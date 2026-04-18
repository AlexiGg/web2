import { useState, useEffect } from 'react';

// підписи для полів
const LABELS = {
  userAgent:  'User Agent',
  platform:   'Платформа',
  language:   'Мова',
  cookiesOn:  'Cookies',
  screenRes:  'Роздільна здатність',
  colorDepth: 'Глибина кольору',
  online:     'Онлайн',
  timezone:   'Часовий пояс',
};

// збір інформації про систему
function collectSysInfo() {
  return {
    userAgent:  navigator.userAgent,
    platform:   navigator.platform,
    language:   navigator.language,
    cookiesOn:  navigator.cookieEnabled ? 'Так' : 'Ні',
    screenRes:  `${screen.width} × ${screen.height}`,
    colorDepth: `${screen.colorDepth} bit`,
    online:     navigator.onLine ? 'Так' : 'Ні',
    timezone:   Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

export default function Footer() {

  // стан з даними
  const [sysInfo, setSysInfo] = useState({});

  useEffect(() => {
    const info = collectSysInfo();

    // зберігаємо в localStorage
    localStorage.setItem('sysInfo', JSON.stringify(info));

    // оновлюємо state
    setSysInfo(info);

  }, []);

  return (
    <footer className="bg-white dark:bg-slate-800 border rounded-2xl shadow p-6 mt-4">

      <h2 className="text-xs font-bold uppercase mb-4">
        Системна інформація
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

        {/* вивід ключ-значення */}
        {Object.entries(sysInfo).map(([key, val]) => (
          <div key={key} className="flex gap-2 text-sm">

            {/* назва */}
            <span className="font-semibold min-w-[160px]">
              {LABELS[key] ?? key}:
            </span>

            {/* значення */}
            <span className="break-all">{val}</span>
          </div>
        ))}
      </div>
    </footer>
  );
}