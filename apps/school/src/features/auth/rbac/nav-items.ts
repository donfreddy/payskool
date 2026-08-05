import {
  LayoutDashboard,
  Wallet,
  Users,
  List,
  Upload,
  ArrowRightLeft,
  ReceiptText,
  FileText,
  CalendarRange,
  BadgePercent,
  TrendingUp,
  PieChart,
  AlertTriangle,
  BarChart3,
  Bell,
  SlidersHorizontal,
  History,
  UserCheck,
  Building2,
  UserCog,
  School,
  CreditCard,
  CircleDollarSign,
  type LucideIcon,
} from "lucide-react";

// SUPER_ADMIN volontairement absent : sans membership sur une école (cf. doc apps/platform),
// un accès staff passe par l'impersonation — équivalent OWNER le temps de la session,
// jamais un rôle distinct dans ce menu.
export type Role = "OWNER" | "SCHOOL_ADMIN" | "CASHIER";

export interface NavItem {
  title: string;
  href?: string; // absent = groupe conteneur, déplié en sous-menu
  icon: LucideIcon;
  allowedRoles: Role[];
  requiresMultiSchool?: boolean; // visible seulement si le Workspace a ≥ 2 écoles
  items?: NavItem[];
}

export interface NavSection {
  heading: string;
  items: NavItem[];
}

export interface GetNavSectionsOptions {
  role: Role;
  schoolId: string;
  hasMultipleSchools?: boolean;
}

const buildNavSections = (schoolId: string): NavSection[] => [
  {
    heading: "Menu Principal",
    items: [
      {
        title: "Tableau de bord",
        href: `/${schoolId}/dashboard`,
        icon: LayoutDashboard,
        allowedRoles: ["OWNER", "SCHOOL_ADMIN"],
      },
      {
        title: "Guichet Caisse",
        href: `/${schoolId}/cashier`,
        icon: Wallet,
        allowedRoles: ["OWNER", "SCHOOL_ADMIN", "CASHIER"],
      },
      {
        title: "Élèves & Inscriptions",
        icon: Users,
        allowedRoles: ["OWNER", "SCHOOL_ADMIN"],
        items: [
          {
            title: "Liste des élèves",
            href: `/${schoolId}/students`,
            icon: List,
            allowedRoles: ["OWNER", "SCHOOL_ADMIN"],
          },
          {
            title: "Importer (CSV/Excel)",
            href: `/${schoolId}/students/import`,
            icon: Upload,
            allowedRoles: ["OWNER", "SCHOOL_ADMIN"],
          },
        ],
      },
    ],
  },
  {
    heading: "Finance",
    items: [
      {
        title: "Encaissements",
        href: `/${schoolId}/transactions`,
        icon: ArrowRightLeft,
        allowedRoles: ["OWNER", "SCHOOL_ADMIN"],
      },
      {
        title: "Reçus",
        href: `/${schoolId}/receipts`,
        icon: ReceiptText,
        allowedRoles: ["OWNER", "SCHOOL_ADMIN", "CASHIER"],
      },
      {
        title: "Grilles Tarifaires",
        icon: FileText,
        allowedRoles: ["OWNER", "SCHOOL_ADMIN"],
        items: [
          {
            title: "Grilles par classe & échéances",
            href: `/${schoolId}/fees/structures`,
            icon: CalendarRange,
            allowedRoles: ["OWNER", "SCHOOL_ADMIN"],
          },
          {
            title: "Bourses & réductions individuelles",
            href: `/${schoolId}/fees/discounts`,
            icon: BadgePercent,
            allowedRoles: ["OWNER", "SCHOOL_ADMIN"],
          },
        ],
      },
      {
        title: "Rapports & Recouvrement",
        icon: TrendingUp,
        allowedRoles: ["OWNER", "SCHOOL_ADMIN"],
        items: [
          {
            title: "Taux de recouvrement",
            href: `/${schoolId}/reports/collection`,
            icon: PieChart,
            allowedRoles: ["OWNER", "SCHOOL_ADMIN"],
          },
          {
            title: "Impayés & relances",
            href: `/${schoolId}/reports/overdue`,
            icon: AlertTriangle,
            allowedRoles: ["OWNER", "SCHOOL_ADMIN"],
          },
        ],
      },
    ],
  },
  {
    heading: "Communication",
    items: [
      {
        title: "Relances & Notifications",
        icon: Bell,
        allowedRoles: ["OWNER", "SCHOOL_ADMIN"],
        items: [
          {
            title: "Règles de relance",
            href: `/${schoolId}/notifications/rules`,
            icon: SlidersHorizontal,
            allowedRoles: ["OWNER", "SCHOOL_ADMIN"],
          },
          {
            title: "Historique d'envoi",
            href: `/${schoolId}/notifications/history`,
            icon: History,
            allowedRoles: ["OWNER", "SCHOOL_ADMIN"],
          },
        ],
      },
    ],
  },
  {
    heading: "Administration",
    items: [
      {
        title: "Membres & Équipe",
        href: `/${schoolId}/members`,
        icon: UserCheck,
        allowedRoles: ["OWNER", "SCHOOL_ADMIN"],
      }
    ],
  },
  {
    heading: "Paramètres",
    items: [
      {
        title: "Profil",
        href: `/${schoolId}/settings/profile`,
        icon: UserCog,
        allowedRoles: ["OWNER", "SCHOOL_ADMIN", "CASHIER"],
      },
      {
        title: "École",
        href: `/${schoolId}/settings/school`,
        icon: School,
        allowedRoles: ["OWNER", "SCHOOL_ADMIN"],
      },
      {
        title: "Intégrations Paiement",
        href: `/${schoolId}/settings/payment-providers`,
        icon: CreditCard,
        allowedRoles: ["OWNER"],
      },
      {
        title: "Facturation Payskool",
        href: `/${schoolId}/settings/billing`,
        icon: CircleDollarSign,
        allowedRoles: ["OWNER"],
      },
    ],
  },
];

function filterItems(
  items: NavItem[],
  ctx: Pick<GetNavSectionsOptions, "role" | "hasMultipleSchools">
): NavItem[] {
  return items
    .filter((item) => item.allowedRoles.includes(ctx.role))
    .filter((item) => !item.requiresMultiSchool || ctx.hasMultipleSchools)
    .map((item) =>
      item.items ? { ...item, items: filterItems(item.items, ctx) } : item
    )
    .filter((item) => item.href || (item.items && item.items.length > 0));
}

export const getNavSections = ({
  role,
  schoolId,
  hasMultipleSchools = false,
}: GetNavSectionsOptions): NavSection[] =>
  buildNavSections(schoolId)
    .map((section) => ({
      ...section,
      items: filterItems(section.items, { role, hasMultipleSchools }),
    }))
    .filter((section) => section.items.length > 0);

export const getNavItems = (options: GetNavSectionsOptions): NavItem[] =>
  getNavSections(options).flatMap((section) => section.items);