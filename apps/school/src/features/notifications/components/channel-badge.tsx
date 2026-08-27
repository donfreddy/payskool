import { cn } from "@payskool/ui/utils";
import { MessageCircle, PhoneCall, SquarePen, type LucideIcon } from "lucide-react";

import type { RelanceChannel } from "@/core/mocks/fake-data";

export const CHANNEL_LABELS: Record<RelanceChannel, string> = {
  WHATSAPP: "WhatsApp",
  SMS: "SMS",
  VOICE: "Appel",
};

const config: Record<RelanceChannel, { icon: LucideIcon; tone: string }> = {
  WHATSAPP: { icon: MessageCircle, tone: "bg-payskool-emerald/10 text-payskool-emerald" },
  SMS: { icon: SquarePen, tone: "bg-violet-100 text-violet-700" },
  VOICE: { icon: PhoneCall, tone: "bg-amber-100 text-amber-700" },
};

export function ChannelBadge({ channel, className }: { channel: RelanceChannel; className?: string }) {
  const { icon: Icon, tone } = config[channel];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold", tone, className)}>
      <Icon className="size-3.5" />
      {CHANNEL_LABELS[channel]}
    </span>
  );
}