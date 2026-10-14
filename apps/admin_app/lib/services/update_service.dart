import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import '../constants/admin_constants.dart';

class UpdateService {
  static const MethodChannel _channel =
      MethodChannel('com.valaroix.admin/notifications');

  static bool _isChecking = false;

  /// Check for updates from central backend
  static Future<void> checkForUpdates(
    BuildContext context, {
    bool isManual = false,
  }) async {
    if (_isChecking) return;
    _isChecking = true;

    try {
      final res = await http.get(
        Uri.parse('${AdminConstants.baseUrl}/version?app=admin'),
        headers: {'Accept': 'application/json'},
      ).timeout(const Duration(seconds: 10));

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final remoteCode = data['versionCode'] is int
            ? data['versionCode'] as int
            : int.tryParse(data['versionCode']?.toString() ?? '0') ?? 0;
        final remoteVersion = data['version']?.toString() ?? '1.0.0';
        final apkUrl = data['apkUrl']?.toString() ?? '';
        final changelog = data['changelog']?.toString() ??
            'Performance improvements and dispatch management upgrades.';
        final forceUpdate = data['forceUpdate'] == true;

        if (remoteCode > AdminConstants.appVersionCode && apkUrl.isNotEmpty) {
          if (context.mounted) {
            _showUpdateDialog(
              context,
              version: remoteVersion,
              apkUrl: apkUrl,
              changelog: changelog,
              forceUpdate: forceUpdate,
            );
          }
        } else if (isManual && context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              backgroundColor: AdminConstants.secondaryBg,
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
                side: const BorderSide(color: Color(0x44D4AF37)),
              ),
              content: Row(
                children: [
                  const Icon(Icons.check_circle_outline, color: Color(0xFFD4AF37), size: 20),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Admin Hub is up to date (v${AdminConstants.appVersion})',
                      style: const TextStyle(color: Colors.white, fontSize: 13),
                    ),
                  ),
                ],
              ),
            ),
          );
        }
      }
    } catch (e) {
      if (isManual && context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: AdminConstants.secondaryBg,
            content: Text(
              'Could not check for updates: $e',
              style: const TextStyle(color: Colors.redAccent, fontSize: 13),
            ),
          ),
        );
      }
    } finally {
      _isChecking = false;
    }
  }

  static void _showUpdateDialog(
    BuildContext context, {
    required String version,
    required String apkUrl,
    required String changelog,
    required bool forceUpdate,
  }) {
    showDialog(
      context: context,
      barrierDismissible: !forceUpdate,
      builder: (ctx) => _UpdateDialogWidget(
        version: version,
        apkUrl: apkUrl,
        changelog: changelog,
        forceUpdate: forceUpdate,
      ),
    );
  }
}

class _UpdateDialogWidget extends StatefulWidget {
  final String version;
  final String apkUrl;
  final String changelog;
  final bool forceUpdate;

  const _UpdateDialogWidget({
    required this.version,
    required this.apkUrl,
    required this.changelog,
    required this.forceUpdate,
  });

  @override
  State<_UpdateDialogWidget> createState() => _UpdateDialogWidgetState();
}

class _UpdateDialogWidgetState extends State<_UpdateDialogWidget> {
  static const MethodChannel _channel =
      MethodChannel('com.valaroix.admin/notifications');

  bool _isDownloading = false;
  double _progress = 0.0;
  String _statusText = 'Ready to download';
  String _bytesText = '';
  String? _errorMessage;

  Future<void> _startDownloadAndInstall() async {
    setState(() {
      _isDownloading = true;
      _errorMessage = null;
      _statusText = 'Connecting to VALAROIX server...';
      _progress = 0.0;
      _bytesText = '';
    });

    try {
      // 1. Get destination file path from native Android cache
      final String? storagePath =
          await _channel.invokeMethod<String>('getUpdateStoragePath');
      if (storagePath == null || storagePath.isEmpty) {
        throw Exception('Storage path unavailable on device');
      }

      // Check Unknown Apps Permission (Android 8+)
      final bool canInstall =
          await _channel.invokeMethod<bool>('canInstallUnknownApps') ?? true;
      if (!canInstall) {
        if (mounted) {
          setState(() {
            _isDownloading = false;
            _statusText = 'Permission Required';
            _errorMessage =
                'Please enable "Allow from this source" in settings, then tap Update Now.';
          });
        }
        await _channel.invokeMethod('openInstallPermissionSettings');
        return;
      }

      // 2. Stream HTTP download
      setState(() {
        _statusText = 'Connecting to VALAROIX server...';
      });

      final client = http.Client();
      final request = http.Request('GET', Uri.parse(widget.apkUrl));
      final response = await client.send(request);

      if (response.statusCode != 200) {
        throw Exception('Download failed with status ${response.statusCode}');
      }

      final totalBytes = response.contentLength ?? 0;
      int receivedBytes = 0;

      final file = File(storagePath);
      if (await file.exists()) {
        await file.delete();
      }
      final sink = file.openWrite();

      await for (final chunk in response.stream) {
        sink.add(chunk);
        receivedBytes += chunk.length;

        if (totalBytes > 0) {
          final p = receivedBytes / totalBytes;
          final recMb = (receivedBytes / (1024 * 1024)).toStringAsFixed(1);
          final totMb = (totalBytes / (1024 * 1024)).toStringAsFixed(1);
          if (mounted) {
            setState(() {
              _progress = p.clamp(0.0, 1.0);
              _statusText = 'Downloading update (${(_progress * 100).toInt()}%)...';
              _bytesText = '$recMb MB / $totMb MB';
            });
          }
        }
      }

      await sink.flush();
      await sink.close();
      client.close();

      if (!mounted) return;

      setState(() {
        _statusText = 'Verifying and launching installer...';
        _progress = 1.0;
      });

      // 3. Trigger Native System Installer via FileProvider
      final bool installed = await _channel.invokeMethod<bool>(
            'installApk',
            {'filePath': storagePath},
          ) ??
          false;

      if (!installed) {
        throw Exception('System package installer could not be launched');
      }

      if (mounted) {
        Navigator.of(context).pop();
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isDownloading = false;
          _errorMessage = e.toString().replaceAll('Exception:', '').trim();
          _statusText = 'Download interrupted';
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: AdminConstants.secondaryBg,
      elevation: 24,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: const BorderSide(color: Color(0x66D4AF37), width: 1.5),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 26),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Emblem / Brand Icon
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: const RadialGradient(
                  colors: [Color(0xFF2A2A2A), Color(0xFF0D0D0D)],
                ),
                border: Border.all(color: AdminConstants.gold, width: 2),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x33D4AF37),
                    blurRadius: 16,
                    spreadRadius: 2,
                  ),
                ],
              ),
              child: const Center(
                child: Icon(
                  Icons.system_update_alt_rounded,
                  color: AdminConstants.gold,
                  size: 30,
                ),
              ),
            ),
            const SizedBox(height: 18),

            // Header Title
            const Text(
              'VALAROIX ADMIN UPDATE',
              style: TextStyle(
                fontFamily: 'serif',
                fontSize: 17,
                fontWeight: FontWeight.w900,
                letterSpacing: 1.5,
                color: AdminConstants.gold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Version ${widget.version} is now available',
              style: const TextStyle(
                fontSize: 13,
                color: AdminConstants.textSecondary,
              ),
            ),
            const SizedBox(height: 16),

            // Downloading Progress View OR Changelog View
            if (_isDownloading) ...[
              const SizedBox(height: 8),
              LinearProgressIndicator(
                value: _progress > 0 ? _progress : null,
                backgroundColor: AdminConstants.tertiaryBg,
                valueColor: const AlwaysStoppedAnimation<Color>(AdminConstants.gold),
                minHeight: 8,
                borderRadius: BorderRadius.circular(4),
              ),
              const SizedBox(height: 14),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    _statusText,
                    style: const TextStyle(
                      color: AdminConstants.gold,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  if (_bytesText.isNotEmpty)
                    Text(
                      _bytesText,
                      style: const TextStyle(
                        color: AdminConstants.textSecondary,
                        fontSize: 11,
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 18),
            ] else ...[
              // Changelog Box
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AdminConstants.primaryBg,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AdminConstants.borderGold),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'WHAT’S NEW:',
                      style: TextStyle(
                        color: AdminConstants.gold,
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.2,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      widget.changelog,
                      style: const TextStyle(
                        color: Color(0xFFE5E7EB),
                        fontSize: 12.5,
                        height: 1.45,
                      ),
                    ),
                  ],
                ),
              ),

              if (_errorMessage != null) ...[
                const SizedBox(height: 12),
                Text(
                  _errorMessage!,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    color: AdminConstants.error,
                    fontSize: 12,
                  ),
                ),
              ],
              const SizedBox(height: 22),

              // Action Buttons
              Row(
                children: [
                  if (!widget.forceUpdate)
                    Expanded(
                      child: TextButton(
                        onPressed: () => Navigator.of(context).pop(),
                        style: TextButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 13),
                        ),
                        child: const Text(
                          'Later',
                          style: TextStyle(
                            color: AdminConstants.textSecondary,
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                  if (!widget.forceUpdate) const SizedBox(width: 12),
                  Expanded(
                    flex: widget.forceUpdate ? 1 : 2,
                    child: ElevatedButton(
                      onPressed: _startDownloadAndInstall,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AdminConstants.gold,
                        foregroundColor: Colors.black,
                        padding: const EdgeInsets.symmetric(vertical: 13),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                        elevation: 4,
                      ),
                      child: const Text(
                        'Update Now',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 0.8,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}
