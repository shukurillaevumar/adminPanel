"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminHome() {
  const router = useRouter();
  const logoutFunction = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/");
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      // ❌ Токена нет — редирект на страницу логина
      router.push("/");
    }
    // если хочешь, тут можно ещё проверить валидность токена через запрос на сервер
  }, []);

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Welcome to Admin Panel!</h1>
      <button
        onClick={logoutFunction}
        className="p-2 bg-red-500 text-white rounded-xl cursor-pointer font-semibold text-lg"
      >
        Log Out
      </button>
    </div>
  );
}
