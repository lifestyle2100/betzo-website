import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, LogIn } from "lucide-react";
import logo from "@/assets/xbetzone-logo.png";

export default function LoginPage() {
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(emailOrUsername, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "hsl(214 42% 9%)" }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <img src={logo} alt="XBetZone" className="h-14 mx-auto object-contain cursor-pointer" />
          </Link>
          <p className="text-muted-foreground text-base mt-2">Sign in to your account</p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 border"
          style={{ background: "hsl(214 38% 12%)", borderColor: "hsl(214 28% 18%)" }}
        >
          <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <LogIn className="w-5 h-5 text-[#ffba00]" />
            Log In
          </h1>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-base">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                Email or Username
              </label>
              <input
                type="text"
                value={emailOrUsername}
                onChange={e => setEmailOrUsername(e.target.value)}
                placeholder="Enter your email or username"
                required
                autoFocus
                autoComplete="username"
                className="w-full px-3.5 py-2.5 rounded-lg text-base text-white placeholder-[hsl(214_10%_50%)] outline-none transition-all border focus:border-[#ffba00]"
                style={{
                  background: "hsl(214 36% 17%)",
                  borderColor: "hsl(214 28% 24%)",
                }}
                data-testid="login-email"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg text-base text-white placeholder-[hsl(214_10%_50%)] outline-none transition-all border focus:border-[#ffba00]"
                  style={{
                    background: "hsl(214 36% 17%)",
                    borderColor: "hsl(214 28% 24%)",
                  }}
                  data-testid="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <a href="#" className="text-sm text-[#ffba00] hover:underline">Forgot password?</a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-[hsl(214_42%_9%)] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              style={{ background: loading ? "#d4a800" : "#ffba00" }}
              data-testid="login-submit"
            >
              {loading ? "Signing in..." : "Log In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "hsl(214 28% 20%)" }} />
            <span className="text-sm text-muted-foreground">or</span>
            <div className="flex-1 h-px" style={{ background: "hsl(214 28% 20%)" }} />
          </div>

          {/* Social login buttons (decorative) */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {[
              { icon: "🔵", label: "Continue with Google" },
              { icon: "📘", label: "Continue with Facebook" },
            ].map(({ icon, label }) => (
              <button
                key={label}
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white border transition-colors hover:border-[#ffba00]"
                style={{ background: "hsl(214 36% 17%)", borderColor: "hsl(214 28% 24%)" }}
              >
                <span>{icon}</span>
                <span className="hidden sm:inline truncate">{label.replace("Continue with ", "")}</span>
              </button>
            ))}
          </div>

          <p className="text-center text-base text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register">
              <span className="text-[#ffba00] font-semibold hover:underline cursor-pointer">
                Register Now
              </span>
            </Link>
          </p>
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          By logging in, you confirm you are 18+ and agree to our{" "}
          <a href="#" className="text-[#ffba00] hover:underline">Terms of Service</a>
        </p>
      </div>
    </div>
  );
}
