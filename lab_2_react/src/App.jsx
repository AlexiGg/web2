import Header from './components/Header';
import Objective from './components/Objective';
import Experience from './components/Experience';
import Education from './components/Education';
import Skills from './components/Skills';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 flex justify-center">
      <div className="max-w-3xl w-full space-y-6">
        <Header />
        <div className="p-4 md:p-0 space-y-6">
          <Objective />
          <Experience />
          <Education />
          <Skills />
        </div>
      </div>
    </div>
  );
}

export default App;