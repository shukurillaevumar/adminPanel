"use client";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("https://back.ifly.com.uz/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: username, password }),
    })
      .then((response) => response.json())
      .then((item) => {
        if (item?.success) {
          toast.success(item?.data?.message);
          localStorage.setItem("access_token", item?.data?.access_token);
          localStorage.setItem("refresh_token", item?.data?.refresh_token);
          router.push("/adminPanel");
        } else {
          toast.error(item?.message?.message);
        }
      });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleLogin}
        className="flex flex-col px-16 py-12 gap-5 rounded-2xl border border-white/30 backdrop-blur-md bg-white/10 shadow-2xl transition-all duration-500 opacity-0 animate-fade-in"
      >
        <h2 className="text-3xl font-bold text-center">Welcome Back</h2>
        <p className="text-center mb-4 text-lg">Log in to your account</p>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-lg">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Write your username"
            required
            className="p-4 border border-white/30 rounded-2xl min-w-[30rem] bg-white/50 placeholder-gray-700 text-black outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="flex flex-col gap-2 relative">
          <label className="font-semibold text-lg">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            placeholder="Write your password"
            required
            className="p-4 border border-white/30 rounded-2xl min-w-[30rem] bg-white/50 placeholder-gray-700 text-black outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[52px] text-gray-700 hover:text-black cursor-pointer"
          >
            {showPassword ? <Eye /> : <EyeOff />}
          </button>
        </div>

        <button
          type="submit"
          className="p-3 w-full mt-5 bg-green-700 text-white font-bold rounded-xl text-lg cursor-pointer hover:bg-green-800 transition"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
