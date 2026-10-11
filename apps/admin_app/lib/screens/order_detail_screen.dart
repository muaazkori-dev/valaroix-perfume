import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../constants/admin_constants.dart';
import '../models/admin_models.dart';
import '../providers/admin_provider.dart';

/// ─────────────────────────────────────────────────────────────────────────────
///  VALAROIX Admin Order Detail Screen
///  Detailed order view with 1-click TCS booking & WhatsApp notifications
/// ─────────────────────────────────────────────────────────────────────────────
class OrderDetailScreen extends StatefulWidget {
  final AdminOrder order;
  const OrderDetailScreen({super.key, required this.order});

  @override
  State<OrderDetailScreen> createState() => _OrderDetailScreenState();
}

class _OrderDetailScreenState extends State<OrderDetailScreen> {
  late AdminOrder _order;
  final _tcsCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _order = widget.order;
    if (_order.tcsTrackingNumber != null) {
      _tcsCtrl.text = _order.tcsTrackingNumber!;
    }
  }

  @override
  void dispose() {
    _tcsCtrl.dispose();
    super.dispose();
  }

  void _sendWhatsApp(String type) async {
    final cleanPhone = _order.phone.replaceAll(RegExp(r'\D'), '').replaceFirst(RegExp(r'^0'), '');
    String msg = '';
    if (type == 'confirm') {
      msg = '''Assalam-o-Alaikum ${_order.customerName}! ✨

Hum VALAROIX Luxury Parfums se baat kar rahe hain.
Aapka order receive hua hai:
📦 Order: #${_order.id}
🌸 Item: ${_order.item}
💰 Total Amount: Rs. ${_order.total} (COD)
📍 Delivery Address: ${_order.address}, ${_order.city}

👉 Kya aap is order ko CONFIRM karte hain taake hum TCS Express se parcel dispatch kar dein? Baraye meharbani 'YES' likh kar reply karein. Shukriya!

Team VALAROIX''';
    } else {
      final cn = _order.tcsTrackingNumber ?? '7729841029';
      msg = '''Assalam-o-Alaikum ${_order.customerName}! ✨

VALAROIX se aapka luxury perfume order #${_order.id} DISPATCH kar diya gaya hai!
📦 Item: ${_order.item}
💰 Total Bill: Rs. ${_order.total} (COD)
🏷️ TCS Consignment CN: $cn
📍 Live Parcel Tracking: https://valaroix.com/track?q=$cn

1-2 din mein TCS delivery rider parcel deliver kar dega. Shukriya!

Team VALAROIX''';
    }

    final url = Uri.parse('https://wa.me/92$cleanPhone?text=${Uri.encodeComponent(msg)}');
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    final admin = context.read<AdminProvider>();

    return Scaffold(
      backgroundColor: AdminConstants.primaryBg,
      appBar: AppBar(
        backgroundColor: AdminConstants.secondaryBg,
        title: Text(
          'ORDER #${_order.id}',
          style: const TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.bold,
            color: AdminConstants.gold,
            letterSpacing: 2,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        physics: const BouncingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status Header
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AdminConstants.secondaryBg,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AdminConstants.borderGold),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Current Status', style: TextStyle(color: AdminConstants.textMuted, fontSize: 11)),
                      const SizedBox(height: 2),
                      Text(
                        _order.status,
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AdminConstants.gold.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AdminConstants.gold),
                    ),
                    child: Text(
                      'Profit: +Rs. ${_order.profit}',
                      style: const TextStyle(color: AdminConstants.gold, fontWeight: FontWeight.bold, fontSize: 12),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 18),

            // Customer Info Card
            const Text('Customer Details', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AdminConstants.secondaryBg,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AdminConstants.border),
              ),
              child: Column(
                children: [
                  _InfoRow(label: 'Name', value: _order.customerName),
                  const Divider(color: AdminConstants.border, height: 16),
                  _InfoRow(label: 'Phone', value: _order.phone),
                  const Divider(color: AdminConstants.border, height: 16),
                  _InfoRow(label: 'City', value: _order.city),
                  const Divider(color: AdminConstants.border, height: 16),
                  _InfoRow(label: 'Address', value: _order.address),
                ],
              ),
            ),

            const SizedBox(height: 18),

            // Item and Pricing
            const Text('Items & Bill', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AdminConstants.secondaryBg,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AdminConstants.border),
              ),
              child: Column(
                children: [
                  _InfoRow(label: 'Perfume', value: _order.item),
                  const Divider(color: AdminConstants.border, height: 16),
                  _InfoRow(label: 'Payment', value: 'Cash on Delivery (COD)'),
                  const Divider(color: AdminConstants.border, height: 16),
                  _InfoRow(label: 'Delivery Fee', value: 'FREE'),
                  const Divider(color: AdminConstants.border, height: 16),
                  _InfoRow(label: 'Total Bill', value: 'Rs. ${_order.total}', isGold: true),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Actions & TCS Booking
            const Text('Actions & Dispatch', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
            const SizedBox(height: 12),

            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AdminConstants.gold,
                      foregroundColor: Colors.black,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    onPressed: () {
                      final cn = _tcsCtrl.text.trim().isNotEmpty
                          ? _tcsCtrl.text.trim()
                          : '77${DateTime.now().millisecondsSinceEpoch.toString().substring(5)}';
                      admin.updateOrderStatus(_order.id, 'Confirmed & Dispatched via TCS', tcsNumber: cn);
                      setState(() {
                        _order = _order.copyWith(status: 'Confirmed & Dispatched via TCS', tcsTrackingNumber: cn);
                        _tcsCtrl.text = cn;
                      });
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Dispatched via TCS CN #$cn'), backgroundColor: AdminConstants.gold),
                      );
                    },
                    icon: const Icon(Icons.local_shipping, size: 18),
                    label: const Text('Book TCS Dispatch', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 10),

            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: const Color(0xFF25D366),
                      side: const BorderSide(color: Color(0xFF25D366)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    onPressed: () => _sendWhatsApp('confirm'),
                    icon: const Icon(Icons.chat, size: 18),
                    label: const Text('Ask Confirmation', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AdminConstants.gold,
                      side: const BorderSide(color: AdminConstants.gold),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    onPressed: () => _sendWhatsApp('dispatch'),
                    icon: const Icon(Icons.send_rounded, size: 18),
                    label: const Text('Send Tracking', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 10),

            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AdminConstants.success,
                      side: const BorderSide(color: AdminConstants.success),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    onPressed: () {
                      admin.updateOrderStatus(_order.id, 'Delivered');
                      setState(() => _order = _order.copyWith(status: 'Delivered'));
                    },
                    icon: const Icon(Icons.check_circle_outline, size: 18),
                    label: const Text('Mark Delivered', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AdminConstants.error,
                      side: const BorderSide(color: AdminConstants.error),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    onPressed: () {
                      admin.updateOrderStatus(_order.id, 'Cancelled');
                      setState(() => _order = _order.copyWith(status: 'Cancelled'));
                    },
                    icon: const Icon(Icons.cancel_outlined, size: 18),
                    label: const Text('Cancel Order', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;
  final bool isGold;

  const _InfoRow({required this.label, required this.value, this.isGold = false});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: AdminConstants.textMuted, fontSize: 13)),
        Flexible(
          child: Text(
            value,
            textAlign: TextAlign.right,
            style: TextStyle(
              color: isGold ? AdminConstants.gold : Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: isGold ? 15 : 13,
            ),
          ),
        ),
      ],
    );
  }
}
