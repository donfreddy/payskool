"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, GraduationCap, ReceiptText, Banknote, School, User } from "lucide-react";
import { Button } from "@payskool/ui/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@payskool/ui/components/ui/command";

export function SearchCommand() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setOpen((v) => !v);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  const runCommand = useCallback(
    (command: () => void) => {
      setOpen(false);
      command();
    },
    []
  );

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="flex h-9 w-full min-w-56 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:bg-secondary sm:w-64"
      >
        <Search className="size-4 shrink-0" />
        <span className="flex-1 text-left">Rechercher…</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="max-w-lg">
          <CommandInput placeholder="Rechercher un élève, un reçu..." />
          <CommandList>
            <CommandEmpty>Aucun résultat.</CommandEmpty>
            <CommandGroup heading="Navigation rapide">
              <CommandItem
                onSelect={() => runCommand(() => router.push("/cs-sainte-marie/dashboard"))}
              >
                <GraduationCap />
                Tableau de bord
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => router.push("/cs-sainte-marie/students"))}
              >
                <User />
                Élèves
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => router.push("/cs-sainte-marie/fees"))}
              >
                <ReceiptText />
                Frais & Échéanciers
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => router.push("/cs-sainte-marie/transactions"))}
              >
                <Banknote />
                Encaissements
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Établissements">
              <CommandItem
                onSelect={() => runCommand(() => router.push("/cs-sainte-marie/dashboard"))}
              >
                <School />
                CS Sainte-Marie (Douala)
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => router.push("/lycee-saint-paul/dashboard"))}
              >
                <School />
                Lycée Saint-Paul (Yaoundé)
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
