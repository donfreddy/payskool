import { cn } from "@payskool/ui/utils";
import { buttonVariants } from "@payskool/ui/components/ui/button";

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card ">
      <div className="container flex justify-between items-center p-4 md:px-6">
        <p className="text-xs text-muted-foreground md:text-sm">
          © {currentYear}{" "}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "link" }), "inline p-0")}
          >
            Payskool
          </a>
          .
        </p>
        <p className="text-xs text-muted-foreground md:text-sm">
          Designed & Developed by{" "}
          <a
            href="https://lehmora.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "link" }), "inline p-0")}
          >
            Lehmora
          </a>
          .
        </p>
      </div>
    </footer>
  )
}