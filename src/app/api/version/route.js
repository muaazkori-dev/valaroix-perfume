import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const app = searchParams.get('app'); // 'customer' or 'admin' or null

    // Default release metadata
    let latestTag = 'v1.0.9';
    let versionCode = 9;
    let customerApkUrl = 'https://github.com/muaazkori-dev/valaroix-perfume/releases/download/v1.0.9/valaroix-customer.apk';
    let adminApkUrl = 'https://github.com/muaazkori-dev/valaroix-perfume/releases/download/v1.0.9/valaroix-admin.apk';

    // Try fetching the latest release from GitHub API
    try {
      const ghRes = await fetch(
        'https://api.github.com/repos/muaazkori-dev/valaroix-perfume/releases/latest',
        {
          headers: {
            'User-Agent': 'Valaroix-Version-Service',
            'Accept': 'application/vnd.github.v3+json',
          },
          next: { revalidate: 60 },
        }
      );

      if (ghRes.ok) {
        const release = await ghRes.json();
        if (release.tag_name) {
          latestTag = release.tag_name;
          // Extract version number from tag (e.g. v1.0.9 -> 9, v1.0.10 -> 10)
          const tagParts = latestTag.replace(/^v/, '').split('.');
          if (tagParts.length >= 3) {
            const parsedCode = parseInt(tagParts[tagParts.length - 1], 10);
            if (!isNaN(parsedCode) && parsedCode > 0) {
              versionCode = parsedCode;
            }
          }

          if (Array.isArray(release.assets)) {
            const custAsset = release.assets.find(a => a.name === 'valaroix-customer.apk');
            if (custAsset && custAsset.browser_download_url) {
              customerApkUrl = custAsset.browser_download_url;
            }
            const adminAsset = release.assets.find(a => a.name === 'valaroix-admin.apk');
            if (adminAsset && adminAsset.browser_download_url) {
              adminApkUrl = adminAsset.browser_download_url;
            }
          }
        }
      }
    } catch (e) {
      console.warn('Could not fetch latest release from GitHub API:', e);
    }

    const versionString = latestTag.replace(/^v/, '');

    const responseData = {
      version: versionString,
      tag: latestTag,
      versionCode: versionCode,
      customer: {
        version: versionString,
        versionCode: versionCode,
        apkUrl: customerApkUrl,
        title: `VALAROIX Haute Parfumerie v${versionString}`,
        changelog: 'Royal Gold official logo, live heads-up drop-down notifications, and in-app instant update system.',
        forceUpdate: false,
      },
      admin: {
        version: versionString,
        versionCode: versionCode,
        apkUrl: adminApkUrl,
        title: `VALAROIX Admin Hub v${versionString}`,
        changelog: 'Official imperial crest, instant audible drop-down order sirens, TCS booking & dispatch manager.',
        forceUpdate: false,
      },
    };

    if (app === 'customer') {
      return NextResponse.json(responseData.customer, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    if (app === 'admin') {
      return NextResponse.json(responseData.admin, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to check version',
      message: error.message,
    }, { status: 500 });
  }
}
