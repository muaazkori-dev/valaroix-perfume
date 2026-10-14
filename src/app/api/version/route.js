import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// In-memory cache to prevent GitHub rate-limiting and guarantee we never downgrade to an older version
let cachedVersionData = {
  tag: 'v1.0.19',
  version: '1.0.19',
  versionCode: 19,
  customerApkUrl: 'https://github.com/muaazkori-dev/valaroix-perfume/releases/download/v1.0.19/valaroix-customer.apk',
  adminApkUrl: 'https://github.com/muaazkori-dev/valaroix-perfume/releases/download/v1.0.19/valaroix-admin.apk',
  lastFetched: 0,
};

async function getLatestRelease() {
  const now = Date.now();
  // Cache for 60 seconds to avoid GitHub rate limits
  if (now - cachedVersionData.lastFetched < 60000) {
    return cachedVersionData;
  }

  try {
    const headers = {
      'User-Agent': 'Valaroix-Version-Service',
      'Accept': 'application/vnd.github.v3+json',
    };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const ghRes = await fetch(
      'https://api.github.com/repos/muaazkori-dev/valaroix-perfume/releases/latest',
      {
        headers,
        next: { revalidate: 60 },
      }
    );

    if (ghRes.ok) {
      const release = await ghRes.json();
      if (release && release.tag_name) {
        const latestTag = release.tag_name;
        let versionCode = cachedVersionData.versionCode;
        const tagParts = latestTag.replace(/^v/, '').split('.');
        if (tagParts.length >= 3) {
          const parsedCode = parseInt(tagParts[tagParts.length - 1], 10);
          if (!isNaN(parsedCode) && parsedCode > 0) {
            versionCode = parsedCode;
          }
        }

        let customerApkUrl = cachedVersionData.customerApkUrl;
        let adminApkUrl = cachedVersionData.adminApkUrl;

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

        if (versionCode >= cachedVersionData.versionCode) {
          cachedVersionData = {
            tag: latestTag,
            version: latestTag.replace(/^v/, ''),
            versionCode: versionCode,
            customerApkUrl,
            adminApkUrl,
            lastFetched: now,
          };
        }
      }
    } else {
      console.warn(`GitHub API returned status ${ghRes.status} for latest release check.`);
    }
  } catch (e) {
    console.warn('Could not fetch latest release from GitHub API:', e);
  }

  return cachedVersionData;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const app = searchParams.get('app'); // 'customer' or 'admin' or null

    const data = await getLatestRelease();

    const responseData = {
      version: data.version,
      tag: data.tag,
      versionCode: data.versionCode,
      customer: {
        version: data.version,
        versionCode: data.versionCode,
        apkUrl: data.customerApkUrl,
        title: `VALAROIX Haute Parfumerie v${data.version}`,
        changelog: 'Royal Gold official logo, live heads-up drop-down notifications, and in-app instant update system.',
        forceUpdate: false,
      },
      admin: {
        version: data.version,
        versionCode: data.versionCode,
        apkUrl: data.adminApkUrl,
        title: `VALAROIX Admin Hub v${data.version}`,
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
