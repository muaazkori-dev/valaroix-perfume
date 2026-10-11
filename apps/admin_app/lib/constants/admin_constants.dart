import 'package:flutter/material.dart';

/// ─────────────────────────────────────────────────────────────────────────────
///  VALAROIX Admin App — Central Constants
/// ─────────────────────────────────────────────────────────────────────────────
class AdminConstants {
  // ── Brand ────────────────────────────────────────────────────────────────────
  static const String appName    = 'VALAROIX Admin';
  static const String appTagline = 'Owner Control Hub';

  // ── Auth ────────────────────────────────────────────────────────────────────
  static const String adminPin = '9824';

  // ── API ──────────────────────────────────────────────────────────────────────
  static const String baseUrl = 'https://valaroix.com/api';

  // ── Owner WhatsApp ───────────────────────────────────────────────────────────
  static const String ownerWhatsApp = '923029111856';

  // ── Poll Interval (real-time order checking) ─────────────────────────────────
  static const Duration pollInterval = Duration(seconds: 4);

  // ── Theme Colours (Dark Gold — different from Customer App) ─────────────────
  static const Color primaryBg    = Color(0xFF0D0D0D);
  static const Color secondaryBg  = Color(0xFF141414);
  static const Color tertiaryBg   = Color(0xFF1E1E1E);
  static const Color gold         = Color(0xFFD4AF37);
  static const Color goldDark     = Color(0xFFB38728);
  static const Color textPrimary  = Color(0xFFF5F5F5);
  static const Color textSecondary= Color(0xFF9CA3AF);
  static const Color textMuted    = Color(0xFF6B7280);
  static const Color border       = Color(0xFF2A2A2A);
  static const Color borderGold   = Color(0x44D4AF37);
  static const Color success      = Color(0xFF10B981);
  static const Color warning      = Color(0xFFF59E0B);
  static const Color error        = Color(0xFFEF4444);
  static const Color info         = Color(0xFF3B82F6);

  // ── Product Prices (for profit calc) ────────────────────────────────────────
  static const Map<String, int> productPrices = {
    'noir x':          2999,
    'vertex':          3499,
    'sauvage':         2499,
    'sauvage classic': 2499,
    'classic':         2499,
  };

  // ── Cost of Goods Sold (approx 35% of price) ────────────────────────────────
  static int getProfit(int price) => price - (price * 0.35).round();
}
