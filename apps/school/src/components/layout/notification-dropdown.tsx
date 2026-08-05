"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { CreditCard, AlertTriangle, UserPlus, Receipt, Download } from "lucide-react";

import { FAKE_NOTIFICATIONS } from "@/core/mocks/fake-data";
import { cn } from "@payskool/ui/utils";
import { Badge } from "@payskool/ui/components/ui/badge";
import { Button, buttonVariants } from "@payskool/ui/components/ui/button";
import { Card, CardFooter } from "@payskool/ui/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@payskool/ui/components/ui/popover";

const iconMap = {
  CreditCard,
  AlertTriangle,
  UserPlus,
  Receipt,
  Download,
};

function formatDistance(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours} h`;
  return `Il y a ${days} j`;
}

export function NotificationDropdown() {
  const { unreadCount, notifications } = FAKE_NOTIFICATIONS;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-4" />
          <span className="sr-only">Notifications</span>
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-4 max-w-8 flex justify-center px-1 text-[10px] leading-none"
              aria-live="polite"
              aria-atomic="true"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <Card className="border-0 shadow-none">
          <div className="flex items-center justify-between border-b border-border p-3">
            <h3 className="text-sm font-semibold">Notifications</h3>
            <Button variant="link" className="text-primary h-auto p-0">
              Tout marquer comme lu
            </Button>
          </div>
          <ul>
            {notifications.map((notification) => {
              const Icon = iconMap[notification.icon];
              return (
                <li key={notification.id}>
                  <Link
                    href={notification.url}
                    className="flex items-center gap-2 py-4 px-6 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                      {Icon && <Icon className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm break-all truncate">
                        {notification.content}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDistance(notification.date)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
          <CardFooter className="justify-center border-t border-border p-0">
            <Link
              href="/cs-sainte-marie/dashboard"
              className={cn(
                buttonVariants({ variant: "link" }),
                "text-primary text-center"
              )}
            >
              Voir toutes les notifications
            </Link>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
