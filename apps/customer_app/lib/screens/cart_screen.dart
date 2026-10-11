import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../constants/app_constants.dart';
import '../providers/cart_provider.dart';
import 'checkout_screen.dart';

/// ─────────────────────────────────────────────────────────────────────────────
///  VALAROIX Cart Screen
///  Lists items in cart, quantity modifiers, total summary & checkout button
/// ─────────────────────────────────────────────────────────────────────────────
class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final cartProvider = context.watch<CartProvider>();
    final cart = cartProvider.cart;
    final total = cartProvider.total;

    return Scaffold(
      backgroundColor: AppConstants.primaryBg,
      appBar: AppBar(
        backgroundColor: AppConstants.primaryBg,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        systemOverlayStyle: const SystemUiOverlayStyle(
          statusBarIconBrightness: Brightness.light,
        ),
        title: const Text(
          'SHOPPING CART',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w900,
            color: AppConstants.gold,
            letterSpacing: 3,
          ),
        ),
        actions: [
          if (cart.isNotEmpty)
            TextButton(
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    backgroundColor: AppConstants.secondaryBg,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                      side: const BorderSide(color: AppConstants.borderGold),
                    ),
                    title: const Text(
                      'Clear Cart',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                    ),
                    content: const Text(
                      'Are you sure you want to remove all items from your cart?',
                      style: TextStyle(color: AppConstants.textSecondary),
                    ),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(ctx),
                        child: const Text('Cancel', style: TextStyle(color: Colors.white54)),
                      ),
                      TextButton(
                        onPressed: () {
                          cartProvider.clearCart();
                          Navigator.pop(ctx);
                        },
                        child: const Text('Clear', style: TextStyle(color: Colors.redAccent)),
                      ),
                    ],
                  ),
                );
              },
              child: const Text(
                'Clear',
                style: TextStyle(color: AppConstants.textMuted, fontSize: 13),
              ),
            ),
        ],
      ),
      body: cart.isEmpty
          ? _EmptyCartView()
          : Column(
              children: [
                Expanded(
                  child: ListView.separated(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    itemCount: cart.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final item = cart[index];
                      return _CartItemTile(item: item);
                    },
                  ),
                ),
                _CartSummaryBottom(total: total),
              ],
            ),
    );
  }
}

class _EmptyCartView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 90,
              height: 90,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppConstants.secondaryBg,
                border: Border.all(color: AppConstants.borderGold, width: 1.5),
              ),
              child: const Icon(
                Icons.shopping_bag_outlined,
                size: 40,
                color: AppConstants.gold,
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'Your Cart is Empty',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: AppConstants.textPrimary,
                letterSpacing: 0.5,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Explore our luxury perfumes collection and select your signature scent.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 13,
                color: AppConstants.textSecondary,
                height: 1.4,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CartItemTile extends StatelessWidget {
  final CartItem item;
  const _CartItemTile({required this.item});

  @override
  Widget build(BuildContext context) {
    final cart = context.read<CartProvider>();

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppConstants.secondaryBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppConstants.borderSubtle),
      ),
      child: Row(
        children: [
          Container(
            width: 65,
            height: 65,
            decoration: BoxDecoration(
              color: AppConstants.tertiaryBg,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppConstants.borderGold),
            ),
            child: const Center(
              child: Text(
                'V',
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.w900,
                  color: AppConstants.gold,
                ),
              ),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.name,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: AppConstants.textPrimary,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  item.subtitle,
                  style: const TextStyle(
                    fontSize: 11,
                    color: AppConstants.textSecondary,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Rs. ${item.price}',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w900,
                    color: AppConstants.gold,
                  ),
                ),
              ],
            ),
          ),
          Row(
            children: [
              IconButton(
                visualDensity: VisualDensity.compact,
                onPressed: () {
                  HapticFeedback.lightImpact();
                  cart.updateQuantity(item.id, item.quantity - 1);
                },
                icon: const Icon(Icons.remove_circle_outline, color: AppConstants.textMuted, size: 22),
              ),
              Text(
                '${item.quantity}',
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
              IconButton(
                visualDensity: VisualDensity.compact,
                onPressed: () {
                  HapticFeedback.lightImpact();
                  cart.updateQuantity(item.id, item.quantity + 1);
                },
                icon: const Icon(Icons.add_circle_outline, color: AppConstants.gold, size: 22),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _CartSummaryBottom extends StatelessWidget {
  final int total;
  const _CartSummaryBottom({required this.total});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppConstants.secondaryBg,
        border: const Border(top: BorderSide(color: AppConstants.borderGold, width: 0.8)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.5),
            blurRadius: 15,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Delivery Fee', style: TextStyle(color: AppConstants.textSecondary, fontSize: 13)),
                const Text('FREE', style: TextStyle(color: AppConstants.success, fontWeight: FontWeight.bold, fontSize: 13)),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Total Amount', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                Text('Rs. $total', style: const TextStyle(color: AppConstants.gold, fontSize: 20, fontWeight: FontWeight.w900)),
              ],
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppConstants.gold,
                  foregroundColor: Colors.black,
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const CheckoutScreen()),
                  );
                },
                child: const Text(
                  'PROCEED TO CHECKOUT',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 1),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
