import { useEffect, useState } from "react";
import api from "../../api/config";
import { 
  Key, 
  Shield, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Lock,
  Zap,
  Info,
  Plus,
  Eye,
  EyeOff
} from "lucide-react";

export default function ClaveGestion() {
  const [clave, setClave] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [generatingKey, setGeneratingKey] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [nombreClave, setNombreClave] = useState(""); // Nuevo estado para el nombre

  const cargar = async () => {
    setMsg("");
    setLoading(true);
    try {
      const response = await api.get('/claves/activa');
      setClave(response.data);
    } catch (error) {
      console.error('Error cargando clave activa:', error);
      setClave(null);
      setMsg("No hay clave activa. Puedes generar una nueva clave UEK.");
    } finally {
      setLoading(false);
    }
  };

  const generar = async () => {
    setMsg("");
    setGeneratingKey(true);
    try {
      const payload = {};
      if (nombreClave?.trim()) {
        payload.etiqueta = nombreClave.trim();
      }
      
      const response = await api.post('/claves/generar', payload);
      setClave(response.data);
      setMsg("¡Clave UEK generada y activada exitosamente!");
      setNombreClave(""); // Limpiar el campo después de generar
    } catch (error) {
      console.error('Error generando clave:', error);
      setMsg("Error: No se pudo generar la clave. Inténtalo de nuevo.");
    } finally {
      setGeneratingKey(false);
    }
  };

  useEffect(() => { 
    cargar(); 
  }, []);

  const keyStrength = clave ? "Máxima (AES-256)" : "No disponible";
  const keyStatus = clave?.activa ? "Activa y Operativa" : "Inactiva";
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent flex items-center space-x-3">
            <Key className="w-8 h-8 text-yellow-400" />
            <span>Gestión de Claves UEK</span>
          </h1>
          <p className="text-slate-400 mt-2">
            User Encryption Key - Tu clave maestra para el cifrado de archivos
          </p>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-300 hover:text-white transition-colors duration-200"
        >
          {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{showDetails ? "Ocultar" : "Mostrar"} Detalles</span>
        </button>
      </div>

      {/* Status Messages */}
      {msg && (
        <div className={`p-4 rounded-xl border ${
          msg.includes("Error") 
            ? "bg-red-600/20 border-red-500/30 text-red-200" 
            : msg.includes("exitosamente")
            ? "bg-green-600/20 border-green-500/30 text-green-200"
            : "bg-blue-600/20 border-blue-500/30 text-blue-200"
        }`}>
          <div className="flex items-center space-x-2">
            {msg.includes("Error") ? (
              <AlertTriangle className="w-5 h-5" />
            ) : msg.includes("exitosamente") ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Info className="w-5 h-5" />
            )}
            <span className="font-medium">{msg}</span>
          </div>
        </div>
      )}

      {/* Key Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Estado</h3>
          </div>
          <p className={`text-2xl font-bold ${clave?.activa ? "text-green-400" : "text-red-400"}`}>
            {keyStatus}
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${clave?.activa ? "bg-green-400 animate-pulse" : "bg-red-400"}`}></div>
            <span className="text-slate-400 text-sm">
              {clave?.activa ? "Disponible para cifrado" : "Cifrado no disponible"}
            </span>
          </div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Lock className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Fortaleza</h3>
          </div>
          <p className="text-2xl font-bold text-blue-400">{keyStrength}</p>
          <p className="text-slate-400 text-sm mt-2">Cifrado de grado militar</p>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Creada</h3>
          </div>
          <p className="text-2xl font-bold text-purple-400">
            {clave ? new Date(clave.creada_en).toLocaleDateString() : "N/A"}
          </p>
          <p className="text-slate-400 text-sm mt-2">Fecha de generación</p>
        </div>
      </div>

      {/* Main Key Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Current Key Details */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-3">
            <Key className="w-6 h-6 text-yellow-400" />
            <span>Clave UEK Actual</span>
          </h2>

          {loading ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
              <span className="text-slate-400 ml-3">Cargando información...</span>
            </div>
          ) : clave ? (
            <div className="space-y-4">
              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 text-sm font-medium">Etiqueta</label>
                    <p className="text-white font-mono text-lg">{clave.etiqueta}</p>
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm font-medium">Estado</label>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${clave.activa ? "bg-green-400" : "bg-red-400"} animate-pulse`}></div>
                      <span className={`font-semibold ${clave.activa ? "text-green-400" : "text-red-400"}`}>
                        {clave.activa ? "Activa" : "Inactiva"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {showDetails && (
                <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                  <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                    <Info className="w-4 h-4 text-blue-400" />
                    <span>Detalles Técnicos</span>
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Algoritmo:</span>
                      <span className="text-white font-mono">AES-256-GCM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">KDF:</span>
                      <span className="text-white font-mono">Argon2id</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Longitud:</span>
                      <span className="text-white font-mono">256 bits</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Creada:</span>
                      <span className="text-white font-mono">{new Date(clave.creada_en).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-blue-200 font-medium mb-1">Clave Operativa</p>
                    <p className="text-blue-300/80 text-sm">
                      Tu clave UEK está activa y lista para cifrar nuevos archivos. 
                      Todos los archivos se cifrarán automáticamente con esta clave.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-8">
              <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
                <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">No hay clave activa</h3>
                <p className="text-slate-400 text-sm">
                  Necesitas generar una clave UEK para poder cifrar archivos de forma segura.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Key Generation Section */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-3">
            <Plus className="w-6 h-6 text-green-400" />
            <span>Generar Nueva Clave</span>
          </h2>

          <div className="space-y-6">
            <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
              <h4 className="text-white font-semibold mb-3">¿Cuándo generar una nueva clave?</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Primera configuración del sistema</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Rotación de claves programada</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Compromiso de seguridad sospechado</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-yellow-200 font-medium mb-1">Advertencia Importante</p>
                  <p className="text-yellow-300/80 text-sm">
                    Generar una nueva clave UEK desactivará la anterior. 
                    Asegúrate de que todos los archivos importantes estén respaldados.
                  </p>
                </div>
              </div>
            </div>

            {/* Campo para nombre personalizado de la clave */}
            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium">
                Nombre de la Clave (opcional)
              </label>
              <input
                type="text"
                value={nombreClave}
                onChange={(e) => setNombreClave(e.target.value)}
                placeholder="Ejemplo: Clave-Proyecto-2025"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                disabled={generatingKey}
              />
              <p className="text-slate-400 text-xs">
                Si no especificas un nombre, se generará automáticamente
              </p>
            </div>

            <button
              onClick={generar}
              disabled={generatingKey}
              className="w-full flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl text-green-200 hover:bg-gradient-to-r hover:from-green-600/30 hover:to-emerald-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {generatingKey ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Generando clave segura...</span>
                </>
              ) : (
                <>
                  <Key className="w-5 h-5" />
                  <span className="font-semibold">Generar Nueva Clave UEK</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Security Information */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-3">
          <Shield className="w-6 h-6 text-blue-400" />
          <span>Información de Seguridad</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-semibold mb-3">Jerarquía de Claves</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">KEK (Key Encryption Key)</p>
                  <p className="text-slate-400 text-sm">Derivada del MASTER_SECRET</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">UEK (User Encryption Key)</p>
                  <p className="text-slate-400 text-sm">Tu clave personal de usuario</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">DEK (Data Encryption Key)</p>
                  <p className="text-slate-400 text-sm">Única por cada archivo</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Características de Seguridad</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-slate-300">Cifrado AES-256-GCM</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-slate-300">Derivación de claves Argon2id</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-slate-300">Nonces únicos por archivo</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-slate-300">Autenticación integrada</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-slate-300">Key wrapping seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
