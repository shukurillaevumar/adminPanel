import { useRouter } from "next/navigation";
export default function LogoutButton() {
  const router = useRouter();
  const logoutFunction = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/");
  };
  return (
    <div className="flex items-end justify-end">
      <button
        onClick={logoutFunction}
        className="p-2 bg-red-500 text-white rounded-xl cursor-pointer font-semibold text-lg"
      >
        Log Out
      </button>
    </div>
  );
}
