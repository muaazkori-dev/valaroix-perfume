/// ─────────────────────────────────────────────────────────────────────────────
///  VALAROIX Admin — Order Model
/// ─────────────────────────────────────────────────────────────────────────────

class AdminOrder {
  final String id;
  final String customerName;
  final String phone;
  final String address;
  final String city;
  final String item;
  final int total;
  final String status;
  final String paymentMethod;
  final String? tcsTrackingNumber;
  final DateTime createdAt;
  final List<AdminOrderItem> items;

  AdminOrder({
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

  factory AdminOrder.fromJson(Map<String, dynamic> json) {
    int total = 0;
    if (json['pricePkr'] != null) {
      total = int.tryParse(json['pricePkr'].toString()) ?? 0;
    } else if (json['total'] != null) {
      total = int.tryParse(json['total'].toString()) ?? 0;
    }
    if (total == 0) {
      final itemStr = (json['item'] ?? '').toString().toLowerCase();
      if (itemStr.contains('vertex')) total = 3499;
      else if (itemStr.contains('sauvage') || itemStr.contains('classic')) total = 2499;
      else total = 2999;
    }

    final itemsList = <AdminOrderItem>[];
    if (json['items'] is List) {
      for (var i in (json['items'] as List)) {
        itemsList.add(AdminOrderItem.fromJson(i));
      }
    }

    return AdminOrder(
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

  AdminOrder copyWith({
    String? status,
    String? tcsTrackingNumber,
  }) => AdminOrder(
    id: id, customerName: customerName, phone: phone, address: address,
    city: city, item: item, total: total,
    status: status ?? this.status,
    paymentMethod: paymentMethod,
    tcsTrackingNumber: tcsTrackingNumber ?? this.tcsTrackingNumber,
    createdAt: createdAt, items: items,
  );

  int get profit => total - (total * 0.35).round();

  bool get isPending    => status.toLowerCase().contains('pending');
  bool get isDispatched => status.toLowerCase().contains('dispatch') ||
      status.toLowerCase().contains('transit') || status.toLowerCase().contains('confirm');
  bool get isDelivered  => status.toLowerCase().contains('deliver');
  bool get isCancelled  => status.toLowerCase().contains('cancel');
}

class AdminOrderItem {
  final String name;
  final int quantity;
  final int price;

  AdminOrderItem({required this.name, required this.quantity, required this.price});

  factory AdminOrderItem.fromJson(Map<String, dynamic> json) => AdminOrderItem(
    name: json['name']?.toString() ?? 'Product',
    quantity: int.tryParse(json['quantity'].toString()) ?? 1,
    price: int.tryParse(json['price'].toString()) ?? 0,
  );
}
