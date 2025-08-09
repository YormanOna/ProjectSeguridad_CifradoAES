import { useState, useEffect } from "react";
import { 
  Settings, 
  Server, 
  Database, 
  Key, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  HardDrive,
  Wifi,
  Lock,
  Activity,
  Save,
  RefreshCw,
  Download,
  Upload
} from "lucide-react";

export default function AdminConfiguracion() {
  const [config, setConfig] = useState({
    sistema: {
      nombreServicio: "SecureVault AES",
      versionApi: "1.0.0",
      modoDebug: false,
      logLevel: "INFO",
      maxUsuarios: 10000,
      backupAutomatico: true,
      intervalBackup: 6 // horas
    },
    seguridad: {
      tiempoSesion: 30, // minutos
      intentosMaxLogin: 5,
      bloqueoTemporal: 15, // minutos
      fuerzaPassword: "ALTA",
      cifradoTLS: true,
      validarIP: true
    },
    almacenamiento: {
      rutaArchivos: "/data/archivos",
      limiteUsuario: 5, // GB
      limiteGlobal: 1000, // GB
      compresionArchivos: true,
      limpirezaAutomatica: true,
      diasRetencion: 365
    },
    notificaciones: {
      emailAdmin: "admin@sistema.com",
      alertasSeguridad: true,
      reportesSemanales: true,
      notificarBackups: true,
      webhookUrl: ""
    }
  });

  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [estadoSistema, setEstadoSistema] = useState({
    servicios: [
      { nombre: "API Principal", estado: "ACTIVO", uptime: "99.9%" },
      { nombre: "Base de Datos", estado: "ACTIVO", uptime: "100%" },
      { nombre: "Servicio de Cifrado", estado: "ACTIVO", uptime: "99.8%" },
      { nombre: "Sistema de Backup", estado: "ACTIVO", uptime: "98.5%" }
    ],
    recursos: {
      cpu: 45,
      memoria: 62,
      disco: 78,
      red: 12
    }
  });

  const handleConfigChange = (seccion, campo, valor) => {
    setConfig(prev => ({
      ...prev,
      [seccion]: {
        ...prev[seccion],
        [campo]: valor
      }
    }));
  };

  const guardarConfiguracion = async () => {
    setGuardando(true);
    setMensaje('');

    try {
      // Simular guardado - aquí iría la llamada real a la API
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMensaje('✅ Configuración guardada correctamente');
    } catch (error) {
      setMensaje('❌ Error al guardar la configuración');
    } finally {
      setGuardando(false);
    }
  };

  const exportarConfiguracion = () => {
    const configJSON = JSON.stringify(config, null, 2);
    const blob = new Blob([configJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sistema-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importarConfiguracion = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedConfig = JSON.parse(e.target.result);
          setConfig(importedConfig);
          setMensaje('✅ Configuración importada correctamente');
        } catch (error) {
          setMensaje('❌ Error al importar la configuración');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent flex items-center space-x-3">
            <Settings className="w-8 h-8 text-orange-400" />
            <span>Configuración del Sistema</span>
          </h1>
          <p className="text-slate-400 mt-2">
            Administra la configuración y parámetros del sistema de cifrado
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept=".json"
            onChange={importarConfiguracion}
            className="hidden"
            id="importConfig"
          />
          
          <label
            htmlFor="importConfig"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-200 hover:bg-blue-600/30 transition-colors duration-200 cursor-pointer"
          >
            <Upload className="w-5 h-5" />
            <span>Importar</span>
          </label>

          <button 
            onClick={exportarConfiguracion}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-xl text-green-200 hover:bg-green-600/30 transition-colors duration-200"
          >
            <Download className="w-5 h-5" />
            <span>Exportar</span>
          </button>

          <button 
            onClick={guardarConfiguracion}
            disabled={guardando}
            className="flex items-center space-x-2 px-6 py-2 bg-orange-600/20 border border-orange-500/30 rounded-xl text-orange-200 hover:bg-orange-600/30 transition-colors duration-200 disabled:opacity-50"
          >
            {guardando ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>{guardando ? 'Guardando...' : 'Guardar Todo'}</span>
          </button>
        </div>
      </div>

      {/* Message */}
      {mensaje && (
        <div className={`p-4 rounded-xl ${
          mensaje.includes('✅') 
            ? 'bg-green-600/10 border border-green-500/30 text-green-200'
            : 'bg-red-600/10 border border-red-500/30 text-red-200'
        }`}>
          {mensaje}
        </div>
      )}

      {/* System Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Services Status */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <Server className="w-6 h-6 text-green-400" />
            <span>Estado de Servicios</span>
          </h3>
          
          <div className="space-y-4">
            {estadoSistema.servicios.map((servicio, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-white font-medium">{servicio.nombre}</div>
                    <div className="text-slate-400 text-sm">{servicio.estado}</div>
                  </div>
                </div>
                <div className="text-green-400 font-mono text-sm">{servicio.uptime}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Usage */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <Activity className="w-6 h-6 text-blue-400" />
            <span>Uso de Recursos</span>
          </h3>
          
          <div className="space-y-4">
            {Object.entries(estadoSistema.recursos).map(([recurso, porcentaje]) => (
              <div key={recurso}>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-300 capitalize">{recurso}</span>
                  <span className="text-white font-mono">{porcentaje}%</span>
                </div>
                <div className="w-full bg-slate-600/30 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      porcentaje > 80 ? 'bg-red-400' : 
                      porcentaje > 60 ? 'bg-yellow-400' : 'bg-green-400'
                    }`}
                    style={{ width: `${porcentaje}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Configuration Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Sistema */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <Server className="w-6 h-6 text-blue-400" />
            <span>Configuración del Sistema</span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 font-medium mb-2">Nombre del Servicio</label>
              <input
                type="text"
                value={config.sistema.nombreServicio}
                onChange={(e) => handleConfigChange('sistema', 'nombreServicio', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2">Nivel de Log</label>
              <select
                value={config.sistema.logLevel}
                onChange={(e) => handleConfigChange('sistema', 'logLevel', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="DEBUG">DEBUG</option>
                <option value="INFO">INFO</option>
                <option value="WARNING">WARNING</option>
                <option value="ERROR">ERROR</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2">Máximo de Usuarios</label>
              <input
                type="number"
                value={config.sistema.maxUsuarios}
                onChange={(e) => handleConfigChange('sistema', 'maxUsuarios', parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-300 font-medium">Modo Debug</div>
                <div className="text-slate-400 text-sm">Habilitar logs detallados</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.sistema.modoDebug}
                  onChange={(e) => handleConfigChange('sistema', 'modoDebug', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Seguridad */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <Shield className="w-6 h-6 text-red-400" />
            <span>Configuración de Seguridad</span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 font-medium mb-2">Tiempo de Sesión (minutos)</label>
              <input
                type="number"
                value={config.seguridad.tiempoSesion}
                onChange={(e) => handleConfigChange('seguridad', 'tiempoSesion', parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-red-500/50"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2">Intentos Máximos de Login</label>
              <input
                type="number"
                value={config.seguridad.intentosMaxLogin}
                onChange={(e) => handleConfigChange('seguridad', 'intentosMaxLogin', parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-red-500/50"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2">Fuerza de Contraseña</label>
              <select
                value={config.seguridad.fuerzaPassword}
                onChange={(e) => handleConfigChange('seguridad', 'fuerzaPassword', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-red-500/50"
              >
                <option value="BAJA">BAJA</option>
                <option value="MEDIA">MEDIA</option>
                <option value="ALTA">ALTA</option>
                <option value="EXTREMA">EXTREMA</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-300 font-medium">Validación de IP</div>
                <div className="text-slate-400 text-sm">Verificar IP en cada sesión</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.seguridad.validarIP}
                  onChange={(e) => handleConfigChange('seguridad', 'validarIP', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Almacenamiento */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <HardDrive className="w-6 h-6 text-green-400" />
            <span>Configuración de Almacenamiento</span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 font-medium mb-2">Ruta de Archivos</label>
              <input
                type="text"
                value={config.almacenamiento.rutaArchivos}
                onChange={(e) => handleConfigChange('almacenamiento', 'rutaArchivos', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-green-500/50"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2">Límite por Usuario (GB)</label>
              <input
                type="number"
                value={config.almacenamiento.limiteUsuario}
                onChange={(e) => handleConfigChange('almacenamiento', 'limiteUsuario', parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-green-500/50"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2">Días de Retención</label>
              <input
                type="number"
                value={config.almacenamiento.diasRetencion}
                onChange={(e) => handleConfigChange('almacenamiento', 'diasRetencion', parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-green-500/50"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-300 font-medium">Compresión Automática</div>
                <div className="text-slate-400 text-sm">Comprimir archivos grandes</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.almacenamiento.compresionArchivos}
                  onChange={(e) => handleConfigChange('almacenamiento', 'compresionArchivos', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notificaciones */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
            <span>Configuración de Notificaciones</span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 font-medium mb-2">Email del Administrador</label>
              <input
                type="email"
                value={config.notificaciones.emailAdmin}
                onChange={(e) => handleConfigChange('notificaciones', 'emailAdmin', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-yellow-500/50"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2">Webhook URL</label>
              <input
                type="url"
                value={config.notificaciones.webhookUrl}
                onChange={(e) => handleConfigChange('notificaciones', 'webhookUrl', e.target.value)}
                placeholder="https://hooks.slack.com/..."
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500/50"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-slate-300 font-medium">Alertas de Seguridad</div>
                  <div className="text-slate-400 text-sm">Notificar eventos críticos</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.notificaciones.alertasSeguridad}
                    onChange={(e) => handleConfigChange('notificaciones', 'alertasSeguridad', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-slate-300 font-medium">Reportes Semanales</div>
                  <div className="text-slate-400 text-sm">Enviar resumen semanal</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.notificaciones.reportesSemanales}
                    onChange={(e) => handleConfigChange('notificaciones', 'reportesSemanales', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Warning */}
      <div className="bg-red-600/10 border border-red-500/30 rounded-2xl p-8">
        <div className="flex items-start space-x-4">
          <AlertTriangle className="w-8 h-8 text-red-400 mt-1" />
          <div>
            <h3 className="text-red-200 font-semibold mb-2 text-lg">⚠️ Zona de Peligro - Configuración Avanzada</h3>
            <p className="text-red-300/80 mb-4">
              Los cambios en esta configuración pueden afectar la seguridad y funcionamiento del sistema. 
              Asegúrate de comprender las implicaciones antes de modificar estos valores.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600/20 border border-red-500/30 rounded-xl text-red-200 hover:bg-red-600/30 transition-colors duration-200">
                <Database className="w-5 h-5" />
                <span>Reiniciar Base de Datos</span>
              </button>
              
              <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600/20 border border-red-500/30 rounded-xl text-red-200 hover:bg-red-600/30 transition-colors duration-200">
                <RefreshCw className="w-5 h-5" />
                <span>Reiniciar Servicios</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
