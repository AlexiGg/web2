import { useState, useEffect } from 'react';

const FORMSPREE_URL = 'https://formspree.io/f/mjgprwwv';

export default function ContactForm() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('modalShown')) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 60_000); 

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('modalShown', 'true');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative animate-[slideUp_0.3s_ease]">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl leading-none"
          aria-label="Закрити"
        >
          ✕
        </button>

        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-5">
          Зворотній зв'язок
        </h3>

        <form
          action={FORMSPREE_URL}
          method="POST"
          onSubmit={handleClose}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Ім'я
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Іван Петренко"
              className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="ivan@example.com"
              className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Номер телефону
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="+380 XX XXX XXXX"
              className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Повідомлення
            </label>
            <textarea
              name="message"
              required
              rows={4}
              placeholder="Ваше повідомлення…"
              className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition"
          >
            Відправити
          </button>
        </form>
      </div>
    </div>
  );
}