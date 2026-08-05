import Link from "next/link"
import { LogOut, User, UserCog } from "lucide-react"
import { FAKE_USER } from "@/core/mocks/fake-data";
import { getInitials } from "@payskool/shared";
import { Avatar, AvatarFallback, AvatarImage } from "@payskool/ui/components/ui/avatar"
import { Button } from "@payskool/ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@payskool/ui/components/ui/dropdown-menu"

export function UserDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-lg"
          aria-label="User"
        >
          <Avatar className="size-9">
            <AvatarImage src="" alt="" />
            <AvatarFallback className="bg-transparent">
              {FAKE_USER.name && getInitials(FAKE_USER.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent forceMount>
        <DropdownMenuLabel className="flex gap-2">
          <Avatar>
            <AvatarImage src="" alt="Avatar" />
            <AvatarFallback className="bg-transparent">
              {FAKE_USER.name && getInitials(FAKE_USER.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <p className="text-sm font-medium truncate">{FAKE_USER.name}</p>
            <p className="text-xs text-muted-foreground font-semibold truncate">
              {FAKE_USER.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-w-48">
          <DropdownMenuItem asChild>
            <Link
              href="/lycee-saint-paul/profile"
            >
              <User className="me-2 size-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/lycee-saint-paul/settings`}
            >
              <UserCog className="me-2 size-4" />
              Paramètres
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="me-2 size-4" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}