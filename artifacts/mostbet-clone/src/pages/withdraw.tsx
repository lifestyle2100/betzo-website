import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AccountLayout } from "./profile";
import { Link } from "wouter";
import { CheckCircle, AlertCircle, TrendingUp, Clock, Info } from "lucide-react";

const METHODS = [
  { id: "bkash",  label: "bKash",          logo: "৳B", color: "#e2136e", bg: "#fce7f3", min: 500,  max: 50000,  fee: "1.5%", time: "1-12 hrs" },
  { id: "nagad",  label: "Nagad",           logo: "N",  color: "#f97316", bg: "#fff7ed", min: 500,  max: 50000,  fee: "1%",   time: "1-12 hrs" },
  { id: "rocket", label: "Rocket",          logo: "R",  color: "#7c3aed", bg: "#f5f3ff", min: 500,  max: 25000,  fee: "1.5%", time: "1-24 hrs" },
  { id: "bank",   label: "Bank Transfer",   logo: "🏦", color: "#0f766e", bg: "#f0fdfa", min: 2000, max: 500000, fee: "Free", time: "1-3 days" },
  { id: "crypto", label: "Crypto (USDT)",   logo: "₿",  color: "#d97706", bg: "#fffbeb", min: 5000, max: 2000000,fee: "Net", time: "30-60 min" },
];

const QUICK = [500, 1000, 2000, 5000, 10000];

export default function WithdrawPage() {
  const { user } = useAuth();
  const [method, setMethod] = useState(METHODS[0]);
  const [amount, setAmount] = useState("");
  const [accountNum, setAccountNum] = useState("");
  const [accountName, setAccountName] = useState("");
  const [step, setStep] = useState<"form" | "confirm" | "done">("form");

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(214 44% 7%)" }}>
      <div className="text-center">
        <p className="text-white text-[17px] font-bold mb-4">Please log in to withdraw</p>
        <Link href="/login"><span className="px-5 py-2.5 rounded-lg font-black text-[hsl(214_42%_9%)] text-[15px] cursor-pointer" style={{ background: "#ffba00" }}>Log In</span></Link>
      </div>
    </div>
  );

  const balance = parseFloat(user.balance);
  const num = parseFloat(amount) || 0;
  const fee = method.fee !== "Free" && method.fee !== "Net" ? num * (parseFloat(method.fee) / 100) : 0;
  const net = Math.max(0, num - fee);

  if (step === "done") return (
    <AccountLayout active="/withdraw">
      <div className="rounded-xl p-8 border text-center" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(59,130,246,0.15)" }}>
          <CheckCircle size={32} className="text-blue-400" />
        </div>
        <h2 className="text-[20px] font-black text-white mb-2">Withdrawal Submitted!</h2>
        <p className="text-[14px] text-[hsl(214_15%_45%)] mb-4">
          Your withdrawal of <strong className="text-[#ffba00]">৳{num.toLocaleString()}</strong> to <strong className="text-white">{accountNum}</strong> via <strong className="text-white">{method.label}</strong> is being processed.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-6 text-[13px] text-[hsl(214_15%_50%)]" style={{ background: "hsl(214 44% 7%)" }}>
          <Clock size={13} /> Expected: {method.time}
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setStep("form"); setAmount(""); }} className="px-5 py-2.5 rounded-lg font-black text-[14px] text-[hsl(214_42%_9%)]" style={{ background: "#ffba00" }}>New Withdrawal</button>
          <Link href="/transactions"><span className="px-5 py-2.5 rounded-lg font-semibold text-[14px] text-white border hover:bg-white/5 transition-colors cursor-pointer" style={{ borderColor: "hsl(214 28% 22%)" }}>View Transactions</span></Link>
        </div>
      </div>
    </AccountLayout>
  );

  return (
    <AccountLayout active="/withdraw">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[19px] font-black text-white">Withdraw Funds</h1>
          <div className="text-right">
            <p className="text-[12px] text-[hsl(214_15%_45%)]">Available Balance</p>
            <p className="text-[17px] font-black text-[#ffba00]">৳{balance.toFixed(2)}</p>
          </div>
        </div>

        {balance < 500 && (
          <div className="p-4 rounded-xl flex items-center gap-2 text-[13px]" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
            <AlertCircle size={14} className="text-red-400 shrink-0" /> <span className="text-red-300">Your balance is below the minimum withdrawal amount of ৳500.</span>
          </div>
        )}

        {step === "form" && (
          <>
            {/* Method */}
            <div className="rounded-xl p-5 border" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
              <h2 className="text-[15px] font-black text-white mb-3">Withdrawal Method</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {METHODS.map(m => (
                  <button key={m.id} type="button" onClick={() => setMethod(m)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all`}
                    style={{ background: method.id === m.id ? "rgba(255,186,0,0.08)" : "hsl(214 44% 8%)", borderColor: method.id === m.id ? "#ffba00" : "hsl(214 28% 18%)" }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-black shrink-0" style={{ background: m.bg, color: m.color }}>{m.logo}</div>
                    <div>
                      <p className="text-[13px] font-bold text-white">{m.label}</p>
                      <p className="text-[11px] text-[hsl(214_15%_45%)]">Fee: {m.fee}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Account details */}
            <div className="rounded-xl p-5 border" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
              <h2 className="text-[15px] font-black text-white mb-3">Account Details</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] font-bold text-[hsl(214_15%_45%)] uppercase tracking-wider mb-1.5">
                    {method.id === "bank" ? "Account Number" : method.id === "crypto" ? "Wallet Address" : `${method.label} Number`}
                  </label>
                  <input value={accountNum} onChange={e => setAccountNum(e.target.value)}
                    placeholder={method.id === "bank" ? "Enter bank account number" : method.id === "crypto" ? "Enter USDT TRC20/ERC20 address" : `Enter ${method.label} number`}
                    className="w-full px-4 py-3 rounded-lg text-[14px] text-white outline-none border focus:border-[#ffba00] transition-colors"
                    style={{ background: "hsl(214 44% 7%)", borderColor: "hsl(214 28% 20%)" }}
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[hsl(214_15%_45%)] uppercase tracking-wider mb-1.5">Account Holder Name</label>
                  <input value={accountName} onChange={e => setAccountName(e.target.value)} placeholder="Full name as registered"
                    className="w-full px-4 py-3 rounded-lg text-[14px] text-white outline-none border focus:border-[#ffba00] transition-colors"
                    style={{ background: "hsl(214 44% 7%)", borderColor: "hsl(214 28% 20%)" }}
                  />
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="rounded-xl p-5 border" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
              <h2 className="text-[15px] font-black text-white mb-3">Amount</h2>
              <div className="relative mb-3">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[17px] font-black text-[hsl(214_15%_40%)]">৳</span>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                  placeholder="0.00" min={method.min} max={Math.min(method.max, balance)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl text-[19px] font-black text-white outline-none border focus:border-[#ffba00] transition-colors"
                  style={{ background: "hsl(214 44% 7%)", borderColor: "hsl(214 28% 20%)" }}
                />
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {QUICK.map(a => (
                  <button key={a} type="button" onClick={() => setAmount(Math.min(a, balance).toString())}
                    className="px-3 py-1.5 rounded-lg text-[13px] font-bold text-[hsl(214_15%_55%)] hover:text-white transition-colors"
                    style={{ background: "hsl(214 44% 14%)" }}>
                    ৳{a >= 1000 ? `${a / 1000}K` : a}
                  </button>
                ))}
                <button type="button" onClick={() => setAmount(balance.toString())}
                  className="px-3 py-1.5 rounded-lg text-[13px] font-bold text-[#ffba00]" style={{ background: "rgba(255,186,0,0.12)" }}>
                  All
                </button>
              </div>

              {num > 0 && (
                <div className="space-y-1.5 p-3 rounded-lg text-[13px]" style={{ background: "hsl(214 44% 7%)" }}>
                  <div className="flex justify-between"><span className="text-[hsl(214_15%_45%)]">Amount</span><span className="text-white font-semibold">৳{num.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-[hsl(214_15%_45%)]">Fee ({method.fee})</span><span className="text-red-400 font-semibold">-৳{fee.toFixed(2)}</span></div>
                  <div className="flex justify-between border-t pt-1.5 mt-1.5" style={{ borderColor: "hsl(214 28% 18%)" }}><span className="text-white font-bold">You Receive</span><span className="text-[#ffba00] font-black text-[14px]">৳{net.toFixed(2)}</span></div>
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-xl flex items-start gap-2.5 text-[13px]" style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}>
              <Info size={14} className="text-blue-400 shrink-0 mt-0.5" />
              <span className="text-[hsl(214_15%_55%)]">Withdrawals are processed within <strong className="text-white">{method.time}</strong>. KYC verification may be required for large amounts.</span>
            </div>

            <button onClick={() => setStep("confirm")} disabled={!amount || num < method.min || num > balance || !accountNum}
              className="w-full py-3.5 rounded-xl font-black text-[16px] text-[hsl(214_42%_9%)] transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: "#ffba00" }}>
              <TrendingUp size={18} /> Continue
            </button>
          </>
        )}

        {step === "confirm" && (
          <div className="rounded-xl p-5 border" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
            <h2 className="text-[17px] font-black text-white mb-4">Confirm Withdrawal</h2>
            <div className="space-y-3 mb-5">
              {[
                ["Method", method.label],
                ["Account", accountNum],
                ["Account Name", accountName],
                ["Amount", `৳${num.toLocaleString()}`],
                ["Fee", fee > 0 ? `-৳${fee.toFixed(2)}` : "Free"],
                ["You Receive", `৳${net.toFixed(2)}`],
                ["Processing Time", method.time],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b last:border-0" style={{ borderColor: "hsl(214 28% 16%)" }}>
                  <span className="text-[14px] text-[hsl(214_15%_50%)]">{k}</span>
                  <span className={`text-[14px] font-black ${k === "You Receive" ? "text-[#ffba00]" : "text-white"}`}>{v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep("done")} className="flex-1 py-3 rounded-xl font-black text-[15px] text-[hsl(214_42%_9%)] hover:brightness-110 transition-all" style={{ background: "#ffba00" }}>Confirm Withdrawal</button>
              <button onClick={() => setStep("form")} className="px-5 py-3 rounded-xl font-semibold text-[14px] text-white border hover:bg-white/5 transition-colors" style={{ borderColor: "hsl(214 28% 22%)" }}>Back</button>
            </div>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
