import { Badge } from "@payskool/ui/components/ui/badge";
import { cn } from "@payskool/ui/utils";

interface CurrencyBadgeProps {
  amount: number;
  variant?: "default" | "secondary" | "destructive" | "outline" | "success";
  className?: string;
}

export function CurrencyBadge({ amount, variant = "secondary", className }: CurrencyBadgeProps) {
  const formattedAmount = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
    minimumFractionDigits: 0,
  }).format(amount).replace("XAF", "FCFA");

  // We can add a custom "success" variant if needed for positive amounts
  const isSuccess = variant === "success";

  return (
    <Badge 
      variant={isSuccess ? "outline" : variant as any} 
      className={cn(
        isSuccess && "bg-payskool-emerald/10 text-payskool-emerald border-payskool-emerald/20",
        className
      )}
    >
      {formattedAmount}
    </Badge>
  );
}
