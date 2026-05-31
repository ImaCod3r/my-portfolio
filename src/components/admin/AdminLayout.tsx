import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaProjectDiagram,
  FaEnvelope,
  FaSignOutAlt,
  FaTachometerAlt,
  FaBars,
  FaTimes,
  FaCog,
  FaLink,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function AdminLayout() {
  const { signOut } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { path: "/admin/dashboard", icon: FaTachometerAlt, label: "Dashboard" },
    { path: "/admin/projects", icon: FaProjectDiagram, label: "Projetos" },
    { path: "/admin/links", icon: FaLink, label: "Links" },
    { path: "/admin/messages", icon: FaEnvelope, label: "Mensagens" },
    { path: "/admin/settings", icon: FaCog, label: "Configurações" },
  ];

  return (
    <div className="h-screen bg-black flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800 shrink-0">
        <h1 className="text-xl font-bold font-mono text-white">
          <span className="text-white/50">&lt;</span>Admin
          <span className="text-white/50">/&gt;</span>
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-400 hover:text-white"
        >
          {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </Button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h1 className="text-xl font-bold font-mono text-white">
            <span className="text-white/50">&lt;</span>Admin
            <span className="text-white/50">/&gt;</span>
          </h1>
          {/* Close button for mobile inside sidebar */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <FaTimes size={20} />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)} // Close on navigate
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => signOut()}
            className="flex items-center justify-start gap-3 w-full text-red-400 hover:bg-red-500/10 hover:text-red-400 font-normal mt-2"
          >
            <FaSignOutAlt />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-full p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
