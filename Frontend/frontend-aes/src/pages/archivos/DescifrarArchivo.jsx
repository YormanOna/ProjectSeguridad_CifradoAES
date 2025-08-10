import React, { useState, useRef } from 'react';
import api from '../../api/config';
import { 
  Upload, 
  Key, 
  Download, 
  Shield, 
  FileText, 
  Lock, 
  Unlock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  X
} from "lucide-react";

const DescifrarArchivo = () => {
  const [file, setFile] = useState(null);
  const [key, setKey] = useState(''); // Faltaba este estado
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fileHash, setFileHash] = useState(''); // Hash del archivo cifrado
  const [decryptedFile, setDecryptedFile] = useState(null); // Archivo descifrado para previsualización
  const [showPreview, setShowPreview] = useState(false); // Mostrar previsualización
  const fileInputRef = useRef(null);

  // Función para detectar tipo de archivo
  const getFileType = (filename) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
    const textTypes = ['txt', 'md', 'json', 'xml', 'csv'];
    const pdfTypes = ['pdf'];
    
    if (imageTypes.includes(extension)) return 'image';
    if (textTypes.includes(extension)) return 'text';
    if (pdfTypes.includes(extension)) return 'pdf';
    return 'other';
  };

  // Función para calcular el hash SHA-256 del archivo
  const calcularHashArchivo = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const buffer = e.target.result;
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        resolve(hashHex);
      };
      reader.readAsArrayBuffer(file);
    });
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

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      setError('');
      setSuccess(false);
      
      // Calcular hash del archivo cifrado
      const hash = await calcularHashArchivo(selectedFile);
      setFileHash(hash);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setError('');
      setSuccess(false);
      
      // Calcular hash del archivo cifrado
      const hash = await calcularHashArchivo(selectedFile);
      setFileHash(hash);
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
      setError('Por favor, selecciona un archivo cifrado para descifrar.');
      return;
    }
    
    if (!key.trim()) {
      setError('Por favor, ingresa la etiqueta de la clave.');
      return;
    }

    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('key', key);
    
    try {
      const response = await api.post('/archivos/desencriptar', formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const blob = new Blob([response.data]);
      const originalFileName = file.name.replace('.encrypted', '').replace('.enc', '');
      
      // Guardar para previsualización
      setDecryptedFile({
        blob: blob,
        name: originalFileName,
        type: blob.type || getFileType(originalFileName),
        url: window.URL.createObjectURL(blob)
      });
      
      // Descargar automáticamente
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = originalFileName;
      a.click();
      window.URL.revokeObjectURL(url);
      
      setSuccess(true);
      setShowPreview(true);
      
      // Reset después de éxito
      setTimeout(() => {
        setFile(null);
        setKey('');
        setSuccess(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 5000);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Clave incorrecta o archivo corrupto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center space-x-3">
          <Unlock className="w-8 h-8 text-green-400" />
          <span>Descifrar Archivo</span>
        </h1>
        <p className="text-slate-400 mt-2">
          Sube un archivo cifrado e ingresa la etiqueta de tu clave para descifrarlo y descargarlo
        </p>
      </div>

      {/* Main Form */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* File Upload Area */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-300">
                Archivo Cifrado
              </label>
              
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-green-400 bg-green-400/10' 
                    : file 
                      ? 'border-green-500 bg-green-500/5'
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
                      <Lock className="w-8 h-8 text-green-400" />
                      <div className="text-left">
                        <p className="font-medium text-green-400">{file.name}</p>
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
                    
                    {/* Hash del archivo */}
                    {fileHash && (
                      <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600/50">
                        <div className="flex items-center space-x-2 mb-1">
                          <Shield className="w-4 h-4 text-amber-400" />
                          <span className="text-sm font-medium text-amber-400">Hash SHA-256</span>
                        </div>
                        <p className="text-xs text-amber-300 font-mono break-all leading-relaxed">
                          {fileHash}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-slate-300">
                        Arrastra tu archivo cifrado aquí
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
                Etiqueta de la Clave
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={key}
                  onChange={handleKeyChange}
                  placeholder="Ingresa la etiqueta de tu clave (ej: DocumentosImportantes)"
                  className="w-full pl-11 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                <p className="text-green-400">¡Archivo descifrado y descargado exitosamente!</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!file || !key.trim() || loading}
              className="w-full flex items-center justify-center space-x-3 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-medium rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Descifrando...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Descifrar y Descargar</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* Preview del archivo descifrado */}
        {showPreview && decryptedFile && (
          <div className="mt-8 bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Archivo Descifrado</h3>
              <button 
                onClick={() => setShowPreview(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">Descifrado exitoso: {decryptedFile.name}</span>
              </div>
              
              {/* Vista previa según el tipo de archivo */}
              {decryptedFile.type === 'image' && (
                <div className="border border-slate-600 rounded-lg overflow-hidden">
                  <img 
                    src={decryptedFile.url} 
                    alt={decryptedFile.name}
                    className="max-w-full max-h-96 object-contain bg-slate-900"
                  />
                </div>
              )}
              
              {decryptedFile.type === 'text' && (
                <div className="border border-slate-600 rounded-lg p-4 bg-slate-900">
                  <iframe 
                    src={decryptedFile.url}
                    className="w-full h-64 bg-white text-black"
                    title="Vista previa del texto"
                  />
                </div>
              )}
              
              {decryptedFile.type === 'pdf' && (
                <div className="border border-slate-600 rounded-lg overflow-hidden">
                  <iframe 
                    src={decryptedFile.url}
                    className="w-full h-96"
                    title="Vista previa del PDF"
                  />
                </div>
              )}
              
              {decryptedFile.type === 'other' && (
                <div className="border border-slate-600 rounded-lg p-8 text-center text-slate-400">
                  <FileText className="w-16 h-16 mx-auto mb-4" />
                  <p>Vista previa no disponible para este tipo de archivo</p>
                  <p className="text-sm mt-2">El archivo se ha descargado correctamente</p>
                </div>
              )}
              
              {/* Botón para volver a descargar */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = decryptedFile.url;
                    a.download = decryptedFile.name;
                    a.click();
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-lg text-green-200 hover:bg-green-600/30 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar de nuevo</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-400">Información de Seguridad</h3>
              <ul className="text-sm text-blue-300 space-y-1">
                <li>• Acepta cualquier archivo cifrado</li>
                <li>• Usa la etiqueta de tu clave (creada en Gestión de Claves)</li>
                <li>• El archivo se descarga automáticamente una vez descifrado</li>
                <li>• Solo puedes usar tus propias claves</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescifrarArchivo;
