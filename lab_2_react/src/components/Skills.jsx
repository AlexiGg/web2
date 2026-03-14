function Skills() {
  const skills = ["SQL", "OSINT", "Google Sheets", "Excel", "Командна робота", "Англійська B1"];
  
  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600">
      <h2 className="text-xl font-bold mb-4 text-blue-600 uppercase">Навички</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span key={skill} className="bg-slate-100 text-slate-700 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-600 hover:text-white hover:scale-105 transition-all cursor-default">
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
export default Skills;