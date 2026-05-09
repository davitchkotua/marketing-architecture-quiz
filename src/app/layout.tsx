import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marketing Architecture Quiz — გაიგე, რა უნდა დალაგდეს პირველ რიგში",
  description:
    "5-წუთიანი საწყისი შეფასება: გაიგე, რამდენად სისტემურად იხარჯება მარკეტინგის ბიუჯეტი შენს ბიზნესში და რა უნდა დალაგდეს პირველ რიგში.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-border-dark bg-surface-dark">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
              <a href="/" className="text-sm font-semibold tracking-wide text-txt-light">
                Marketing Architect Studio
              </a>
              <a
                href="https://www.davitchkotua.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-txt-muted uppercase tracking-wider hover:text-accent transition"
              >
                davitchkotua.com
              </a>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border-dark bg-surface-dark">
            <div className="mx-auto max-w-5xl px-5 py-6 text-xs text-txt-muted">
              © {new Date().getFullYear()} Davit Chkotua / Marketing Architect Studio
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
