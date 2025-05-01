"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ReactNode } from "react";
import LeftMenu from "@/app/components/LeftMenu";
import LogoutButton from "../components/LogoutButton";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      router.push("/");
    }
  }, []);

  return (
    <div className="flex min-h-screen">
      <div className="w-1/6 bg-gray-800 text-white">
        <LeftMenu />
      </div>
      <div className="w-5/6 p-4">
        <LogoutButton /> {children}
      </div>
    </div>
  );
}
