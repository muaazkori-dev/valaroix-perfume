import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../constants/app_constants.dart';
import 'main_screen.dart';

/// ─────────────────────────────────────────────────────────────────────────────
///  VALAROIX Splash Screen
///  Luxury dark animated intro before the main app loads
/// ─────────────────────────────────────────────────────────────────────────────
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {
  late final AnimationController _logoCtrl;
  late final AnimationController _textCtrl;
  late final AnimationController _particleCtrl;

  late final Animation<double> _logoScale;
  late final Animation<double> _logoOpacity;
  late final Animation<double> _textOpacity;
  late final Animation<double> _taglineOffset;

  @override
  void initState() {
    super.initState();

    _logoCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );
    _textCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _particleCtrl = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 4),
    )..repeat();

    _logoScale = Tween<double>(begin: 0.5, end: 1.0).animate(
      CurvedAnimation(parent: _logoCtrl, curve: Curves.elasticOut),
    );
    _logoOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _logoCtrl, curve: const Interval(0.0, 0.5)),
    );
    _textOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _textCtrl, curve: Curves.easeIn),
    );
    _taglineOffset = Tween<double>(begin: 20.0, end: 0.0).animate(
      CurvedAnimation(parent: _textCtrl, curve: Curves.easeOut),
    );

    _startSequence();
  }

  Future<void> _startSequence() async {
    await Future.delayed(const Duration(milliseconds: 300));
    _logoCtrl.forward();
    await Future.delayed(const Duration(milliseconds: 900));
    _textCtrl.forward();
    await Future.delayed(const Duration(milliseconds: 1200));
    if (mounted) {
      Navigator.of(context).pushReplacement(
        PageRouteBuilder(
          pageBuilder: (_, a, __) => const MainScreen(),
          transitionsBuilder: (_, anim, __, child) => FadeTransition(
            opacity: anim,
            child: child,
          ),
          transitionDuration: const Duration(milliseconds: 600),
        ),
      );
    }
  }

  @override
  void dispose() {
    _logoCtrl.dispose();
    _textCtrl.dispose();
    _particleCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppConstants.primaryBg,
      body: Stack(
        children: [
          // ── Animated Gold Particle Field ───────────────────────────────────
          AnimatedBuilder(
            animation: _particleCtrl,
            builder: (_, __) => CustomPaint(
              size: MediaQuery.of(context).size,
              painter: _ParticlePainter(_particleCtrl.value),
            ),
          ),

          // ── Radial Gold Glow Center ────────────────────────────────────────
          Center(
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    AppConstants.gold.withOpacity(0.08),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),

          // ── Logo + Text ────────────────────────────────────────────────────
          Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Logo Emblem
                AnimatedBuilder(
                  animation: _logoCtrl,
                  builder: (_, __) => Opacity(
                    opacity: _logoOpacity.value,
                    child: Transform.scale(
                      scale: _logoScale.value,
                      child: _ValaroixEmblem(),
                    ),
                  ),
                ),

                const SizedBox(height: 28),

                // Brand Name
                AnimatedBuilder(
                  animation: _textCtrl,
                  builder: (_, __) => Opacity(
                    opacity: _textOpacity.value,
                    child: Transform.translate(
                      offset: Offset(0, _taglineOffset.value),
                      child: Column(
                        children: [
                          Text(
                            AppConstants.appName,
                            style: const TextStyle(
                              fontSize: 34,
                              fontWeight: FontWeight.w900,
                              color: AppConstants.gold,
                              letterSpacing: 8,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            AppConstants.appTagline,
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w300,
                              color: AppConstants.textSecondary,
                              letterSpacing: 2,
                              fontStyle: FontStyle.italic,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Container(
                            height: 1,
                            width: 120,
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  Colors.transparent,
                                  AppConstants.gold,
                                  Colors.transparent,
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// ─── VALAROIX Logo Emblem ────────────────────────────────────────────────────
class _ValaroixEmblem extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 110,
      height: 110,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: AppConstants.secondaryBg,
        border: Border.all(color: AppConstants.gold, width: 1.5),
        boxShadow: [
          BoxShadow(
            color: AppConstants.gold.withOpacity(0.3),
            blurRadius: 30,
            spreadRadius: 5,
          ),
        ],
      ),
      child: Center(
        child: Text(
          'V',
          style: const TextStyle(
            fontSize: 52,
            fontWeight: FontWeight.w900,
            color: AppConstants.gold,
            letterSpacing: -2,
          ),
        ),
      ),
    );
  }
}

/// ─── Gold Particle Painter ───────────────────────────────────────────────────
class _ParticlePainter extends CustomPainter {
  final double progress;
  static final List<_Particle> _particles = List.generate(
    30,
    (i) => _Particle(
      x: (i * 137.5) % 1.0,
      y: (i * 73.3) % 1.0,
      size: 1.0 + (i % 3) * 0.8,
      speed: 0.1 + (i % 5) * 0.04,
      phase: (i * 47.0) % (2 * math.pi),
    ),
  );

  _ParticlePainter(this.progress);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = AppConstants.gold.withOpacity(0.25);
    for (final p in _particles) {
      final y = (p.y + progress * p.speed) % 1.0;
      final x = p.x + math.sin(progress * 2 * math.pi + p.phase) * 0.02;
      canvas.drawCircle(
        Offset(x * size.width, y * size.height),
        p.size,
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(_ParticlePainter old) => old.progress != progress;
}

class _Particle {
  final double x, y, size, speed, phase;
  const _Particle({
    required this.x, required this.y,
    required this.size, required this.speed, required this.phase,
  });
}
