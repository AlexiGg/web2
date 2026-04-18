import { useState, useEffect } from 'react';

const BACKEND_URL = 'http://localhost:3001/api/contact';

export default function ContactForm() {

  // чи відкрита модалка
  const [isOpen, setIsOpen] = useState(false);

  // стан форми: idle | sending | success | error
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    // якщо вже показували — не показуємо знову
    if (sessionStorage.getItem('modalShown')) return;

    // відкрития форми
    const timer = setTimeout(() => setIsOpen(true), 60_000);

    // очистка таймера
    return () => clearTimeout(timer);
  }, []);

  // закриття модалки
  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('modalShown', 'true');
  };

  // відправка форми
  const handleSubmit = async (e) => {
    e.preventDefault(); // не перезавантажувати сторінку
    setStatus('sending');

    // зібрати дані форми в об'єкт
    const data = Object.fromEntries(new FormData(e.target).entries());

    try {
      // POST-запит на сервер
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus('success');
        setTimeout(handleClose, 1500);
      } else {
        setStatus('error');
      }

    } catch {
      setStatus('error'); // сервер недоступний
    }
  };

  // якщо закрито — нічого не рендеримо
  if (!isOpen) return null;

  return (
    // затемнений фон
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      // клік по фону = закрити
      onClick={e => e.target === e.currentTarget && handleClose()}
    >

      {/* модальне вікно */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative">

        {/* кнопка закриття */}
        <button onClick={handleClose} className="absolute top-4 right-4">✕</button>

        {/* заголовок */}
        <h3>Зворотній зв'язок</h3>

        {/* успіх */}
        {status === 'success' ? (
          <p>Повідомлення надіслано!</p>
        ) : (
          // форма
          <form onSubmit={handleSubmit}>

            {/* ім’я */}
            <input type="text" name="name" required placeholder="Ім'я" />

            {/* email */}
            <input type="email" name="email" required placeholder="Email" />

            {/* телефон (необов'язково) */}
            <input type="tel" name="phone" placeholder="Телефон" />

            {/* повідомлення */}
            <textarea name="message" required rows={4} />

            {/* помилка */}
            {status === 'error' && (
              <p>Бекенд не працює</p>
            )}

            {/* кнопка */}
            <button type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Надсилання…' : 'Відправити'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}