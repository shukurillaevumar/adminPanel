import Image from "next/image";
import Link from "next/link";
import Logo from "@/../public/ChatGPT Image Apr 24, 2025, 02_07_00 PM.png";

export default function LeftMenu() {
  return (
    <div className="p-2 bg-[#1E2939] h-screen">
      <div className="flex justify-center items-center mb-4">
        <Link href={"/adminPanel"}>
          <Image src={Logo} alt="logo" className="w-32 h-auto" />
        </Link>
      </div>
      <ul className="text-center flex flex-col gap-2 text-white font-semibold text-lg">
        {[
          "products",
          "category",
          "discounts",
          "sizes",
          "colors",
          "faq",
          "contact",
          "team",
          "news",
        ].map((item) => (
          <Link
            key={item}
            href={`/adminPanel/${item}`}
            className="p-4 hover:bg-white/20 rounded-xl cursor-pointer transition-all duration-100 ease-in block"
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </Link>
        ))}
      </ul>
    </div>
  );
}
