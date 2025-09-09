/**
 * @fileoverview root layout for the app router. loads global styles and tailwind.
 */
import "./globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body>{children}</body>
    </html>
  );
}
