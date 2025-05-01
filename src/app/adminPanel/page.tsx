"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminHome() {
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      router.push("/");
    }
  }, []);

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Welcome to Admin Panel!</h1>
    </div>
  );
}
