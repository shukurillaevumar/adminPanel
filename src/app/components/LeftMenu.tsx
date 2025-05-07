"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/../public/ChatGPT Image Apr 24, 2025, 02_07_00 PM.png";

import {
  LayoutDashboard,
  Tag,
  Percent,
  Ruler,
  Palette,
  HelpCircle,
  Phone,
  Users,
  Newspaper,
} from "lucide-react";

export default function LeftMenu() {
  const pathname = usePathname();

  const menuItems = [
    { name: "products", icon: LayoutDashboard },
    { name: "category", icon: Tag },
    { name: "discounts", icon: Percent },
    { name: "sizes", icon: Ruler },
    { name: "colors", icon: Palette },
    { name: "faq", icon: HelpCircle },
    { name: "contact", icon: Phone },
    { name: "team", icon: Users },
    { name: "news", icon: Newspaper },
  ];

  return (
    <div className="p-2 bg-[#1E2939] h-screen">
      <div className="flex justify-center items-center mb-4">
        <Link href="/adminPanel">
          <Image src={Logo} alt="logo" className="w-32 h-auto" />
        </Link>
      </div>
      <ul className="text-center flex flex-col gap-2 text-white font-semibold text-lg">
        {menuItems.map(({ name, icon: Icon }) => {
          const isActive = pathname === `/adminPanel/${name}`;
          return (
            <Link
              key={name}
              href={`/adminPanel/${name}`}
              className={`p-4 flex items-center gap-3 rounded-xl transition-all duration-150 ease-in
                ${
                  isActive
                    ? "bg-white/30 font-bold"
                    : "hover:bg-white/20 font-normal"
                }`}
            >
              <Icon
                className={`w-5 h-5 transition-all duration-150 ${
                  isActive ? "text-white" : "text-gray-400"
                }`}
              />
              <span className={isActive ? "text-white" : "text-gray-300"}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </span>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}
