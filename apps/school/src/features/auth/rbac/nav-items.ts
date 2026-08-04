import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  FileText, 
  BarChart, 
  Settings 
} from "lucide-react";

export type Role = "PROMOTER" | "ACCOUNTANT" | "CASHIER";

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  allowedRoles: Role[];
}

export const getNavItems = (role: Role, schoolId: string): NavItem[] => {
  const routes: NavItem[] = [
    {
      title: "Tableau de bord",
      href: `/${schoolId}/dashboard`,
      icon: LayoutDashboard,
      allowedRoles: ["PROMOTER", "ACCOUNTANT", "CASHIER"],
    },
    {
      title: "Élèves & Inscriptions",
      href: `/${schoolId}/students`,
      icon: Users,
      allowedRoles: ["PROMOTER", "ACCOUNTANT", "CASHIER"],
    },
    {
      title: "Guichet Caisse",
      href: `/${schoolId}/cashier`,
      icon: Wallet,
      allowedRoles: ["PROMOTER", "CASHIER"],
    },
    {
      title: "Grilles Tarifaires",
      href: `/${schoolId}/fee-plans`,
      icon: FileText,
      allowedRoles: ["PROMOTER", "ACCOUNTANT"],
    },
    {
      title: "Rapports Groupe",
      href: `/${schoolId}/reports`,
      icon: BarChart,
      allowedRoles: ["PROMOTER", "ACCOUNTANT"],
    },
    {
      title: "Paramètres",
      href: `/${schoolId}/settings`,
      icon: Settings,
      allowedRoles: ["PROMOTER"],
    },
  ];

  return routes.filter((route) => route.allowedRoles.includes(role));
};
