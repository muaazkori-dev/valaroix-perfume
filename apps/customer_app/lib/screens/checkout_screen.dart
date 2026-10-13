import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../constants/app_constants.dart';
import '../models/order_model.dart';
import '../providers/cart_provider.dart';
import '../services/api_service.dart';

/// ─────────────────────────────────────────────────────────────────────────────
///  VALAROIX Checkout Screen
///  Clean, luxury form for cash-on-delivery orders
/// ─────────────────────────────────────────────────────────────────────────────
class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _addressCtrl = TextEditingController();
  final _cityCtrl = TextEditingController();

  bool _isSubmitting = false;

  @override
  void dispose() {
    _nameCtrl.dispose();
    _phoneCtrl.dispose();
    _addressCtrl.dispose();
    _cityCtrl.dispose();
    super.dispose();
  }

  Future<void> _handlePlaceOrder() async {
    if (!_formKey.currentState!.validate()) return;

    final cartProvider = context.read<CartProvider>();
    final cart = cartProvider.cart;
    if (cart.isEmpty) return;

    setState(() => _isSubmitting = true);
    HapticFeedback.mediumImpact();

    final itemsPayload = cart.map((i) => {
      'name': i.name,
      'quantity': i.quantity,
      'price': i.price,
    }).toList();

    final res = await ApiService.placeOrder(
      customerName: _nameCtrl.text.trim(),
      phone: _phoneCtrl.text.trim(),
      address: _addressCtrl.text.trim(),
      city: _cityCtrl.text.trim(),
      items: itemsPayload,
      total: cartProvider.total,
    );

    setState(() => _isSubmitting = false);

    if (res['success'] == true) {
      final orderId = res['orderId'] as String;

      // Save order to local list
      cartProvider.addOrder(OrderModel(
        id: orderId,
        customerName: _nameCtrl.text.trim(),
        phone: _phoneCtrl.text.trim(),
        address: _addressCtrl.text.trim(),
        city: _cityCtrl.text.trim(),
        item: cart.map((i) => '${i.name} x${i.quantity}').join(', '),
        total: cartProvider.total.toDouble(),
        status: 'Pending Verification',
        paymentMethod: 'COD',
        createdAt: DateTime.now(),
      ));

      final waUrl = ApiService.buildWhatsAppOrderUrl(
        orderId: orderId,
        customerName: _nameCtrl.text.trim(),
        items: itemsPayload,
        total: cartProvider.total,
        address: _addressCtrl.text.trim(),
        city: _cityCtrl.text.trim(),
      );

      // Clear the cart
      cartProvider.clearCart();

      if (!mounted) return;

      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (ctx) => AlertDialog(
          backgroundColor: AppConstants.secondaryBg,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
            side: const BorderSide(color: AppConstants.gold),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 60,
                height: 60,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: Color(0x2210B981),
                ),
                child: const Icon(Icons.check_circle_rounded, color: AppConstants.success, size: 38),
              ),
              const SizedBox(height: 16),
              const Text(
                'ORDER CONFIRMED',
                style: TextStyle(
                  color: AppConstants.gold,
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Order ID: $orderId',
                style: const TextStyle(
                  color: Colors.white,
                  fontFamily: 'monospace',
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Your luxury parcel is booked for dispatch via TCS Express with Free Delivery.',
                textAlign: TextAlign.center,
                style: TextStyle(color: AppConstants.textSecondary, fontSize: 12),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF25D366),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  onPressed: () async {
                    final uri = Uri.parse(waUrl);
                    if (await canLaunchUrl(uri)) {
                      await launchUrl(uri, mode: LaunchMode.externalApplication);
                    }
                  },
                  icon: const Icon(Icons.chat, size: 18),
                  label: const Text('Confirm via WhatsApp', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(height: 10),
              SizedBox(
                width: double.infinity,
                child: TextButton(
                  onPressed: () {
                    Navigator.of(ctx).pop();
                    Navigator.of(context).pop();
                  },
                  child: const Text('Back to Boutique', style: TextStyle(color: AppConstants.gold)),
                ),
              ),
            ],
          ),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(res['message'] ?? 'Could not place order. Please try again.'),
          backgroundColor: AppConstants.error,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();

    return Scaffold(
      backgroundColor: AppConstants.primaryBg,
      appBar: AppBar(
        backgroundColor: AppConstants.primaryBg,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        title: const Text(
          'CHECKOUT',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w900,
            color: AppConstants.gold,
            letterSpacing: 3,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        physics: const BouncingScrollPhysics(),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Delivery Information',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 16),

              _InputField(
                controller: _nameCtrl,
                label: 'Full Name',
                hint: 'e.g. Muhammad Ali',
                icon: Icons.person_outline,
                validator: (v) => (v == null || v.trim().isEmpty) ? 'Please enter your name' : null,
              ),
              const SizedBox(height: 14),

              _InputField(
                controller: _phoneCtrl,
                label: 'Phone / WhatsApp Number',
                hint: 'e.g. 03141234567',
                icon: Icons.phone_outlined,
                keyboardType: TextInputType.phone,
                validator: (v) {
                  if (v == null || v.trim().isEmpty) return 'Please enter your phone number';
                  if (v.trim().length < 10) return 'Enter a valid 11-digit mobile number';
                  return null;
                },
              ),
              const SizedBox(height: 14),

              _InputField(
                controller: _cityCtrl,
                label: 'City',
                hint: 'Karachi, Lahore, Islamabad, etc.',
                icon: Icons.location_city_outlined,
                validator: (v) => (v == null || v.trim().isEmpty) ? 'Please enter your city' : null,
              ),
              const SizedBox(height: 14),

              _InputField(
                controller: _addressCtrl,
                label: 'Full Street Delivery Address',
                hint: 'House / Flat #, Street, Area / Sector',
                icon: Icons.home_outlined,
                maxLines: 2,
                validator: (v) => (v == null || v.trim().isEmpty) ? 'Please enter your address' : null,
              ),

              const SizedBox(height: 24),
              const Text(
                'Payment Method',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 12),

              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppConstants.secondaryBg,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppConstants.gold),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 36,
                      height: 36,
                      decoration: const BoxDecoration(
                        color: Color(0x22D4AF37),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.payments_rounded, color: AppConstants.gold, size: 20),
                    ),
                    const SizedBox(width: 14),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Cash on Delivery (COD)',
                            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                          ),
                          SizedBox(height: 2),
                          Text(
                            'Pay safely in cash when rider delivers to your doorstep',
                            style: TextStyle(color: AppConstants.textSecondary, fontSize: 11),
                          ),
                        ],
                      ),
                    ),
                    const Icon(Icons.check_circle, color: AppConstants.gold, size: 22),
                  ],
                ),
              ),

              const SizedBox(height: 24),
              const Text(
                'Order Summary',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 12),

              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppConstants.secondaryBg,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppConstants.borderSubtle),
                ),
                child: Column(
                  children: [
                    ...cart.cart.map((i) => Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('${i.name} (x${i.quantity})', style: const TextStyle(color: AppConstants.textSecondary, fontSize: 13)),
                          Text('Rs. ${i.price * i.quantity}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                        ],
                      ),
                    )),
                    const Divider(color: AppConstants.borderSubtle, height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: const [
                        Text('Delivery (TCS Express)', style: TextStyle(color: AppConstants.textSecondary, fontSize: 13)),
                        Text('FREE', style: TextStyle(color: AppConstants.success, fontWeight: FontWeight.bold, fontSize: 13)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Total Bill', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
                        Text('Rs. ${cart.total}', style: const TextStyle(color: AppConstants.gold, fontWeight: FontWeight.w900, fontSize: 18)),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 30),

              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppConstants.gold,
                    foregroundColor: Colors.black,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  onPressed: _isSubmitting ? null : _handlePlaceOrder,
                  child: _isSubmitting
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(color: Colors.black, strokeWidth: 2.5),
                        )
                      : const Text(
                          'CONFIRM ORDER (COD)',
                          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 1),
                        ),
                ),
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}

class _InputField extends StatelessWidget {
  final TextEditingController controller;
  final String label;
  final String hint;
  final IconData icon;
  final TextInputType? keyboardType;
  final int maxLines;
  final String? Function(String?)? validator;

  const _InputField({
    required this.controller,
    required this.label,
    required this.hint,
    required this.icon,
    this.keyboardType,
    this.maxLines = 1,
    this.validator,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: AppConstants.textSecondary, fontSize: 12, fontWeight: FontWeight.w600)),
        const SizedBox(height: 6),
        TextFormField(
          controller: controller,
          keyboardType: keyboardType,
          maxLines: maxLines,
          style: const TextStyle(color: Colors.white, fontSize: 14),
          validator: validator,
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(color: AppConstants.textMuted, fontSize: 13),
            prefixIcon: Icon(icon, color: AppConstants.gold, size: 20),
            filled: true,
            fillColor: AppConstants.secondaryBg,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: AppConstants.borderSubtle),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: AppConstants.borderSubtle),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: AppConstants.gold, width: 1.5),
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          ),
        ),
      ],
    );
  }
}
