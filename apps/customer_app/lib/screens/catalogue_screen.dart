import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../constants/app_constants.dart';
import '../providers/cart_provider.dart';
import 'bespoke_screen.dart';
import 'product_detail_screen.dart';

/// ─────────────────────────────────────────────────────────────────────────────
///  VALAROIX Catalogue Screen
///  Full-width scrollable list of all 3 products
/// ─────────────────────────────────────────────────────────────────────────────
class CatalogueScreen extends StatelessWidget {
  const CatalogueScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppConstants.primaryBg,
      appBar: AppBar(
        backgroundColor: AppConstants.primaryBg,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        systemOverlayStyle: const SystemUiOverlayStyle(
          statusBarIconBrightness: Brightness.light,
        ),
        centerTitle: false,
        title: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: AppConstants.gold, width: 1.2),
              ),
              child: ClipOval(
                child: Image.asset(
                  'assets/images/logo.png',
                  width: 32,
                  height: 32,
                  fit: BoxFit.cover,
                ),
              ),
            ),
            const SizedBox(width: 10),
            const Text(
              'OUR COLLECTION',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w900,
                color: AppConstants.gold,
                letterSpacing: 3,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Apni Pasand Ka Perfume',
            icon: const Icon(Icons.auto_awesome, color: AppConstants.gold, size: 20),
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const BespokeScreen()),
            ),
          ),
          const SizedBox(width: 8),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(
            height: 1,
            color: AppConstants.borderSubtle,
          ),
        ),
      ),
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Luxury Haute Parfumerie',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w900,
                      color: AppConstants.textPrimary,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Each fragrance crafted with 30–40% perfume oil concentration\nfor an unrivaled trail that lasts all day.',
                    style: TextStyle(
                      fontSize: 13,
                      color: AppConstants.textSecondary,
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    height: 2,
                    width: 40,
                    decoration: BoxDecoration(
                      color: AppConstants.gold,
                      borderRadius: BorderRadius.circular(1),
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Bespoke Fragrance Banner
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              child: GestureDetector(
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const BespokeScreen()),
                ),
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF1E1705), Color(0xFF0F0F12)],
                    ),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppConstants.gold.withOpacity(0.5)),
                    boxShadow: [
                      BoxShadow(
                        color: AppConstants.gold.withOpacity(0.08),
                        blurRadius: 16,
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: AppConstants.gold.withOpacity(0.12),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.auto_awesome, color: AppConstants.gold, size: 20),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text(
                              'APNI PASAND KA PERFUME',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w900,
                                color: AppConstants.gold,
                                letterSpacing: 1.2,
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Custom clone of any designer fragrance (Min. 2 bottles)',
                              style: TextStyle(fontSize: 11, color: AppConstants.textSecondary),
                            ),
                          ],
                        ),
                      ),
                      const Icon(Icons.arrow_forward_ios_rounded, color: AppConstants.gold, size: 14),
                    ],
                  ),
                ),
              ),
            ),
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) {
                final product = AppConstants.products[index];
                return Padding(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 16, vertical: 8),
                  child: _CatalogueCard(product: product),
                );
              },
              childCount: AppConstants.products.length,
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }
}

/// ─── Full-Width Catalogue Card ─────────────────────────────────────────────
class _CatalogueCard extends StatelessWidget {
  final Map<String, dynamic> product;
  const _CatalogueCard({required this.product});

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
              blurRadius: 24,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Product Visual Banner (Full-Width Large Image) ──────────────
            ClipRRect(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
              child: Container(
                width: double.infinity,
                height: 230,
                decoration: BoxDecoration(
                  color: baseColor,
                  border: Border(
                    bottom: BorderSide(
                      color: accentColor.withOpacity(0.3),
                      width: 1.0,
                    ),
                  ),
                ),
                child: Stack(
                  children: [
                    // Full bottle luxury image
                    Positioned.fill(
                      child: Image.asset(
                        product['image'] ?? 'assets/images/app_logo.jpg',
                        fit: BoxFit.cover,
                        alignment: Alignment.center,
                        errorBuilder: (_, __, ___) => Container(
                          color: Colors.black,
                          child: Center(
                            child: Text(
                              'V',
                              style: TextStyle(
                                fontSize: 52,
                                fontWeight: FontWeight.w900,
                                color: accentColor.withOpacity(0.8),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                    // Ambient gradient overlay
                    Positioned.fill(
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.black.withOpacity(0.2),
                              Colors.transparent,
                              Colors.black.withOpacity(0.55),
                            ],
                          ),
                        ),
                      ),
                    ),
                    // Tag Badge
                    Positioned(
                      top: 12,
                      left: 12,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.black87,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: tagColor.withOpacity(0.6)),
                        ),
                        child: Text(
                          product['tag'] ?? '',
                          style: TextStyle(
                            fontSize: 9.5,
                            fontWeight: FontWeight.bold,
                            color: tagColor == const Color(0xFF0D0D0D)
                                ? AppConstants.gold
                                : tagColor,
                            letterSpacing: 1.2,
                          ),
                        ),
                      ),
                    ),
                    // Lasting & Forward icon
                    Positioned(
                      top: 12,
                      right: 12,
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          if (product['lasting'] != null)
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.black87,
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: AppConstants.gold.withOpacity(0.4)),
                              ),
                              child: Text(
                                product['lasting'] ?? '',
                                style: const TextStyle(
                                  fontSize: 9.5,
                                  color: AppConstants.gold,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          const SizedBox(width: 8),
                          Container(
                            width: 30,
                            height: 30,
                            decoration: BoxDecoration(
                              color: Colors.black87,
                              shape: BoxShape.circle,
                              border: Border.all(color: accentColor.withOpacity(0.4)),
                            ),
                            child: const Icon(
                              Icons.arrow_forward_ios_rounded,
                              size: 12,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // ── Product Info ──────────────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    product['name'] ?? '',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                      color: AppConstants.textPrimary,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    product['subtitle'] ?? '',
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppConstants.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 10),
                  // Notes preview
                  Text(
                    '🌿 ${product['topNotes'] ?? ''}',
                    style: TextStyle(
                      fontSize: 11,
                      color: accentColor.withOpacity(0.8),
                    ),
                  ),
                  const SizedBox(height: 12),
                  // Badges row
                  Row(
                    children: [
                      _SmallBadge(
                        label: product['oil'] ?? '',
                        color: AppConstants.gold,
                      ),
                      const SizedBox(width: 8),
                      _SmallBadge(
                        label: product['lasting'] ?? '',
                        color: accentColor,
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  // Price + Add to Cart
                  Row(
                    children: [
                      Text(
                        'Rs. ${product['price']}',
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                          color: AppConstants.gold,
                        ),
                      ),
                      const Spacer(),
                      GestureDetector(
                        onTap: () {
                          context.read<CartProvider>().addToCart(product);
                          HapticFeedback.mediumImpact();
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(
                                '${product['name']} added to cart!',
                                style: const TextStyle(
                                  color: Colors.black,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              backgroundColor: AppConstants.gold,
                              duration: const Duration(seconds: 2),
                              behavior: SnackBarBehavior.floating,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12)),
                            ),
                          );
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 20, vertical: 10),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [
                                AppConstants.gold,
                                AppConstants.goldDark,
                              ],
                            ),
                            borderRadius: BorderRadius.circular(12),
                            boxShadow: [
                              BoxShadow(
                                color: AppConstants.gold.withOpacity(0.3),
                                blurRadius: 12,
                                offset: const Offset(0, 3),
                              ),
                            ],
                          ),
                          child: const Row(
                            children: [
                              Icon(Icons.add_shopping_cart_rounded,
                                  color: Colors.black, size: 16),
                              SizedBox(width: 6),
                              Text(
                                'Add to Cart',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.black,
                                ),
                              ),
                            ],
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
    );
  }
}

class _SmallBadge extends StatelessWidget {
  final String label;
  final Color color;
  const _SmallBadge({required this.label, required this.color});

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
        decoration: BoxDecoration(
          color: color.withOpacity(0.08),
          borderRadius: BorderRadius.circular(6),
          border: Border.all(color: color.withOpacity(0.2)),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 9,
            color: color.withOpacity(0.9),
            fontWeight: FontWeight.w600,
          ),
        ),
      );
}
