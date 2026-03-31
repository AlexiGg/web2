import { useState, useEffect } from 'react';
import Header from './components/Header';
import Objective from './components/Objective';
import Experience from './components/Experience';
import Education from './components/Education';
import Skills from './components/Skills';
import Footer from './components/Footer';
import Reviews from './components/Reviews';
import ContactForm from './components/ContactForm';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      setTheme(saved);
    } else {
      const hour = new Date().getHours();
      setTheme(hour >= 7 && hour < 21 ? 'light' : 'dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Кнопка перемикання теми */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-full shadow-md text-sm font-medium hover:bg-blue-50 dark:hover:bg-slate-600 transition-all"
        >
          {theme === 'dark' ? '☀ Денна' : '☾ Нічна'}
        </button>
      </div>

      <div className="py-12 px-4 flex justify-center font-sans">
        <div className="max-w-3xl w-full space-y-8">
          <Header />
          <main className="space-y-6">
            <Objective />
            <Experience />
            <Education />
            <Skills />
            <Reviews />
          </main>
          <Footer />
        </div>
      </div>

      {/* Модальне вікно (з'являється через 1 хвилину) */}
      <ContactForm />
    </div>
  );
}

export default App;