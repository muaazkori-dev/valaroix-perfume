/// ─────────────────────────────────────────────────────────────────────────────
///  VALAROIX — Order Model
/// ─────────────────────────────────────────────────────────────────────────────

class OrderModel {
  final String id;
  final String customerName;
  final String phone;
  final String address;
  final String city;
  final String item;
  final double total;
  final String status;
  final String paymentMethod;
  final String? tcsTrackingNumber;
  final DateTime createdAt;
  final List<OrderItem> items;

  OrderModel({
    required this.id,
    required this.customerName,
    required this.phone,
    required this.address,
    required this.city,
    required this.item,
    required this.total,
    required this.status,
    required this.paymentMethod,
    this.tcsTrackingNumber,
    required this.createdAt,
    this.items = const [],
  });

  factory OrderModel.fromJson(Map<String, dynamic> json) {
    double total = 0;
    if (json['pricePkr'] != null) {
      total = double.tryParse(json['pricePkr'].toString()) ?? 0;
    } else if (json['total'] != null) {
      total = double.tryParse(json['total'].toString()) ?? 0;
    }

    final itemsList = <OrderItem>[];
    if (json['items'] is List) {
      for (var i in (json['items'] as List)) {
        itemsList.add(OrderItem.fromJson(i));
      }
    }

    return OrderModel(
      id: json['id']?.toString() ?? '',
      customerName: json['customerName']?.toString() ?? json['name']?.toString() ?? 'Customer',
      phone: json['phone']?.toString() ?? json['whatsapp']?.toString() ?? '',
      address: json['address']?.toString() ?? '',
      city: json['city']?.toString() ?? 'Pakistan',
      item: json['item']?.toString() ?? 'VALAROIX Parfum',
      total: total,
      status: json['status']?.toString() ?? 'Pending',
      paymentMethod: json['paymentMethod']?.toString() ?? 'COD',
      tcsTrackingNumber: json['tcsTrackingNumber']?.toString(),
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'].toString()) ?? DateTime.now()
          : DateTime.now(),
      items: itemsList,
    );
  }

  String get statusDisplay {
    final s = status.toLowerCase();
    if (s.contains('pending')) return 'Pending';
    if (s.contains('confirm') || s.contains('dispatch') || s.contains('transit')) return 'Dispatched';
    if (s.contains('deliver')) return 'Delivered';
    if (s.contains('cancel')) return 'Cancelled';
    return status;
  }

  bool get isDelivered => status.toLowerCase().contains('deliver');
  bool get isDispatched => status.toLowerCase().contains('dispatch') ||
      status.toLowerCase().contains('transit') ||
      status.toLowerCase().contains('confirm');
  bool get isPending => status.toLowerCase().contains('pending');
  bool get isCancelled => status.toLowerCase().contains('cancel');
}

class OrderItem {
  final String name;
  final int quantity;
  final double price;

  OrderItem({required this.name, required this.quantity, required this.price});

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    return OrderItem(
      name: json['name']?.toString() ?? 'Product',
      quantity: int.tryParse(json['quantity'].toString()) ?? 1,
      price: double.tryParse(json['price'].toString()) ?? 0,
    );
  }
}
