export const metadata = {
  title: 'VALAROIX — Admin Hub & Real-Time Alerts',
  description: 'Real-Time Order & TCS Dispatch Control for VALAROIX',
  manifest: '/manifest-admin.json',
  themeColor: '#D4AF37',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'VALAROIX Admin'
  }
};

export default function AdminLayout({ children }) {
  return (
    <>
      <link rel="manifest" href="/manifest-admin.json" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="theme-color" content="#D4AF37" />
      {children}
    </>
  );
}
