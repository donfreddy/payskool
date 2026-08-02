import { GraduationCap, ArrowRight } from 'lucide-react';
import { useActiveStudent } from '../contexts/ActiveStudentContext';

interface StudentsViewProps {
  onSelectStudent: () => void;
}

export function StudentsView({ onSelectStudent }: StudentsViewProps) {
  const { students, setActiveStudentId } = useActiveStudent();

  // Group by school
  const schools = Array.from(new Set(students.map((s) => s.school.name)));
  const totalFamilyDue = students.reduce((sum, s) => sum + s.totalRemaining, 0);

  return (
    <div className="pt-20 px-4 pb-28">
      <h1 className="text-2xl font-extrabold text-slate-navy mb-6 tracking-tight">Espace Famille</h1>

      {/* Overview Card */}
      <section className="rounded-2xl p-6 bg-slate-navy shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emeraude/20 blur-[40px] pointer-events-none rounded-full"></div>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Total famille à payer</p>
        <p className="text-3xl font-extrabold text-white mb-2">{totalFamilyDue.toLocaleString('fr-FR')} FCFA</p>
        <p className="text-sm font-medium text-slate-300">{students.length} enfants inscrits</p>
      </section>

      {/* List by School */}
      <div className="space-y-8">
        {schools.map((schoolName) => {
          const schoolStudents = students.filter(s => s.school.name === schoolName);
          
          return (
            <section key={schoolName}>
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-tight text-slate-600 uppercase">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                {schoolName}
              </h2>
              <ul className="space-y-3">
                {schoolStudents.map((child) => (
                  <li key={child.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 flex items-center gap-4 border-b border-slate-100">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0">
                        {child.initials}
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-slate-navy">{child.name}</span>
                        <span className="block text-xs font-medium text-slate-500 mt-0.5">Classe : {child.grade}</span>
                        <span className="block text-sm font-extrabold text-slate-800 mt-1">{child.totalRemaining.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setActiveStudentId(child.id);
                        onSelectStudent();
                      }}
                      className="w-full p-3 flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors active:bg-slate-100"
                    >
                      Voir le dossier de {child.name.split(' ')[0]}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
