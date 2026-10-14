import 'package:flutter/material.dart';

/// ─────────────────────────────────────────────────────────────────────────────
///  VALAROIX Customer App — Central Constants
///  All colours, URLs, and brand identity live here.
/// ─────────────────────────────────────────────────────────────────────────────
class AppConstants {
  // ── Brand Identity ──────────────────────────────────────────────────────────
  static const String appName     = 'VALAROIX';
  static const String appTagline  = "L'Élixir De Distinction";
  static const String appSubtitle = 'Luxury Haute Parfumerie';

  // ── Backend API (Valaroix Next.js on Vercel) ─────────────────────────────────
  static const String baseUrl = 'https://valaroix.com/api';
  static const String appVersion = '1.0.21';
  static const int appVersionCode = 21;

  // ── Support & Social ────────────────────────────────────────────────────────
  static const String whatsappNumber = '923029111856';
  static const String storePhone     = '+92 302 9111856';
  static const String instagramUrl   = 'https://instagram.com/valaroix';

  // ── Perfume Products (hardcoded – no DB needed for 3 products) ──────────────
  static const List<Map<String, dynamic>> products = [
    {
      'id':          'noir-x',
      'name':        'VALAROIX NOIR X',
      'subtitle':    'Inspired by Dior Sauvage',
      'price':       2999,
      'oil':         '40% Perfume Oil Concentration',
      'lasting':     '8–12 Hours Lasting',
      'tag':         'BEST SELLER',
      'tagColor':    0xFFD4AF37,
      'description': 'A bold, sensual fragrance with woody bergamot top notes, a magnetic heart of amberwood and geranium, and a warm base of white musks and vetiver. Inspired by the iconic Dior Sauvage.',
      'topNotes':    'Bergamot, Pepper',
      'midNotes':    'Amberwood, Geranium, Lavender',
      'baseNotes':   'Vetiver, Patchouli, White Musk',
      'image':       'assets/images/noir_x.jpg',
      'colorHex':    0xFF0D0D0D,
      'accentHex':   0xFFD4AF37,
    },
    {
      'id':          'vertex',
      'name':        'VALAROIX VERTEX',
      'subtitle':    'Inspired by YSL Y',
      'price':       3499,
      'oil':         '40% Perfume Oil Concentration',
      'lasting':     '8–12 Hours Lasting',
      'tag':         'NEW ARRIVAL',
      'tagColor':    0xFF1E3A5F,
      'description': 'A sophisticated masculine fragrance with fresh ginger, bergamot top notes, an elegant heart of geranium and sage, and a powerful base of vetiver and amberwood. Inspired by YSL Y.',
      'topNotes':    'Bergamot, Ginger, Apple',
      'midNotes':    'Geranium, Sage, Juniper Berry',
      'baseNotes':   'Amberwood, Vetiver, Suede',
      'image':       'assets/images/vertex.jpg',
      'colorHex':    0xFF0A1628,
      'accentHex':   0xFF4A90D9,
    },
    {
      'id':          'sauvage-classic',
      'name':        'VALAROIX SAUVAGE',
      'subtitle':    'Inspired by Dior Sauvage (Classic)',
      'price':       2499,
      'oil':         '30% Perfume Oil Concentration',
      'lasting':     '6–8 Hours Lasting',
      'tag':         'CLASSIC',
      'tagColor':    0xFF2D2D2D,
      'description': 'The timeless classic. Fresh Calabrian bergamot explodes with a radically fresh signature, combining radiance with a savage, noble trail. A must-have in every fragrance wardrobe.',
      'topNotes':    'Calabrian Bergamot, Pepper',
      'midNotes':    'Elemi, Lavender',
      'baseNotes':   'Ambroxan, Cedar, Labdanum',
      'image':       'assets/images/sauvage.jpg',
      'colorHex':    0xFF1A1A2E,
      'accentHex':   0xFF8899AA,
    },
  ];

  // ── Theme Colours (Luxury Dark) ──────────────────────────────────────────────
  static const Color primaryBg      = Color(0xFF0B0B0E);   // Deep obsidian black
  static const Color secondaryBg    = Color(0xFF141414);   // Card/surface black
  static const Color tertiaryBg     = Color(0xFF1A1A1A);   // Elevated surface
  static const Color gold            = Color(0xFFD4AF37);  // Signature gold
  static const Color goldLight       = Color(0xFFE8C84D);  // Lighter gold
  static const Color goldDark        = Color(0xFFB38728);  // Darker gold
  static const Color textPrimary     = Color(0xFFF5F5F5);  // Near-white
  static const Color textSecondary   = Color(0xFF9CA3AF);  // Muted grey
  static const Color textMuted       = Color(0xFF6B7280);  // Dim grey
  static const Color borderSubtle    = Color(0xFF2A2A2A);  // Subtle border
  static const Color borderGold      = Color(0x33D4AF37);  // 20% gold border
  static const Color success         = Color(0xFF10B981);  // Emerald green
  static const Color error           = Color(0xFFEF4444);  // Red

  // ── Delivery ────────────────────────────────────────────────────────────────
  static const double shippingFee    = 0.0;   // Free delivery always
  static const String deliveryNote   = 'Free Delivery Pakistan-Wide';
}
