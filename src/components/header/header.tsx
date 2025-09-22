"use client";


import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Container, Logo } from "../index";
import { Bell, User } from "lucide-react";

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-700 text-white shadow-xl border-b border-blue-700 animate-fade-in">
      <Container>
        <nav className="flex items-center justify-between py-2">
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="focus:outline-none hover:scale-110 transition-transform duration-200"
            >
              <Logo width="70px" />
            </button>
          </div>

          {/* Center: Nav Buttons */}
          <ul className="flex items-center gap-2 md:gap-4 lg:gap-6">
            <li>
              <button
                onClick={() => router.push("/home")}
                className={`px-4 py-2 rounded-xl font-semibold transition shadow-sm border border-white/20
                  ${pathname === "/home" ? "bg-yellow-300 text-blue-800" : "bg-white/10 hover:bg-white/20 text-white hover:text-yellow-300 active:bg-white/30"}`}
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => router.push("/reports")}
                className={`px-4 py-2 rounded-xl font-semibold transition shadow-sm border border-white/20
                  ${pathname === "/reports" ? "bg-yellow-300 text-blue-800" : "bg-white/10 hover:bg-white/20 text-white hover:text-yellow-300 active:bg-white/30"}`}
              >
                Reports
              </button>
            </li>
            <li>
              <button
                onClick={() => router.push("/addReport")}
                className={`px-4 py-2 rounded-xl font-semibold transition shadow-sm border border-white/20
                  ${pathname === "/addReport" ? "bg-yellow-300 text-blue-800" : "bg-white/10 hover:bg-white/20 text-white hover:text-yellow-300 active:bg-white/30"}`}
              >
                Add Report
              </button>
            </li>
          </ul>

          {/* Right: Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Notification Bell with Hover Dropdown */}
            <div className="relative group">
              <button
                className="p-2 rounded-full bg-white/10 hover:bg-yellow-300 hover:text-blue-800 active:bg-yellow-400 transition shadow border border-white/20"
                aria-label="Notifications"
              >
                <Bell size={22} />
              </button>
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-64 bg-white text-blue-900 rounded-xl shadow-lg border border-blue-200 opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-opacity duration-200 z-50">
                <div className="p-4 font-semibold border-b border-blue-100">Notifications</div>
                <ul className="max-h-60 overflow-y-auto">
                  {/* Example notifications, replace with dynamic data if needed */}
                  <li className="px-4 py-2 hover:bg-blue-50 cursor-pointer">New report submitted!</li>
                  <li className="px-4 py-2 hover:bg-blue-50 cursor-pointer">Your issue was upvoted</li>
                  <li className="px-4 py-2 hover:bg-blue-50 cursor-pointer">A report was resolved</li>
                  <li className="px-4 py-2 hover:bg-blue-50 cursor-pointer">Welcome to the dashboard!</li>
                </ul>
                <div className="p-2 text-xs text-center text-blue-400 border-t border-blue-100">No more notifications</div>
              </div>
            </div>
            {/* User Profile */}
            <button
              onClick={() => router.push("/user")}
              className="p-2 rounded-full bg-white/10 hover:bg-yellow-300 hover:text-blue-800 active:bg-yellow-400 transition shadow border border-white/20"
              aria-label="User Dashboard"
            >
              <User size={22} />
            </button>
          </div>
        </nav>
      </Container>
    </header>
  );
};

export default Header;
