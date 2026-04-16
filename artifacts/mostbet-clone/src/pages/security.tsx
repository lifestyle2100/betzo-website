import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AccountLayout } from "./profile";
import { Link } from "wouter";
import { Lock, Shield, Smartphone, Eye, EyeOff, CheckCircle, AlertTriangle, Key, Globe, LogOut } from "lucide-react";

export default function SecurityPage() {
  const { user } = useAuth();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [saved, setSaved] = useState("");

  if (!user) return (
    <AccountLayout active="/security">
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-white text-[17px] font-bold mb-4">Please log in</p>
        <Link href="/login"><span className="px-5 py-2.5 rounded-lg font-black text-[hsl(214_42%_9%)] text-[15px] cursor-pointer" style={{ background: "#ffba00" }}>Log In</span></Link>
      </div>
    </AccountLayout>
  );

  function handlePwChange(e: React.FormEvent) {
    e.preventDefault();
    setSaved("password");
    setPwForm({ current: "", newPw: "", confirm: "" });
    setTimeout(() => setSaved(""), 3000);
  }

  const SESSIONS = [
    { device: "Chrome · Windows 11", location: "Dhaka, Bangladesh", ip: "103.x.x.x", time: "Now (Current)", current: true },
    { device: "Mobile App · Android", location: "Dhaka, Bangladesh", ip: "103.x.x.x", time: "2 hours ago", current: false },
    { device: "Firefox · macOS", location: "Chittagong, Bangladesh", ip: "182.x.x.x", time: "3 days ago", current: false },
  ];

  return (
    <AccountLayout active="/security">
      <div className="space-y-4">
        <h1 className="text-[19px] font-black text-white">Security Settings</h1>

        {saved && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-green-400 text-[14px] font-semibold" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)" }}>
            <CheckCircle size={15} /> {saved === "password" ? "Password updated successfully!" : "Settings saved!"}
          </div>
        )}

        {/* Security Overview */}
        <div className="rounded-xl p-5 border" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
          <h2 className="text-[15px] font-black text-white mb-3 flex items-center gap-2"><Shield size={16} className="text-[#ffba00]" /> Security Overview</h2>
          <div className="space-y-3">
            {[
              { label: "Email Verified",       status: true,  text: "Verified" },
              { label: "Phone Verified",        status: false, text: "Not Verified" },
              { label: "Two-Factor Auth (2FA)", status: false, text: "Disabled" },
              { label: "KYC Verification",      status: true,  text: "Verified" },
            ].map(({ label, status, text }) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: "hsl(214 28% 16%)" }}>
                <span className="text-[14px] text-[hsl(214_15%_55%)]">{label}</span>
                <div className="flex items-center gap-1.5">
                  {status
                    ? <><CheckCircle size={13} className="text-green-400" /><span className="text-[13px] font-bold text-green-400">{text}</span></>
                    : <><AlertTriangle size={13} className="text-yellow-400" /><span className="text-[13px] font-bold text-yellow-400">{text}</span></>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Change Password */}
        <div className="rounded-xl p-5 border" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
          <h2 className="text-[15px] font-black text-white mb-4 flex items-center gap-2"><Key size={16} className="text-[#ffba00]" /> Change Password</h2>
          <form onSubmit={handlePwChange} className="space-y-3">
            {[
              { label: "Current Password", key: "current" as const, show: showCurrent, toggle: () => setShowCurrent(v => !v) },
              { label: "New Password",     key: "newPw"   as const, show: showNew,     toggle: () => setShowNew(v => !v) },
              { label: "Confirm New Password", key: "confirm" as const, show: showConfirm, toggle: () => setShowConfirm(v => !v) },
            ].map(({ label, key, show, toggle }) => (
              <div key={key}>
                <label className="block text-[12px] font-bold text-[hsl(214_15%_45%)] uppercase tracking-wider mb-1.5">{label}</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(214_15%_40%)]" />
                  <input type={show ? "text" : "password"} value={pwForm[key]}
                    onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-lg text-[14px] text-white outline-none border focus:border-[#ffba00] transition-colors"
                    style={{ background: "hsl(214 44% 7%)", borderColor: "hsl(214 28% 20%)" }}
                  />
                  <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(214_15%_40%)] hover:text-white transition-colors">
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            ))}
            {pwForm.newPw && pwForm.newPw.length < 8 && (
              <p className="text-[12px] text-yellow-400 flex items-center gap-1"><AlertTriangle size={12} /> Password must be at least 8 characters</p>
            )}
            {pwForm.newPw && pwForm.confirm && pwForm.newPw !== pwForm.confirm && (
              <p className="text-[12px] text-red-400 flex items-center gap-1"><AlertTriangle size={12} /> Passwords do not match</p>
            )}
            <button type="submit" disabled={!pwForm.current || !pwForm.newPw || !pwForm.confirm || pwForm.newPw !== pwForm.confirm || pwForm.newPw.length < 8}
              className="px-5 py-2.5 rounded-lg font-black text-[14px] text-[hsl(214_42%_9%)] hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "#ffba00" }}>
              Update Password
            </button>
          </form>
        </div>

        {/* 2FA */}
        <div className="rounded-xl p-5 border" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(59,130,246,0.15)" }}>
              <Smartphone size={18} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-[15px] font-black text-white">Two-Factor Authentication (2FA)</h2>
              <p className="text-[13px] text-[hsl(214_15%_45%)]">Add an extra layer of security using Google Authenticator or SMS.</p>
            </div>
          </div>
          <button className="px-5 py-2.5 rounded-lg font-black text-[14px] text-white hover:brightness-110 transition-all" style={{ background: "hsl(214 36% 18%)", border: "1px solid hsl(214 28% 26%)" }}>
            Enable 2FA
          </button>
        </div>

        {/* Active Sessions */}
        <div className="rounded-xl p-5 border" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
          <h2 className="text-[15px] font-black text-white mb-4 flex items-center gap-2"><Globe size={16} className="text-[#ffba00]" /> Active Sessions</h2>
          <div className="space-y-3">
            {SESSIONS.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "hsl(214 44% 8%)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.current ? "#22c55e" : "hsl(214 28% 30%)" }} />
                  <div>
                    <p className="text-[13px] font-bold text-white">{s.device}</p>
                    <p className="text-[12px] text-[hsl(214_15%_40%)]">{s.location} · {s.ip}</p>
                    <p className="text-[11px] text-[hsl(214_15%_35%)]">{s.time}</p>
                  </div>
                </div>
                {!s.current && (
                  <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-semibold text-red-400 hover:bg-red-500/10 transition-colors">
                    <LogOut size={12} /> End
                  </button>
                )}
                {s.current && <span className="text-[12px] text-green-400 font-bold">Current</span>}
              </div>
            ))}
          </div>
          <button className="mt-3 text-[13px] font-semibold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5">
            <LogOut size={13} /> Sign Out All Other Sessions
          </button>
        </div>
      </div>
    </AccountLayout>
  );
}
