import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Funnel AI Studio - Luxe Suite',
  description: 'Générateur de Tunnel de Vente Haute Précision & Luxe UI',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body className="font-sans bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
