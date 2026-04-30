import "./globals.css";

export const metadata = {
  title: "AI Website Co-Pilot",
  description: "Select text, explain it, and summarize it with a simple AI side panel.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
