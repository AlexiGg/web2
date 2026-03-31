import { useState, useEffect } from 'react';

const VARIANT = 10;

export default function Reviews() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${VARIANT}/comments`
        );
        if (!res.ok) throw new Error('Помилка мережі');
        const data = await res.json();
        setComments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, []);

  return (
    <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow p-6">
      <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4">
        Відгуки роботодавців
      </h2>

      {loading && (
        <p className="text-slate-400 italic text-sm">Завантаження відгуків…</p>
      )}
      {error && (
        <p className="text-red-500 text-sm">Помилка: {error}</p>
      )}

      <div className="space-y-4">
        {comments.map(comment => (
          <div
            key={comment.id}
            className="border border-slate-100 dark:border-slate-700 rounded-xl p-4 hover:-translate-y-0.5 transition-transform"
          >
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-0.5">
              {comment.name}
            </p>
            <p className="text-xs text-slate-400 mb-2">{comment.email}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {comment.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}