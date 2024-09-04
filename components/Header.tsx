"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-foreground">
          Blog CRUD
        </Link>
        <nav className="flex items-center space-x-4">
          <Button asChild variant="ghost">
            <Link href="/create">Create Post</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </nav>
      </div>
    </header>
  );
}
