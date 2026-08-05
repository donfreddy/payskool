import * as React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@payskool/ui/components/ui/breadcrumb";

export interface BreadcrumbLinkData {
  label: string;
  href?: string;
  icon?: React.ElementType;
}

interface PageHeaderProps {
  breadcrumbs: BreadcrumbLinkData[];
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  greetingName?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ breadcrumbs, title, subtitle, greetingName, actions }: PageHeaderProps) {
  // Déterminer le bonjour ou bonsoir en fonction de l'heure locale
  const getGreeting = () => {
    // Note: This relies on the client's local time
    const hour = new Date().getHours();
    if (hour >= 18) return "Bonsoir";
    return "Bonjour";
  };

  const displayTitle = greetingName ? `${getGreeting()} ${greetingName}` : title;

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <Breadcrumb className="mb-2">
          <BreadcrumbList className="text-xs font-medium text-muted-foreground">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <React.Fragment key={crumb.label}>
                  <BreadcrumbItem>
                    {isLast || !crumb.href ? (
                      <BreadcrumbPage className="flex items-center gap-1.5 font-medium text-muted-foreground">
                        {crumb.icon && <crumb.icon className="h-3.5 w-3.5" />}
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={crumb.href} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                          {crumb.icon && <crumb.icon className="h-3.5 w-3.5" />}
                          {crumb.label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
        
        {displayTitle && (
          <h1 suppressHydrationWarning className="font-display text-3xl font-bold tracking-tight lg:text-[34px] text-foreground">
            {displayTitle}
          </h1>
        )}
        
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
