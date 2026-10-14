import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/admin_constants.dart';
import '../models/admin_models.dart';

/// ─────────────────────────────────────────────────────────────────────────────
///  Admin Provider — Real-time order polling & state management
/// ─────────────────────────────────────────────────────────────────────────────
class AdminProvider extends ChangeNotifier {
  // ── Auth State ───────────────────────────────────────────────────────────────
  bool _isAuthenticated = false;
  bool get isAuthenticated => _isAuthenticated;

  // ── Orders State ─────────────────────────────────────────────────────────────
  List<AdminOrder> _orders = [];
  List<AdminOrder> get orders => _orders;

  int get totalRevenue => _orders.fold(0, (s, o) => s + o.total);
  int get totalProfit  => _orders.fold(0, (s, o) => s + o.profit);
  int get pendingCount => _orders.where((o) => o.isPending).length;
  int get deliveredCount => _orders.where((o) => o.isDelivered).length;

  // ── Sound / Alert State ──────────────────────────────────────────────────────
  bool _soundEnabled = true;
  bool get soundEnabled => _soundEnabled;
  void toggleSound() { _soundEnabled = !_soundEnabled; notifyListeners(); }

  // ── New Order Alert ──────────────────────────────────────────────────────────
  AdminOrder? _newOrderAlert;
  AdminOrder? get newOrderAlert => _newOrderAlert;
  void clearNewOrderAlert() { _newOrderAlert = null; notifyListeners(); }

  // ── Native WhatsApp-Style Status Bar Notification ───────────────────────────
  static const MethodChannel _notifChannel = MethodChannel('com.valaroix.admin/notifications');

  Future<void> requestNotificationPermission() async {
    try {
      await _notifChannel.invokeMethod('requestPermission');
    } catch (_) {}
  }

  Future<void> openNotificationSettings() async {
    try {
      await _notifChannel.invokeMethod('openSettings');
    } catch (_) {}
  }

  Future<bool> isPermissionGranted() async {
    try {
      final res = await _notifChannel.invokeMethod<bool>('isPermissionGranted');
      return res ?? false;
    } catch (_) {
      return false;
    }
  }

  Future<void> sendTestNotification() async {
    try {
      await _notifChannel.invokeMethod('showNotification', {
        'title': '🔔 VALAROIX ORDER ALERT (TEST)',
        'message': 'Notification system 100% active hai! Naye orders par aisi drop-down sound aur banner aayega.',
      });
      if (_soundEnabled) {
        HapticFeedback.heavyImpact();
        SystemSound.play(SystemSoundType.alert);
      }
    } catch (_) {}
  }

  Future<void> _triggerStatusBarNotification(AdminOrder order) async {
    try {
      await _notifChannel.invokeMethod('showNotification', {
        'title': '🔔 NAYA ORDER AAYA HAI! #${order.id}',
        'message': '${order.customerName} (${order.city}) ne ${order.item} order kiya! Total Rs. ${order.total} COD',
      });
    } catch (_) {}
  }

  // ── Internal ─────────────────────────────────────────────────────────────────
  Timer? _pollTimer;
  Set<String> _knownIds = {};
  final String _base = AdminConstants.baseUrl;

  AdminProvider() {
    _initAuth();
  }

  Future<void> _initAuth() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final savedIds = prefs.getStringList('admin_known_order_ids') ?? [];
      _knownIds = savedIds.toSet();

      final savedLogin = prefs.getBool('admin_logged_in') ?? false;
      if (savedLogin) {
        _isAuthenticated = true;
        _startPolling();
        notifyListeners();
      }
    } catch (_) {}
  }

  // ── Auth ─────────────────────────────────────────────────────────────────────
  bool login(String pin) {
    if (pin == AdminConstants.adminPin) {
      _isAuthenticated = true;
      _persistLogin(true);
      _startPolling();
      notifyListeners();
      return true;
    }
    return false;
  }

  Future<void> _persistLogin(bool val) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool('admin_logged_in', val);
    } catch (_) {}
  }

  void logout() {
    _isAuthenticated = false;
    _persistLogin(false);
    _pollTimer?.cancel();
    notifyListeners();
  }

  // ── Polling ──────────────────────────────────────────────────────────────────
  void _startPolling() {
    _pollTimer?.cancel();
    _fetchOrders(); // Immediate first fetch
    _pollTimer = Timer.periodic(AdminConstants.pollInterval, (_) => _fetchOrders());
  }

  Future<void> _fetchOrders() async {
    try {
      final res = await http.get(
        Uri.parse('$_base/orders'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(const Duration(seconds: 8));

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final rawList = (data['orders'] as List?) ?? [];
        final fetched = rawList.map((o) => AdminOrder.fromJson(o)).toList();

        // Detect new orders
        List<AdminOrder> newOnes = [];
        if (_knownIds.isNotEmpty) {
          newOnes = fetched.where((o) => !_knownIds.contains(o.id)).toList();
        } else {
          // If fresh launch or knownIds was empty, alert for any pending order created in the last 30 minutes!
          final thirtyMinsAgo = DateTime.now().subtract(const Duration(minutes: 30));
          newOnes = fetched.where((o) => o.isPending && o.createdAt.isAfter(thirtyMinsAgo)).toList();
        }

        if (newOnes.isNotEmpty) {
          _newOrderAlert = newOnes.first;
          for (final o in newOnes) {
            _triggerStatusBarNotification(o);
          }
          if (_soundEnabled) {
            HapticFeedback.heavyImpact();
            SystemSound.play(SystemSoundType.alert);
          }
        }

        _knownIds = fetched.map((o) => o.id).toSet();
        try {
          final prefs = await SharedPreferences.getInstance();
          await prefs.setStringList('admin_known_order_ids', _knownIds.toList());
        } catch (_) {}

        // Update list
        _orders = fetched;
        notifyListeners();
      }
    } catch (_) {}
  }

  // ── Update Order Status (local + server) ──────────────────────────────────────
  void updateOrderStatus(String orderId, String newStatus, {String? tcsNumber}) {
    _orders = _orders.map((o) {
      if (o.id == orderId) {
        return o.copyWith(status: newStatus, tcsTrackingNumber: tcsNumber);
      }
      return o;
    }).toList();
    notifyListeners();

    // Push update to server immediately
    _pushStatusUpdate(orderId, newStatus, tcsNumber: tcsNumber);
  }

  Future<void> _pushStatusUpdate(String orderId, String status, {String? tcsNumber}) async {
    try {
      await http.patch(
        Uri.parse('$_base/orders'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'id': orderId,
          'status': status,
          if (tcsNumber != null) 'tcsTrackingNumber': tcsNumber,
        }),
      ).timeout(const Duration(seconds: 8));
    } catch (_) {}
  }

  // ── Delete Order ─────────────────────────────────────────────────────────────
  void deleteOrder(String orderId) {
    _orders.removeWhere((o) => o.id == orderId);
    notifyListeners();
  }

  @override
  void dispose() {
    _pollTimer?.cancel();
    super.dispose();
  }
}
