import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../constants/admin_constants.dart';
import '../models/admin_models.dart';
import '../providers/admin_provider.dart';
import '../services/update_service.dart';
import 'order_detail_screen.dart';
import 'pin_screen.dart';

/// ─────────────────────────────────────────────────────────────────────────────
///  VALAROIX Admin Dashboard Screen
///  Real-time metrics, live order stream, audio alert toggle & TCS dispatch
/// ─────────────────────────────────────────────────────────────────────────────
class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tabCtrl;

  @override
  void initState() {
    super.initState();
    _tabCtrl = TabController(length: 4, vsync: this);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      Future.delayed(const Duration(seconds: 2), () {
        if (mounted) {
          UpdateService.checkForUpdates(context);
        }
      });
    });
  }

  @override
  void dispose() {
    _tabCtrl.dispose();
    super.dispose();
  }

  void _openWhatsApp(AdminOrder order, String type) async {
    final cleanPhone = order.phone.replaceAll(RegExp(r'\D'), '').replaceFirst(RegExp(r'^0'), '');
    String msg = '';
    if (type == 'confirm') {
      msg = '''Assalam-o-Alaikum ${order.customerName}! ✨

Hum VALAROIX Luxury Parfums se baat kar rahe hain.
Aapka order receive hua hai:
📦 Order: #${order.id}
🌸 Item: ${order.item}
💰 Bill: Rs. ${order.total} (Cash on Delivery)
📍 City: ${order.city}

👉 Kya aap is order ko CONFIRM karte hain taake hum TCS Express se dispatch kar dein? Baraye meharbani 'YES' likh kar reply karein. Shukriya!

Team VALAROIX''';
    } else {
      final cn = order.tcsTrackingNumber ?? '7729841029';
      msg = '''Assalam-o-Alaikum ${order.customerName}! ✨

VALAROIX se aapka perfume order #${order.id} DISPATCH kar diya gaya hai!
📦 Item: ${order.item}
💰 Bill: Rs. ${order.total} (COD)
🏷️ TCS CN: $cn
📍 Track: https://valaroix.com/track?q=$cn

1-2 din mein parcel receive ho jayega. Shukriya!''';
    }

    final url = Uri.parse('https://wa.me/92$cleanPhone?text=${Uri.encodeComponent(msg)}');
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  void _showNotificationHelper(BuildContext context, AdminProvider admin) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AdminConstants.secondaryBg,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: AdminConstants.gold, width: 1.5),
        ),
        title: const Row(
          children: [
            Icon(Icons.notifications_active, color: AdminConstants.gold, size: 22),
            SizedBox(width: 10),
            Text(
              'Notification Alerts',
              style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Agar phone par notifications greyed out ya Denied hain:',
              style: TextStyle(color: AdminConstants.gold, fontSize: 13, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.black45,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.white10),
              ),
              child: const Text(
                '1. Neeche "Open App Settings" par tap karein.\n'
                '2. Upar daayein kone mein 3 dots (⋮) dabayein.\n'
                '3. "Allow restricted settings" par tap karein.\n'
                '4. Phir "Notifications" ko ALLOW kar dein!',
                style: TextStyle(color: Colors.white70, fontSize: 12, height: 1.5),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: AdminConstants.gold,
                foregroundColor: Colors.black,
                minimumSize: const Size.fromHeight(42),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              onPressed: () {
                Navigator.pop(ctx);
                admin.openNotificationSettings();
              },
              icon: const Icon(Icons.settings, size: 16),
              label: const Text('Open App Settings', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
            ),
            const SizedBox(height: 8),
            OutlinedButton.icon(
              style: OutlinedButton.styleFrom(
                foregroundColor: AdminConstants.success,
                side: const BorderSide(color: AdminConstants.success),
                minimumSize: const Size.fromHeight(42),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              onPressed: () {
                Navigator.pop(ctx);
                admin.requestNotificationPermission();
                admin.sendTestNotification();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Test drop-down alert sent! Check notification bar.'),
                    backgroundColor: AdminConstants.success,
                  ),
                );
              },
              icon: const Icon(Icons.bolt, size: 16),
              label: const Text('Send Test Alert Now (Drop-down)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Close', style: TextStyle(color: AdminConstants.textMuted)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final admin = context.watch<AdminProvider>();
    final newAlert = admin.newOrderAlert;

    return Scaffold(
      backgroundColor: AdminConstants.primaryBg,
      appBar: AppBar(
        backgroundColor: AdminConstants.secondaryBg,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        title: Row(
          children: [
            Container(
              width: 34,
              height: 34,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: AdminConstants.gold, width: 1.2),
              ),
              child: ClipOval(
                child: Image.asset(
                  'assets/images/logo.png',
                  width: 34,
                  height: 34,
                  fit: BoxFit.cover,
                ),
              ),
            ),
            const SizedBox(width: 10),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'VALAROIX ADMIN',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: 2),
                ),
                Text(
                  'Owner Hub: Muaaz & Fahad',
                  style: TextStyle(fontSize: 10, color: AdminConstants.gold),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Check for Updates',
            icon: const Icon(Icons.system_update_alt_rounded, color: AdminConstants.gold),
            onPressed: () => UpdateService.checkForUpdates(context, isManual: true),
          ),
          IconButton(
            tooltip: 'Notification Setup & Test',
            icon: const Icon(Icons.notifications_active_outlined, color: AdminConstants.gold),
            onPressed: () => _showNotificationHelper(context, admin),
          ),
          IconButton(
            tooltip: admin.soundEnabled ? 'Order Sound: ON' : 'Order Sound: OFF',
            icon: Icon(
              admin.soundEnabled ? Icons.volume_up_rounded : Icons.volume_off_rounded,
              color: admin.soundEnabled ? AdminConstants.success : AdminConstants.textMuted,
            ),
            onPressed: () {
              admin.toggleSound();
              HapticFeedback.lightImpact();
            },
          ),
          IconButton(
            tooltip: 'Lock Panel',
            icon: const Icon(Icons.lock_outline_rounded, color: Colors.redAccent),
            onPressed: () {
              admin.logout();
              Navigator.of(context).pushReplacement(
                MaterialPageRoute(builder: (_) => const PinScreen()),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // ── Real-Time New Order Banner ─────────────────────────────────────
          if (newAlert != null)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              color: const Color(0xFF064E3B),
              child: Row(
                children: [
                  const Icon(Icons.notifications_active_rounded, color: Colors.white, size: 20),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      '🔔 NEW ORDER: ${newAlert.customerName} — Rs. ${newAlert.total}',
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.white70, size: 18),
                    onPressed: () => admin.clearNewOrderAlert(),
                  ),
                ],
              ),
            ),

          // ── Stats Summary Bar ──────────────────────────────────────────────
          Padding(
            padding: const EdgeInsets.all(16),
            child: GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 10,
              crossAxisSpacing: 10,
              childAspectRatio: 2.2,
              children: [
                _StatTile(
                  label: 'TOTAL ORDERS',
                  value: '${admin.orders.length}',
                  color: Colors.white,
                  icon: Icons.shopping_bag_outlined,
                ),
                _StatTile(
                  label: 'PENDING DISPATCH',
                  value: '${admin.pendingCount}',
                  color: AdminConstants.warning,
                  icon: Icons.pending_actions_outlined,
                ),
                _StatTile(
                  label: 'TOTAL REVENUE',
                  value: 'Rs. ${admin.totalRevenue.toString()}',
                  color: AdminConstants.gold,
                  icon: Icons.account_balance_wallet_outlined,
                ),
                _StatTile(
                  label: 'NET PROFIT',
                  value: 'Rs. ${admin.totalProfit.toString()}',
                  color: AdminConstants.success,
                  icon: Icons.trending_up_rounded,
                ),
              ],
            ),
          ),

          // ── Tab Bar ────────────────────────────────────────────────────────
          Container(
            color: AdminConstants.secondaryBg,
            child: TabBar(
              controller: _tabCtrl,
              indicatorColor: AdminConstants.gold,
              labelColor: AdminConstants.gold,
              unselectedLabelColor: AdminConstants.textMuted,
              labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
              tabs: const [
                Tab(text: 'All Orders'),
                Tab(text: 'Pending'),
                Tab(text: 'Dispatched'),
                Tab(text: 'Delivered'),
              ],
            ),
          ),

          // ── Tab Views ──────────────────────────────────────────────────────
          Expanded(
            child: TabBarView(
              controller: _tabCtrl,
              children: [
                _OrdersListView(orders: admin.orders, onWhatsApp: _openWhatsApp),
                _OrdersListView(
                  orders: admin.orders.where((o) => o.isPending).toList(),
                  onWhatsApp: _openWhatsApp,
                ),
                _OrdersListView(
                  orders: admin.orders.where((o) => o.isDispatched).toList(),
                  onWhatsApp: _openWhatsApp,
                ),
                _OrdersListView(
                  orders: admin.orders.where((o) => o.isDelivered).toList(),
                  onWhatsApp: _openWhatsApp,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _StatTile extends StatelessWidget {
  final String label;
  final String value;
  final Color color;
  final IconData icon;

  const _StatTile({
    required this.label,
    required this.value,
    required this.color,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: AdminConstants.secondaryBg,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AdminConstants.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                label,
                style: const TextStyle(
                  color: AdminConstants.textMuted,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.5,
                ),
              ),
              Icon(icon, color: color.withOpacity(0.6), size: 16),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              color: color,
              fontSize: 16,
              fontWeight: FontWeight.w900,
            ),
          ),
        ],
      ),
    );
  }
}

class _OrdersListView extends StatelessWidget {
  final List<AdminOrder> orders;
  final void Function(AdminOrder, String) onWhatsApp;

  const _OrdersListView({required this.orders, required this.onWhatsApp});

  @override
  Widget build(BuildContext context) {
    if (orders.isEmpty) {
      return const Center(
        child: Text(
          'No orders in this category',
          style: TextStyle(color: AdminConstants.textMuted, fontSize: 13),
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: orders.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final o = orders[index];
        return _OrderAdminCard(order: o, onWhatsApp: onWhatsApp);
      },
    );
  }
}

class _OrderAdminCard extends StatelessWidget {
  final AdminOrder order;
  final void Function(AdminOrder, String) onWhatsApp;

  const _OrderAdminCard({required this.order, required this.onWhatsApp});

  Color _getStatusColor() {
    if (order.isDelivered) return AdminConstants.success;
    if (order.isDispatched) return const Color(0xFF3B82F6);
    if (order.isCancelled) return AdminConstants.error;
    return AdminConstants.warning;
  }

  @override
  Widget build(BuildContext context) {
    final statusColor = _getStatusColor();
    final admin = context.read<AdminProvider>();

    return GestureDetector(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(builder: (_) => OrderDetailScreen(order: order)),
        );
      },
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AdminConstants.secondaryBg,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AdminConstants.border),
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
                    color: AdminConstants.gold,
                    fontFamily: 'monospace',
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: statusColor.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: statusColor.withOpacity(0.5)),
                  ),
                  child: Text(
                    order.status,
                    style: TextStyle(color: statusColor, fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              '${order.customerName} · ${order.phone}',
              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
            ),
            const SizedBox(height: 2),
            Text(
              '${order.address}, ${order.city}',
              style: const TextStyle(color: AdminConstants.textSecondary, fontSize: 11),
            ),
            const SizedBox(height: 6),
            Text(
              order.item,
              style: const TextStyle(color: AdminConstants.gold, fontWeight: FontWeight.w600, fontSize: 12),
            ),
            const SizedBox(height: 6),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Total: Rs. ${order.total}',
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                ),
                Text(
                  'Profit: +Rs. ${order.profit}',
                  style: const TextStyle(color: AdminConstants.success, fontWeight: FontWeight.bold, fontSize: 12),
                ),
              ],
            ),
            const Divider(color: AdminConstants.border, height: 20),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: const Color(0xFF25D366),
                      side: const BorderSide(color: Color(0xFF25D366)),
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    onPressed: () => onWhatsApp(order, 'confirm'),
                    icon: const Icon(Icons.chat, size: 14),
                    label: const Text('Confirm WA', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AdminConstants.gold,
                      foregroundColor: Colors.black,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    onPressed: () {
                      final cn = '77${DateTime.now().millisecondsSinceEpoch.toString().substring(5)}';
                      admin.updateOrderStatus(order.id, 'Confirmed & Dispatched via TCS', tcsNumber: cn);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Order #${order.id} booked with TCS (CN #$cn)'),
                          backgroundColor: AdminConstants.gold,
                        ),
                      );
                    },
                    icon: const Icon(Icons.local_shipping, size: 14),
                    label: const Text('1-Tap TCS', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
