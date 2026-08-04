export const FAKE_USER = {
  id: "u_1",
  name: "Marc K.",
  role: "PROMOTER",
};

export const FAKE_SCHOOLS = [
  { id: "cs-sainte-marie", name: "CS Sainte-Marie (Douala - Akwa)", logo: "🏫" },
  { id: "lycee-saint-paul", name: "Lycée Saint-Paul (Yaoundé)", logo: "🏛️" },
  { id: "maternelle-bisounours", name: "Maternelle les Bisounours", logo: "🧸" },
];

export const FAKE_METRICS = {
  totalCollection: 45200000,
  collectionRate: 78,
  remainingAmount: 12800000,
  studentsUpToDate: 412,
  totalStudents: 520,
};

export const FAKE_RECENT_PAYMENTS = [
  {
    id: "txn_1",
    student: "Marc K. Junior",
    class: "6ème A",
    amount: 50000,
    method: "Orange Money",
    receipt: "#8921",
    status: "SUCCÈS",
    date: "2026-08-04T10:30:00Z",
  },
  {
    id: "txn_2",
    student: "Sonia Talla",
    class: "3ème B",
    amount: 35000,
    method: "MTN MoMo",
    receipt: "#8920",
    status: "SUCCÈS",
    date: "2026-08-04T10:15:00Z",
  },
  {
    id: "txn_3",
    student: "Erick Kouam",
    class: "Terminale C",
    amount: 100000,
    method: "Espèces Guichet",
    receipt: "#8919",
    status: "SUCCÈS",
    date: "2026-08-04T09:45:00Z",
  },
  {
    id: "txn_4",
    student: "Sarah Diop",
    class: "4ème C",
    amount: 40000,
    method: "Wave",
    receipt: "#8918",
    status: "SUCCÈS",
    date: "2026-08-04T09:10:00Z",
  },
];

export const FAKE_LIVE_FEED = [
  {
    id: "feed_1",
    message: "Nouveau paiement MoMo de 50.000 FCFA validé (Orange)",
    timeAgo: "Il y a 2 min",
  },
  {
    id: "feed_2",
    message: "Reçu de caisse #8919 imprimé par Caissier A",
    timeAgo: "Il y a 15 min",
  },
  {
    id: "feed_3",
    message: "Alerte impayé Tranche 2 envoyée à 14 parents via WhatsApp",
    timeAgo: "Il y a 1 heure",
  },
];
