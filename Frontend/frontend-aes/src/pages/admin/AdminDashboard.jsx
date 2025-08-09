import { useState, useEffect } from "react";
import { 
  Shield, 
  Users, 
  Files, 
  Key, 
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Server,
  Database,
  Lock,
  Eye,
  Settings,
  BarChart3,
  Clock,
  Globe,
  Zap
} from "lucide-react";
import { 
  apiAdminStats, 
  apiAdminActividad, 
  apiAdminAlertas, 
  apiAdminEstadoSistema 
} from "../../api/admin.api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    usuariosActivos: 0,
    totalArchivos: 0,
    archivosCifrados: 0,
    espacioTotal: "0 TB",
    espacioUsado: "0 TB",
    alertasSeguridad: 0,
    sesionesActivas: 0,
    backupsRealizados: 0,
    ultimoBackup: "N/A"
  });

  const [actividad, setActividad] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [estadoSistema, setEstadoSistema] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarDatosAdmin();
  }, []);

  const cargarDatosAdmin = async () => {
    try {
      setLoading(true);
      setError('');

      // Cargar estadísticas principales
      const statsData = await apiAdminStats();
      setStats(statsData);

      // Cargar actividad reciente
      const actividadData = await apiAdminActividad({ limit: 5 });
      setActividad(actividadData);

      // Cargar alertas
      const alertasData = await apiAdminAlertas();
      setAlertas(alertasData);

      // Cargar estado del sistema
      const estadoData = await apiAdminEstadoSistema();
      setEstadoSistema(estadoData);

    } catch (error) {
      console.error('Error cargando datos de administrador:', error);
      setError('Error al cargar los datos del panel. Algunas funciones pueden no estar disponibles.');
      
      // Datos de ejemplo para desarrollo si la API falla
      setStats({
        totalUsuarios: 1247,
        usuariosActivos: 892,
        totalArchivos: 15634,
        archivosCifrados: 15634,
        espacioTotal: "2.4 TB",
        espacioUsado: "1.8 TB",
        alertasSeguridad: 3,
        sesionesActivas: 234,
        backupsRealizados: 156,
        ultimoBackup: "Hace 2 horas"
      });

      setActividad([
        {
          id: 1,
          usuario: "usuario@ejemplo.com",
          accion: "LOGIN_EXITOSO",
          timestamp: new Date().toISOString(),
          ip: "192.168.1.100",
          severity: "info"
        }
      ]);

      setAlertas([
        {
          id: 1,
          tipo: "DESARROLLO",
          mensaje: "Modo de desarrollo - APIs de admin no disponibles",
          timestamp: "Ahora",
          severity: "warning"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'success': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'info': 
      default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'info': 
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400"></div>
          <span className="text-slate-400 ml-4">Cargando panel de administrador...</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-2xl p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-400 mt-1" />
            <div>
              <h3 className="text-yellow-200 font-semibold mb-2">Advertencia</h3>
              <p className="text-yellow-300/80">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent flex items-center space-x-3">
                <Shield className="w-8 h-8 text-red-400" />
                <span>Panel de Administrador</span>
              </h1>
              <p className="text-slate-400 mt-2">
                Monitoreo completo del sistema de cifrado AES y gestión de usuarios
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={cargarDatosAdmin}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-200 hover:bg-blue-600/30 transition-colors duration-200"
              >
                <Activity className="w-5 h-5" />
                <span>Actualizar</span>
              </button>
              
              <div className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-red-300 font-medium">{stats.alertasSeguridad} Alertas</span>
              </div>
              
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
                <Server className="w-5 h-5 text-green-400" />
                <span className="text-green-300 font-medium">Sistema Activo</span>
              </div>
            </div>
          </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-400" />
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-400">{stats.totalUsuarios.toLocaleString()}</div>
              <div className="text-xs text-slate-400">Total</div>
            </div>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Usuarios Registrados</p>
            <div className="flex items-center space-x-2 mt-2">
              <div className="text-sm text-green-400">{stats.usuariosActivos} activos</div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Files className="w-8 h-8 text-green-400" />
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">{stats.totalArchivos.toLocaleString()}</div>
              <div className="text-xs text-slate-400">Cifrados</div>
            </div>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Archivos Protegidos</p>
            <div className="flex items-center space-x-2 mt-2">
              <Lock className="w-4 h-4 text-green-400" />
              <div className="text-sm text-green-400">100% Cifrados</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Database className="w-8 h-8 text-purple-400" />
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-400">{stats.espacioUsado}</div>
              <div className="text-xs text-slate-400">de {stats.espacioTotal}</div>
            </div>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Almacenamiento</p>
            <div className="w-full bg-slate-600/30 rounded-full h-2 mt-2">
              <div className="bg-purple-400 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-yellow-400" />
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-400">{stats.sesionesActivas}</div>
              <div className="text-xs text-slate-400">Activas</div>
            </div>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Sesiones de Usuario</p>
            <div className="flex items-center space-x-2 mt-2">
              <Globe className="w-4 h-4 text-yellow-400" />
              <div className="text-sm text-yellow-400">En línea ahora</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* System Status */}
        <div className="xl:col-span-2">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <Server className="w-6 h-6 text-cyan-400" />
              <span>Estado del Sistema</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <div>
                      <div className="text-green-200 font-medium">Servicio de Cifrado</div>
                      <div className="text-green-300/80 text-sm">Operativo</div>
                    </div>
                  </div>
                  <div className="text-green-400 text-2xl font-bold">99.9%</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Database className="w-6 h-6 text-blue-400" />
                    <div>
                      <div className="text-blue-200 font-medium">Base de Datos</div>
                      <div className="text-blue-300/80 text-sm">Conectada</div>
                    </div>
                  </div>
                  <div className="text-blue-400 text-2xl font-bold">OK</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Key className="w-6 h-6 text-purple-400" />
                    <div>
                      <div className="text-purple-200 font-medium">Gestor de Claves</div>
                      <div className="text-purple-300/80 text-sm">Activo</div>
                    </div>
                  </div>
                  <div className="text-purple-400 text-2xl font-bold">100%</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-6 h-6 text-yellow-400" />
                    <div>
                      <div className="text-yellow-200 font-medium">Carga del Sistema</div>
                      <div className="text-yellow-300/80 text-sm">Normal</div>
                    </div>
                  </div>
                  <div className="text-yellow-400 text-2xl font-bold">45%</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-6 h-6 text-green-400" />
                    <div>
                      <div className="text-green-200 font-medium">Último Backup</div>
                      <div className="text-green-300/80 text-sm">{stats.ultimoBackup}</div>
                    </div>
                  </div>
                  <div className="text-green-400 text-2xl font-bold">✓</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-6 h-6 text-cyan-400" />
                    <div>
                      <div className="text-cyan-200 font-medium">Rendimiento</div>
                      <div className="text-cyan-300/80 text-sm">Óptimo</div>
                    </div>
                  </div>
                  <div className="text-cyan-400 text-2xl font-bold">A+</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Alerts */}
        <div className="xl:col-span-1">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <span>Alertas de Seguridad</span>
            </h3>
            
            <div className="space-y-4">
              {alertas.map((alerta) => (
                <div key={alerta.id} className={`p-4 rounded-xl border ${getSeverityColor(alerta.severity)}`}>
                  <div className="flex items-start space-x-3">
                    {getSeverityIcon(alerta.severity)}
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1">{alerta.tipo}</div>
                      <p className="text-sm opacity-90">{alerta.mensaje}</p>
                      <div className="text-xs opacity-70 mt-2 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{alerta.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700/70 transition-colors duration-200">
              Ver Todas las Alertas
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <Activity className="w-6 h-6 text-green-400" />
            <span>Actividad Reciente del Sistema</span>
          </h3>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-300 hover:text-white transition-colors duration-200">
            <Eye className="w-4 h-4" />
            <span>Ver Todo el Log</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-700/50">
                <th className="pb-3 text-slate-400 font-medium">Usuario</th>
                <th className="pb-3 text-slate-400 font-medium">Acción</th>
                <th className="pb-3 text-slate-400 font-medium">IP</th>
                <th className="pb-3 text-slate-400 font-medium">Tiempo</th>
                <th className="pb-3 text-slate-400 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {actividad.map((item) => (
                <tr key={item.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors duration-200">
                  <td className="py-3 text-white font-mono text-sm">{item.usuario}</td>
                  <td className="py-3 text-slate-300">{item.accion.replace('_', ' ')}</td>
                  <td className="py-3 text-slate-400 font-mono text-sm">{item.ip}</td>
                  <td className="py-3 text-slate-400 text-sm">
                    {new Date(item.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3">
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs ${getSeverityColor(item.severity)}`}>
                      {getSeverityIcon(item.severity)}
                      <span>{item.severity.toUpperCase()}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-slate-800/40 to-slate-700/40 border border-slate-600/50 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <Settings className="w-6 h-6 text-blue-400" />
          <span>Acciones Rápidas de Administrador</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-3 p-4 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-200 hover:bg-blue-600/30 transition-colors duration-200">
            <Users className="w-5 h-5" />
            <span>Gestionar Usuarios</span>
          </button>
          
          <button className="flex items-center justify-center space-x-3 p-4 bg-green-600/20 border border-green-500/30 rounded-xl text-green-200 hover:bg-green-600/30 transition-colors duration-200">
            <Database className="w-5 h-5" />
            <span>Backup Manual</span>
          </button>
          
          <button className="flex items-center justify-center space-x-3 p-4 bg-purple-600/20 border border-purple-500/30 rounded-xl text-purple-200 hover:bg-purple-600/30 transition-colors duration-200">
            <BarChart3 className="w-5 h-5" />
            <span>Reportes Detallados</span>
          </button>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
