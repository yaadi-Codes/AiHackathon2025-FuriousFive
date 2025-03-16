"use client"

import { Menu, Bell, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-md z-50 border-b border-purple-100">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-bold text-xl gradient-text">INTELLI</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-vibrant-purple hover:text-vibrant-pink transition-colors">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-vibrant-purple to-vibrant-pink opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <User className="h-5 w-5 text-vibrant-purple" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border border-purple-100">
              <DropdownMenuLabel className="gradient-text">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled className="text-vibrant-purple">
                <User className="mr-2 h-4 w-4" />
                <span>{user?.name || "User"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="text-vibrant-red hover:text-white hover:bg-vibrant-red">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

