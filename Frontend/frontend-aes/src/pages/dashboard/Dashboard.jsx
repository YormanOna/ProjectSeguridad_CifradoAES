import { useEffect, useState } from "react";
import { 
  Shield, 
  Lock, 
  FileText, 
  Key, 
  Activity, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import api from "../../api/config";

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState({
    totalArchivos: 0,
    archivosCifrados: 0,
    clavesActivas: 0,
    ultimaActividad: "Cargando...",
    espacioUsado: "0 GB",
    sistemaEstado: "Operativo"
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Cargar estadísticas del dashboard
      const statsResponse = await api.get('/dashboard/stats');
      setStats(statsResponse.data);
      
      // Cargar actividad reciente desde auditoría (últimos 5 eventos)
      try {
        const activityResponse = await api.get('/admin/auditoria?limit=5');
        const activityData = activityResponse.data.map(item => ({
          id: item.id,
          action: formatearAccion(item.accion),
          file: item.tipo_recurso || 'Sistema',
          time: formatearTiempo(item.creado_en),
          status: item.estado === 'SUCCESS' ? 'success' : 'warning',
          icon: getIconoActividad(item.accion)
        }));
        setRecentActivity(activityData);
      } catch (activityError) {
        console.error("Error cargando actividad reciente:", activityError);
        // Si falla la actividad, usar datos de ejemplo
        setRecentActivity([]);
      }
      
    } catch (err) {
      console.error("Error cargando datos del dashboard:", err);
      setError("Error al cargar los datos del dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear acciones de auditoría
  const formatearAccion = (accion) => {
    const acciones = {
      'CIFRAR': 'Archivo cifrado',
      'DESCIFRAR': 'Archivo descifrado',
      'SUBIR': 'Archivo subido',
      'DESCARGAR': 'Archivo descargado',
      'LOGIN': 'Inicio de sesión',
      'LOGOUT': 'Cierre de sesión',
      'USUARIO_CREADO': 'Usuario creado',
      'USUARIO_ACTUALIZADO': 'Usuario actualizado',
      'USUARIO_ACTIVADO': 'Usuario activado',
      'USUARIO_SUSPENDIDO': 'Usuario suspendido',
      'COMPARTIR': 'Archivo compartido',
      'CLAVE_CREADA': 'Clave de cifrado creada',
      'CLAVE_ROTADA': 'Clave de cifrado rotada'
    };
    return acciones[accion] || accion;
  };

  // Función para formatear tiempo relativo
  const formatearTiempo = (fecha) => {
    const ahora = new Date();
    const fechaItem = new Date(fecha);
    const diferencia = ahora - fechaItem;
    
    const minutos = Math.floor(diferencia / (1000 * 60));
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    
    if (minutos < 1) return 'Hace un momento';
    if (minutos < 60) return `Hace ${minutos} min`;
    if (horas < 24) return `Hace ${horas}h`;
    if (dias < 7) return `Hace ${dias}d`;
    return fechaItem.toLocaleDateString();
  };

  // Función para obtener ícono según la acción
  const getIconoActividad = (accion) => {
    switch (accion) {
      case 'CIFRAR':
      case 'DESCIFRAR':
        return Lock;
      case 'SUBIR':
      case 'DESCARGAR':
        return FileText;
      case 'LOGIN':
      case 'LOGOUT':
        return Users;
      case 'COMPARTIR':
        return Users;
      case 'CLAVE_CREADA':
      case 'CLAVE_ROTADA':
        return Key;
      default:
        return Activity;
    }
  };

  // Función para navegar a la página de auditoría
  const verTodasActividades = () => {
    if (onNavigate) {
      onNavigate('auditoria');
    }
  };

  const securityMetrics = [
    { 
      label: "Archivos Protegidos", 
      value: loading ? "..." : `${stats.archivosCifrados}`, 
      icon: Shield, 
      color: "text-green-400", 
      bgColor: "bg-green-400/10", 
      borderColor: "border-green-400/20" 
    },
    { 
      label: "Cifrado AES-256", 
      value: "Activo", 
      icon: Lock, 
      color: "text-blue-400", 
      bgColor: "bg-blue-400/10", 
      borderColor: "border-blue-400/20" 
    },
    { 
      label: "Claves Activas", 
      value: loading ? "..." : `${stats.clavesActivas}`, 
      icon: Key, 
      color: "text-yellow-400", 
      bgColor: "bg-yellow-400/10", 
      borderColor: "border-yellow-400/20" 
    },
    { 
      label: "Espacio Usado", 
      value: loading ? "..." : stats.espacioUsado, 
      icon: Activity, 
      color: "text-purple-400", 
      bgColor: "bg-purple-400/10", 
      borderColor: "border-purple-400/20" 
    },
  ];



  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
            Panel de Seguridad
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Sistema de cifrado simétrico AES-GCM con gestión avanzada de claves
          </p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-green-300 font-medium">Sistema Operativo</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-600/20 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-red-200 font-medium">Error</p>
              <p className="text-red-300/80 text-sm">{error}</p>
            </div>
            <button 
              onClick={cargarDatos}
              className="ml-auto text-red-400 hover:text-red-300 text-sm font-medium"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Security Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className={`${metric.bgColor} ${metric.borderColor} border rounded-2xl p-6 backdrop-blur-sm hover:scale-105 transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${metric.color}`} />
                <TrendingUp className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">{metric.label}</p>
                <p className={`text-2xl font-bold ${metric.color} mt-1`}>{metric.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        
        {/* Activity Feed */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Activity className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Actividad Reciente</h2>
            </div>
            <button 
              onClick={verTodasActividades}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              Ver todo
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl animate-pulse">
                  <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-slate-600 rounded w-1/3"></div>
                      <div className="h-3 bg-slate-600 rounded w-16"></div>
                    </div>
                    <div className="h-3 bg-slate-600 rounded w-1/4"></div>
                  </div>
                  <div className="w-5 h-5 bg-slate-600 rounded"></div>
                </div>
              ))
            ) : recentActivity.length > 0 ? (
              recentActivity.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl hover:bg-slate-700/50 transition-colors duration-200"
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      activity.status === 'success' ? 'bg-green-400' : 'bg-yellow-400'
                    }`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-white font-medium">{activity.action}</p>
                        <span className="text-xs text-slate-400">{activity.time}</span>
                      </div>
                      <p className="text-slate-400 text-sm">{activity.file}</p>
                    </div>
                    <IconComponent className={`w-5 h-5 ${
                      activity.status === 'success' ? 'text-green-400' : 'text-yellow-400'
                    }`} />
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No hay actividad reciente</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-3">
          <Shield className="w-6 h-6 text-purple-400" />
          <span>Acciones Rápidas</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-blue-600/20 border border-blue-500/30 rounded-xl hover:bg-blue-600/30 transition-colors duration-200 group">
            <FileText className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform duration-200" />
            <div className="text-left">
              <p className="text-blue-200 font-medium">Subir Archivo</p>
              <p className="text-blue-400 text-sm">Cifrado automático</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 bg-green-600/20 border border-green-500/30 rounded-xl hover:bg-green-600/30 transition-colors duration-200 group">
            <Key className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform duration-200" />
            <div className="text-left">
              <p className="text-green-200 font-medium">Generar Clave</p>
              <p className="text-green-400 text-sm">Nueva UEK</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 bg-purple-600/20 border border-purple-500/30 rounded-xl hover:bg-purple-600/30 transition-colors duration-200 group">
            <Activity className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform duration-200" />
            <div className="text-left">
              <p className="text-purple-200 font-medium">Ver Auditoría</p>
              <p className="text-purple-400 text-sm">Logs de seguridad</p>
            </div>
          </button>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-start space-x-4">
          <AlertTriangle className="w-6 h-6 text-yellow-400 mt-1" />
          <div>
            <h3 className="text-yellow-200 font-semibold mb-2">Recordatorio de Seguridad</h3>
            <p className="text-yellow-300/80">
              Todos tus archivos están protegidos con cifrado AES-256-GCM de grado militar. 
              Las claves se gestionan automáticamente usando una jerarquía de tres niveles (DEK/UEK/KEK) 
              para máxima seguridad. Recuerda rotar tus claves periódicamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
