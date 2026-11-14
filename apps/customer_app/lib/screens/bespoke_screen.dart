import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';
import '../constants/app_constants.dart';

class BespokeScreen extends StatefulWidget {
  const BespokeScreen({super.key});

  @override
  State<BespokeScreen> createState() => _BespokeScreenState();
}

class _BespokeScreenState extends State<BespokeScreen> {
  final _formKey = GlobalKey<FormState>();

  final List<Map<String, String>> _popularFlavours = [
    {'id': 'aventus', 'name': 'Creed Aventus', 'vibe': 'Smoky Pineapple & Birch', 'family': 'Fruity Woody'},
    {'id': 'baccarat', 'name': 'Baccarat Rouge 540', 'vibe': 'Saffron, Amberwood & Jasmine', 'family': 'Warm Amber'},
    {'id': 'oudwood', 'name': 'Tom Ford Oud Wood', 'vibe': 'Rare Oud, Sandalwood & Vanilla', 'family': 'Precious Woody'},
    {'id': 'tygar', 'name': 'Bvlgari Tygar', 'vibe': 'Grapefruit & Deep Ambroxan', 'family': 'Citrus Amber'},
    {'id': 'sauvage-elixir', 'name': 'Dior Sauvage Elixir', 'vibe': 'Nutmeg, Cinnamon & Cardamom', 'family': 'Spicy Intense'},
    {'id': 'khamrah', 'name': 'Lattafa Khamrah / Angels Share', 'vibe': 'Cognac, Cinnamon & Vanilla', 'family': 'Sweet Gourmand'},
    {'id': 'smw', 'name': 'Silver Mountain Water', 'vibe': 'Green Tea & Blackcurrant', 'family': 'Fresh Mountain'},
    {'id': 'hawas', 'name': 'Rasasi Hawas', 'vibe': 'Aquatic Citrus & Ambergris', 'family': 'Aquatic Fresh'},
    {'id': '9pm-rebel', 'name': '9 PM Rebel', 'vibe': 'Pineapple, Green Apple & Caramel', 'family': 'Fruity Sweet'},
  ];

  final List<Map<String, String>> _bottleStyles = [
    {
      'id': 'zayvor-emerald',
      'name': 'Emerald Crystal (Zayvor)',
      'image': 'assets/images/zayvor.jpg',
      'cap': 'Gold Orb Ball Cap',
      'desc': 'Heavyweight 50ml emerald crystal with gold ball cap',
    },
    {
      'id': 'noir-x-matte',
      'name': 'Matte Noir (Noir X)',
      'image': 'assets/images/noir_x.jpg',
      'cap': 'Jet-Black Crown Cap',
      'desc': 'Velvety obsidian finish with radiant typography',
    },
    {
      'id': 'vertex-blue',
      'name': 'Royal Blue (Vertex)',
      'image': 'assets/images/vertex.jpg',
      'cap': 'Midnight Metallic Cap',
      'desc': 'Electric sapphire glass with imperial crest',
    },
    {
      'id': 'classic-clear',
      'name': 'Classic Clear (Sauvage)',
      'image': 'assets/images/sauvage.jpg',
      'cap': 'Gold Cylinder Cap',
      'desc': 'Fluted crystal bottle showing pure golden essence',
    },
  ];

  String _selectedFlavourId = 'aventus';
  final _customFlavourCtrl = TextEditingController();
  String _selectedBottleId = 'zayvor-emerald';

  int _quantity = 2; // Strict minimum 2 bottles
  bool _isSubmitting = false;

  final _nameCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _cityCtrl = TextEditingController();
  final _addressCtrl = TextEditingController();
  final _notesCtrl = TextEditingController();

  @override
  void dispose() {
    _customFlavourCtrl.dispose();
    _nameCtrl.dispose();
    _phoneCtrl.dispose();
    _cityCtrl.dispose();
    _addressCtrl.dispose();
    _notesCtrl.dispose();
    super.dispose();
  }

  String get _effectiveFlavourName {
    if (_selectedFlavourId == 'custom') {
      return _customFlavourCtrl.text.trim().isNotEmpty
          ? _customFlavourCtrl.text.trim()
          : 'Custom Desired Blend';
    }
    final match = _popularFlavours.firstWhere(
      (f) => f['id'] == _selectedFlavourId,
      orElse: () => _popularFlavours.first,
    );
    return match['name'] ?? 'Bespoke Blend';
  }

  Map<String, String> get _selectedBottle {
    return _bottleStyles.firstWhere(
      (b) => b['id'] == _selectedBottleId,
      orElse: () => _bottleStyles.first,
    );
  }

  void _openWhatsApp() async {
    final text = 'Assalam-o-Alaikum VALAROIX! ✨\n\n'
        'Mujhe apna Custom Perfume order karna hai:\n\n'
        '🧪 *Fragrance / Flavour:* $_effectiveFlavourName\n'
        '🍾 *Bottle Choice:* ${_selectedBottle['name']}\n'
        '📦 *Quantity:* $_quantity Bottles (Same Flavour)\n\n'
        '📍 *Customer Details:*\n'
        'Name: ${_nameCtrl.text.trim().isNotEmpty ? _nameCtrl.text.trim() : "Customer"}\n'
        'Phone: ${_phoneCtrl.text.trim()}\n'
        'City: ${_cityCtrl.text.trim()}\n'
        'Address: ${_addressCtrl.text.trim()}\n\n'
        '👉 Baraye meharbani details confirm karein. Shukriya!';

    final uri = Uri.parse('https://wa.me/923029111856?text=${Uri.encodeComponent(text)}');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  Future<void> _submitCustomOrder() async {
    if (!_formKey.currentState!.validate()) return;

    if (_selectedFlavourId == 'custom' && _customFlavourCtrl.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please specify the custom fragrance name or notes.'),
          backgroundColor: Colors.redAccent,
        ),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    final orderId = 'VLX-CUST-${10000 + (DateTime.now().millisecondsSinceEpoch % 90000)}';
    final totalAmount = _quantity * 3000;

    final orderData = {
      'id': orderId,
      'customerName': _nameCtrl.text.trim(),
      'name': _nameCtrl.text.trim(),
      'phone': _phoneCtrl.text.trim(),
      'whatsapp': _phoneCtrl.text.trim(),
      'city': _cityCtrl.text.trim().isNotEmpty ? _cityCtrl.text.trim() : 'Pakistan',
      'address': _addressCtrl.text.trim(),
      'notes': 'BESPOKE CUSTOM PERFUME (APP ORDER):\n'
          '• Flavour: $_effectiveFlavourName\n'
          '• Bottle: ${_selectedBottle['name']}\n'
          '• Quantity: $_quantity Bottles (Same Flavour)\n'
          '• Payment Terms: 30% Advance Deposit + 70% COD\n'
          '• Status: Request Confirmed (Team will contact customer)'
          '${_notesCtrl.text.trim().isNotEmpty ? "\n• Special Notes: ${_notesCtrl.text.trim()}" : ""}',
      'item': 'VALAROIX BESPOKE: $_effectiveFlavourName ($_quantity Bottles)',
      'items': [
        {
          'id': 'bespoke-$_selectedFlavourId',
          'name': 'VALAROIX BESPOKE — $_effectiveFlavourName',
          'quantity': _quantity,
          'price': 3000,
          'isCustom': true,
          'customFlavour': _effectiveFlavourName,
          'customBottle': _selectedBottle['name'],
        }
      ],
      'total': totalAmount,
      'pricePkr': totalAmount,
      'paymentMethod': '30% Advance Deposit + 70% COD',
      'status': 'Pending Verification (Custom Request)',
      'isCustom': true,
      'customFlavour': _effectiveFlavourName,
      'customBottle': _selectedBottle['name'],
      'tcsTrackingNumber': null,
    };

    try {
      await http.post(
        Uri.parse('${AppConstants.baseUrl}/orders'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(orderData),
      );
    } catch (_) {}

    setState(() => _isSubmitting = false);

    if (mounted) {
      _showConfirmationDialog(orderId);
    }
  }

  void _showConfirmationDialog(String orderId) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF14141E),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: AppConstants.gold, width: 1.5),
        ),
        title: const Column(
          children: [
            Icon(Icons.check_circle_outline, color: AppConstants.gold, size: 54),
            SizedBox(height: 12),
            Text(
              'ORDER CONFIRMED',
              style: TextStyle(
                color: AppConstants.gold,
                fontSize: 16,
                fontWeight: FontWeight.w900,
                letterSpacing: 1.5,
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Request ID: #$orderId',
              style: const TextStyle(color: Colors.white70, fontSize: 12, fontFamily: 'monospace'),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.black54,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFF10B981).withOpacity(0.5)),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.phone_in_talk, color: Color(0xFF10B981), size: 16),
                      SizedBox(width: 6),
                      Text(
                        'We Will Contact You Shortly',
                        style: TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold, fontSize: 12),
                      ),
                    ],
                  ),
                  SizedBox(height: 6),
                  Text(
                    'We have received your custom fragrance order and our team will contact you directly via WhatsApp or phone call. You do not need to do anything further—we will reach out to you ourselves to finalize your bespoke formula and delivery details.',
                    style: TextStyle(color: Colors.white, fontSize: 11, height: 1.4),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 10),
            Text(
              '• Flavour: $_effectiveFlavourName',
              style: const TextStyle(color: Colors.white, fontSize: 12),
            ),
            Text(
              '• Bottle: ${_selectedBottle['name']}',
              style: const TextStyle(color: Colors.white, fontSize: 12),
            ),
            Text(
              '• Quantity: $_quantity Bottles',
              style: const TextStyle(color: AppConstants.gold, fontWeight: FontWeight.bold, fontSize: 12),
            ),
          ],
        ),
        actions: [
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF25D366),
              foregroundColor: Colors.white,
              minimumSize: const Size.fromHeight(42),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: () {
              Navigator.pop(ctx);
              _openWhatsApp();
            },
            icon: const Icon(Icons.chat, size: 16),
            label: const Text('Chat on WhatsApp (Optional)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
          ),
          const SizedBox(height: 6),
          TextButton(
            style: TextButton.styleFrom(
              minimumSize: const Size.fromHeight(38),
            ),
            onPressed: () {
              Navigator.pop(ctx);
              Navigator.pop(context);
            },
            child: const Text('Done', style: TextStyle(color: Colors.white70, fontSize: 13)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF070709),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F0F14),
        elevation: 0,
        title: const Text(
          'BESPOKE ATELIER',
          style: TextStyle(
            color: AppConstants.gold,
            fontWeight: FontWeight.w900,
            letterSpacing: 1.5,
            fontSize: 15,
          ),
        ),
        centerTitle: true,
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          children: [
            // Top Luxury Banner
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [const Color(0xFF161622), AppConstants.gold.withOpacity(0.1)],
                ),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppConstants.gold.withOpacity(0.3)),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.auto_awesome, color: AppConstants.gold, size: 18),
                      SizedBox(width: 8),
                      Text(
                        'APNI PASAND KA PERFUME',
                        style: TextStyle(
                          color: AppConstants.gold,
                          fontWeight: FontWeight.w900,
                          fontSize: 14,
                          letterSpacing: 1,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 6),
                  Text(
                    'Apna manpasand designer scent flavour aur luxury bottle select karein. Humari team aap se khud contact karegi!',
                    style: TextStyle(color: Colors.white70, fontSize: 12, height: 1.4),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Two Core Rules
            Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFF111116),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppConstants.gold.withOpacity(0.3)),
                    ),
                    child: const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('RULE 1', style: TextStyle(color: AppConstants.gold, fontWeight: FontWeight.bold, fontSize: 10)),
                        SizedBox(height: 2),
                        Text('Min 2 Bottles', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                        Text('Aik hi flavour formula mein', style: TextStyle(color: Colors.white54, fontSize: 10)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFF111116),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppConstants.gold.withOpacity(0.3)),
                    ),
                    child: const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('RULE 2', style: TextStyle(color: AppConstants.gold, fontWeight: FontWeight.bold, fontSize: 10)),
                        SizedBox(height: 2),
                        Text('30% Advance', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                        Text('Baqi 70% COD rider ko', style: TextStyle(color: Colors.white54, fontSize: 10)),
                      ],
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 22),

            // 1. Choose Flavour
            const Text(
              '1. SELECT FRAGRANCE FLAVOUR',
              style: TextStyle(color: AppConstants.gold, fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 1),
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                ..._popularFlavours.map((f) {
                  final isSelected = _selectedFlavourId == f['id'];
                  return ChoiceChip(
                    label: Text(f['name']!),
                    selected: isSelected,
                    onSelected: (val) {
                      if (val) setState(() => _selectedFlavourId = f['id']!);
                    },
                    selectedColor: AppConstants.gold,
                    backgroundColor: const Color(0xFF161622),
                    labelStyle: TextStyle(
                      color: isSelected ? Colors.black : Colors.white70,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                      fontSize: 12,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                      side: BorderSide(
                        color: isSelected ? AppConstants.gold : Colors.white12,
                      ),
                    ),
                  );
                }),
                ChoiceChip(
                  label: const Text('✨ Custom Flavour / Clone'),
                  selected: _selectedFlavourId == 'custom',
                  onSelected: (val) {
                    if (val) setState(() => _selectedFlavourId = 'custom');
                  },
                  selectedColor: Colors.tealAccent,
                  backgroundColor: const Color(0xFF161622),
                  labelStyle: TextStyle(
                    color: _selectedFlavourId == 'custom' ? Colors.black : Colors.tealAccent,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                    side: const BorderSide(color: Colors.tealAccent),
                  ),
                ),
              ],
            ),

            if (_selectedFlavourId == 'custom') ...[
              const SizedBox(height: 12),
              TextFormField(
                controller: _customFlavourCtrl,
                style: const TextStyle(color: Colors.white, fontSize: 13),
                decoration: InputDecoration(
                  labelText: 'Type Desired Perfume Name / Notes *',
                  labelStyle: const TextStyle(color: Colors.tealAccent, fontSize: 12),
                  hintText: 'e.g. Creed Green Irish Tweed, TF Black Orchid...',
                  hintStyle: const TextStyle(color: Colors.white30, fontSize: 12),
                  filled: true,
                  fillColor: const Color(0xFF161622),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Colors.tealAccent)),
                  focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Colors.tealAccent, width: 1.5)),
                ),
              ),
            ],

            const SizedBox(height: 24),

            // 2. Choose Bottle Style
            const Text(
              '2. SELECT 50ML LUXURY BOTTLE',
              style: TextStyle(color: AppConstants.gold, fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 1),
            ),
            const SizedBox(height: 10),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.85,
                mainAxisSpacing: 10,
                crossAxisSpacing: 10,
              ),
              itemCount: _bottleStyles.length,
              itemBuilder: (ctx, i) {
                final b = _bottleStyles[i];
                final isSelected = _selectedBottleId == b['id'];
                return GestureDetector(
                  onTap: () => setState(() => _selectedBottleId = b['id']!),
                  child: Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFF14141E),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: isSelected ? AppConstants.gold : Colors.white12,
                        width: isSelected ? 2 : 1,
                      ),
                    ),
                    padding: const EdgeInsets.all(8),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(10),
                            child: Image.asset(
                              b['image']!,
                              width: double.infinity,
                              fit: BoxFit.cover,
                            ),
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          b['name']!,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            color: isSelected ? AppConstants.gold : Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 11,
                          ),
                        ),
                        Text(
                          b['cap']!,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(color: Colors.white54, fontSize: 9.5),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),

            const SizedBox(height: 24),

            // 3. Quantity (Locked at Min 2)
            const Text(
              '3. QUANTITY (MINIMUM 2 BOTTLES REQUIRED)',
              style: TextStyle(color: AppConstants.gold, fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 1),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: const Color(0xFF14141E),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.white12),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Bottles to formulate:',
                        style: TextStyle(color: Colors.white70, fontSize: 12),
                      ),
                      Text(
                        'Min 2 bottles of $_effectiveFlavourName',
                        style: const TextStyle(color: AppConstants.gold, fontSize: 11, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.black,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: AppConstants.gold),
                    ),
                    child: Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.remove, color: Colors.white, size: 18),
                          onPressed: () {
                            if (_quantity <= 2) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Minimum 2 bottles required for custom formula!'),
                                  backgroundColor: Colors.amber,
                                  duration: Duration(seconds: 2),
                                ),
                              );
                              return;
                            }
                            setState(() => _quantity--);
                          },
                        ),
                        Text(
                          '$_quantity',
                          style: const TextStyle(color: AppConstants.gold, fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        IconButton(
                          icon: const Icon(Icons.add, color: Colors.white, size: 18),
                          onPressed: () => setState(() => _quantity++),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // 4. Delivery Information
            const Text(
              '4. YOUR DELIVERY INFORMATION',
              style: TextStyle(color: AppConstants.gold, fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 1),
            ),
            const SizedBox(height: 10),
            TextFormField(
              controller: _nameCtrl,
              style: const TextStyle(color: Colors.white, fontSize: 13),
              validator: (v) => v == null || v.trim().isEmpty ? 'Please enter your name' : null,
              decoration: InputDecoration(
                labelText: 'Full Name *',
                labelStyle: const TextStyle(color: Colors.white60, fontSize: 12),
                filled: true,
                fillColor: const Color(0xFF14141E),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Colors.white12)),
              ),
            ),
            const SizedBox(height: 10),
            TextFormField(
              controller: _phoneCtrl,
              keyboardType: TextInputType.phone,
              style: const TextStyle(color: Colors.white, fontSize: 13),
              validator: (v) => v == null || v.trim().length < 10 ? 'Please enter valid phone' : null,
              decoration: InputDecoration(
                labelText: 'WhatsApp / Phone Number *',
                labelStyle: const TextStyle(color: Colors.white60, fontSize: 12),
                filled: true,
                fillColor: const Color(0xFF14141E),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Colors.white12)),
              ),
            ),
            const SizedBox(height: 10),
            TextFormField(
              controller: _cityCtrl,
              style: const TextStyle(color: Colors.white, fontSize: 13),
              validator: (v) => v == null || v.trim().isEmpty ? 'Please enter city' : null,
              decoration: InputDecoration(
                labelText: 'City *',
                labelStyle: const TextStyle(color: Colors.white60, fontSize: 12),
                filled: true,
                fillColor: const Color(0xFF14141E),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Colors.white12)),
              ),
            ),
            const SizedBox(height: 10),
            TextFormField(
              controller: _addressCtrl,
              style: const TextStyle(color: Colors.white, fontSize: 13),
              validator: (v) => v == null || v.trim().isEmpty ? 'Please enter delivery address' : null,
              maxLines: 2,
              decoration: InputDecoration(
                labelText: 'Complete Street Address *',
                labelStyle: const TextStyle(color: Colors.white60, fontSize: 12),
                filled: true,
                fillColor: const Color(0xFF14141E),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Colors.white12)),
              ),
            ),
            const SizedBox(height: 10),
            TextFormField(
              controller: _notesCtrl,
              style: const TextStyle(color: Colors.white, fontSize: 13),
              decoration: InputDecoration(
                labelText: 'Special Blending Instructions (Optional)',
                labelStyle: const TextStyle(color: Colors.white60, fontSize: 12),
                filled: true,
                fillColor: const Color(0xFF14141E),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Colors.white12)),
              ),
            ),

            const SizedBox(height: 14),

            // English Notice Banner
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.black45,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.white10),
              ),
              child: const Row(
                children: [
                  Icon(Icons.contact_phone_outlined, color: AppConstants.gold, size: 16),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Our team will contact you directly to confirm your order details.',
                      style: TextStyle(color: Colors.white70, fontSize: 11),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Submit Button
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppConstants.gold,
                foregroundColor: Colors.black,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: _isSubmitting ? null : _submitCustomOrder,
              child: _isSubmitting
                  ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black))
                  : const Text(
                      'Confirm Custom Perfume Order',
                      style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13, letterSpacing: 0.5),
                    ),
            ),

            const SizedBox(height: 10),

            // WhatsApp Direct Button
            OutlinedButton.icon(
              style: OutlinedButton.styleFrom(
                foregroundColor: const Color(0xFF25D366),
                side: const BorderSide(color: Color(0xFF25D366)),
                padding: const EdgeInsets.symmetric(vertical: 13),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: _openWhatsApp,
              icon: const Icon(Icons.chat, size: 18),
              label: const Text(
                'Order on WhatsApp (03029111856)',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
              ),
            ),

            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
