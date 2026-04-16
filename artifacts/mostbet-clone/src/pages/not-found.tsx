import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-8xl font-black text-[#ffba00] mb-4">404</div>
          <h1 className="text-3xl font-bold text-white mb-2">Page Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/">
              <button className="px-6 py-2.5 bg-[#ffba00] text-[hsl(214_42%_9%)] font-bold rounded-lg hover:bg-[#ffc929] transition-colors">
                Go Home
              </button>
            </Link>
            <Link href="/sportsbook">
              <button className="px-6 py-2.5 bg-[hsl(214_36%_18%)] border border-[hsl(214_28%_24%)] text-white font-medium rounded-lg hover:border-[#ffba00] transition-colors">
                View Sports
              </button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
