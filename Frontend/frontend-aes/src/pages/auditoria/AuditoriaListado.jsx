import { useEffect, useState } from "react";
import api from "../../api/config";
import { getCurrentUser } from "../../utils/auth";
import { 
  Shield, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Eye, 
  Filter, 
  Search, 
  Calendar, 
  User, 
  FileText, 
  Key, 
  Lock, 
  RefreshCw, 
  TrendingUp, 
  Clock,
  Download,
  Settings
} from "lucide-react";

/**
 * Requiere rol ADMIN (tu backend valida por JWT).
 */
export default function AuditoriaListado() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  // Obtener información del usuario actual
  const currentUser = getCurrentUser();

  // Stats simulados para demo
  const [stats, setStats] = useState({
    totalEvents: 0,
    successEvents: 0,
    failedEvents: 0,
    todayEvents: 0
  });

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Preparar filtros (por ahora básicos)
      const filtros = {
        busqueda: searchTerm,
        accion: filterAction !== 'all' ? filterAction : undefined,
        estado: filterStatus !== 'all' ? filterStatus : undefined
      };
      
      // Cambiar la URL para usar el endpoint correcto
      const response = await api.get('/auditoria/', { params: filtros });
      const r = response.data;
      setItems(r);
      
      // Calcular estadísticas
      setStats({
        totalEvents: r.length,
        successEvents: r.filter(item => item.estado === 'SUCCESS').length,
        failedEvents: r.filter(item => item.estado !== 'SUCCESS').length,
        todayEvents: r.filter(item => {
          const today = new Date().toDateString();
          const itemDate = new Date(item.creado_en).toDateString();
          return today === itemDate;
        }).length
      });
      
      setErr("");
    } catch (error) {
      console.error('Error cargando auditoría:', error);
      if (error.response?.status === 403) {
        setErr("No tienes permisos de administrador para acceder a esta sección.");
      } else if (error.response?.status === 401) {
        setErr("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      } else {
        setErr("Error al cargar los datos de auditoría. Por favor, intenta nuevamente.");
      }
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const getActionIcon = (accion) => {
    switch (accion?.toUpperCase()) {
      case 'LOGIN': return User;
      case 'LOGOUT': return User;
      case 'CIFRAR': return Lock;
      case 'DESCIFRAR': return Eye;
      case 'SUBIR_ARCHIVO': return FileText;
      case 'GENERAR_CLAVE': return Key;
      case 'ROTAR_CLAVE': return RefreshCw;
      default: return Activity;
    }
  };

  const getActionColor = (accion) => {
    switch (accion?.toUpperCase()) {
      case 'LOGIN': return "text-green-400";
      case 'LOGOUT': return "text-yellow-400";
      case 'CIFRAR': return "text-blue-400";
      case 'DESCIFRAR': return "text-purple-400";
      case 'SUBIR_ARCHIVO': return "text-orange-400";
      case 'GENERAR_CLAVE': return "text-pink-400";
      case 'ROTAR_CLAVE': return "text-cyan-400";
      default: return "text-slate-400";
    }
  };

  const getStatusIcon = (estado) => {
    switch (estado?.toUpperCase()) {
      case 'SUCCESS': return CheckCircle;
      case 'FAILED': return XCircle;
      case 'WARNING': return AlertTriangle;
      default: return AlertTriangle;
    }
  };

  const getStatusColor = (estado) => {
    switch (estado?.toUpperCase()) {
      case 'SUCCESS': return "text-green-400";
      case 'FAILED': return "text-red-400";
      case 'WARNING': return "text-yellow-400";
      default: return "text-slate-400";
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.accion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tipo_recurso?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.recurso_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = filterAction === "all" || item.accion === filterAction;
    const matchesStatus = filterStatus === "all" || item.estado === filterStatus;
    
    let matchesDate = true;
    if (dateRange !== "all") {
      const now = new Date();
      const itemDate = new Date(item.creado_en);
      switch (dateRange) {
        case "today":
          matchesDate = now.toDateString() === itemDate.toDateString();
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = itemDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = itemDate >= monthAgo;
          break;
      }
    }

    return matchesSearch && matchesAction && matchesStatus && matchesDate;
  });

  if (!currentUser || !currentUser.isAdmin) {
    return (
      <div className="space-y-8">
        <div className="text-center p-12">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8 max-w-md mx-auto">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Acceso Restringido</h2>
            <p className="text-slate-400">
              Esta sección requiere permisos de administrador. Contacta al administrador del sistema.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent flex items-center space-x-3">
            <Shield className="w-8 h-8 text-red-400" />
            <span>Auditoría de Seguridad</span>
          </h1>
          <p className="text-slate-400 mt-2">
            Monitoreo completo de todas las actividades del sistema
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={cargarDatos}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-200 hover:bg-blue-600/30 disabled:opacity-50 transition-colors duration-200"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
          
          <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
            <Activity className="w-5 h-5 text-green-400" />
            <span className="text-green-300 font-medium">En Vivo</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {err && (
        <div className="bg-red-600/20 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-red-200 font-medium">Error de Acceso</p>
              <p className="text-red-300/80 text-sm">{err}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-blue-400" />
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Total de Eventos</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">{stats.totalEvents}</p>
          </div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Eventos Exitosos</p>
            <p className="text-2xl font-bold text-green-400 mt-1">{stats.successEvents}</p>
          </div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <XCircle className="w-8 h-8 text-red-400" />
            <AlertTriangle className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Eventos Fallidos</p>
            <p className="text-2xl font-bold text-red-400 mt-1">{stats.failedEvents}</p>
          </div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-purple-400" />
            <Calendar className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Eventos Hoy</p>
            <p className="text-2xl font-bold text-purple-400 mt-1">{stats.todayEvents}</p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por acción, recurso o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Action Filter */}
          <div>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas las acciones</option>
              <option value="LOGIN">Login</option>
              <option value="CIFRAR">Cifrar</option>
              <option value="DESCIFRAR">Descifrar</option>
              <option value="GENERAR_CLAVE">Generar Clave</option>
              <option value="SUBIR_ARCHIVO">Subir Archivo</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="SUCCESS">Exitoso</option>
              <option value="FAILED">Fallido</option>
              <option value="WARNING">Advertencia</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Registro de Auditoría ({filteredItems.length} eventos)
            </h2>
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-300 hover:text-white transition-colors duration-200">
                <Download className="w-4 h-4" />
                <span className="text-sm">Exportar</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-300 hover:text-white transition-colors duration-200">
                <Settings className="w-4 h-4" />
                <span className="text-sm">Configurar</span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
            <span className="text-slate-400 ml-3">Cargando registros de auditoría...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-slate-700/30 rounded-xl p-8 max-w-md mx-auto">
              <Activity className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Sin Registros</h3>
              <p className="text-slate-400">
                {searchTerm || filterAction !== "all" || filterStatus !== "all"
                  ? "No se encontraron registros con los filtros actuales."
                  : "No hay registros de auditoría disponibles."
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/30">
                <tr>
                  <th className="text-left p-4 text-slate-300 font-medium">Fecha y Hora</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Acción</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Recurso</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Estado</th>
                  <th className="text-left p-4 text-slate-300 font-medium">IP</th>
                  <th className="text-center p-4 text-slate-300 font-medium">Detalles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredItems.map((item) => {
                  const ActionIcon = getActionIcon(item.accion);
                  const StatusIcon = getStatusIcon(item.estado);
                  const actionColor = getActionColor(item.accion);
                  const statusColor = getStatusColor(item.estado);

                  return (
                    <tr key={item.id} className="hover:bg-slate-700/20 transition-colors duration-200">
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-white font-mono text-sm">
                              {new Date(item.creado_en).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-slate-700/30`}>
                            <ActionIcon className={`w-4 h-4 ${actionColor}`} />
                          </div>
                          <span className="text-white font-medium">{item.accion}</span>
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div>
                          {item.tipo_recurso && (
                            <p className="text-slate-300">
                              {item.tipo_recurso} 
                              {item.recurso_id && (
                                <span className="text-slate-400 font-mono ml-1">
                                  #{item.recurso_id}
                                </span>
                              )}
                            </p>
                          )}
                          {!item.tipo_recurso && (
                            <span className="text-slate-500">N/A</span>
                          )}
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                          <span className={`font-medium ${statusColor}`}>
                            {item.estado}
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="text-slate-400 font-mono text-sm">
                          {item.ip || 'N/A'}
                        </span>
                      </td>
                      
                      <td className="p-4 text-center">
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-600/50 rounded-lg transition-colors duration-200">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Security Summary */}
      <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-2xl p-6">
        <div className="flex items-start space-x-4">
          <Shield className="w-6 h-6 text-red-400 mt-1" />
          <div>
            <h3 className="text-red-200 font-semibold mb-2">Monitoreo de Seguridad Activo</h3>
            <p className="text-red-300/80">
              Todas las acciones del sistema están siendo monitoreadas y registradas para 
              garantizar la seguridad y trazabilidad. Los logs se almacenan de forma segura 
              y solo son accesibles por administradores autorizados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
