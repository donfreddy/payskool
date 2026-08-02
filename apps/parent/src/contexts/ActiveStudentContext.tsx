import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Student } from '../types/models';
import { students as allStudents } from '../mocks/dashboardData';

interface ActiveStudentContextType {
  activeStudent: Student;
  students: Student[];
  setActiveStudentId: (id: string) => void;
}

const ActiveStudentContext = createContext<ActiveStudentContextType | undefined>(undefined);

export function ActiveStudentProvider({ children }: { children: ReactNode }) {
  const [activeStudentId, setActiveStudentId] = useState<string>(allStudents[0]!.id);

  const activeStudent = allStudents.find((s) => s.id === activeStudentId) || allStudents[0]!;

  return (
    <ActiveStudentContext.Provider value={{ activeStudent, students: allStudents, setActiveStudentId }}>
      {children}
    </ActiveStudentContext.Provider>
  );
}

export function useActiveStudent() {
  const context = useContext(ActiveStudentContext);
  if (context === undefined) {
    throw new Error('useActiveStudent must be used within an ActiveStudentProvider');
  }
  return context;
}
