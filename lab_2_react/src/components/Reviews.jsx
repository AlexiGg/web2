import { useState, useEffect } from 'react';

// ID поста (для API)
const VARIANT = 10;

export default function Reviews() {
  // стан
  const [comments, setComments] = useState([]); // список відгуків
  const [loading, setLoading]   = useState(true); // стан завантаження
  const [error, setError]       = useState(null); // помилка

  useEffect(() => {
    async function fetchComments() {
      try {
        // запит до API
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${VARIANT}/comments`
        );

        // перевірка відповіді
        if (!res.ok) throw new Error('Помилка мережі');

        const data = await res.json();

        // зберігаємо дані
        setComments(data);

      } catch (err) {
        // зберігаємо помилку
        setError(err.message);

      } finally {
        // вимикаємо loading
        setLoading(false);
      }
    }

    fetchComments();
  }, []);

  return (
    <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow p-6">
      
      {/* заголовок */}
      <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4">
        Відгуки роботодавців
      </h2>

      {/* loading */}
      {loading && (
        <p className="text-slate-400 italic text-sm">
          Завантаження відгуків…
        </p>
      )}

      {/* помилка */}
      {error && (
        <p className="text-red-500 text-sm">
          Помилка: {error}
        </p>
      )}

      {/* список відгуків */}
      <div className="space-y-4">
        {comments.map(comment => (
          <div
            key={comment.id} // унікальний ключ
            className="border border-slate-100 dark:border-slate-700 rounded-xl p-4 hover:-translate-y-0.5 transition-transform"
          >
            {/* ім’я */}
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-0.5">
              {comment.name}
            </p>

            {/* email */}
            <p className="text-xs text-slate-400 mb-2">
              {comment.email}
            </p>

            {/* текст */}
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {comment.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}