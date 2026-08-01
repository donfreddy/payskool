import { prisma } from './client.js'
import { UserRole, WorkspacePlan } from '@prisma/client'

// =============================================================================
// PAYSKOOL — Dev Seed Data
// Crée un workspace de démo avec une école, des utilisateurs et des élèves
// =============================================================================

async function main() {
  console.log('🌱 Seeding PAYSKOOL database...')

  // ---- 1. Owner (Promoteur) ----
  const owner = await prisma.user.upsert({
    where: { email: 'owner@payskool-demo.com' },
    update: {},
    create: {
      email: 'owner@payskool-demo.com',
      emailVerified: true,
      passwordHash: '$2b$12$DEMO_HASH_REPLACE_IN_PROD', // bcrypt hash
      firstName: 'Kouassi',
      lastName: 'N\'Goran',
      globalRole: UserRole.OWNER,
    },
  })
  console.log('✅ Owner created:', owner.email)

  // ---- 2. Workspace ----
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'groupe-excellence' },
    update: {},
    create: {
      name: 'Groupe Scolaire Excellence',
      slug: 'groupe-excellence',
      ownerId: owner.id,
      plan: WorkspacePlan.TRIAL,
      maxSchools: 3,
      maxStudents: 500,
      trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  })
  console.log('✅ Workspace created:', workspace.name)

  // ---- 3. School ----
  const school = await prisma.school.upsert({
    where: { id: 'seed-school-id-001' },
    update: {},
    create: {
      id: 'seed-school-id-001',
      workspaceId: workspace.id,
      name: 'Collège Sainte-Marie d\'Abidjan',
      slug: 'sainte-marie-abidjan',
      type: 'SECONDAIRE',
      city: 'Abidjan',
      countryCode: 'CI',
      currency: 'XOF',
      academicYear: '2026-2027',
      timezone: 'Africa/Abidjan',
    },
  })
  console.log('✅ School created:', school.name)

  // ---- 4. School Admin ----
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sainte-marie.edu.ci' },
    update: {},
    create: {
      email: 'admin@sainte-marie.edu.ci',
      emailVerified: true,
      passwordHash: '$2b$12$DEMO_HASH_REPLACE_IN_PROD',
      firstName: 'Aminata',
      lastName: 'Traoré',
      globalRole: UserRole.SCHOOL_ADMIN,
    },
  })

  await prisma.membership.upsert({
    where: { userId_schoolId: { userId: admin.id, schoolId: school.id } },
    update: {},
    create: {
      userId: admin.id,
      schoolId: school.id,
      role: UserRole.SCHOOL_ADMIN,
    },
  })
  console.log('✅ Admin created:', admin.email)

  // ---- 5. Cashier ----
  const cashier = await prisma.user.upsert({
    where: { email: 'caissier@sainte-marie.edu.ci' },
    update: {},
    create: {
      email: 'caissier@sainte-marie.edu.ci',
      emailVerified: true,
      passwordHash: '$2b$12$DEMO_HASH_REPLACE_IN_PROD',
      firstName: 'Hervé',
      lastName: 'Kouamé',
      globalRole: UserRole.CASHIER,
    },
  })

  await prisma.membership.upsert({
    where: { userId_schoolId: { userId: cashier.id, schoolId: school.id } },
    update: {},
    create: {
      userId: cashier.id,
      schoolId: school.id,
      role: UserRole.CASHIER,
    },
  })
  console.log('✅ Cashier created:', cashier.email)

  // ---- 6. Fee Structure: 6ème ----
  const feeStructure = await prisma.feeStructure.upsert({
    where: {
      schoolId_classLevel_academicYear_name: {
        schoolId: school.id,
        classLevel: '6ème',
        academicYear: '2026-2027',
        name: 'Frais de Scolarité 6ème 2026-2027',
      },
    },
    update: {},
    create: {
      schoolId: school.id,
      name: 'Frais de Scolarité 6ème 2026-2027',
      classLevel: '6ème',
      academicYear: '2026-2027',
      totalAmount: 350000_00, // 350,000 XOF en centimes
      feeType: 'ONE_TIME',
    },
  })
  console.log('✅ Fee Structure created:', feeStructure.name)

  // ---- 7. Fee Installments ----
  const installments = [
    { label: 'Tranche 1 — Inscription', amount: 100000_00, dueDate: '2026-09-15', sortOrder: 0 },
    { label: 'Tranche 2 — 1er Trimestre', amount: 125000_00, dueDate: '2026-11-15', sortOrder: 1 },
    { label: 'Tranche 3 — 2ème Trimestre', amount: 125000_00, dueDate: '2027-02-15', sortOrder: 2 },
  ]

  for (const inst of installments) {
    await prisma.feeInstallment.create({
      data: {
        feeStructureId: feeStructure.id,
        schoolId: school.id,
        label: inst.label,
        amount: BigInt(inst.amount),
        dueDate: new Date(inst.dueDate),
        sortOrder: inst.sortOrder,
      },
    }).catch(() => null) // ignore if already exists
  }
  console.log('✅ Fee Installments created')

  // ---- 8. Demo Student ----
  const student = await prisma.student.upsert({
    where: {
      schoolId_matricule_academicYear: {
        schoolId: school.id,
        matricule: 'SM-6E-001',
        academicYear: '2026-2027',
      },
    },
    update: {},
    create: {
      schoolId: school.id,
      matricule: 'SM-6E-001',
      firstName: 'Marc',
      lastName: 'Koné',
      gender: 'M',
      classLevel: '6ème',
      academicYear: '2026-2027',
      previousBalance: BigInt(0),
    },
  })
  console.log('✅ Student created:', `${student.firstName} ${student.lastName}`)

  // ---- 9. Notification Settings ----
  await prisma.notificationSettings.upsert({
    where: { schoolId: school.id },
    update: {},
    create: {
      schoolId: school.id,
    },
  })

  console.log('\n🎉 Seed completed successfully!')
  console.log('━'.repeat(50))
  console.log('🔑 Login credentials (dev only):')
  console.log('   Owner:   owner@payskool-demo.com')
  console.log('   Admin:   admin@sainte-marie.edu.ci')
  console.log('   Cashier: caissier@sainte-marie.edu.ci')
  console.log('   Password: CHANGE_ME (bcrypt hash in seed)')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
