import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

interface TubelightNavbarProps {
  items: NavItem[];
  className?: string;
}

export function TubelightNavbar({ items, className }: TubelightNavbarProps) {
  return (
    <nav className={cn("flex items-center justify-center gap-4 p-4", className)}>
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.a
            key={index}
            href={item.href}
            className="group relative flex h-12 items-center gap-2 px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="h-5 w-5" />
            <span className="hidden md:inline-block">{item.label}</span>
            <motion.div
              className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 blur-lg transition-opacity group-hover:opacity-100"
              layoutId="navbar-glow"
            />
            <motion.div
              className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-background to-background/80 opacity-0 group-hover:opacity-100"
              layoutId="navbar-bg"
            />
          </motion.a>
        );
      })}
    </nav>
  );
}