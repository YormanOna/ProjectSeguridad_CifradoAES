import { useState, useRef } from "react";
import FileField from "../../components/forms/FileField";
import { apiSubirArchivo } from "../../api/archivos.api";
import { 
  Upload, 
  File, 
  Lock, 
  CheckCircle, 
  AlertTriangle, 
  Shield, 
  FileText, 
  Image, 
  Video, 
  Music,
  Archive,
  Code,
  RefreshCw,
  X,
  Info,
  Zap
} from "lucide-react";
import { fmtBytes } from "../../utils/format";

export default function ArchivoSubir({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [resp, setResp] = useState(null);
  const [err, setErr] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const getFileIcon = (type) => {
    if (!type) return File;
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    if (type.startsWith('audio/')) return Music;
    if (type.startsWith('text/') || type.includes('document')) return FileText;
    if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return Archive;
    if (type.includes('javascript') || type.includes('python') || type.includes('json')) return Code;
    return File;
  };

  const getFileTypeColor = (type) => {
    if (!type) return "text-slate-400";
    if (type.startsWith('image/')) return "text-green-400";
    if (type.startsWith('video/')) return "text-red-400";
    if (type.startsWith('audio/')) return "text-purple-400";
    if (type.startsWith('text/') || type.includes('document')) return "text-blue-400";
    if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return "text-yellow-400";
    if (type.includes('javascript') || type.includes('python') || type.includes('json')) return "text-orange-400";
    return "text-slate-400";
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setErr("");
      setResp(null);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    setErr("");
    setResp(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const subir = async (e) => {
    e.preventDefault();
    setErr("");
    
    if (!file) {
      setErr("Por favor, selecciona un archivo para subir.");
      return;
    }

    // Simulación de progreso
    setUploading(true);
    setUploadProgress(0);
    
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 20;
      });
    }, 100);

    try {
      const r = await apiSubirArchivo(file);
      setUploadProgress(100);
      setResp(r);
      onUploaded?.(r);
      
      // Reset después de éxito
      setTimeout(() => {
        setFile(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 2000);
      
    } catch (error) {
      clearInterval(progressInterval);
      setErr("Error al subir y cifrar el archivo. Por favor, inténtalo de nuevo.");
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
    }
  };

  const FileIcon = file ? getFileIcon(file.type) : Upload;
  const fileTypeColor = file ? getFileTypeColor(file.type) : "text-slate-400";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent flex items-center space-x-3">
          <Upload className="w-8 h-8 text-purple-400" />
          <span>Subir y Cifrar Archivo</span>
        </h1>
        <p className="text-slate-400 mt-2">
          Tu archivo será cifrado automáticamente con AES-256-GCM antes del almacenamiento
        </p>
      </div>

      {/* Status Messages */}
      {err && (
        <div className="bg-red-600/20 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-red-200 font-medium">Error de Subida</p>
              <p className="text-red-300/80 text-sm">{err}</p>
            </div>
          </div>
        </div>
      )}

      {resp && (
        <div className="bg-green-600/20 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-3">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <p className="text-green-200 font-medium">¡Archivo Cifrado Exitosamente!</p>
              <p className="text-green-300/80 text-sm">Tu archivo está seguro y disponible para descarga</p>
            </div>
          </div>
          
          <div className="bg-slate-700/30 rounded-lg p-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">ID del Archivo:</span>
                <span className="text-white font-mono ml-2">{resp.id}</span>
              </div>
              <div>
                <span className="text-slate-400">Nombre:</span>
                <span className="text-white ml-2">{resp.nombre_original}</span>
              </div>
              <div>
                <span className="text-slate-400">Tamaño:</span>
                <span className="text-white ml-2">{fmtBytes(resp.tamano_bytes)}</span>
              </div>
              <div>
                <span className="text-slate-400">Fecha:</span>
                <span className="text-white ml-2">{new Date(resp.creado_en).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={subir} className="space-y-6">
        
        {/* File Drop Zone */}
        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
            dragActive
              ? "border-purple-400 bg-purple-600/10"
              : file
              ? "border-green-500/50 bg-green-600/10"
              : "border-slate-600 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) {
                setFile(selectedFile);
                setErr("");
                setResp(null);
              }
            }}
            className="hidden"
          />

          {!file ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-purple-600/20 rounded-full">
                  <Upload className={`w-12 h-12 ${dragActive ? 'text-purple-400 animate-bounce' : 'text-purple-400'}`} />
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {dragActive ? "Suelta el archivo aquí" : "Arrastra tu archivo aquí"}
                </h3>
                <p className="text-slate-400 mb-4">
                  o haz clic para seleccionar un archivo desde tu computadora
                </p>
                
                <button
                  type="button"
                  onClick={handleFileSelect}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600/20 border border-purple-500/30 rounded-xl text-purple-200 hover:bg-purple-600/30 transition-colors duration-200"
                >
                  <Upload className="w-5 h-5" />
                  <span>Seleccionar Archivo</span>
                </button>
              </div>

              <div className="text-xs text-slate-500">
                <p>Tamaño máximo: 50 MB</p>
                <p>Formatos soportados: Todos los tipos de archivo</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-green-600/20 rounded-full">
                  <FileIcon className={`w-12 h-12 ${fileTypeColor}`} />
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Archivo Seleccionado</h3>
                <div className="bg-slate-700/50 rounded-xl p-4 max-w-md mx-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileIcon className={`w-6 h-6 ${fileTypeColor}`} />
                      <div className="text-left">
                        <p className="text-white font-medium truncate max-w-48">{file.name}</p>
                        <p className="text-slate-400 text-sm">
                          {fmtBytes(file.size)} • {file.type || 'Tipo desconocido'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-600/20 rounded-lg transition-colors duration-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
              <div>
                <p className="text-white font-medium">Cifrando y subiendo archivo...</p>
                <p className="text-slate-400 text-sm">Aplicando cifrado AES-256-GCM</p>
              </div>
            </div>
            
            <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Progreso</span>
              <span className="text-white font-mono">{Math.round(uploadProgress)}%</span>
            </div>
          </div>
        )}

        {/* Upload Button */}
        {file && !uploading && !resp && (
          <div className="flex justify-center">
            <button
              type="submit"
              className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl text-white font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-600/25"
            >
              <Lock className="w-6 h-6" />
              <span>Cifrar y Subir Archivo</span>
            </button>
          </div>
        )}
      </form>

      {/* Security Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Proceso de Cifrado</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
              <div className="w-8 h-8 bg-blue-600/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 font-bold text-sm">1</span>
              </div>
              <div>
                <p className="text-white font-medium">Generación de DEK</p>
                <p className="text-slate-400 text-sm">Clave única para este archivo</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
              <div className="w-8 h-8 bg-purple-600/20 border border-purple-500/30 rounded-lg flex items-center justify-center">
                <span className="text-purple-400 font-bold text-sm">2</span>
              </div>
              <div>
                <p className="text-white font-medium">Cifrado AES-GCM</p>
                <p className="text-slate-400 text-sm">Protección y autenticación</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
              <div className="w-8 h-8 bg-green-600/20 border border-green-500/30 rounded-lg flex items-center justify-center">
                <span className="text-green-400 font-bold text-sm">3</span>
              </div>
              <div>
                <p className="text-white font-medium">Key Wrapping</p>
                <p className="text-slate-400 text-sm">DEK protegida con tu UEK</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Info className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Características</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-slate-300">Cifrado automático en cliente</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-slate-300">Zero-knowledge del servidor</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-slate-300">Integridad garantizada</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-slate-300">Acceso solo con tu clave</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700/50">
            <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-lg">
              <Zap className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-yellow-200 font-medium text-sm">Máxima Seguridad</p>
                <p className="text-yellow-300/80 text-xs">Grado militar AES-256-GCM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
