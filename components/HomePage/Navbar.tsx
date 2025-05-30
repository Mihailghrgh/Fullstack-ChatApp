"use client";

import { MessageCircle } from "lucide-react";
import { links } from "./links";
import Link from "next/link";
import { Button } from "../ui/button";
import ThemeComponent from "../Theme/ThemeComponent";
import { Menu } from "lucide-react";

function Navbar() {
  return (
    <>
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 ">
            <div className="flex items-center">
              <MessageCircle className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">Chat Io</span>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4 scroll-smooth">
                {links.map((link) => {
                  return (
                    <div key={link.id}>
                      <Link href={link.href}>{link.name}</Link>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="hidden md:block space-x-2 space-y-2">
              <Link href="/sign-in">
                <Button variant="ghost" className="hover:cursor-pointer">
                  Sign In
                </Button>
              </Link>
              <Link href="/chat">
                <Button className="hover:cursor-pointer">Get Started</Button>
              </Link>

              <ThemeComponent />
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="hover:cursor-pointer"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
export default Navbar;
