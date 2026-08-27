import type { AcademicYear } from "@/core/mocks/academic-years-db";
import type { FakeStudent } from "@/core/mocks/fake-data";
import { addStudent, fetchStudents } from "@/core/mocks/students-db";

/**
 * Couche d'accès simulée du domaine Élèves — à remplacer par les appels
 * réels vers `apps/api` (GET /students, POST /students) sans toucher aux écrans.
 * `year` filtre l’année académique (année passée = lecture seule).
 */

export function listStudents(_schoolId: string, year?: AcademicYear): Promise<FakeStudent[]> {
  return fetchStudents(year);
}

export function createStudent(_schoolId: string, student: FakeStudent): Promise<FakeStudent> {
  addStudent(student);
  return Promise.resolve(student);
}