import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const THEME_FILE = path.join(process.cwd(), 'public', 'site-theme.json');

// In-memory cache
let cachedTheme = 'royal-gold';

// Helper to read persisted theme
function getPersistedTheme() {
  try {
    if (fs.existsSync(THEME_FILE)) {
      const data = JSON.parse(fs.readFileSync(THEME_FILE, 'utf8'));
      if (data && (data.theme === 'royal-gold' || data.theme === 'sapphire-blue' || data.theme === 'imperial-emerald')) {
        cachedTheme = data.theme;
        return data.theme;
      }
    }
  } catch (e) {
    console.error('Error reading theme file:', e);
  }
  return cachedTheme;
}

// Helper to save theme
function savePersistedTheme(theme) {
  try {
    cachedTheme = theme;
    fs.writeFileSync(THEME_FILE, JSON.stringify({ theme, updatedAt: new Date().toISOString() }), 'utf8');
  } catch (e) {
    console.error('Error saving theme file:', e);
  }
}

export async function GET() {
  const activeTheme = getPersistedTheme();
  return NextResponse.json({
    theme: activeTheme,
    availableThemes: [
      {
        id: 'royal-gold',
        name: 'Royal Noir & Gold',
        subtitle: 'Classic Imperial Black Velvet & Gold (Sauvage Classic)',
        palette: ['#0D0D0D', '#141414', '#D4AF37', '#F6E6B4'],
        description: 'Heritage French luxury aesthetic. Midnight black, velvet noir, and imperial royal gold.',
      },
      {
        id: 'sapphire-blue',
        name: 'Midnight Sapphire & Platinum',
        subtitle: 'Modern Electric Blue & Obsidian (Noir X & Vertex)',
        palette: ['#050814', '#0B132B', '#2563EB', '#FFFFFF'],
        description: 'High-voltage modern luxury. Deep midnight blue, obsidian black, ice sapphire glow, and crisp diamond white.',
      },
      {
        id: 'imperial-emerald',
        name: 'Imperial Emerald & Platinum',
        subtitle: 'VALAROIX Master Brand House Edition (Niche Aristocracy)',
        palette: ['#04120B', '#061A10', '#10B981', '#F1F5F9'],
        description: 'Ultra-exclusive niche perfumery aesthetic inspired by Clive Christian & Roja Parfums. Midnight emerald obsidian with luminous jade glow and frosted platinum accents.',
      }
    ]
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Access-Control-Allow-Origin': '*',
    }
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const newTheme = body.theme;

    if (newTheme !== 'royal-gold' && newTheme !== 'sapphire-blue' && newTheme !== 'imperial-emerald') {
      return NextResponse.json({ error: 'Invalid theme specified' }, { status: 400 });
    }

    savePersistedTheme(newTheme);

    const themeTitles = {
      'royal-gold': 'Royal Noir & Gold',
      'sapphire-blue': 'Midnight Sapphire & Platinum',
      'imperial-emerald': 'Imperial Emerald & Platinum (VALAROIX Brand Edition)'
    };

    return NextResponse.json({
      success: true,
      theme: newTheme,
      message: `Website design successfully updated to ${themeTitles[newTheme] || newTheme}!`,
      updatedAt: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update theme', message: error.message }, { status: 500 });
  }
}
