import { useState, useEffect } from 'react';

const BACKEND_URL = 'http://localhost:3001/api/contact';

export default function ContactForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (sessionStorage.getItem('modalShown')) return;
    const timer = setTimeout(() => setIsOpen(true), 10_000);
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
      if (res.ok) { setStatus('success'); setTimeout(handleClose, 1500); }
      else setStatus('error');
    } catch { setStatus('error'); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && handleClose()}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative">
        <button onClick={handleClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl">✕</button>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-5">Зворотній зв'язок</h3>

        {status === 'success' ? (
          <p className="text-green-600 text-center py-6 font-medium">✅ Повідомлення надіслано!</p>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input type="text" name="name" required placeholder="Ім'я" className="w-full border rounded-lg px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 dark:text-slate-100" />
            <input type="email" name="email" required placeholder="Email" className="w-full border rounded-lg px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 dark:text-slate-100" />
            <input type="tel" name="phone" placeholder="Телефон" className="w-full border rounded-lg px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 dark:text-slate-100" />
            <textarea name="message" required rows={4} placeholder="Повідомлення…" className="w-full border rounded-lg px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 dark:text-slate-100 resize-none" />
            {status === 'error' && <p className="text-red-500 text-sm">❌ Помилка. Перевірте що бекенд запущений.</p>}
            <button type="submit" disabled={status === 'sending'} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm">
              {status === 'sending' ? 'Надсилання…' : 'Відправити'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}