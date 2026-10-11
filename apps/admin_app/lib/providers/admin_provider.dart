import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
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

  // ── Internal ─────────────────────────────────────────────────────────────────
  Timer? _pollTimer;
  Set<String> _knownIds = {};
  final String _base = AdminConstants.baseUrl;

  // ── Auth ─────────────────────────────────────────────────────────────────────
  bool login(String pin) {
    if (pin == AdminConstants.adminPin) {
      _isAuthenticated = true;
      _startPolling();
      notifyListeners();
      return true;
    }
    return false;
  }

  void logout() {
    _isAuthenticated = false;
    _pollTimer?.cancel();
    notifyListeners();
  }

  // ── Polling ──────────────────────────────────────────────────────────────────
  void _startPolling() {
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
        if (_knownIds.isNotEmpty) {
          final newOnes = fetched.where((o) => !_knownIds.contains(o.id)).toList();
          if (newOnes.isNotEmpty) {
            _newOrderAlert = newOnes.first;
          }
        }

        _knownIds = fetched.map((o) => o.id).toSet();

        // Preserve local status updates
        _orders = fetched.map((serverOrder) {
          final existing = _orders.firstWhere(
            (o) => o.id == serverOrder.id,
            orElse: () => serverOrder,
          );
          if (existing.isDispatched || existing.isDelivered || existing.isCancelled) {
            return existing;
          }
          return serverOrder;
        }).toList();

        notifyListeners();
      }
    } catch (_) {}
  }

  // ── Update Order Status (local) ──────────────────────────────────────────────
  void updateOrderStatus(String orderId, String newStatus, {String? tcsNumber}) {
    _orders = _orders.map((o) {
      if (o.id == orderId) {
        return o.copyWith(status: newStatus, tcsTrackingNumber: tcsNumber);
      }
      return o;
    }).toList();
    notifyListeners();

    // Push update to server
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
