import { GraduationCap, Check, Phone } from 'lucide-react';
import clsx from 'clsx';
import { useActiveStudent } from '../contexts/ActiveStudentContext';
import { parentProfile } from '../mocks/dashboardData';

interface StudentsViewProps {
  onSelectStudent: () => void;
}

export function StudentsView({ onSelectStudent }: StudentsViewProps) {
  const { activeStudent, students, setActiveStudentId } = useActiveStudent();

  // Group by school
  const schools = Array.from(new Set(students.map((s) => s.school.name)));
  const totalFamilyDue = students.reduce((sum, s) => sum + s.totalRemaining, 0);

  return (
    <div className="pt-20 px-4 pb-28">
      <h1 className="text-2xl font-extrabold text-slate-navy mb-6 tracking-tight">Espace Famille</h1>

      {/* Parent Profile Card */}
      <div className="mb-6 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
          <Phone className="w-5 h-5 text-slate-500" />
        </div>
        <div>
          <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Compte Parent</span>
          <span className="block text-sm font-extrabold text-slate-navy">{parentProfile.phone}</span>
        </div>
      </div>

      {/* Overview Card */}
      <section className="rounded-2xl p-6 bg-slate-navy shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emeraude/20 blur-2xl pointer-events-none rounded-full"></div>
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
                {schoolStudents.map((child) => {
                  const isActive = child.id === activeStudent.id;
                  return (
                    <li key={child.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveStudentId(child.id);
                          onSelectStudent();
                        }}
                        className={clsx(
                          "w-full flex items-center justify-between gap-4 p-4 rounded-2xl border text-left shadow-sm transition-colors active:scale-[0.98]",
                          isActive 
                            ? "border-emeraude bg-emeraude/5" 
                            : "border-slate-200 bg-white hover:border-slate-300"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={clsx(
                            "w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0",
                            isActive ? "bg-emeraude text-white" : "bg-slate-100 text-slate-600"
                          )}>
                            {child.initials}
                          </div>
                          <div>
                            <span className="block text-sm font-bold text-slate-navy">{child.name}</span>
                            <span className="block text-xs font-medium text-slate-500 mt-0.5">Classe : {child.grade} · Année {child.school.academicYear}</span>
                            <span className="block text-sm font-extrabold text-slate-800 mt-1">{child.totalRemaining.toLocaleString('fr-FR')} FCFA</span>
                          </div>
                        </div>
                        
                        {isActive ? (
                          <div className="w-8 h-8 rounded-full bg-emeraude flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4 text-white" strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="px-3 py-1.5 rounded-full border border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
                            Choisir
                          </div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
