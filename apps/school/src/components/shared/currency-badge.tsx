import { Badge, type BadgeProps } from "@payskool/ui/components/ui/badge";

interface CurrencyBadgeProps {
  amount: number;
  variant?: BadgeProps["variant"];
  className?: string;
}

export function CurrencyBadge({ amount, variant = "secondary", className }: CurrencyBadgeProps) {
  const formattedAmount = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
    minimumFractionDigits: 0,
  })
    .format(amount)
    .replace("XAF", "FCFA");

  return (
    <Badge variant={variant} className={className}>
      {formattedAmount}
    </Badge>
  );
}