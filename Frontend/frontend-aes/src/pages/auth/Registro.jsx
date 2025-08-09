import { useState } from "react";
import TextField from "../../components/forms/TextField";
import { apiRegistro } from "../../api/auth.api";
import { 
  Shield, 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertTriangle, 
  UserPlus,
  Zap,
  ArrowLeft
} from "lucide-react";

export default function Registro({ onBackToLogin }) {
  const [correo, setCorreo] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [resp, setResp] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validarContrasena = (password) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial
    };
  };

  const passwordStrength = validarContrasena(contrasena);
  const passwordsMatch = contrasena === confirmarContrasena;

  const enviar = async (e) => {
    e.preventDefault();
    setError("");

    if (!passwordStrength.isValid) {
      setError("La contraseña no cumple con todos los requisitos de seguridad.");
      return;
    }

    if (!passwordsMatch) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);
    try {
      const r = await apiRegistro(correo, usuario, contrasena);
      setResp(r);
    } catch (err) {
      setError("No se pudo completar el registro. El correo o usuario ya podrían estar en uso.");
    } finally {
      setCargando(false);
    }
  };

  if (resp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-6">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.3),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(16,185,129,0.2),transparent_50%)]"></div>
        </div>

        <div className="w-full max-w-md relative">
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mb-6 shadow-lg shadow-green-500/25">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-4">¡Cuenta Creada!</h2>
              <div className="bg-green-600/20 border border-green-500/30 rounded-xl p-4 mb-6">
                <p className="text-green-200 mb-2">Tu cuenta ha sido creada exitosamente:</p>
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">ID de Usuario:</span>
                      <span className="text-white font-mono">{resp.usuario_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Usuario:</span>
                      <span className="text-white">{usuario}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Correo:</span>
                      <span className="text-white">{correo}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600/20 border border-blue-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <div className="text-left">
                    <p className="text-blue-200 font-medium text-sm">Seguridad Activada</p>
                    <p className="text-blue-300/80 text-xs">
                      Tu cuenta está protegida con cifrado AES-256
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={onBackToLogin}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-semibold transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-blue-600/25"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Ir al Login</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(16,185,129,0.2),transparent_50%)]"></div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mb-6 shadow-lg shadow-green-500/25">
            <UserPlus className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Crear Cuenta
          </h1>
          <p className="text-slate-400">
            Únete a SecureVault y protege tus archivos
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">Registro de Usuario</h2>
            <p className="text-slate-400">Crea tu bóveda digital segura</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-600/20 border border-red-500/30 rounded-xl">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-red-200 font-medium text-sm">Error de Registro</p>
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

            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Nombre de Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={usuario}
                  onChange={e => setUsuario(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="tu_usuario"
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

              {/* Password Strength Indicator */}
              {contrasena && (
                <div className="mt-3 p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-sm font-medium text-slate-300 mb-2">Requisitos de seguridad:</p>
                  <div className="space-y-1 text-xs">
                    <div className={`flex items-center space-x-2 ${passwordStrength.minLength ? 'text-green-400' : 'text-slate-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordStrength.minLength ? 'bg-green-400' : 'bg-slate-400'}`}></div>
                      <span>Al menos 8 caracteres</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${passwordStrength.hasUpper ? 'text-green-400' : 'text-slate-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordStrength.hasUpper ? 'bg-green-400' : 'bg-slate-400'}`}></div>
                      <span>Una letra mayúscula</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${passwordStrength.hasLower ? 'text-green-400' : 'text-slate-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordStrength.hasLower ? 'bg-green-400' : 'bg-slate-400'}`}></div>
                      <span>Una letra minúscula</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${passwordStrength.hasNumber ? 'text-green-400' : 'text-slate-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordStrength.hasNumber ? 'bg-green-400' : 'bg-slate-400'}`}></div>
                      <span>Un número</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${passwordStrength.hasSpecial ? 'text-green-400' : 'text-slate-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordStrength.hasSpecial ? 'bg-green-400' : 'bg-slate-400'}`}></div>
                      <span>Un carácter especial</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmarContrasena}
                  onChange={e => setConfirmarContrasena(e.target.value)}
                  required
                  className={`w-full pl-10 pr-12 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    confirmarContrasena && !passwordsMatch 
                      ? 'border-red-500 focus:ring-red-500' 
                      : confirmarContrasena && passwordsMatch 
                      ? 'border-green-500 focus:ring-green-500'
                      : 'border-slate-600 focus:ring-blue-500'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors duration-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              {confirmarContrasena && !passwordsMatch && (
                <p className="text-red-400 text-sm flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Las contraseñas no coinciden</span>
                </p>
              )}
              
              {confirmarContrasena && passwordsMatch && (
                <p className="text-green-400 text-sm flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Las contraseñas coinciden</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={cargando || !passwordStrength.isValid || !passwordsMatch}
              className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 rounded-xl text-white font-semibold disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg shadow-green-600/25"
            >
              {cargando ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creando cuenta...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Crear Cuenta Segura</span>
                </>
              )}
            </button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <div className="text-center space-y-2">
              <p className="text-slate-400 text-sm">¿Ya tienes una cuenta?</p>
              <button 
                className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors duration-200"
                onClick={onBackToLogin}
              >
                Iniciar sesión
              </button>
            </div>
          </div>

          {/* Security Features */}
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <h4 className="text-white font-semibold mb-3 text-center">Al registrarte obtienes:</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-slate-300">Cifrado AES-256 automático</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-slate-300">Gestión segura de claves</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-slate-300">Almacenamiento privado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            © 2024 SecureVault. Tu privacidad es nuestra prioridad.
          </p>
        </div>
      </div>
    </div>
  );
}
