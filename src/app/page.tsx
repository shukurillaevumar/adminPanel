import LoginPage from "./login/LoginPage";
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-200 to-gray-400">
      <LoginPage />
      <ToastContainer />
    </div>
  );
}
