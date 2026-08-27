import { Avatar, AvatarFallback } from "@payskool/ui/components/ui/avatar";
import { cn } from "@payskool/ui/utils";

import { initials } from "@/lib/format";

const genderTones: Record<"M" | "F", string> = {
  M: "bg-payskool-navy text-white",
  F: "bg-payskool-emerald/15 text-payskool-emerald",
};

export function StudentAvatar({
  firstName,
  lastName,
  gender,
  className,
}: {
  firstName: string;
  lastName: string;
  gender: "M" | "F";
  className?: string;
}) {
  return (
    <Avatar className={cn("size-9 shrink-0 rounded-lg", className)}>
      <AvatarFallback className={cn("rounded-lg text-xs font-bold", genderTones[gender])}>
        {initials(firstName, lastName)}
      </AvatarFallback>
    </Avatar>
  );
}