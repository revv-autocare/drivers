import type { Metadata } from "next";
import "design-system/styles/tokens.css";

export const metadata: Metadata = {
  title: "Revv Shop",
  description: "Workbay, customers, and claims for Revv shops",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
