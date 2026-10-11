import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../constants/app_constants.dart';
import '../models/order_model.dart';
import '../providers/cart_provider.dart';

/// ─────────────────────────────────────────────────────────────────────────────
///  VALAROIX Orders Screen
///  Lists recent orders placed by the customer
/// ─────────────────────────────────────────────────────────────────────────────
class OrdersScreen extends StatelessWidget {
  const OrdersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final cartProvider = context.watch<CartProvider>();
    final orders = cartProvider.orders;

    return Scaffold(
      backgroundColor: AppConstants.primaryBg,
      appBar: AppBar(
        backgroundColor: AppConstants.primaryBg,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        title: const Text(
          'MY ORDERS',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w900,
            color: AppConstants.gold,
            letterSpacing: 3,
          ),
        ),
      ),
      body: orders.isEmpty
          ? Center(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppConstants.secondaryBg,
                        border: Border.all(color: AppConstants.borderGold),
                      ),
                      child: const Icon(
                        Icons.receipt_long_outlined,
                        size: 36,
                        color: AppConstants.gold,
                      ),
                    ),
                    const SizedBox(height: 18),
                    const Text(
                      'No Orders Found',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppConstants.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Your placed perfume orders will appear here with live tracking status.',
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
            )
          : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: orders.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final o = orders[index];
                return _OrderCard(order: o);
              },
            ),
    );
  }
}

class _OrderCard extends StatelessWidget {
  final OrderModel order;
  const _OrderCard({required this.order});

  Color _getStatusColor() {
    if (order.isDelivered) return AppConstants.success;
    if (order.isDispatched) return const Color(0xFF3B82F6);
    if (order.isCancelled) return AppConstants.error;
    return const Color(0xFFF59E0B);
  }

  @override
  Widget build(BuildContext context) {
    final statusColor = _getStatusColor();

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppConstants.secondaryBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppConstants.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '#${order.id}',
                style: const TextStyle(
                  color: AppConstants.gold,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'monospace',
                  fontSize: 14,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: statusColor.withOpacity(0.5)),
                ),
                child: Text(
                  order.statusDisplay,
                  style: TextStyle(
                    color: statusColor,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            order.item,
            style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 6),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Total: Rs. ${order.total.toStringAsFixed(0)}',
                style: const TextStyle(color: AppConstants.gold, fontWeight: FontWeight.bold, fontSize: 13),
              ),
              Text(
                '${order.createdAt.day}/${order.createdAt.month}/${order.createdAt.year}',
                style: const TextStyle(color: AppConstants.textMuted, fontSize: 11),
              ),
            ],
          ),
          if (order.tcsTrackingNumber != null && order.tcsTrackingNumber!.isNotEmpty) ...[
            const Divider(color: AppConstants.borderSubtle, height: 18),
            Row(
              children: [
                const Icon(Icons.local_shipping_outlined, color: AppConstants.gold, size: 16),
                const SizedBox(width: 6),
                Text(
                  'TCS CN: ${order.tcsTrackingNumber}',
                  style: const TextStyle(color: Colors.white70, fontSize: 11, fontFamily: 'monospace'),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
