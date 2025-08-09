import { BarChart3, Files, Upload, Key, Shield, Activity, Users, FileText } from "lucide-react";
import { getCurrentUser } from "../../utils/auth";

export default function Sidebar({ onNavigate, current }) {
  const user = getCurrentUser();
  const isAdmin = user?.isAdmin || false;
  
  const baseLinks = [
    { key: "dashboard", label: "Panel Principal", icon: BarChart3, color: "text-blue-400" },
    { key: "archivos", label: "Mis Archivos", icon: Files, color: "text-green-400" },
    { key: "subir", label: "Subir Archivo", icon: Upload, color: "text-purple-400" },
    { key: "claves", label: "Gestión de Claves", icon: Key, color: "text-yellow-400" },
  ];

  const adminLinks = [
    { key: "auditoria", label: "Auditoría", icon: Shield, color: "text-red-400" },
    { key: "usuarios", label: "Gestión de Usuarios", icon: Users, color: "text-indigo-400" },
  ];

  // Solo mostrar opciones de admin si el usuario es admin
  const links = isAdmin ? [...baseLinks, ...adminLinks] : baseLinks;

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700/50 min-h-[calc(100vh-64px)] shadow-xl">
      <nav className="p-6 space-y-2">
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Navegación</h2>
          {user?.isAdmin && (
            <div className="mb-2 px-2">
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                <Shield className="w-3 h-3 mr-1" />
                Administrador
              </span>
            </div>
          )}
        </div>
        
        {links.map(l => {
          const Icon = l.icon;
          const isActive = current === l.key;
          
          return (
            <button
              key={l.key}
              onClick={() => onNavigate(l.key)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-blue-600/20 border border-blue-500/30 text-blue-100 shadow-lg shadow-blue-600/10" 
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 transition-colors duration-200 ${
                isActive ? "text-blue-400" : l.color + " group-hover:text-white"
              }`} />
              <span className="font-medium">{l.label}</span>
              {isActive && (
                <div className="ml-auto">
                  <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
                </div>
              )}
            </button>
          );
        })}
        
        <div className="pt-8 mt-8 border-t border-slate-700/50">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-600/30">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium text-slate-200">Estado de Seguridad</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-400">Cifrado Activo</span>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}
