import Link from "next/link";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-xl font-bold text-accent", className)}>
      <Leaf className="h-6 w-6" />
      <h1 className="font-headline tracking-tight">EcoFinds</h1>
    </Link>
  );
}
