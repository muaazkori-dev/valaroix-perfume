import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../constants/app_constants.dart';
import '../providers/cart_provider.dart';
import 'main_screen.dart';
import 'product_detail_screen.dart';

/// ─────────────────────────────────────────────────────────────────────────────
///  VALAROIX Home Screen
///  Luxury hero banner → 3 product cards → trust badges → WhatsApp CTA
/// ─────────────────────────────────────────────────────────────────────────────
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with SingleTickerProviderStateMixin {
  late final AnimationController _heroCtrl;

  @override
  void initState() {
    super.initState();
    _heroCtrl = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 8),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _heroCtrl.dispose();
    super.dispose();
  }

  Future<void> _openWhatsApp() async {
    final url = Uri.parse(
      'https://wa.me/${AppConstants.whatsappNumber}?text=${Uri.encodeComponent("Assalam-o-Alaikum VALAROIX! Mujhe aapke luxury fragrances ke baare mein jaanna hai. 🌟")}',
    );
    if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('WhatsApp open karne mein masla hua.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: AppConstants.primaryBg,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          // ── App Bar ─────────────────────────────────────────────────────────
          SliverAppBar(
            expandedHeight: 0,
            floating: true,
            pinned: false,
            backgroundColor: AppConstants.primaryBg,
            surfaceTintColor: Colors.transparent,
            systemOverlayStyle: const SystemUiOverlayStyle(
              statusBarBrightness: Brightness.dark,
              statusBarIconBrightness: Brightness.light,
            ),
            title: Row(
              children: [
                Container(
                  width: 34,
                  height: 34,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppConstants.secondaryBg,
                    border: Border.all(color: AppConstants.gold, width: 1.2),
                  ),
                  child: const Center(
                    child: Text(
                      'V',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                        color: AppConstants.gold,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                const Text(
                  'VALAROIX',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                    color: AppConstants.gold,
                    letterSpacing: 4,
                  ),
                ),
              ],
            ),
            actions: [
              IconButton(
                onPressed: _openWhatsApp,
                icon: const Icon(Icons.chat_bubble_outline_rounded,
                    color: Color(0xFF25D366)),
                tooltip: 'WhatsApp Support',
              ),
            ],
          ),

          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // ── Hero Section ───────────────────────────────────────────────
                _HeroSection(ctrl: _heroCtrl, screenWidth: size.width),

                const SizedBox(height: 32),

                // ── Section Title ──────────────────────────────────────────────
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'OUR COLLECTION',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: AppConstants.textMuted,
                          letterSpacing: 3,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Luxury Fragrances',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w900,
                          color: AppConstants.textPrimary,
                          letterSpacing: 0.5,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        height: 2,
                        width: 40,
                        decoration: const BoxDecoration(
                          color: AppConstants.gold,
                          borderRadius: BorderRadius.all(Radius.circular(1)),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // ── Product Cards ──────────────────────────────────────────────
                ...AppConstants.products.map(
                  (p) => Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: _ProductCard(product: p),
                  ),
                ),

                const SizedBox(height: 28),

                // ── Trust Badges ───────────────────────────────────────────────
                _TrustBadges(),

                const SizedBox(height: 24),

                // ── WhatsApp CTA ───────────────────────────────────────────────
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: GestureDetector(
                    onTap: _openWhatsApp,
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      decoration: BoxDecoration(
                        color: const Color(0xFF075E54),
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF25D366).withOpacity(0.3),
                            blurRadius: 20,
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.chat_rounded, color: Colors.white, size: 20),
                          const SizedBox(width: 10),
                          const Text(
                            'Order via WhatsApp',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 100),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// ─── Hero Section ─────────────────────────────────────────────────────────────
class _HeroSection extends StatelessWidget {
  final AnimationController ctrl;
  final double screenWidth;
  const _HeroSection({required this.ctrl, required this.screenWidth});

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: ctrl,
      builder: (_, __) => Container(
        width: double.infinity,
        height: 220,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              AppConstants.primaryBg,
              Color.lerp(
                const Color(0xFF1A1200),
                const Color(0xFF0D0D0D),
                ctrl.value,
              )!,
            ],
          ),
        ),
        child: Stack(
          children: [
            // Gold circular glow
            Positioned(
              right: -40,
              top: -40,
              child: Container(
                width: 220,
                height: 220,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [
                      AppConstants.gold.withOpacity(0.10 + ctrl.value * 0.06),
                      Colors.transparent,
                    ],
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      border: Border.all(color: AppConstants.gold, width: 0.8),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Text(
                      'HAUTE PARFUMERIE',
                      style: TextStyle(
                        fontSize: 9,
                        fontWeight: FontWeight.bold,
                        color: AppConstants.gold,
                        letterSpacing: 2.5,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    "L'Élixir De\nDistinction",
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.w900,
                      color: AppConstants.textPrimary,
                      height: 1.1,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    'Premium Oil · Free Delivery · COD Available',
                    style: TextStyle(
                      fontSize: 12,
                      color: AppConstants.textSecondary,
                      letterSpacing: 0.3,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// ─── Product Card ─────────────────────────────────────────────────────────────
class _ProductCard extends StatelessWidget {
  final Map<String, dynamic> product;
  const _ProductCard({required this.product});

  @override
  Widget build(BuildContext context) {
    final accentColor = Color(product['accentHex'] as int);
    final baseColor = Color(product['colorHex'] as int);
    final tagColor = Color(product['tagColor'] as int);

    return GestureDetector(
      onTap: () => Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => ProductDetailScreen(product: product),
        ),
      ),
      child: Container(
        decoration: BoxDecoration(
          color: AppConstants.secondaryBg,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppConstants.borderSubtle),
          boxShadow: [
            BoxShadow(
              color: accentColor.withOpacity(0.08),
              blurRadius: 20,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              // Product Visual - Real Perfume Bottle Photo
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: accentColor.withOpacity(0.4),
                    width: 1.0,
                  ),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(15),
                  child: Image.asset(
                    product['image'] ?? 'assets/images/app_logo.jpg',
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Center(
                      child: Text(
                        'V',
                        style: TextStyle(
                          fontSize: 42,
                          fontWeight: FontWeight.w900,
                          color: accentColor.withOpacity(0.7),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              // Product Info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: tagColor.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: tagColor.withOpacity(0.4)),
                          ),
                          child: Text(
                            product['tag'] ?? '',
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                              color: tagColor == const Color(0xFF0D0D0D)
                                  ? AppConstants.gold
                                  : Color(product['tagColor'] as int),
                              letterSpacing: 1,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      product['name'] ?? '',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w900,
                        color: AppConstants.textPrimary,
                        letterSpacing: 0.5,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      product['subtitle'] ?? '',
                      style: const TextStyle(
                        fontSize: 11,
                        color: AppConstants.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      product['lasting'] ?? '',
                      style: TextStyle(
                        fontSize: 10,
                        color: accentColor.withOpacity(0.8),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Text(
                          'Rs. ${product['price']}',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w900,
                            color: accentColor == AppConstants.gold
                                ? AppConstants.gold
                                : AppConstants.gold,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: GestureDetector(
                            onTap: () {
                              context.read<CartProvider>().addToCart(product);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(
                                    '${product['name']} added to cart!',
                                    style: const TextStyle(color: Colors.white),
                                  ),
                                  backgroundColor: AppConstants.gold,
                                  duration: const Duration(seconds: 2),
                                  behavior: SnackBarBehavior.floating,
                                ),
                              );
                            },
                            child: Container(
                              alignment: Alignment.center,
                              padding: const EdgeInsets.symmetric(vertical: 7),
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [AppConstants.gold, AppConstants.goldDark],
                                ),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Text(
                                'Add to Cart',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.black,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// ─── Trust Badges ─────────────────────────────────────────────────────────────
class _TrustBadges extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: AppConstants.secondaryBg,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppConstants.borderGold),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: const [
            _Badge(icon: Icons.local_shipping_outlined, label: 'Free Delivery'),
            _Divider(),
            _Badge(icon: Icons.verified_outlined, label: '100% Authentic'),
            _Divider(),
            _Badge(icon: Icons.payments_outlined, label: 'COD Available'),
          ],
        ),
      ),
    );
  }
}

class _Badge extends StatelessWidget {
  final IconData icon;
  final String label;
  const _Badge({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) => Column(
    children: [
      Icon(icon, color: AppConstants.gold, size: 22),
      const SizedBox(height: 4),
      Text(label, style: const TextStyle(fontSize: 10, color: AppConstants.textSecondary)),
    ],
  );
}

class _Divider extends StatelessWidget {
  const _Divider();
  @override
  Widget build(BuildContext context) => Container(
    width: 1, height: 36, color: AppConstants.borderSubtle,
  );
}
