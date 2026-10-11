import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'constants/app_constants.dart';
import 'providers/cart_provider.dart';
import 'screens/splash_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ),
  );
  runApp(const ValaroixCustomerApp());
}

class ValaroixCustomerApp extends StatelessWidget {
  const ValaroixCustomerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => CartProvider()),
      ],
      child: MaterialApp(
        title: AppConstants.appName,
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          scaffoldBackgroundColor: AppConstants.primaryBg,
          colorScheme: const ColorScheme.dark(
            primary: AppConstants.gold,
            secondary: AppConstants.goldDark,
            surface: AppConstants.secondaryBg,
          ),
          fontFamily: 'Roboto',
          appBarTheme: const AppBarTheme(
            elevation: 0,
            backgroundColor: AppConstants.primaryBg,
            foregroundColor: AppConstants.textPrimary,
            centerTitle: false,
          ),
        ),
        home: const SplashScreen(),
      ),
    );
  }
}
