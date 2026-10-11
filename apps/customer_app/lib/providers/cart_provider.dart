import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/app_constants.dart';
import '../models/order_model.dart';

/// ─────────────────────────────────────────────────────────────────────────────
///  Cart Item
/// ─────────────────────────────────────────────────────────────────────────────
class CartItem {
  final String id;
  final String name;
  final String subtitle;
  final int price;
  int quantity;
  final String image;

  CartItem({
    required this.id,
    required this.name,
    required this.subtitle,
    required this.price,
    required this.quantity,
    required this.image,
  });

  Map<String, dynamic> toJson() => {
    'id': id, 'name': name, 'subtitle': subtitle,
    'price': price, 'quantity': quantity, 'image': image,
  };

  factory CartItem.fromJson(Map<String, dynamic> j) => CartItem(
    id: j['id'] ?? '', name: j['name'] ?? '', subtitle: j['subtitle'] ?? '',
    price: j['price'] ?? 0, quantity: j['quantity'] ?? 1, image: j['image'] ?? '',
  );
}

/// ─────────────────────────────────────────────────────────────────────────────
///  Cart Provider
/// ─────────────────────────────────────────────────────────────────────────────
class CartProvider extends ChangeNotifier {
  List<CartItem> _cart = [];
  List<OrderModel> _orders = [];
  Timer? _syncTimer;

  static const MethodChannel _notifChannel = MethodChannel('com.valaroix.customer/notifications');

  List<CartItem> get cart => _cart;
  List<OrderModel> get orders => _orders;

  int get itemCount => _cart.fold(0, (s, i) => s + i.quantity);
  int get total => _cart.fold(0, (s, i) => s + (i.price * i.quantity));

  CartProvider() {
    _loadCart();
    _loadOrders();
    _startSyncTimer();
  }

  void _startSyncTimer() {
    _syncTimer?.cancel();
    _syncTimer = Timer.periodic(const Duration(seconds: 5), (_) => syncOrdersWithServer());
  }

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

  Future<void> sendTestNotification() async {
    try {
      await _notifChannel.invokeMethod('showNotification', {
        'title': '🎉 VALAROIX ORDER UPDATE (TEST)',
        'message': 'Customer notification system 100% active hai! Status update hone par aisi drop-down notification aayegi.',
      });
      HapticFeedback.heavyImpact();
    } catch (_) {}
  }

  Future<void> _triggerOrderNotification(OrderModel order) async {
    try {
      String statusText = 'status tabdeel ho gaya hai';
      final s = order.status.toLowerCase();
      if (s == 'confirmed' || order.isConfirmed) {
        statusText = 'confirm ho gaya hai aur packing shuru ho chuki hai!';
      } else if (s == 'dispatched' || order.isDispatched) {
        statusText = 'TCS Courier ko bheja ja chuka hai! Tracking: ${order.tcsTrackingNumber}';
      } else if (s == 'delivered' || order.isDelivered) {
        statusText = 'kamyabi se deliver ho gaya hai. VALAROIX perfume ka shukriya!';
      } else if (s == 'cancelled' || order.isCancelled) {
        statusText = 'cancel ho gaya hai.';
      }

      await _notifChannel.invokeMethod('showNotification', {
        'title': '🎉 ORDER UPDATE #${order.id}',
        'message': 'Aapka order $statusText',
      });
      HapticFeedback.heavyImpact();
    } catch (_) {}
  }

  Future<void> _loadCart() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString('valaroix_cart');
      if (raw != null) {
        final list = jsonDecode(raw) as List;
        _cart = list.map((e) => CartItem.fromJson(e)).toList();
        notifyListeners();
      }
    } catch (_) {}
  }

  Future<void> _saveCart() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('valaroix_cart', jsonEncode(_cart.map((e) => e.toJson()).toList()));
    } catch (_) {}
  }

  Future<void> _loadOrders() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString('valaroix_orders');
      if (raw != null) {
        final list = jsonDecode(raw) as List;
        _orders = list.map((e) => OrderModel.fromJson(e)).toList();
        notifyListeners();
      }
      syncOrdersWithServer();
    } catch (_) {}
  }

  Future<void> syncOrdersWithServer() async {
    try {
      final res = await http.get(
        Uri.parse('${AppConstants.baseUrl}/orders'),
      ).timeout(const Duration(seconds: 6));

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final list = (data['orders'] as List?) ?? [];
        if (list.isNotEmpty) {
          final serverOrders = list.map((o) => OrderModel.fromJson(o)).toList();
          bool hasChanges = false;
          final updatedOrders = <OrderModel>[];

          for (final local in _orders) {
            final match = serverOrders.firstWhere((s) => s.id == local.id, orElse: () => local);
            if (match.status.toLowerCase() != local.status.toLowerCase() ||
                match.tcsTrackingNumber != local.tcsTrackingNumber) {
              hasChanges = true;
              updatedOrders.add(match);
              // Trigger WhatsApp-style status notification to customer!
              _triggerOrderNotification(match);
            } else {
              updatedOrders.add(local);
            }
          }

          if (hasChanges) {
            _orders = updatedOrders;
            notifyListeners();
            final prefs = await SharedPreferences.getInstance();
            await prefs.setString(
              'valaroix_orders',
              jsonEncode(_orders.map((o) => {
                'id': o.id, 'customerName': o.customerName, 'phone': o.phone,
                'address': o.address, 'city': o.city, 'item': o.item,
                'total': o.total, 'status': o.status, 'paymentMethod': o.paymentMethod,
                'tcsTrackingNumber': o.tcsTrackingNumber,
                'createdAt': o.createdAt.toIso8601String(),
              }).toList()),
            );
          }
        }
      }
    } catch (_) {}
  }

  void addToCart(Map<String, dynamic> product) {
    final id = product['id']?.toString() ?? '';
    final existing = _cart.indexWhere((c) => c.id == id);
    if (existing >= 0) {
      _cart[existing].quantity++;
    } else {
      _cart.add(CartItem(
        id: id,
        name: product['name'] ?? '',
        subtitle: product['subtitle'] ?? '',
        price: (product['price'] as num?)?.toInt() ?? 0,
        quantity: 1,
        image: product['image'] ?? '',
      ));
    }
    _saveCart();
    notifyListeners();
  }

  void removeFromCart(String id) {
    _cart.removeWhere((c) => c.id == id);
    _saveCart();
    notifyListeners();
  }

  void updateQuantity(String id, int qty) {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    final i = _cart.indexWhere((c) => c.id == id);
    if (i >= 0) {
      _cart[i].quantity = qty;
      _saveCart();
      notifyListeners();
    }
  }

  void clearCart() {
    _cart.clear();
    _saveCart();
    notifyListeners();
  }

  Future<void> addOrder(OrderModel order) async {
    _orders.insert(0, order);
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(
        'valaroix_orders',
        jsonEncode(_orders.map((o) => {
          'id': o.id, 'customerName': o.customerName, 'phone': o.phone,
          'address': o.address, 'city': o.city, 'item': o.item,
          'total': o.total, 'status': o.status, 'paymentMethod': o.paymentMethod,
          'tcsTrackingNumber': o.tcsTrackingNumber,
          'createdAt': o.createdAt.toIso8601String(),
        }).toList()),
      );
    } catch (_) {}
    notifyListeners();
  }

  @override
  void dispose() {
    _syncTimer?.cancel();
    super.dispose();
  }
}
