export const metadata = {
  title: 'Retrato Golden Hour - Hiperrealista',
  description:
    'Retrato fotogr?fico hiperrealista de una mujer joven moderna y elegante, en golden hour con luz c?lida y fondo urbano difuminado.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
