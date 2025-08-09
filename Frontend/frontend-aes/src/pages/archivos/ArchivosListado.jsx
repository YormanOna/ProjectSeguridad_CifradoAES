import { useState, useEffect } from "react";
import api from "../../api/config";
import { saveBlob, fmtBytes } from "../../utils/format";
import ArchivoDetalle from "./ArchivoDetalle";
import { 
  Files, 
  Download, 
  Search, 
  Filter, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive, 
  Code, 
  File,
  Calendar,
  HardDrive,
  Lock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  Trash2,
  Share2,
  MoreVertical,
  Shield
} from "lucide-react";

export default function ArchivosListado({ recientes = [], recargar = 0 }) {
  const [vistaActual, setVistaActual] = useState('lista'); // 'lista' o 'detalle'
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [descargarId, setDescargarId] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [downloadingFiles, setDownloadingFiles] = useState(new Set());
  const [archivos, setArchivos] = useState([]); // Nueva state para archivos de la BD

  // Stats basados en archivos de la BD
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    encryptedFiles: 0,
    lastUpload: "Ninguno"
  });

  // Cargar archivos desde la API
  useEffect(() => {
    cargarArchivos();
  }, [recargar]); // Recargar cuando cambie el prop recargar

  const cargarArchivos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/archivos/');
      const archivosData = response.data;
      setArchivos(archivosData);
      
      // Calcular estadísticas
      setStats({
        totalFiles: archivosData.length,
        totalSize: archivosData.reduce((acc, file) => acc + (file.tamano_bytes || 0), 0),
        encryptedFiles: archivosData.length,
        lastUpload: archivosData.length > 0 ? "Reciente" : "Ninguno"
      });
    } catch (error) {
      console.error('Error cargando archivos:', error);
      setMsg('Error al cargar los archivos');
    } finally {
      setLoading(false);
    }
  };

  // Combinar archivos de la BD con recientes (evitar duplicados)
  const todosLosArchivos = [...archivos, ...recientes.filter(r => 
    !archivos.some(a => a.id === r.id)
  )];

  useEffect(() => {
    // Actualizar stats cuando cambien los archivos
    const total = todosLosArchivos.length;
    const totalSize = todosLosArchivos.reduce((acc, file) => acc + (file.tamano_bytes || 0), 0);
    
    setStats({
      totalFiles: total,
      totalSize: totalSize,
      encryptedFiles: total,
      lastUpload: total > 0 ? "Reciente" : "Ninguno"
    });
  }, [archivos, recientes]);

  const getFileIcon = (nombre) => {
    const ext = nombre?.split('.').pop()?.toLowerCase();
    if (!ext) return File;
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext)) return Image;
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(ext)) return Video;
    if (['mp3', 'wav', 'flac', 'aac', 'm4a'].includes(ext)) return Music;
    if (['txt', 'doc', 'docx', 'pdf', 'rtf'].includes(ext)) return FileText;
    if (['zip', 'rar', 'tar', 'gz', '7z'].includes(ext)) return Archive;
    if (['js', 'py', 'java', 'cpp', 'html', 'css', 'json', 'xml'].includes(ext)) return Code;
    
    return File;
  };

  const getFileTypeColor = (nombre) => {
    const ext = nombre?.split('.').pop()?.toLowerCase();
    if (!ext) return "text-slate-400";
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext)) return "text-green-400";
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(ext)) return "text-red-400";
    if (['mp3', 'wav', 'flac', 'aac', 'm4a'].includes(ext)) return "text-purple-400";
    if (['txt', 'doc', 'docx', 'pdf', 'rtf'].includes(ext)) return "text-blue-400";
    if (['zip', 'rar', 'tar', 'gz', '7z'].includes(ext)) return "text-yellow-400";
    if (['js', 'py', 'java', 'cpp', 'html', 'css', 'json', 'xml'].includes(ext)) return "text-orange-400";
    
    return "text-slate-400";
  };

  const descargar = async (id, nombre = "archivo.bin", cifrado = false) => {
    setMsg("");
    setDownloadingFiles(prev => new Set([...prev, id]));
    
    try {
      const endpoint = cifrado ? `/archivos/descargar-cifrado/${id}` : `/archivos/descifrar/${id}`;
      const response = await api.get(endpoint, { responseType: 'blob' });
      
      const nombreArchivo = cifrado ? `${nombre}.encrypted` : nombre;
      saveBlob(response.data, nombreArchivo);
      
      const tipoDescarga = cifrado ? "cifrado" : "descifrado";
      setMsg(`✅ ${nombreArchivo} descargado ${tipoDescarga} correctamente.`);
    } catch (error) {
      console.error('Error descargando archivo:', error);
      setMsg(`❌ Error al descargar ${nombre}. Verifica tus permisos.`);
    } finally {
      setDownloadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const descargarPorId = async () => {
    if (!descargarId.trim()) {
      setMsg("❌ Por favor, ingresa un ID de archivo válido.");
      return;
    }
    
    await descargar(descargarId, `archivo_${descargarId}`);
    setDescargarId("");
  };

  const filteredFiles = todosLosArchivos.filter(archivo => {
    const matchesSearch = archivo.nombre_original?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         archivo.id.toString().includes(searchTerm);
    
    if (filterType === "all") return matchesSearch;
    
    const ext = archivo.nombre_original?.split('.').pop()?.toLowerCase();
    switch (filterType) {
      case "images": return matchesSearch && ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext);
      case "documents": return matchesSearch && ['txt', 'doc', 'docx', 'pdf', 'rtf'].includes(ext);
      case "media": return matchesSearch && ['mp4', 'avi', 'mov', 'mp3', 'wav', 'flac'].includes(ext);
      case "code": return matchesSearch && ['js', 'py', 'java', 'cpp', 'html', 'css', 'json'].includes(ext);
      default: return matchesSearch;
    }
  });

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (sortBy) {
      case "name": return (a.nombre_original || "").localeCompare(b.nombre_original || "");
      case "size": return (b.tamano_bytes || 0) - (a.tamano_bytes || 0);
      case "recent": 
      default: return b.id - a.id;
    }
  });

  // Función para ver detalle de un archivo
  const verDetalle = (archivoId) => {
    setArchivoSeleccionado(archivoId);
    setVistaActual('detalle');
  };

  const listadoView = (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center space-x-3">
            <Files className="w-8 h-8 text-green-400" />
            <span>Mis Archivos Cifrados</span>
          </h1>
          <p className="text-slate-400 mt-2">
            Gestiona tus archivos protegidos con cifrado AES-256-GCM
          </p>
        </div>
        
        <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
          <Lock className="w-5 h-5 text-green-400" />
          <span className="text-green-300 font-medium">Cifrado Activo</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Files className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Total de Archivos</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">{stats.totalFiles}</p>
          </div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <HardDrive className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Espacio Usado</p>
            <p className="text-2xl font-bold text-green-400 mt-1">{fmtBytes(stats.totalSize)}</p>
          </div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Lock className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Archivos Cifrados</p>
            <p className="text-2xl font-bold text-purple-400 mt-1">{stats.encryptedFiles}</p>
          </div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-yellow-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Última Subida</p>
            <p className="text-2xl font-bold text-yellow-400 mt-1">{stats.lastUpload}</p>
          </div>
        </div>
      </div>

      {/* Download by ID Section */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Download className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">Descargar por ID</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              value={descargarId}
              onChange={e => setDescargarId(e.target.value)}
              placeholder="Ingresa el ID del archivo (ej: 1234)"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button 
            onClick={descargarPorId}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-200 hover:bg-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            <span>Descargar</span>
          </button>
        </div>

        {msg && (
          <div className={`mt-4 p-3 rounded-lg ${
            msg.includes("❌") 
              ? "bg-red-600/20 border border-red-500/30 text-red-200" 
              : "bg-green-600/20 border border-green-500/30 text-green-200"
          }`}>
            <p className="text-sm">{msg}</p>
          </div>
        )}
      </div>

      {/* Search and Filter Section */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar archivos por nombre o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los tipos</option>
                <option value="images">Imágenes</option>
                <option value="documents">Documentos</option>
                <option value="media">Media</option>
                <option value="code">Código</option>
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="recent">Más recientes</option>
              <option value="name">Por nombre</option>
              <option value="size">Por tamaño</option>
            </select>
          </div>
        </div>
      </div>

      {/* Files List */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50">
          <h2 className="text-xl font-semibold text-white flex items-center justify-between">
            <span>Archivos en Esta Sesión ({sortedFiles.length})</span>
            <span className="text-sm text-slate-400 font-normal">
              {searchTerm && `Filtrando por: "${searchTerm}"`}
            </span>
          </h2>
        </div>

        <div className="divide-y divide-slate-700/50">
          {sortedFiles.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-slate-700/30 rounded-xl p-8 max-w-md mx-auto">
                <Files className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {searchTerm || filterType !== "all" ? "Sin resultados" : "Sin archivos"}
                </h3>
                <p className="text-slate-400 mb-6">
                  {searchTerm || filterType !== "all" 
                    ? "No se encontraron archivos con los filtros actuales."
                    : "Aún no has subido archivos. ¡Comienza subiendo tu primer archivo!"
                  }
                </p>
                {searchTerm || filterType !== "all" ? (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterType("all");
                    }}
                    className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-200 hover:bg-blue-600/30 transition-colors duration-200"
                  >
                    Limpiar filtros
                  </button>
                ) : null}
              </div>
            </div>
          ) : (
            sortedFiles.map((archivo) => {
              const FileIcon = getFileIcon(archivo.nombre_original);
              const fileTypeColor = getFileTypeColor(archivo.nombre_original);
              const isDownloading = downloadingFiles.has(archivo.id);

              return (
                <div key={archivo.id} className="p-6 hover:bg-slate-700/30 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-slate-700/50 rounded-xl border border-slate-600/50 flex items-center justify-center">
                          <FileIcon className={`w-6 h-6 ${fileTypeColor}`} />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-white font-medium truncate">
                            {archivo.nombre_original || `Archivo ${archivo.id}`}
                          </h3>
                          <div className="flex items-center space-x-1">
                            <Lock className="w-4 h-4 text-green-400" />
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-slate-400">
                          <span className="font-mono">ID: {archivo.id}</span>
                          {archivo.tamano_bytes && (
                            <span>{fmtBytes(archivo.tamano_bytes)}</span>
                          )}
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Subido recientemente</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Botón Descargar Descifrado */}
                      <button
                        onClick={() => descargar(archivo.id, archivo.nombre_original, false)}
                        disabled={isDownloading}
                        className="flex items-center space-x-2 px-3 py-2 bg-green-600/20 border border-green-500/30 rounded-lg text-green-200 hover:bg-green-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        {isDownloading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline text-sm">
                          {isDownloading ? "Descargando..." : "Descifrar"}
                        </span>
                      </button>

                      {/* Botón Descargar Cifrado */}
                      <button
                        onClick={() => descargar(archivo.id, archivo.nombre_original, true)}
                        disabled={isDownloading}
                        className="flex items-center space-x-2 px-3 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-200 hover:bg-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        {isDownloading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Shield className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline text-sm">
                          Cifrado
                        </span>
                      </button>

                      <div className="relative group">
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-600/50 rounded-lg transition-colors duration-200">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {/* Dropdown menu - placeholder for future features */}
                        <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                          <div className="p-2">
                            <button 
                              className="w-full flex items-center space-x-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors duration-200"
                              onClick={() => verDetalle(archivo.id)}
                            >
                              <Eye className="w-4 h-4" />
                              <span>Ver detalles</span>
                            </button>
                            <button className="w-full flex items-center space-x-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors duration-200">
                              <Share2 className="w-4 h-4" />
                              <span>Compartir</span>
                            </button>
                            <div className="border-t border-slate-700 my-2"></div>
                            <button className="w-full flex items-center space-x-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-600/10 rounded-lg transition-colors duration-200">
                              <Trash2 className="w-4 h-4" />
                              <span>Eliminar</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Security Info Footer */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6">
        <div className="flex items-start space-x-4">
          <Lock className="w-6 h-6 text-blue-400 mt-1" />
          <div>
            <h3 className="text-blue-200 font-semibold mb-2">Protección Garantizada</h3>
            <p className="text-blue-300/80">
              Todos tus archivos están protegidos con cifrado AES-256-GCM de grado militar. 
              Solo tú puedes acceder a ellos usando tu clave UEK personal. El servidor nunca 
              tiene acceso a tus datos sin cifrar (arquitectura zero-knowledge).
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Mostrar detalle de archivo cuando se selecciona
  if (vistaActual === 'detalle' && archivoSeleccionado) {
    return (
      <ArchivoDetalle 
        archivoId={archivoSeleccionado}
        onBack={() => {
          setVistaActual('lista');
          setArchivoSeleccionado(null);
        }}
      />
    );
  }

  // Vista de lista por defecto
  return listadoView;
}
