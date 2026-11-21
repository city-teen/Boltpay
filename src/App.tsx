import { useEffect, useState, useCallback } from 'react';
import {
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  Clock,
  Calculator,
  Lock,
  Save,
  X,
  Camera,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  Info,
} from 'lucide-react';
import { supabase, type RateRow } from '@/lib/supabase';

function formatTimeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function App() {
  const [rate, setRate] = useState<RateRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);

  const fetchRate = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('exchange_rates')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    setRate(data as RateRow | null);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  const currentAed = Number(rate?.aed_per_1000_inr ?? 0);
  const inrPerAed = currentAed ? 1000 / currentAed : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-teal-500/10 blur-3xl" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Camera className="h-5 w-5 text-slate-950" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-none">Pay Snap</h1>
              <p className="text-[11px] text-slate-400 leading-none mt-0.5">UAE → India Rate Board</p>
            </div>
          </div>
          <button
            onClick={() => setShowAdmin(true)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-100 transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
          >
            <Lock className="h-3.5 w-3.5" />
            Admin
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
        {/* Hero rate card */}
        <section className="animate-fade-up">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              Live exchange rate
            </span>
            <h2 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight">
              Send money from UAE to India
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base">
              Today's best rate, updated daily by Pay Snap
            </p>
          </div>

          {error && (
            <div className="max-w-md mx-auto mb-6 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300 text-center">
              Couldn't load the rate. Please try again.
            </div>
          )}

          {/* Main rate display */}
          <div className="max-w-2xl mx-auto">
            <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800/50 border border-white/10 p-8 sm:p-10 shadow-2xl overflow-hidden">
              <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

              {loading ? (
                <div className="space-y-6">
                  <div className="shimmer-bg h-24 rounded-2xl" />
                  <div className="shimmer-bg h-6 w-48 mx-auto rounded-lg" />
                  <div className="shimmer-bg h-20 rounded-2xl" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center gap-3 sm:gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">You send</div>
                      <div className="flex items-baseline gap-1.5 justify-center">
                        <span className="text-2xl sm:text-3xl font-bold text-emerald-400">
                          {currentAed.toFixed(2)}
                        </span>
                        <span className="text-sm font-semibold text-emerald-400/80">AED</span>
                        <span className="text-lg leading-none">🇦🇪</span>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <div className="h-9 w-9 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                        <ArrowRight className="h-4 w-4 text-emerald-400" />
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">They receive</div>
                      <div className="flex items-baseline gap-1.5 justify-center">
                        <span className="text-2xl sm:text-3xl font-bold text-slate-50">1,000</span>
                        <span className="text-sm font-semibold text-slate-400">INR</span>
                        <span className="text-lg leading-none">🇮🇳</span>
                      </div>
                    </div>
                  </div>

                  {/* Secondary info */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                      <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">1 AED = <span>🇦🇪</span></div>
                      <div className="text-lg font-semibold text-slate-100">
                        {inrPerAed.toFixed(2)} <span className="text-sm text-slate-400">INR</span> <span>🇮🇳</span>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                      <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">1 INR = <span>🇮🇳</span></div>
                      <div className="text-lg font-semibold text-slate-100">
                        {currentAed ? (currentAed / 1000).toFixed(4) : '0.00'}{' '}
                        <span className="text-sm text-slate-400">AED</span> <span>🇦🇪</span>
                      </div>
                    </div>
                  </div>

                  {/* Minimum amount notice */}
                  <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 text-xs text-amber-300">
                    <Info className="h-3.5 w-3.5 flex-shrink-0" />
                    This rate applies only for amounts above 25,000 Rs
                  </div>

                  {/* Updated time */}
                  {rate && (
                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                      <Clock className="h-3.5 w-3.5" />
                      Last updated {formatTimeAgo(rate.updated_at)}
                      {rate.note && <span className="text-slate-600">· {rate.note}</span>}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="mt-3 flex justify-center">
              <button
                onClick={fetchRate}
                disabled={loading}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="mt-12 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <CalculatorSection aedPer1000Inr={currentAed} />
        </section>

        {/* Trust badges */}
        <section className="mt-12 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <TrustBadge icon={<ShieldCheck className="h-5 w-5" />} title="Trusted" sub="Secure transfers" />
            <TrustBadge icon={<Clock className="h-5 w-5" />} title="Daily updates" sub="Fresh rates" />
            <TrustBadge icon={<ShieldCheck className="h-5 w-5" />} title="Best rate" sub="Low fees" />
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 text-center text-xs text-slate-600">
          <p>© {new Date().getFullYear()} Pay Snap. Rates shown are indicative and updated manually.</p>
        </footer>
      </main>

      {showAdmin && (
        <AdminPanel
          onClose={() => setShowAdmin(false)}
          onUpdated={() => {
            fetchRate();
          }}
          currentRate={rate}
        />
      )}
    </div>
  );
}

function TrustBadge({
  icon,
  title,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
      <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 mb-2">
        {icon}
      </div>
      <div className="text-sm font-semibold text-slate-100">{title}</div>
      <div className="text-xs text-slate-500">{sub}</div>
    </div>
  );
}

function CalculatorSection({ aedPer1000Inr }: { aedPer1000Inr: number }) {
  const [mode, setMode] = useState<'aed' | 'inr'>('aed');
  const [amount, setAmount] = useState<string>('1000');

  const numAmount = parseFloat(amount) || 0;
  const inrPerAed = aedPer1000Inr ? 1000 / aedPer1000Inr : 0;
  const aedPerInr = aedPer1000Inr ? aedPer1000Inr / 1000 : 0;

  const result =
    mode === 'aed'
      ? numAmount * inrPerAed
      : numAmount * aedPerInr;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800/50 border border-white/10 p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-5">
        <Calculator className="h-4 w-4 text-emerald-400" />
        <h3 className="text-sm font-semibold text-slate-200">Rate calculator</h3>
      </div>

      <div className="flex gap-2 mb-4 p-1 bg-slate-950/50 rounded-xl border border-white/5">
        <button
          onClick={() => setMode('aed')}
          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
            mode === 'aed'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          I send AED 🇦🇪
        </button>
        <button
          onClick={() => setMode('inr')}
          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
            mode === 'inr'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          They receive INR 🇮🇳
        </button>
      </div>

      <label className="block text-xs text-slate-400 mb-1.5">
        {mode === 'aed' ? 'Amount in AED' : 'Amount in INR'}
      </label>
      <div className="relative mb-4">
        <input
          type="number"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3.5 text-lg font-semibold text-slate-100 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
          placeholder="0.00"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
          {mode === 'aed' ? 'AED 🇦🇪' : 'INR 🇮🇳'}
        </span>
      </div>

      <div className="flex items-center justify-center py-2">
        <ArrowRight className="h-4 w-4 text-slate-600 rotate-90" />
      </div>

      <label className="block text-xs text-slate-400 mb-1.5">
        {mode === 'aed' ? 'Recipient gets (INR)' : 'You send (AED)'}
      </label>
      <div className="relative">
        <div className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-4 py-3.5 text-lg font-semibold text-emerald-300">
          {result.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
        </div>
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-emerald-400/60">
          {mode === 'aed' ? 'INR 🇮🇳' : 'AED 🇦🇪'}
        </span>
      </div>
    </div>
  );
}

const ADMIN_PASSWORD = 'Sidra123';

function AdminPanel({
  onClose,
  onUpdated,
  currentRate,
}: {
  onClose: () => void;
  onUpdated: () => void;
  currentRate: RateRow | null;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState<string>('');
  const [showPass, setShowPass] = useState(false);
  const [passErr, setPassErr] = useState(false);

  const [newRate, setNewRate] = useState<string>(
    currentRate ? Number(currentRate.aed_per_1000_inr).toFixed(2) : '',
  );
  const [note, setNote] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleUnlock = () => {
    if (password === ADMIN_PASSWORD) {
      setUnlocked(true);
      setPassErr(false);
    } else {
      setPassErr(true);
    }
  };

  const handleSave = async () => {
    const parsed = parseFloat(newRate);
    if (isNaN(parsed) || parsed <= 0) {
      setErr('Please enter a valid rate greater than 0.');
      return;
    }
    setSaving(true);
    setErr(null);
    setSaved(false);

    const { error: insErr } = await supabase.from('exchange_rates').insert({
      aed_per_1000_inr: parsed,
      note: note.trim() || null,
    });

    if (insErr) {
      setErr(insErr.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setSaved(true);
    onUpdated();
    setTimeout(() => {
      setSaved(false);
      setNote('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-up">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <Lock className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">
                {unlocked ? 'Update rate' : 'Admin lock'}
              </h3>
              <p className="text-xs text-slate-500">
                {unlocked ? 'Daily manual update' : 'Enter password to continue'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1.5 rounded-lg hover:bg-white/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!unlocked ? (
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPassErr(false);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-11 pr-11 py-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="Enter password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passErr && (
                <p className="mt-2 text-xs text-red-400">Wrong password. Try again.</p>
              )}
            </div>

            <button
              onClick={handleUnlock}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-semibold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
            >
              <Lock className="h-4 w-4" />
              Unlock
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {currentRate && (
              <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                <div className="text-xs text-slate-400 mb-0.5">Current rate</div>
                <div className="text-base font-semibold text-slate-200">
                  {Number(currentRate.aed_per_1000_inr).toFixed(2)} AED = 1000 INR
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Updated {formatDateTime(currentRate.updated_at)}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                New rate (AED per 1000 INR)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-base font-semibold text-slate-100 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="36.50"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                  AED
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                Note <span className="text-slate-600">(optional)</span>
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                placeholder="e.g. Updated for today"
              />
            </div>

            {err && (
              <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {err}
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving || saved}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-60 text-slate-950 font-semibold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Rate updated!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Update rate
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
