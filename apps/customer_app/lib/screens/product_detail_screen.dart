import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../constants/app_constants.dart';
import '../providers/cart_provider.dart';
import '../services/api_service.dart';

/// ─────────────────────────────────────────────────────────────────────────────
///  VALAROIX Product Detail Screen
///  Full-screen luxury product view with notes, qty selector, CTA buttons
/// ─────────────────────────────────────────────────────────────────────────────
class ProductDetailScreen extends StatefulWidget {
  final Map<String, dynamic> product;
  const ProductDetailScreen({super.key, required this.product});

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen>
    with SingleTickerProviderStateMixin {
  int _quantity = 1;
  late final AnimationController _glowCtrl;

  @override
  void initState() {
    super.initState();
    _glowCtrl = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 6),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _glowCtrl.dispose();
    super.dispose();
  }

  Map<String, dynamic> get p => widget.product;
  Color get accent => Color(p['accentHex'] as int);
  Color get base => Color(p['colorHex'] as int);

  List<String> _splitNotes(String key) =>
      (p[key] as String?)?.split(',').map((s) => s.trim()).toList() ?? [];

  void _addToCart() {
    final cart = context.read<CartProvider>();
    for (int i = 0; i < _quantity; i++) {
      cart.addToCart(p);
    }
    HapticFeedback.mediumImpact();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          '$_quantity × ${p['name']} added to cart!',
          style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
        ),
        backgroundColor: AppConstants.gold,
        duration: const Duration(seconds: 2),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  Future<void> _orderViaWhatsApp() async {
    final cart = context.read<CartProvider>();
    final orderId =
        'VLX-${DateTime.now().millisecondsSinceEpoch.toString().substring(5)}';
    final url = ApiService.buildWhatsAppOrderUrl(
      orderId: orderId,
      customerName: 'Customer',
      items: [
        {
          'name': p['name'],
          'quantity': _quantity,
          'price': p['price'],
        }
      ],
      total: (p['price'] as int) * _quantity,
      address: 'Pakistan',
      city: '',
    );
    final uri = Uri.parse(url);
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('WhatsApp open karne mein masla hua.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final topNotes = _splitNotes('topNotes');
    final midNotes = _splitNotes('midNotes');
    final baseNotes = _splitNotes('baseNotes');
    final tagColor = Color(p['tagColor'] as int);

    return Scaffold(
      backgroundColor: AppConstants.primaryBg,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        systemOverlayStyle: const SystemUiOverlayStyle(
          statusBarIconBrightness: Brightness.light,
        ),
        leading: GestureDetector(
          onTap: () => Navigator.pop(context),
          child: Container(
            margin: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppConstants.secondaryBg.withOpacity(0.9),
              shape: BoxShape.circle,
              border: Border.all(color: AppConstants.borderSubtle),
            ),
            child: const Icon(Icons.arrow_back_ios_new_rounded,
                color: AppConstants.textPrimary, size: 16),
          ),
        ),
        actions: [
          GestureDetector(
            onTap: _addToCart,
            child: Container(
              margin: const EdgeInsets.all(8),
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppConstants.secondaryBg.withOpacity(0.9),
                shape: BoxShape.circle,
                border: Border.all(color: AppConstants.borderSubtle),
              ),
              child: const Icon(Icons.shopping_bag_outlined,
                  color: AppConstants.gold, size: 18),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Hero Emblem ─────────────────────────────────────────────────
            AnimatedBuilder(
              animation: _glowCtrl,
              builder: (_, __) => Container(
                width: double.infinity,
                height: 320,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [base, Color.lerp(base, AppConstants.primaryBg, 0.4)!],
                  ),
                ),
                child: Stack(
                  children: [
                    // Ambient glow
                    Positioned(
                      right: -60,
                      top: -60,
                      child: Container(
                        width: 280,
                        height: 280,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: RadialGradient(
                            colors: [
                              accent.withOpacity(0.15 + _glowCtrl.value * 0.10),
                              Colors.transparent,
                            ],
                          ),
                        ),
                      ),
                    ),
                    Positioned(
                      left: -40,
                      bottom: -40,
                      child: Container(
                        width: 200,
                        height: 200,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: RadialGradient(
                            colors: [
                              AppConstants.gold.withOpacity(0.06 + _glowCtrl.value * 0.04),
                              Colors.transparent,
                            ],
                          ),
                        ),
                      ),
                    ),
                    // Central emblem
                    Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const SizedBox(height: 40),
                          Container(
                            width: 170,
                            height: 170,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: accent,
                                width: 2.0,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: accent.withOpacity(0.35 + _glowCtrl.value * 0.15),
                                  blurRadius: 40,
                                  spreadRadius: 5,
                                ),
                              ],
                            ),
                            child: ClipOval(
                              child: Image.asset(
                                p['image'] ?? 'assets/images/app_logo.jpg',
                                fit: BoxFit.cover,
                                errorBuilder: (_, __, ___) => Image.asset(
                                  'assets/images/logo.png',
                                  fit: BoxFit.cover,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),
                          // Tag badge
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 12, vertical: 4),
                            decoration: BoxDecoration(
                              color: tagColor.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: tagColor.withOpacity(0.5)),
                            ),
                            child: Text(
                              p['tag'] ?? '',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: tagColor == const Color(0xFF0D0D0D)
                                    ? AppConstants.gold
                                    : tagColor,
                                letterSpacing: 2,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // ── Product Info ─────────────────────────────────────────────────
            Container(
              width: double.infinity,
              decoration: const BoxDecoration(
                color: AppConstants.primaryBg,
                borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
              ),
              transform: Matrix4.translationValues(0, -28, 0),
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 28, 20, 0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Name & price row
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                p['name'] ?? '',
                                style: const TextStyle(
                                  fontSize: 22,
                                  fontWeight: FontWeight.w900,
                                  color: AppConstants.textPrimary,
                                  letterSpacing: 0.5,
                                  height: 1.1,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                p['subtitle'] ?? '',
                                style: const TextStyle(
                                  fontSize: 13,
                                  color: AppConstants.textSecondary,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              'Rs. ${p['price']}',
                              style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.w900,
                                color: AppConstants.gold,
                              ),
                            ),
                            const Text(
                              'per bottle',
                              style: TextStyle(
                                fontSize: 10,
                                color: AppConstants.textMuted,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),

                    const SizedBox(height: 16),

                    // Badges row
                    Row(
                      children: [
                        _InfoBadge(
                          icon: Icons.opacity_rounded,
                          label: p['oil'] ?? '',
                          color: AppConstants.gold,
                        ),
                        const SizedBox(width: 10),
                        _InfoBadge(
                          icon: Icons.access_time_rounded,
                          label: p['lasting'] ?? '',
                          color: accent,
                        ),
                      ],
                    ),

                    const SizedBox(height: 24),

                    // ── Fragrance Notes ────────────────────────────────────────
                    _SectionTitle(title: 'FRAGRANCE NOTES'),
                    const SizedBox(height: 14),

                    _NotesRow(
                      label: 'TOP NOTES',
                      notes: topNotes,
                      color: accent,
                      icon: Icons.north_rounded,
                    ),
                    const SizedBox(height: 12),
                    _NotesRow(
                      label: 'HEART NOTES',
                      notes: midNotes,
                      color: AppConstants.gold,
                      icon: Icons.favorite_border_rounded,
                    ),
                    const SizedBox(height: 12),
                    _NotesRow(
                      label: 'BASE NOTES',
                      notes: baseNotes,
                      color: AppConstants.textSecondary,
                      icon: Icons.south_rounded,
                    ),

                    const SizedBox(height: 24),

                    // ── Description ────────────────────────────────────────────
                    _SectionTitle(title: 'ABOUT THIS FRAGRANCE'),
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppConstants.secondaryBg,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppConstants.borderSubtle),
                      ),
                      child: Text(
                        p['description'] ?? '',
                        style: const TextStyle(
                          fontSize: 14,
                          color: AppConstants.textSecondary,
                          height: 1.7,
                          letterSpacing: 0.2,
                        ),
                      ),
                    ),

                    const SizedBox(height: 24),

                    // ── Quantity Selector ──────────────────────────────────────
                    _SectionTitle(title: 'QUANTITY'),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Container(
                          decoration: BoxDecoration(
                            color: AppConstants.secondaryBg,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: AppConstants.borderGold),
                          ),
                          child: Row(
                            children: [
                              _QtyButton(
                                icon: Icons.remove_rounded,
                                onTap: () {
                                  if (_quantity > 1) {
                                    setState(() => _quantity--);
                                    HapticFeedback.selectionClick();
                                  }
                                },
                              ),
                              Container(
                                width: 48,
                                alignment: Alignment.center,
                                child: Text(
                                  '$_quantity',
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w900,
                                    color: AppConstants.textPrimary,
                                  ),
                                ),
                              ),
                              _QtyButton(
                                icon: Icons.add_rounded,
                                onTap: () {
                                  if (_quantity < 10) {
                                    setState(() => _quantity++);
                                    HapticFeedback.selectionClick();
                                  }
                                },
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            decoration: BoxDecoration(
                              color: AppConstants.secondaryBg,
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(color: AppConstants.borderSubtle),
                            ),
                            child: Column(
                              children: [
                                const Text(
                                  'SUBTOTAL',
                                  style: TextStyle(
                                    fontSize: 9,
                                    color: AppConstants.textMuted,
                                    letterSpacing: 2,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Rs. ${(p['price'] as int) * _quantity}',
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w900,
                                    color: AppConstants.gold,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 24),

                    // ── Trust Row ──────────────────────────────────────────────
                    Container(
                      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
                      decoration: BoxDecoration(
                        color: AppConstants.secondaryBg,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppConstants.borderGold),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: const [
                          _TrustItem(icon: Icons.local_shipping_outlined, label: 'Free Delivery'),
                          _TrustItem(icon: Icons.payments_outlined, label: 'COD Available'),
                          _TrustItem(icon: Icons.verified_outlined, label: '100% Authentic'),
                        ],
                      ),
                    ),

                    const SizedBox(height: 28),

                    // ── CTA Buttons ────────────────────────────────────────────
                    // Add to Cart
                    GestureDetector(
                      onTap: _addToCart,
                      child: Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [AppConstants.gold, AppConstants.goldDark],
                          ),
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: AppConstants.gold.withOpacity(0.35),
                              blurRadius: 20,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.shopping_bag_outlined,
                                color: Colors.black, size: 20),
                            SizedBox(width: 10),
                            Text(
                              'Add to Cart',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w900,
                                color: Colors.black,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 12),

                    // WhatsApp Order
                    GestureDetector(
                      onTap: _orderViaWhatsApp,
                      child: Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        decoration: BoxDecoration(
                          color: const Color(0xFF075E54),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: const Color(0xFF25D366).withOpacity(0.4),
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFF25D366).withOpacity(0.20),
                              blurRadius: 16,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.chat_rounded,
                                color: Colors.white, size: 20),
                            SizedBox(width: 10),
                            Text(
                              'Order via WhatsApp',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 100),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Helper Widgets ─────────────────────────────────────────────────────────────

class _SectionTitle extends StatelessWidget {
  final String title;
  const _SectionTitle({required this.title});

  @override
  Widget build(BuildContext context) => Row(
        children: [
          Container(
            width: 3,
            height: 14,
            decoration: BoxDecoration(
              color: AppConstants.gold,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(width: 8),
          Text(
            title,
            style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: AppConstants.textMuted,
              letterSpacing: 2.5,
            ),
          ),
        ],
      );
}

class _InfoBadge extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  const _InfoBadge({required this.icon, required this.label, required this.color});

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: color.withOpacity(0.08),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: color.withOpacity(0.25)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 12, color: color),
            const SizedBox(width: 5),
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                color: color,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      );
}

class _NotesRow extends StatelessWidget {
  final String label;
  final List<String> notes;
  final Color color;
  final IconData icon;
  const _NotesRow({
    required this.label,
    required this.notes,
    required this.color,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) => Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 86,
            child: Row(
              children: [
                Icon(icon, size: 10, color: color.withOpacity(0.6)),
                const SizedBox(width: 4),
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 9,
                    fontWeight: FontWeight.bold,
                    color: color.withOpacity(0.7),
                    letterSpacing: 1,
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: Wrap(
              spacing: 6,
              runSpacing: 6,
              children: notes
                  .map(
                    (n) => Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: color.withOpacity(0.08),
                        borderRadius: BorderRadius.circular(20),
                        border:
                            Border.all(color: color.withOpacity(0.2)),
                      ),
                      child: Text(
                        n,
                        style: TextStyle(
                          fontSize: 11,
                          color: color.withOpacity(0.9),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  )
                  .toList(),
            ),
          ),
        ],
      );
}

class _QtyButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;
  const _QtyButton({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) => GestureDetector(
        onTap: onTap,
        child: Container(
          width: 44,
          height: 44,
          alignment: Alignment.center,
          child: Icon(icon, color: AppConstants.gold, size: 20),
        ),
      );
}

class _TrustItem extends StatelessWidget {
  final IconData icon;
  final String label;
  const _TrustItem({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) => Column(
        children: [
          Icon(icon, size: 18, color: AppConstants.gold),
          const SizedBox(height: 4),
          Text(
            label,
            style: const TextStyle(
                fontSize: 9, color: AppConstants.textMuted),
          ),
        ],
      );
}
