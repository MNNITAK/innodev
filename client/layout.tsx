import type React from "react";
import "./src/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>CIVORA - Policy Simulation Platform</title>
        <meta
          name="description"
          content="A parallel world of synthetic citizens and real reactions. Simulate policy outcomes before implementation."
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
