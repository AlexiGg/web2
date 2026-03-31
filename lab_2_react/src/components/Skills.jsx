function Skills() {
  const skills = ["SQL", "OSINT", "Google Sheets", "Excel", "Командна робота", "Англійська B1"];
  
  return (
    <section className="
  bg-white dark:bg-slate-800
  border-l-4 border-blue-600
  p-6 rounded-xl shadow-md mb-6
">
  <h2 className="text-blue-600 dark:text-blue-400 font-bold uppercase mb-4">
    Навички
  </h2>

  <div className="flex flex-wrap gap-2">
    {["SQL", "OSINT", "Google Sheets", "Excel", "Командна робота", "Англійська B1"].map(skill => (
      <span
        key={skill}
        className="
          bg-slate-100 dark:bg-slate-700
          text-slate-700 dark:text-slate-200
          px-3 py-1 rounded-lg text-sm
        "
      >
        {skill}
      </span>
    ))}
  </div>
</section>
  );
}
export default Skills;