import Cookies from "js-cookie";
import { Shield, Lock, LogOut, User, Crown } from "lucide-react";
import { getCurrentUser } from "../../utils/auth";

export default function Topbar() {
  const salir = () => { 
    Cookies.remove("access_token"); 
    Cookies.remove("refresh_token");
    window.location.reload(); 
  };
  
  const currentUser = getCurrentUser();
  const rolDisplay = currentUser?.isAdmin ? "Administrador" : "Usuario";
  const RolIcon = currentUser?.isAdmin ? Crown : User;
  const rolColor = currentUser?.isAdmin ? "text-orange-300" : "text-blue-300";
  const bgColor = currentUser?.isAdmin ? "bg-orange-900/50 border-orange-700/50" : "bg-blue-900/50 border-blue-700/50";
  
  return (
    <header className="h-16 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-b border-blue-800/30 flex items-center justify-between px-6 shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Shield className="w-8 h-8 text-blue-400" />
            <Lock className="w-4 h-4 text-green-400 absolute -bottom-1 -right-1" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-white">SecureVault</h1>
            <p className="text-xs text-blue-200">Sistema de Cifrado AES-GCM</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-2 text-sm text-blue-200">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Sistema Seguro</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border ${bgColor}`}>
            <RolIcon className={`w-4 h-4 ${rolColor}`} />
            <span className={`text-sm ${rolColor}`}>{rolDisplay}</span>
          </div>
          
          <button
            onClick={salir}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-lg text-red-200 hover:text-red-100 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
}
