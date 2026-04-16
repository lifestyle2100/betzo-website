import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AccountLayout } from "./profile";
import { Link } from "wouter";
import { CheckCircle, Copy, AlertCircle, ChevronRight, Wallet, Zap } from "lucide-react";

const METHODS = [
  {
    id: "bkash", label: "bKash", logo: "৳B", color: "#e2136e", bg: "#fce7f3",
    min: 200, max: 100000, fee: "0%", time: "Instant",
    numbers: ["01700-000000", "01700-111111"],
  },
  {
    id: "nagad", label: "Nagad", logo: "N", color: "#f97316", bg: "#fff7ed",
    min: 200, max: 100000, fee: "0%", time: "Instant",
    numbers: ["01900-000000", "01900-111111"],
  },
  {
    id: "rocket", label: "Rocket", logo: "R", color: "#7c3aed", bg: "#f5f3ff",
    min: 200, max: 50000, fee: "0%", time: "Instant",
    numbers: ["01800-000000"],
  },
  {
    id: "card", label: "Visa / Mastercard", logo: "💳", color: "#1d4ed8", bg: "#eff6ff",
    min: 1000, max: 500000, fee: "2.5%", time: "1-5 min",
    numbers: [],
  },
  {
    id: "bank", label: "Bank Transfer", logo: "🏦", color: "#0f766e", bg: "#f0fdfa",
    min: 5000, max: 1000000, fee: "0%", time: "1-3 hours",
    numbers: [],
  },
  {
    id: "crypto", label: "Crypto (USDT)", logo: "₿", color: "#d97706", bg: "#fffbeb",
    min: 1000, max: 5000000, fee: "Network fee", time: "10-30 min",
    numbers: [],
  },
];

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000, 25000];

export default function DepositPage() {
  const { user } = useAuth();
  const [method, setMethod] = useState(METHODS[0]);
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"select" | "confirm" | "done">("select");
  const [txnId, setTxnId] = useState("");
  const [copied, setCopied] = useState("");

  if (!user) return (
    <AccountLayout active="/deposit">
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-white text-[17px] font-bold mb-4">Please log in to deposit</p>
        <Link href="/login"><span className="px-5 py-2.5 rounded-lg font-black text-[hsl(214_42%_9%)] text-[15px] cursor-pointer" style={{ background: "#ffba00" }}>Log In</span></Link>
      </div>
    </AccountLayout>
  );

  const num = parseFloat(amount) || 0;
  const bonus = num >= 1000 ? Math.min(num * 1.25, 30000) : 0;

  function copyNumber(n: string) {
    navigator.clipboard.writeText(n).catch(() => {});
    setCopied(n);
    setTimeout(() => setCopied(""), 2000);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step === "select") { setStep("confirm"); return; }
    setStep("done");
  }

  if (step === "done") {
    return (
      <AccountLayout active="/deposit">
        <div className="rounded-xl p-8 border text-center" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(34,197,94,0.15)" }}>
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <h2 className="text-[20px] font-black text-white mb-2">Deposit Request Submitted!</h2>
          <p className="text-[14px] text-[hsl(214_15%_45%)] mb-4">
            Your deposit of <strong className="text-[#ffba00]">৳{num.toLocaleString()}</strong> via <strong className="text-white">{method.label}</strong> is being processed.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-6 text-[13px] text-[hsl(214_15%_50%)]" style={{ background: "hsl(214 44% 7%)" }}>
            <span>Reference:</span>
            <span className="font-mono font-bold text-white">DEP{Date.now().toString().slice(-8)}</span>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setStep("select"); setAmount(""); setTxnId(""); }} className="px-5 py-2.5 rounded-lg font-black text-[14px] text-[hsl(214_42%_9%)] hover:brightness-110 transition-all" style={{ background: "#ffba00" }}>
              New Deposit
            </button>
            <Link href="/transactions"><span className="px-5 py-2.5 rounded-lg font-semibold text-[14px] text-white border hover:bg-white/5 transition-colors cursor-pointer" style={{ borderColor: "hsl(214 28% 22%)" }}>View Transactions</span></Link>
          </div>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout active="/deposit">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[19px] font-black text-white">Deposit Funds</h1>
          <div className="text-right">
            <p className="text-[12px] text-[hsl(214_15%_45%)]">Current Balance</p>
            <p className="text-[17px] font-black text-[#ffba00]">৳{parseFloat(user.balance).toFixed(2)}</p>
          </div>
        </div>

        {/* Bonus banner */}
        <div className="rounded-xl p-4 border flex items-center gap-3" style={{ background: "linear-gradient(105deg, rgba(255,186,0,0.12), rgba(255,186,0,0.04))", borderColor: "rgba(255,186,0,0.25)" }}>
          <Zap size={20} className="text-[#ffba00] shrink-0" />
          <div>
            <p className="text-[14px] font-black text-[#ffba00]">125% Welcome Bonus — up to ৳30,000!</p>
            <p className="text-[12px] text-[hsl(214_15%_50%)]">Minimum deposit ৳1,000. Wagering requirement: 20x</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: select method */}
          {step === "select" && (
            <>
              <div className="rounded-xl p-5 border mb-4" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
                <h2 className="text-[15px] font-black text-white mb-3">Select Payment Method</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {METHODS.map(m => (
                    <button key={m.id} type="button" onClick={() => setMethod(m)}
                      className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border text-center transition-all ${method.id === m.id ? "border-[#ffba00] scale-[1.02]" : "hover:border-white/20"}`}
                      style={{ background: method.id === m.id ? "rgba(255,186,0,0.08)" : "hsl(214 44% 8%)", borderColor: method.id === m.id ? "#ffba00" : "hsl(214 28% 18%)" }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-[17px] font-black shrink-0" style={{ background: m.bg, color: m.color }}>
                        {m.logo}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-white leading-tight">{m.label}</p>
                        <p className="text-[11px] text-[hsl(214_15%_45%)]">{m.time}</p>
                      </div>
                      {method.id === m.id && <CheckCircle size={14} className="text-[#ffba00]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div className="rounded-xl p-5 border mb-4" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
                <h2 className="text-[15px] font-black text-white mb-3">Enter Amount</h2>
                <div className="relative mb-3">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[17px] font-black text-[hsl(214_15%_40%)]">৳</span>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                    placeholder="0.00" min={method.min} max={method.max}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl text-[19px] font-black text-white outline-none border focus:border-[#ffba00] transition-colors"
                    style={{ background: "hsl(214 44% 7%)", borderColor: "hsl(214 28% 20%)" }}
                  />
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {QUICK_AMOUNTS.map(a => (
                    <button key={a} type="button" onClick={() => setAmount(a.toString())}
                      className={`px-3 py-1.5 rounded-lg text-[13px] font-bold transition-colors ${parseFloat(amount) === a ? "text-[hsl(214_42%_9%)]" : "text-[hsl(214_15%_55%)] hover:text-white"}`}
                      style={{ background: parseFloat(amount) === a ? "#ffba00" : "hsl(214 44% 14%)" }}>
                      ৳{a >= 1000 ? `${a / 1000}K` : a}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3 text-center text-[12px]">
                  <div className="p-2 rounded-lg" style={{ background: "hsl(214 44% 7%)" }}>
                    <p className="text-[hsl(214_15%_45%)]">Min</p>
                    <p className="font-bold text-white">৳{method.min.toLocaleString()}</p>
                  </div>
                  <div className="p-2 rounded-lg" style={{ background: "hsl(214 44% 7%)" }}>
                    <p className="text-[hsl(214_15%_45%)]">Fee</p>
                    <p className="font-bold text-white">{method.fee}</p>
                  </div>
                  <div className="p-2 rounded-lg" style={{ background: "hsl(214 44% 7%)" }}>
                    <p className="text-[hsl(214_15%_45%)]">Max</p>
                    <p className="font-bold text-white">৳{(method.max / 1000).toFixed(0)}K</p>
                  </div>
                </div>

                {bonus > 0 && (
                  <div className="mt-3 p-3 rounded-lg flex items-center gap-2 text-[13px]" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)" }}>
                    <CheckCircle size={14} className="text-green-400 shrink-0" />
                    <span className="text-green-400">You'll receive <strong>৳{bonus.toLocaleString()}</strong> bonus!</span>
                  </div>
                )}
              </div>

              {/* Payment info (mobile wallets) */}
              {method.numbers.length > 0 && (
                <div className="rounded-xl p-5 border mb-4" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
                  <h2 className="text-[15px] font-black text-white mb-3">Send Money To</h2>
                  <div className="space-y-2">
                    {method.numbers.map(n => (
                      <div key={n} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "hsl(214 44% 7%)" }}>
                        <div>
                          <p className="text-[12px] text-[hsl(214_15%_45%)]">{method.label} Number</p>
                          <p className="text-[15px] font-black text-white font-mono">{n}</p>
                        </div>
                        <button type="button" onClick={() => copyNumber(n)} className="p-2 rounded-lg hover:bg-white/10 text-[hsl(214_15%_45%)] hover:text-white transition-colors">
                          {copied === n ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} />}
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-3 rounded-lg text-[12px] text-[hsl(214_15%_45%)] flex gap-2" style={{ background: "rgba(255,186,0,0.08)", border: "1px solid rgba(255,186,0,0.2)" }}>
                    <AlertCircle size={14} className="text-[#ffba00] shrink-0 mt-0.5" />
                    <span>Send payment to the number above, then enter your transaction ID below.</span>
                  </div>
                </div>
              )}

              {/* Transaction ID */}
              {(method.numbers.length > 0 || method.id === "card") && (
                <div className="rounded-xl p-5 border mb-4" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
                  <label className="block text-[12px] font-bold text-[hsl(214_15%_45%)] uppercase tracking-wider mb-1.5">Transaction ID / Reference</label>
                  <input value={txnId} onChange={e => setTxnId(e.target.value)} placeholder="Enter your payment reference number"
                    className="w-full px-4 py-3 rounded-lg text-[14px] text-white outline-none border focus:border-[#ffba00] transition-colors"
                    style={{ background: "hsl(214 44% 7%)", borderColor: "hsl(214 28% 20%)" }}
                  />
                </div>
              )}

              <button type="submit" disabled={!amount || parseFloat(amount) < method.min}
                className="w-full py-3.5 rounded-xl font-black text-[16px] text-[hsl(214_42%_9%)] transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: "#ffba00" }}>
                <Wallet size={18} /> Continue to Deposit
              </button>
            </>
          )}

          {/* Step 2: Confirm */}
          {step === "confirm" && (
            <div className="rounded-xl p-5 border" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
              <h2 className="text-[17px] font-black text-white mb-4">Confirm Deposit</h2>
              <div className="space-y-3 mb-5">
                {[
                  ["Method", method.label],
                  ["Amount", `৳${parseFloat(amount).toLocaleString()}`],
                  ["Fee", method.fee === "0%" ? "Free" : method.fee],
                  ["Processing Time", method.time],
                  ...(bonus > 0 ? [["Bonus", `+৳${bonus.toLocaleString()}`]] : []),
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b last:border-0" style={{ borderColor: "hsl(214 28% 16%)" }}>
                    <span className="text-[14px] text-[hsl(214_15%_50%)]">{k}</span>
                    <span className={`text-[14px] font-black ${k === "Bonus" ? "text-green-400" : "text-white"}`}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 py-3 rounded-xl font-black text-[15px] text-[hsl(214_42%_9%)] hover:brightness-110 transition-all flex items-center justify-center gap-2" style={{ background: "#ffba00" }}>
                  <CheckCircle size={16} /> Confirm Deposit
                </button>
                <button type="button" onClick={() => setStep("select")} className="px-5 py-3 rounded-xl font-semibold text-[14px] text-white border hover:bg-white/5 transition-colors" style={{ borderColor: "hsl(214 28% 22%)" }}>Back</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </AccountLayout>
  );
}
