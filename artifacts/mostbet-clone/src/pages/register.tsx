import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, UserPlus, Check } from "lucide-react";
import logo from "@/assets/xbetzone-logo.png";

const countries = [
  "Bangladesh", "India", "Pakistan", "Sri Lanka", "Nepal", "Afghanistan",
  "United Kingdom", "United States", "Canada", "Australia", "Germany",
  "France", "Brazil", "Nigeria", "Kenya", "Ghana", "South Africa",
];

export default function RegisterPage() {
  const { register } = useAuth();
  const [, navigate] = useLocation();
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    country: "Bangladesh",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!agreed) {
      setError("You must agree to the Terms & Conditions");
      return;
    }

    setLoading(true);
    try {
      await register({
        username: form.username,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
        country: form.country,
      });
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full px-3.5 py-2.5 rounded-lg text-base text-white placeholder-[hsl(214_10%_50%)] outline-none transition-all border focus:border-[#ffba00]`;
  const inputStyle = { background: "hsl(214 36% 17%)", borderColor: "hsl(214 28% 24%)" };

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: "Weak", color: "#ef4444", width: "33%" };
    if (p.length < 10 || !/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: "Fair", color: "#f97316", width: "66%" };
    return { label: "Strong", color: "#22c55e", width: "100%" };
  })();

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
          <p className="text-muted-foreground text-base mt-2">Create your account to start betting</p>
        </div>

        {/* Welcome bonus banner */}
        <div
          className="rounded-xl p-3.5 mb-6 flex items-center gap-3"
          style={{ background: "linear-gradient(90deg, hsl(43 100% 20%) 0%, hsl(214 38% 14%) 100%)", border: "1px solid #ffba0040" }}
        >
          <span className="text-3xl">🎁</span>
          <div>
            <p className="text-sm font-bold text-[#ffba00]">Welcome Bonus</p>
            <p className="text-base font-black text-white">125% up to ৳30,000 on first deposit!</p>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 border"
          style={{ background: "hsl(214 38% 12%)", borderColor: "hsl(214 28% 18%)" }}
        >
          <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#ffba00]" />
            Create Account
          </h1>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-base">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                Username <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.username}
                onChange={set("username")}
                placeholder="Choose a username"
                required
                minLength={3}
                maxLength={30}
                autoFocus
                className={inputClass}
                style={inputStyle}
                data-testid="register-username"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="Enter your email"
                required
                className={inputClass}
                style={inputStyle}
                data-testid="register-email"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                Phone Number <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                placeholder="+880 1X XXXX XXXX"
                className={inputClass}
                style={inputStyle}
                data-testid="register-phone"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                Country
              </label>
              <select
                value={form.country}
                onChange={set("country")}
                className={inputClass}
                style={inputStyle}
                data-testid="register-country"
              >
                {countries.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className={`${inputClass} pr-10`}
                  style={inputStyle}
                  data-testid="register-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordStrength && (
                <div className="mt-1.5">
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: "hsl(214 28% 20%)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: passwordStrength.width, background: passwordStrength.color }}
                    />
                  </div>
                  <p className="text-[13px] mt-0.5" style={{ color: passwordStrength.color }}>
                    {passwordStrength.label} password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={set("confirmPassword")}
                  placeholder="Re-enter your password"
                  required
                  autoComplete="new-password"
                  className={`${inputClass} pr-10`}
                  style={inputStyle}
                  data-testid="register-confirm-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-sm text-red-400 mt-1">Passwords don't match</p>
              )}
              {form.confirmPassword && form.password === form.confirmPassword && form.confirmPassword.length > 0 && (
                <p className="text-sm text-green-400 mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Passwords match
                </p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <div
                onClick={() => setAgreed(v => !v)}
                className={`w-4 h-4 rounded border shrink-0 mt-0.5 flex items-center justify-center transition-all cursor-pointer ${
                  agreed ? "bg-[#ffba00] border-[#ffba00]" : "border-[hsl(214_28%_30%)]"
                }`}
                style={{ background: agreed ? "#ffba00" : "hsl(214 36% 17%)" }}
              >
                {agreed && <Check className="w-3 h-3 text-[hsl(214_42%_9%)]" />}
              </div>
              <span className="text-sm text-muted-foreground">
                I am 18+ and agree to the{" "}
                <a href="#" className="text-[#ffba00] hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-[#ffba00] hover:underline">Privacy Policy</a>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-[hsl(214_42%_9%)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: loading ? "#d4a800" : "#ffba00" }}
              data-testid="register-submit"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-base text-muted-foreground mt-5">
            Already have an account?{" "}
            <Link href="/login">
              <span className="text-[#ffba00] font-semibold hover:underline cursor-pointer">
                Log In
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
