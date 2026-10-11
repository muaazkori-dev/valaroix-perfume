import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../constants/admin_constants.dart';
import '../providers/admin_provider.dart';
import 'dashboard_screen.dart';

/// ─────────────────────────────────────────────────────────────────────────────
///  VALAROIX Admin PIN Screen
///  Secure 4-digit passcode screen for owner login (PIN: 9824)
/// ─────────────────────────────────────────────────────────────────────────────
class PinScreen extends StatefulWidget {
  const PinScreen({super.key});

  @override
  State<PinScreen> createState() => _PinScreenState();
}

class _PinScreenState extends State<PinScreen> {
  String _enteredPin = '';
  bool _hasError = false;

  void _handleNumberPress(String digit) {
    if (_enteredPin.length >= 4) return;
    HapticFeedback.lightImpact();
    setState(() {
      _enteredPin += digit;
      _hasError = false;
    });

    if (_enteredPin.length == 4) {
      _verifyPin();
    }
  }

  void _handleBackspace() {
    if (_enteredPin.isEmpty) return;
    HapticFeedback.lightImpact();
    setState(() {
      _enteredPin = _enteredPin.substring(0, _enteredPin.length - 1);
      _hasError = false;
    });
  }

  void _verifyPin() {
    final provider = context.read<AdminProvider>();
    final success = provider.login(_enteredPin);
    if (success) {
      HapticFeedback.mediumImpact();
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const DashboardScreen()),
      );
    } else {
      HapticFeedback.heavyImpact();
      setState(() {
        _hasError = true;
        _enteredPin = '';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AdminConstants.primaryBg,
      body: SafeArea(
        child: Column(
          children: [
            const Spacer(),

            // ── V Emblem ─────────────────────────────────────────────────────
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AdminConstants.secondaryBg,
                border: Border.all(color: AdminConstants.gold, width: 1.5),
                boxShadow: [
                  BoxShadow(
                    color: AdminConstants.gold.withOpacity(0.2),
                    blurRadius: 25,
                    spreadRadius: 2,
                  ),
                ],
              ),
              child: const Center(
                child: Text(
                  'V',
                  style: TextStyle(
                    fontSize: 40,
                    fontWeight: FontWeight.w900,
                    color: AdminConstants.gold,
                  ),
                ),
              ),
            ),

            const SizedBox(height: 20),

            const Text(
              'VALAROIX ADMIN',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w900,
                color: Colors.white,
                letterSpacing: 4,
              ),
            ),
            const SizedBox(height: 6),
            const Text(
              'Executive Owner Portal (PIN: 9824)',
              style: TextStyle(
                fontSize: 12,
                color: AdminConstants.textSecondary,
                letterSpacing: 0.5,
              ),
            ),

            const SizedBox(height: 32),

            // ── PIN Dots Indicator ───────────────────────────────────────────
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(4, (index) {
                final isFilled = index < _enteredPin.length;
                return Container(
                  margin: const EdgeInsets.symmetric(horizontal: 10),
                  width: 16,
                  height: 16,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: isFilled ? AdminConstants.gold : Colors.transparent,
                    border: Border.all(
                      color: _hasError ? AdminConstants.error : AdminConstants.gold,
                      width: 2,
                    ),
                  ),
                );
              }),
            ),

            if (_hasError) ...[
              const SizedBox(height: 14),
              const Text(
                'Incorrect PIN. Enter 9824',
                style: TextStyle(
                  color: AdminConstants.error,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],

            const Spacer(),

            // ── Numeric Numpad ───────────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 40),
              child: Column(
                children: [
                  _NumpadRow(digits: const ['1', '2', '3'], onKey: _handleNumberPress),
                  const SizedBox(height: 16),
                  _NumpadRow(digits: const ['4', '5', '6'], onKey: _handleNumberPress),
                  const SizedBox(height: 16),
                  _NumpadRow(digits: const ['7', '8', '9'], onKey: _handleNumberPress),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const SizedBox(width: 70),
                      _NumpadButton(label: '0', onTap: () => _handleNumberPress('0')),
                      _NumpadButton(
                        icon: Icons.backspace_outlined,
                        onTap: _handleBackspace,
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}

class _NumpadRow extends StatelessWidget {
  final List<String> digits;
  final void Function(String) onKey;
  const _NumpadRow({required this.digits, required this.onKey});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: digits.map((d) => _NumpadButton(label: d, onTap: () => onKey(d))).toList(),
    );
  }
}

class _NumpadButton extends StatelessWidget {
  final String? label;
  final IconData? icon;
  final VoidCallback onTap;

  const _NumpadButton({this.label, this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 70,
        height: 70,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: AdminConstants.secondaryBg,
          border: Border.all(color: AdminConstants.border),
        ),
        child: Center(
          child: label != null
              ? Text(
                  label!,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                )
              : Icon(icon, color: AdminConstants.gold, size: 22),
        ),
      ),
    );
  }
}
