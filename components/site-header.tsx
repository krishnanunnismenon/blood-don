import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          Blood Donation n8n
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              Admin Dashboard
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
