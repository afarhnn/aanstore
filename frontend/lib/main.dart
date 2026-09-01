import 'package:flutter/material.dart';

void main() {
  runApp(const AanStoreApp());
}

class AanStoreApp extends StatefulWidget {
  const AanStoreApp({super.key});

  @override
  State<AanStoreApp> createState() => _AanStoreAppState();
}

class _AanStoreAppState extends State<AanStoreApp> {
  Locale _locale = const Locale('id');

  void _toggleLocale() {
    setState(() {
      _locale = _locale.languageCode == 'id' ? const Locale('en') : const Locale('id');
    });
  }

  @override
  Widget build(BuildContext context) {
    final primary = const Color(0xFF0B3A61); // navy blue
    final accent = const Color(0xFFD1A23A); // gold

    return MaterialApp(
      title: 'AanStore',
      locale: _locale,
      theme: ThemeData(
        primaryColor: primary,
        colorScheme: ColorScheme.fromSwatch(primarySwatch: Colors.indigo).copyWith(secondary: accent),
        useMaterial3: true,
      ),
      home: LoginPage(onToggleLocale: _toggleLocale),
    );
  }
}

class LoginPage extends StatelessWidget {
  final VoidCallback onToggleLocale;
  const LoginPage({super.key, required this.onToggleLocale});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('AanStore - Login')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // logo placeholder
            Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                color: const Color(0xFF0B3A61),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Center(
                child: Text('Aan', style: TextStyle(color: Colors.white, fontSize: 36, fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(height: 24),
            TextField(decoration: const InputDecoration(labelText: 'Email')),
            const SizedBox(height: 8),
            TextField(decoration: const InputDecoration(labelText: 'Password'), obscureText: true),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                ElevatedButton(onPressed: () { Navigator.push(context, MaterialPageRoute(builder: (_) => const DashboardPage())); }, child: const Text('Login')),
                TextButton(onPressed: onToggleLocale, child: const Text('ID/EN'))
              ],
            )
          ],
        ),
      ),
    );
  }
}

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('AanStore - Dashboard')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Selamat datang di AanStore', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 12),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(12.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text('Penjualan Hari Ini', style: TextStyle(fontWeight: FontWeight.bold)),
                        SizedBox(height: 8),
                        Text('Rp 0')
                      ],
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text('Stok Hampir Habis', style: TextStyle(fontWeight: FontWeight.bold)),
                        SizedBox(height: 8),
                        Text('0 item')
                      ],
                    )
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(onPressed: () { Navigator.push(context, MaterialPageRoute(builder: (_) => const ProductsPage())); }, child: const Text('Produk'))
          ],
        ),
      ),
    );
  }
}

class ProductsPage extends StatelessWidget {
  const ProductsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Produk')),
      body: const Center(child: Text('Daftar produk akan muncul di sini')),
    );
  }
}
