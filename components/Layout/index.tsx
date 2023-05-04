import { Navbar } from "@/components/Navbar";
import type { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="container flex flex-col mx-auto max-w-4xl min-h-screen">
      <Navbar />
      <main className="flex-1 p-5">{children}</main>
      <footer>Footer</footer>
    </div>
  );
}
