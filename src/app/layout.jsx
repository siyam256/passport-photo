import "./globals.css";

// Metadata for SEO and browser tab title
export const metadata = {
  title: "Passport AI - Professional Photo Generator",
  description: "Generate professional passport size photos using AI",
};

/**
 * Root Layout Component
 * This is the wrapper for the entire application.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
    }
