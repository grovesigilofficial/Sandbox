export const metadata = {
  title: "GrovePortal Sandbox",
  description: "Sandbox environment for GrovePortal."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
