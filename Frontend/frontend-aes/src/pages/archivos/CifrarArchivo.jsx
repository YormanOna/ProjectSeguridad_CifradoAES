import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Key, 
  Download, 
  Shield, 
  FileText, 
  Lock, 
  File,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  X,
  Image,
  Video,
  Music,
  Archive,
  Code
} from "lucide-react";

const CifrarArchivo = () => {
  const [file, setFile] = useState(null);
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

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
      setError('');
      setSuccess(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setSuccess(false);
    }
  };

  const handleKeyChange = (e) => {
    setKey(e.target.value);
    setError('');
    setSuccess(false);
  };

  const removeFile = () => {
    setFile(null);
    setError('');
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Por favor, selecciona un archivo para cifrar.');
      return;
    }
    
    if (!key.trim()) {
      setError('Por favor, ingresa una clave para el cifrado.');
      return;
    }

    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('key', key);
    
    try {
      const response = await fetch('/api/archivos/encriptar', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Error al cifrar el archivo');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name + '.enc';
      a.click();
      window.URL.revokeObjectURL(url);
      
      setSuccess(true);
      // Reset después de éxito
      setTimeout(() => {
        setFile(null);
        setKey('');
        setSuccess(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 3000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const FileIcon = file ? getFileIcon(file.type) : Upload;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent flex items-center space-x-3">
          <Lock className="w-8 h-8 text-purple-400" />
          <span>Cifrar Archivo</span>
        </h1>
        <p className="text-slate-400 mt-2">
          Sube un archivo e ingresa una clave para cifrarlo y descargarlo
        </p>
      </div>

      {/* Main Form */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* File Upload Area */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-300">
                Archivo a Cifrar
              </label>
              
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-purple-400 bg-purple-400/10' 
                    : file 
                      ? 'border-purple-500 bg-purple-500/5'
                      : 'border-slate-600 hover:border-slate-500'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                {file ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-3">
                      <FileIcon className="w-8 h-8 text-purple-400" />
                      <div className="text-left">
                        <p className="font-medium text-purple-400">{file.name}</p>
                        <p className="text-sm text-slate-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-1 hover:bg-red-500/20 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-slate-300">
                        Arrastra tu archivo aquí
                      </p>
                      <p className="text-slate-400">
                        o haz clic para seleccionarlo
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Key Input */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-300">
                Clave de Cifrado
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={key}
                  onChange={handleKeyChange}
                  placeholder="Ingresa una clave segura para cifrar el archivo"
                  className="w-full pl-11 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-center space-x-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-green-400">¡Archivo cifrado y descargado exitosamente!</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!file || !key.trim() || loading}
              className="w-full flex items-center justify-center space-x-3 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-medium rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Cifrando...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Cifrar y Descargar</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-400">Información de Seguridad</h3>
              <ul className="text-sm text-blue-300 space-y-1">
                <li>• Se utiliza cifrado AES-256-GCM para máxima seguridad</li>
                <li>• El archivo se descarga con extensión .enc</li>
                <li>• Guarda tu clave de forma segura, será necesaria para descifrar</li>
                <li>• Tus claves no se almacenan en el servidor</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CifrarArchivo;
