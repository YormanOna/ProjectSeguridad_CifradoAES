import { useState, useEffect } from "react";
import { 
  FileText, 
  Calendar, 
  HardDrive, 
  Lock, 
  Shield, 
  Key, 
  Download, 
  Share2, 
  Trash2, 
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Eye,
  Info,
  Activity
} from "lucide-react";
import { fmtBytes } from "../../utils/format";

export default function ArchivoDetalle({ archivoId, onBack }) {
  // Datos simulados para demo - en producción vendrían del backend
  const [archivo, setArchivo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setArchivo({
        id: archivoId || 1234,
        nombre_original: "documento_importante.pdf",
        tipo_mime: "application/pdf",
        tamano_bytes: 2048576, // 2MB
        creado_en: new Date().toISOString(),
        actualizado_en: new Date().toISOString(),
        cifrado: "AES-256-GCM",
        estado: "CIFRADO",
        hash_verificacion: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456789012345",
        metadatos: {
          version: 1,
          autor: "Usuario Demo",
          descripcion: "Archivo de ejemplo"
        }
      });
      
      setHistorial([
        {
          id: 1,
          accion: "ARCHIVO_CREADO",
          fecha: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          detalles: "Archivo subido y cifrado exitosamente"
        },
        {
          id: 2,
          accion: "DESCARGA",
          fecha: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          detalles: "Archivo descargado y descifrado por el propietario"
        },
        {
          id: 3,
          accion: "VERIFICACION_INTEGRIDAD",
          fecha: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          detalles: "Verificación de integridad completada - OK"
        }
      ]);
      
      setLoading(false);
    }, 1000);
  }, [archivoId]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          <span className="text-slate-400 ml-4">Cargando detalles del archivo...</span>
        </div>
      </div>
    );
  }

  if (!archivo) {
    return (
      <div className="space-y-8">
        <div className="text-center p-12">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8 max-w-md mx-auto">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Archivo no encontrado</h2>
            <p className="text-slate-400">
              No se pudo cargar la información del archivo solicitado.
            </p>
            <button
              onClick={onBack}
              className="mt-4 flex items-center space-x-2 mx-auto px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-200 hover:bg-blue-600/30 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-300 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </button>
          
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
              <FileText className="w-8 h-8 text-blue-400" />
              <span>Detalle del Archivo</span>
            </h1>
            <p className="text-slate-400 mt-2">
              Información completa y gestión del archivo cifrado
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-300 font-medium">{archivo.estado}</span>
          </div>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* File Icon & Basic Info */}
          <div className="lg:col-span-1">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-600/20 border border-blue-500/30 rounded-2xl mb-6">
                <FileText className="w-12 h-12 text-blue-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2 break-all">
                {archivo.nombre_original}
              </h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <HardDrive className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300">{fmtBytes(archivo.tamano_bytes)}</span>
                </div>
                
                <div className="flex items-center justify-center space-x-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300">
                    {new Date(archivo.creado_en).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Technical Details */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Info className="w-5 h-5 text-blue-400" />
                <span>Información Técnica</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">ID del Archivo:</span>
                      <span className="text-white font-mono">{archivo.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tipo MIME:</span>
                      <span className="text-white font-mono">{archivo.tipo_mime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tamaño:</span>
                      <span className="text-white">{fmtBytes(archivo.tamano_bytes)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-xl p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Algoritmo:</span>
                      <span className="text-white font-mono">{archivo.cifrado}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Estado:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400">{archivo.estado}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-2">Hash de Verificación:</span>
                      <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-3 relative group">
                        <span className="text-amber-300 font-mono text-sm break-all leading-relaxed">
                          {archivo.hash_verificacion}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Information */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span>Información de Seguridad</span>
              </h3>
              
              <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-green-200 font-medium text-sm">Cifrado AES-256</p>
                      <p className="text-green-300/80 text-xs">Grado militar</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Key className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-blue-200 font-medium text-sm">DEK Única</p>
                      <p className="text-blue-300/80 text-xs">Por archivo</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-purple-200 font-medium text-sm">Integridad</p>
                      <p className="text-purple-300/80 text-xs">Verificada</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata */}
            {archivo.metadatos && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Metadatos</h3>
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <div className="space-y-2 text-sm">
                    {Object.entries(archivo.metadatos).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-slate-400 capitalize">{key.replace('_', ' ')}:</span>
                        <span className="text-white">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Acciones Disponibles</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-3 p-4 bg-green-600/20 border border-green-500/30 rounded-xl text-green-200 hover:bg-green-600/30 transition-colors duration-200">
            <Download className="w-5 h-5" />
            <span>Descargar y Descifrar</span>
          </button>
          
          <button className="flex items-center justify-center space-x-3 p-4 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-200 hover:bg-blue-600/30 transition-colors duration-200">
            <Share2 className="w-5 h-5" />
            <span>Compartir</span>
          </button>
          
          <button className="flex items-center justify-center space-x-3 p-4 bg-red-600/20 border border-red-500/30 rounded-xl text-red-200 hover:bg-red-600/30 transition-colors duration-200">
            <Trash2 className="w-5 h-5" />
            <span>Eliminar</span>
          </button>
        </div>
      </div>

      {/* Activity History */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Activity className="w-6 h-6 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Historial de Actividad</h3>
        </div>
        
        <div className="space-y-4">
          {historial.map((evento) => (
            <div key={evento.id} className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-xl">
              <div className="flex-shrink-0 w-3 h-3 bg-blue-400 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-medium">{evento.accion.replace('_', ' ')}</h4>
                  <span className="text-slate-400 text-sm">
                    {new Date(evento.fecha).toLocaleString()}
                  </span>
                </div>
                <p className="text-slate-300 text-sm mt-1">{evento.detalles}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
