import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { StarBackground } from "@/components/ui/star-background";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@/components/navbar";

const orbitron = Orbitron({ 
  subsets: ["latin"],
  variable: '--font-orbitron',
});

const rajdhani = Rajdhani({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: '--font-rajdhani',
});

export const metadata: Metadata = {
  title: "CodeNest - Future of Code Sharing",
  description: "A next-generation platform for sharing and discovering code snippets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${orbitron.variable} ${rajdhani.variable} font-rajdhani bg-black text-space-light min-h-screen antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <StarBackground />
            <div className="relative z-10">
              <Navbar />
              {children}
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                className: '',
                duration: 3000,
                style: {
                  background: '#1a1a1a',
                  color: '#fff',
                  border: '1px solid rgba(0, 255, 255, 0.1)',
                },
                success: {
                  iconTheme: {
                    primary: '#00ff9d',
                    secondary: '#1a1a1a',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ff4b4b',
                    secondary: '#1a1a1a',
                  },
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 