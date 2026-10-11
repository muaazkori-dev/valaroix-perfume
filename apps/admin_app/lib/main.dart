import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'constants/admin_constants.dart';
import 'providers/admin_provider.dart';
import 'screens/pin_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ),
  );
  runApp(const ValaroixAdminApp());
}

class ValaroixAdminApp extends StatelessWidget {
  const ValaroixAdminApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AdminProvider()),
      ],
      child: MaterialApp(
        title: AdminConstants.appName,
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          scaffoldBackgroundColor: AdminConstants.primaryBg,
          colorScheme: const ColorScheme.dark(
            primary: AdminConstants.gold,
            secondary: AdminConstants.goldDark,
            surface: AdminConstants.secondaryBg,
          ),
          fontFamily: 'Roboto',
          appBarTheme: const AppBarTheme(
            elevation: 0,
            backgroundColor: AdminConstants.secondaryBg,
            foregroundColor: AdminConstants.textPrimary,
            centerTitle: false,
          ),
        ),
        home: const PinScreen(),
      ),
    );
  }
}
