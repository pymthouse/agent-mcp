export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          background: "#0a0a0a",
          color: "#f5f5f5",
        }}
      >
        {children}
      </body>
    </html>
  );
}
