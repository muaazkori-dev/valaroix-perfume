import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
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

  List<CartItem> get cart => _cart;
  List<OrderModel> get orders => _orders;

  int get itemCount => _cart.fold(0, (s, i) => s + i.quantity);
  int get total => _cart.fold(0, (s, i) => s + (i.price * i.quantity));

  CartProvider() {
    _loadCart();
    _loadOrders();
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
}
