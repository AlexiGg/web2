import { useState, useEffect } from 'react';
 
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
  const [sysInfo, setSysInfo] = useState({});
 
  useEffect(() => {
    const info = collectSysInfo();
    localStorage.setItem('sysInfo', JSON.stringify(info));
    setSysInfo(info);
  }, []);
 
  return (
    <footer className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow p-6 mt-4">
      <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4">
        Системна інформація
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {Object.entries(sysInfo).map(([key, val]) => (
          <div key={key} className="flex gap-2 text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-300 min-w-[160px]">
              {LABELS[key] ?? key}:
            </span>
            <span className="text-slate-500 dark:text-slate-400 break-all">{val}</span>
          </div>
        ))}
      </div>
    </footer>
  );
}