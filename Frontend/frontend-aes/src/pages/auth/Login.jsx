import { useState } from "react";
import Cookies from "js-cookie";
import TextField from "../../components/forms/TextField";
import api from "../../api/config";
import { Shield, Lock, Mail, Eye, EyeOff, AlertTriangle, CheckCircle, Zap } from "lucide-react";

export default function Login({ onLoggedIn, onGoToRegister }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setError(""); 
    setCargando(true);
    
    try {
      const response = await api.post('/auth/login', { correo, contrasena });
      const data = response.data;
      Cookies.set("access_token", data.access_token);
      Cookies.set("refresh_token", data.refresh_token);
      onLoggedIn(data);
    } catch (error) {
      console.error('Error en login:', error);
      setError("Credenciales inválidas. Por favor, verifica tu correo y contraseña.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center p-2">
      {/* Background Effects */}
      
      <div className="w-full max-w-md relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/25">
            <div className="relative">
              <Shield className="w-10 h-10 text-white" />
              <Lock className="w-5 h-5 text-blue-200 absolute -bottom-1 -right-1" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent mb-2">
            SecureVault
          </h1>
          <p className="text-slate-400">
            Sistema de Cifrado AES-GCM
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">Iniciar Sesión</h2>
            <p className="text-slate-400">Accede a tu bóveda digital segura</p>
          </div>

          {/* Security Notice */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-blue-200 font-medium text-sm">Conexión Segura</p>
                <p className="text-blue-300/80 text-xs">
                  Autenticación JWT con cifrado end-to-end
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-600/20 border border-red-500/30 rounded-xl">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-red-200 font-medium text-sm">Error de Autenticación</p>
                  <p className="text-red-300/80 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={enviar} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={correo}
                  onChange={e => setCorreo(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="tu@ejemplo.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={contrasena}
                  onChange={e => setContrasena(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 rounded-xl text-white font-semibold disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg shadow-blue-600/25"
            >
              {cargando ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Acceder de Forma Segura</span>
                </>
              )}
            </button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <div className="text-center space-y-2">
              <p className="text-slate-400 text-sm">¿No tienes una cuenta?</p>
              <button 
                className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors duration-200"
                onClick={onGoToRegister}
              >
                Crear cuenta nueva
              </button>
            </div>
          </div>

          {/* Security Features */}
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <h4 className="text-white font-semibold mb-3 text-center">Características de Seguridad</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-slate-300">Autenticación JWT segura</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-slate-300">Cifrado AES-256-GCM</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-slate-300">Arquitectura zero-knowledge</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            © 2024 SecureVault. Protegiendo tu información con tecnología de punta.
          </p>
        </div>
      </div>
    </div>
  );
}
