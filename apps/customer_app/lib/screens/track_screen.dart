import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';
import '../constants/app_constants.dart';
import '../models/order_model.dart';
import '../services/api_service.dart';

/// ─────────────────────────────────────────────────────────────────────────────
///  VALAROIX Track Order Screen
///  Search order by ID or phone with live 4-step progress timeline
/// ─────────────────────────────────────────────────────────────────────────────
class TrackScreen extends StatefulWidget {
  const TrackScreen({super.key});

  @override
  State<TrackScreen> createState() => _TrackScreenState();
}

class _TrackScreenState extends State<TrackScreen> {
  final _searchCtrl = TextEditingController();
  bool _isSearching = false;
  OrderModel? _trackedOrder;
  bool _searched = false;

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  Future<void> _handleTrack() async {
    final q = _searchCtrl.text.trim();
    if (q.isEmpty) return;

    setState(() {
      _isSearching = true;
      _searched = true;
    });
    HapticFeedback.lightImpact();

    final order = await ApiService.trackOrder(q);

    setState(() {
      _isSearching = false;
      _trackedOrder = order;
    });
  }

  int _getTimelineStep(String status) {
    final s = status.toLowerCase();
    if (s.contains('deliver')) return 4;
    if (s.contains('dispatch') || s.contains('transit')) return 3;
    if (s.contains('confirm')) return 2;
    return 1; // Pending
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppConstants.primaryBg,
      appBar: AppBar(
        backgroundColor: AppConstants.primaryBg,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        title: const Text(
          'TRACK PARCEL',
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
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Track Your Fragrance Parcel',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            const SizedBox(height: 6),
            const Text(
              'Enter your Order ID (e.g. VLX-12345) or Phone Number to check real-time TCS delivery status.',
              style: TextStyle(color: AppConstants.textSecondary, fontSize: 12, height: 1.4),
            ),
            const SizedBox(height: 18),

            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _searchCtrl,
                    style: const TextStyle(color: Colors.white, fontSize: 14),
                    decoration: InputDecoration(
                      hintText: 'Order ID or 0314...',
                      hintStyle: const TextStyle(color: AppConstants.textMuted, fontSize: 13),
                      prefixIcon: const Icon(Icons.search, color: AppConstants.gold, size: 20),
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
                        borderSide: const BorderSide(color: AppConstants.gold),
                      ),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    ),
                    onSubmitted: (_) => _handleTrack(),
                  ),
                ),
                const SizedBox(width: 10),
                SizedBox(
                  height: 48,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppConstants.gold,
                      foregroundColor: Colors.black,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      padding: const EdgeInsets.symmetric(horizontal: 18),
                    ),
                    onPressed: _isSearching ? null : _handleTrack,
                    child: _isSearching
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(color: Colors.black, strokeWidth: 2),
                          )
                        : const Text('TRACK', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1)),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 28),

            if (_searched && _trackedOrder == null && !_isSearching)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppConstants.secondaryBg,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppConstants.borderSubtle),
                ),
                child: const Column(
                  children: [
                    Icon(Icons.search_off_rounded, color: AppConstants.textMuted, size: 36),
                    SizedBox(height: 10),
                    Text(
                      'No matching order found',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 4),
                    Text(
                      'Please verify your Order ID or phone number, or contact concierge on WhatsApp.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: AppConstants.textSecondary, fontSize: 12),
                    ),
                  ],
                ),
              ),

            if (_trackedOrder != null) ...[
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppConstants.secondaryBg,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppConstants.borderGold),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '#${_trackedOrder!.id}',
                          style: const TextStyle(
                            color: AppConstants.gold,
                            fontFamily: 'monospace',
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0x22D4AF37),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: AppConstants.borderGold),
                          ),
                          child: Text(
                            _trackedOrder!.statusDisplay,
                            style: const TextStyle(color: AppConstants.gold, fontSize: 12, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      _trackedOrder!.item,
                      style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Recipient: ${_trackedOrder!.customerName} (${_trackedOrder!.city})',
                      style: const TextStyle(color: AppConstants.textSecondary, fontSize: 12),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Total: Rs. ${_trackedOrder!.total.toStringAsFixed(0)} (COD)',
                      style: const TextStyle(color: AppConstants.gold, fontSize: 13, fontWeight: FontWeight.bold),
                    ),

                    if (_trackedOrder!.tcsTrackingNumber != null && _trackedOrder!.tcsTrackingNumber!.isNotEmpty) ...[
                      const Divider(color: AppConstants.borderSubtle, height: 24),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Courier Partner', style: TextStyle(color: AppConstants.textMuted, fontSize: 11)),
                              const Text('TCS Express Courier', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                            ],
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              const Text('Consignment CN', style: TextStyle(color: AppConstants.textMuted, fontSize: 11)),
                              Text(_trackedOrder!.tcsTrackingNumber!, style: const TextStyle(color: AppConstants.gold, fontWeight: FontWeight.bold, fontFamily: 'monospace', fontSize: 13)),
                            ],
                          ),
                        ],
                      ),
                    ],

                    const Divider(color: AppConstants.borderSubtle, height: 28),
                    const Text('Delivery Journey', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                    const SizedBox(height: 16),

                    _TimelineStep(
                      title: 'Order Placed',
                      subtitle: 'Received at VALAROIX Boutique',
                      isCompleted: _getTimelineStep(_trackedOrder!.status) >= 1,
                      isLast: false,
                    ),
                    _TimelineStep(
                      title: 'Confirmed by Atelier',
                      subtitle: 'Bottle verified and packed in luxury packaging',
                      isCompleted: _getTimelineStep(_trackedOrder!.status) >= 2,
                      isLast: false,
                    ),
                    _TimelineStep(
                      title: 'Dispatched via TCS Express',
                      subtitle: _trackedOrder!.tcsTrackingNumber != null ? 'CN #${_trackedOrder!.tcsTrackingNumber}' : 'En route to your city',
                      isCompleted: _getTimelineStep(_trackedOrder!.status) >= 3,
                      isLast: false,
                    ),
                    _TimelineStep(
                      title: 'Delivered',
                      subtitle: 'Handed over to customer',
                      isCompleted: _getTimelineStep(_trackedOrder!.status) >= 4,
                      isLast: true,
                    ),
                  ],
                ),
              ),
            ],

            const SizedBox(height: 30),

            // WhatsApp Concierge Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppConstants.secondaryBg,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppConstants.borderSubtle),
              ),
              child: Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: const BoxDecoration(
                      color: Color(0xFF075E54),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.chat_bubble_rounded, color: Colors.white, size: 22),
                  ),
                  const SizedBox(width: 14),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Need Delivery Assistance?', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                        SizedBox(height: 2),
                        Text('Chat directly with our luxury concierge', style: TextStyle(color: AppConstants.textSecondary, fontSize: 11)),
                      ],
                    ),
                  ),
                  TextButton(
                    onPressed: () async {
                      final url = Uri.parse('https://wa.me/${AppConstants.whatsappNumber}');
                      if (await canLaunchUrl(url)) {
                        await launchUrl(url, mode: LaunchMode.externalApplication);
                      }
                    },
                    child: const Text('Chat', style: TextStyle(color: AppConstants.gold, fontWeight: FontWeight.bold)),
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

class _TimelineStep extends StatelessWidget {
  final String title;
  final String subtitle;
  final bool isCompleted;
  final bool isLast;

  const _TimelineStep({
    required this.title,
    required this.subtitle,
    required this.isCompleted,
    required this.isLast,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            Container(
              width: 16,
              height: 16,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isCompleted ? AppConstants.gold : Colors.transparent,
                border: Border.all(
                  color: isCompleted ? AppConstants.gold : AppConstants.textMuted,
                  width: 2,
                ),
              ),
              child: isCompleted
                  ? const Icon(Icons.check, size: 10, color: Colors.black)
                  : null,
            ),
            if (!isLast)
              Container(
                width: 2,
                height: 36,
                color: isCompleted ? AppConstants.gold.withOpacity(0.5) : AppConstants.borderSubtle,
              ),
          ],
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  color: isCompleted ? Colors.white : AppConstants.textMuted,
                  fontWeight: FontWeight.bold,
                  fontSize: 13,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                subtitle,
                style: const TextStyle(color: AppConstants.textSecondary, fontSize: 11),
              ),
              if (!isLast) const SizedBox(height: 14),
            ],
          ),
        ),
      ],
    );
  }
}
