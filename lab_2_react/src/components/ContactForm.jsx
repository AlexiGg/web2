import { useState, useEffect } from 'react';

const BACKEND_URL = 'http://localhost:3001/api/contact';

export default function ContactForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (sessionStorage.getItem('modalShown')) return;
    const timer = setTimeout(() => setIsOpen(true), 60_000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('modalShown', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    const data = Object.fromEntries(new FormData(e.target).entries());
    try {
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus('success');
        setTimeout(handleClose, 2000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

        {/* Шапка модалки */}
        <div className="bg-blue-600 px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg">Зворотній зв'язок</h3>
            <p className="text-blue-200 text-sm mt-0.5">Відповім протягом доби</p>
          </div>
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5">
          {status === 'success' ? (
            /* Успіх */
            <div className="flex flex-col items-center py-8 gap-3">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center text-3xl">
                ✓
              </div>
              <p className="font-semibold text-slate-800 dark:text-slate-100 text-lg">Надіслано!</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm text-center">
                Дякую за повідомлення. Незабаром зв'яжусь з вами.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Ім'я */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Ім'я *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Іван Петренко"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="ivan@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Телефон */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Телефон
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+380 XX XXX XXXX"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Повідомлення */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Повідомлення *
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Ваше повідомлення…"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                />
              </div>

              {/* Помилка */}
              {status === 'error' && (
                <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2.5">
                  <span className="text-red-500 text-sm">⚠</span>
                  <p className="text-red-600 dark:text-red-400 text-sm">Помилка. Спробуйте ще раз.</p>
                </div>
              )}

              {/* Кнопка */}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg text-sm transition-all mt-1"
              >
                {status === 'sending' ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Надсилання…
                  </span>
                ) : 'Відправити'}
              </button>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}