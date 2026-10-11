import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../constants/app_constants.dart';
import '../providers/cart_provider.dart';
import 'home_screen.dart';
import 'catalogue_screen.dart';
import 'cart_screen.dart';
import 'orders_screen.dart';
import 'track_screen.dart';

/// ─────────────────────────────────────────────────────────────────────────────
///  VALAROIX Main Screen — Bottom Navigation Shell
///  5 tabs: Home | Catalogue | Cart | Orders | Track
/// ─────────────────────────────────────────────────────────────────────────────
class MainScreen extends StatefulWidget {
  final int initialIndex;
  const MainScreen({super.key, this.initialIndex = 0});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  late int _currentIndex;

  final List<Widget> _screens = const [
    HomeScreen(),
    CatalogueScreen(),
    CartScreen(),
    OrdersScreen(),
    TrackScreen(),
  ];

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
  }

  @override
  Widget build(BuildContext context) {
    final cartCount = context.watch<CartProvider>().itemCount;

    return Scaffold(
      backgroundColor: AppConstants.primaryBg,
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: AppConstants.secondaryBg,
          border: Border(
            top: BorderSide(color: AppConstants.borderGold, width: 0.8),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.6),
              blurRadius: 20,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _NavItem(
                  icon: Icons.home_outlined,
                  activeIcon: Icons.home_rounded,
                  label: 'Home',
                  index: 0,
                  currentIndex: _currentIndex,
                  onTap: (i) => setState(() => _currentIndex = i),
                ),
                _NavItem(
                  icon: Icons.auto_awesome_outlined,
                  activeIcon: Icons.auto_awesome,
                  label: 'Parfums',
                  index: 1,
                  currentIndex: _currentIndex,
                  onTap: (i) => setState(() => _currentIndex = i),
                ),
                _CartNavItem(
                  cartCount: cartCount,
                  index: 2,
                  currentIndex: _currentIndex,
                  onTap: (i) => setState(() => _currentIndex = i),
                ),
                _NavItem(
                  icon: Icons.receipt_long_outlined,
                  activeIcon: Icons.receipt_long_rounded,
                  label: 'Orders',
                  index: 3,
                  currentIndex: _currentIndex,
                  onTap: (i) => setState(() => _currentIndex = i),
                ),
                _NavItem(
                  icon: Icons.local_shipping_outlined,
                  activeIcon: Icons.local_shipping_rounded,
                  label: 'Track',
                  index: 4,
                  currentIndex: _currentIndex,
                  onTap: (i) => setState(() => _currentIndex = i),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// ─── Single Nav Item ─────────────────────────────────────────────────────────
class _NavItem extends StatelessWidget {
  final IconData icon;
  final IconData activeIcon;
  final String label;
  final int index;
  final int currentIndex;
  final void Function(int) onTap;

  const _NavItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
    required this.index,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final active = currentIndex == index;
    return GestureDetector(
      onTap: () => onTap(index),
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          color: active ? AppConstants.gold.withOpacity(0.12) : Colors.transparent,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              active ? activeIcon : icon,
              size: 22,
              color: active ? AppConstants.gold : AppConstants.textMuted,
            ),
            const SizedBox(height: 3),
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: active ? FontWeight.bold : FontWeight.normal,
                color: active ? AppConstants.gold : AppConstants.textMuted,
                letterSpacing: 0.5,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// ─── Cart Nav Item with Badge ─────────────────────────────────────────────────
class _CartNavItem extends StatelessWidget {
  final int cartCount;
  final int index;
  final int currentIndex;
  final void Function(int) onTap;

  const _CartNavItem({
    required this.cartCount,
    required this.index,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final active = currentIndex == index;
    return GestureDetector(
      onTap: () => onTap(index),
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          color: active ? AppConstants.gold.withOpacity(0.12) : Colors.transparent,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                Icon(
                  active ? Icons.shopping_bag_rounded : Icons.shopping_bag_outlined,
                  size: 22,
                  color: active ? AppConstants.gold : AppConstants.textMuted,
                ),
                if (cartCount > 0)
                  Positioned(
                    right: -7,
                    top: -7,
                    child: Container(
                      width: 16,
                      height: 16,
                      decoration: const BoxDecoration(
                        color: Color(0xFFEF4444),
                        shape: BoxShape.circle,
                      ),
                      child: Center(
                        child: Text(
                          cartCount > 9 ? '9+' : '$cartCount',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 3),
            Text(
              'Cart',
              style: TextStyle(
                fontSize: 10,
                fontWeight: active ? FontWeight.bold : FontWeight.normal,
                color: active ? AppConstants.gold : AppConstants.textMuted,
                letterSpacing: 0.5,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
