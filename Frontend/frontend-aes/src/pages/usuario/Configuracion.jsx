import { useState, useEffect } from "react";
import { 
  Settings, 
  User, 
  Lock, 
  Key, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database,
  Activity,
  Download,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
  Info
} from "lucide-react";

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState('perfil');
  const [perfil, setPerfil] = useState({
    nombre: 'Usuario Demo',
    email: 'usuario@ejemplo.com',
    telefono: '+52 555 123 4567',
    fechaRegistro: '2024-01-15T10:30:00Z',
    ultimoAcceso: new Date().toISOString()
  });
  
  const [configuracion, setConfiguracion] = useState({
    tema: 'dark',
    idioma: 'es',
    notificaciones: {
      email: true,
      push: false,
      seguridad: true
    },
    seguridad: {
      autenticacionDobleFactor: false,
      sesionesSimultaneas: 3,
      timeoutSesion: 30
    },
    privacidad: {
      logAuditoria: true,
      compartirMetadatos: false,
      backupAutomatico: true
    }
  });

  const [cambiarPassword, setCambiarPassword] = useState({
    passwordActual: '',
    passwordNuevo: '',
    confirmarPassword: '',
    mostrarActual: false,
    mostrarNuevo: false,
    mostrarConfirmar: false
  });

  const [estadisticas, setEstadisticas] = useState({
    archivosSubidos: 247,
    espacioUsado: '1.2 GB',
    ultimaActividad: 'Hace 5 minutos',
    sesionesActivas: 2,
    loginsExitosos: 156,
    intentosFallidos: 3
  });

  const tabs = [
    { id: 'perfil', label: 'Mi Perfil', icon: User },
    { id: 'seguridad', label: 'Seguridad', icon: Lock },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
    { id: 'privacidad', label: 'Privacidad', icon: Shield },
    { id: 'datos', label: 'Mis Datos', icon: Database }
  ];

  const handleConfigChange = (categoria, campo, valor) => {
    setConfiguracion(prev => ({
      ...prev,
      [categoria]: {
        ...prev[categoria],
        [campo]: valor
      }
    }));
  };

  const handlePasswordChange = (campo, valor) => {
    setCambiarPassword(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const validarPassword = (password) => {
    const criterios = {
      longitud: password.length >= 8,
      mayuscula: /[A-Z]/.test(password),
      minuscula: /[a-z]/.test(password),
      numero: /\d/.test(password),
      especial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    return criterios;
  };

  const criteriosPassword = validarPassword(cambiarPassword.passwordNuevo);
  const passwordValido = Object.values(criteriosPassword).every(Boolean);
  const passwordsCoinciden = cambiarPassword.passwordNuevo === cambiarPassword.confirmarPassword;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center space-x-3">
            <Settings className="w-8 h-8 text-blue-400" />
            <span>Configuración</span>
          </h1>
          <p className="text-slate-400 mt-2">
            Administra tu perfil, seguridad y preferencias de la aplicación
          </p>
        </div>

        <div className="flex items-center space-x-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <Shield className="w-5 h-5 text-blue-400" />
          <span className="text-blue-300 font-medium">Configuración Segura</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar con tabs */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 sticky top-6">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-600/20 border border-blue-500/30 text-blue-200'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="lg:col-span-3">
          {/* Tab: Mi Perfil */}
          {activeTab === 'perfil' && (
            <div className="space-y-6">
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{perfil.nombre}</h2>
                    <p className="text-slate-400">{perfil.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Nombre completo</label>
                    <input
                      type="text"
                      value={perfil.nombre}
                      onChange={(e) => setPerfil(prev => ({ ...prev, nombre: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Correo electrónico</label>
                    <input
                      type="email"
                      value={perfil.email}
                      onChange={(e) => setPerfil(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Teléfono</label>
                    <input
                      type="tel"
                      value={perfil.telefono}
                      onChange={(e) => setPerfil(prev => ({ ...prev, telefono: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Fecha de registro</label>
                    <input
                      type="text"
                      value={new Date(perfil.fechaRegistro).toLocaleDateString()}
                      readOnly
                      className="w-full px-4 py-3 bg-slate-600/30 border border-slate-600/30 rounded-xl text-slate-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <button className="px-6 py-3 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-200 hover:bg-blue-600/30 transition-colors duration-200">
                    Guardar Cambios
                  </button>
                </div>
              </div>

              {/* Estadísticas de cuenta */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Activity className="w-6 h-6 text-green-400" />
                  <span>Estadísticas de Cuenta</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">{estadisticas.archivosSubidos}</div>
                    <div className="text-slate-400 text-sm">Archivos Subidos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">{estadisticas.espacioUsado}</div>
                    <div className="text-slate-400 text-sm">Espacio Usado</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">{estadisticas.sesionesActivas}</div>
                    <div className="text-slate-400 text-sm">Sesiones Activas</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Seguridad */}
          {activeTab === 'seguridad' && (
            <div className="space-y-6">
              {/* Cambiar contraseña */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Key className="w-6 h-6 text-yellow-400" />
                  <span>Cambiar Contraseña</span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Contraseña actual</label>
                    <div className="relative">
                      <input
                        type={cambiarPassword.mostrarActual ? 'text' : 'password'}
                        value={cambiarPassword.passwordActual}
                        onChange={(e) => handlePasswordChange('passwordActual', e.target.value)}
                        className="w-full px-4 py-3 pr-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50"
                        placeholder="Ingresa tu contraseña actual"
                      />
                      <button
                        type="button"
                        onClick={() => handlePasswordChange('mostrarActual', !cambiarPassword.mostrarActual)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {cambiarPassword.mostrarActual ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Nueva contraseña</label>
                    <div className="relative">
                      <input
                        type={cambiarPassword.mostrarNuevo ? 'text' : 'password'}
                        value={cambiarPassword.passwordNuevo}
                        onChange={(e) => handlePasswordChange('passwordNuevo', e.target.value)}
                        className="w-full px-4 py-3 pr-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50"
                        placeholder="Crea una contraseña nueva"
                      />
                      <button
                        type="button"
                        onClick={() => handlePasswordChange('mostrarNuevo', !cambiarPassword.mostrarNuevo)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {cambiarPassword.mostrarNuevo ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Criterios de contraseña */}
                    {cambiarPassword.passwordNuevo && (
                      <div className="mt-3 p-4 bg-slate-700/30 rounded-xl">
                        <div className="text-sm text-slate-300 mb-2">La contraseña debe cumplir:</div>
                        <div className="space-y-1">
                          {[
                            { key: 'longitud', label: 'Al menos 8 caracteres' },
                            { key: 'mayuscula', label: 'Una letra mayúscula' },
                            { key: 'minuscula', label: 'Una letra minúscula' },
                            { key: 'numero', label: 'Un número' },
                            { key: 'especial', label: 'Un carácter especial' }
                          ].map(({ key, label }) => (
                            <div key={key} className="flex items-center space-x-2">
                              {criteriosPassword[key] ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : (
                                <X className="w-4 h-4 text-red-400" />
                              )}
                              <span className={`text-sm ${criteriosPassword[key] ? 'text-green-400' : 'text-red-400'}`}>
                                {label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Confirmar nueva contraseña</label>
                    <div className="relative">
                      <input
                        type={cambiarPassword.mostrarConfirmar ? 'text' : 'password'}
                        value={cambiarPassword.confirmarPassword}
                        onChange={(e) => handlePasswordChange('confirmarPassword', e.target.value)}
                        className="w-full px-4 py-3 pr-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50"
                        placeholder="Confirma la nueva contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => handlePasswordChange('mostrarConfirmar', !cambiarPassword.mostrarConfirmar)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {cambiarPassword.mostrarConfirmar ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {cambiarPassword.confirmarPassword && (
                      <div className="mt-2">
                        {passwordsCoinciden ? (
                          <div className="flex items-center space-x-2 text-green-400 text-sm">
                            <Check className="w-4 h-4" />
                            <span>Las contraseñas coinciden</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-red-400 text-sm">
                            <X className="w-4 h-4" />
                            <span>Las contraseñas no coinciden</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    disabled={!passwordValido || !passwordsCoinciden || !cambiarPassword.passwordActual}
                    className="px-6 py-3 bg-yellow-600/20 border border-yellow-500/30 rounded-xl text-yellow-200 hover:bg-yellow-600/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cambiar Contraseña
                  </button>
                </div>
              </div>

              {/* Configuración de seguridad */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Shield className="w-6 h-6 text-green-400" />
                  <span>Configuración de Seguridad</span>
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Autenticación de doble factor</div>
                      <div className="text-slate-400 text-sm">Añade una capa extra de seguridad a tu cuenta</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configuracion.seguridad.autenticacionDobleFactor}
                        onChange={(e) => handleConfigChange('seguridad', 'autenticacionDobleFactor', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Sesiones simultáneas máximas</div>
                      <div className="text-slate-400 text-sm">Controla cuántos dispositivos pueden estar conectados</div>
                    </div>
                    <select
                      value={configuracion.seguridad.sesionesSimultaneas}
                      onChange={(e) => handleConfigChange('seguridad', 'sesionesSimultaneas', parseInt(e.target.value))}
                      className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                    >
                      <option value={1}>1 sesión</option>
                      <option value={2}>2 sesiones</option>
                      <option value={3}>3 sesiones</option>
                      <option value={5}>5 sesiones</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Tiempo de inactividad (minutos)</div>
                      <div className="text-slate-400 text-sm">Cierra la sesión automáticamente por inactividad</div>
                    </div>
                    <select
                      value={configuracion.seguridad.timeoutSesion}
                      onChange={(e) => handleConfigChange('seguridad', 'timeoutSesion', parseInt(e.target.value))}
                      className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                    >
                      <option value={15}>15 minutos</option>
                      <option value={30}>30 minutos</option>
                      <option value={60}>1 hora</option>
                      <option value={120}>2 horas</option>
                      <option value={0}>Nunca</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Notificaciones */}
          {activeTab === 'notificaciones' && (
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <Bell className="w-6 h-6 text-blue-400" />
                <span>Preferencias de Notificaciones</span>
              </h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Notificaciones por correo</div>
                    <div className="text-slate-400 text-sm">Recibe alertas importantes por email</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configuracion.notificaciones.email}
                      onChange={(e) => handleConfigChange('notificaciones', 'email', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Notificaciones push</div>
                    <div className="text-slate-400 text-sm">Recibe alertas en tiempo real en el navegador</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configuracion.notificaciones.push}
                      onChange={(e) => handleConfigChange('notificaciones', 'push', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Alertas de seguridad</div>
                    <div className="text-slate-400 text-sm">Recibe notificaciones sobre actividad sospechosa</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configuracion.notificaciones.seguridad}
                      onChange={(e) => handleConfigChange('notificaciones', 'seguridad', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Privacidad */}
          {activeTab === 'privacidad' && (
            <div className="space-y-6">
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Shield className="w-6 h-6 text-purple-400" />
                  <span>Configuración de Privacidad</span>
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Log de auditoría detallado</div>
                      <div className="text-slate-400 text-sm">Registra todas las acciones realizadas en tu cuenta</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configuracion.privacidad.logAuditoria}
                        onChange={(e) => handleConfigChange('privacidad', 'logAuditoria', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Compartir metadatos de análisis</div>
                      <div className="text-slate-400 text-sm">Ayuda a mejorar el servicio con datos anónimos</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configuracion.privacidad.compartirMetadatos}
                        onChange={(e) => handleConfigChange('privacidad', 'compartirMetadatos', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Backup automático de claves</div>
                      <div className="text-slate-400 text-sm">Respalda automáticamente tus claves de cifrado</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configuracion.privacidad.backupAutomatico}
                        onChange={(e) => handleConfigChange('privacidad', 'backupAutomatico', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Zona de peligro */}
              <div className="bg-red-600/10 border border-red-500/30 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-red-200 mb-6 flex items-center space-x-2">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <span>Zona de Peligro</span>
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-600/10 rounded-xl">
                    <div>
                      <div className="text-red-200 font-medium">Eliminar todas las sesiones activas</div>
                      <div className="text-red-300/80 text-sm">Cierra la sesión en todos los dispositivos</div>
                    </div>
                    <button className="px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-lg text-red-200 hover:bg-red-600/30 transition-colors duration-200">
                      Cerrar Sesiones
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-red-600/10 rounded-xl">
                    <div>
                      <div className="text-red-200 font-medium">Eliminar cuenta permanentemente</div>
                      <div className="text-red-300/80 text-sm">Esta acción no se puede deshacer</div>
                    </div>
                    <button className="px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-lg text-red-200 hover:bg-red-600/30 transition-colors duration-200">
                      Eliminar Cuenta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Mis Datos */}
          {activeTab === 'datos' && (
            <div className="space-y-6">
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Database className="w-6 h-6 text-cyan-400" />
                  <span>Gestión de Datos</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-700/30 rounded-xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <Download className="w-6 h-6 text-green-400" />
                      <h4 className="text-lg font-semibold text-white">Exportar Datos</h4>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">
                      Descarga una copia de todos tus datos personales y archivos cifrados.
                    </p>
                    <button className="w-full px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-lg text-green-200 hover:bg-green-600/30 transition-colors duration-200">
                      Solicitar Exportación
                    </button>
                  </div>

                  <div className="p-6 bg-slate-700/30 rounded-xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <Trash2 className="w-6 h-6 text-red-400" />
                      <h4 className="text-lg font-semibold text-white">Eliminar Datos</h4>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">
                      Elimina permanentemente todos tus datos del sistema. Acción irreversible.
                    </p>
                    <button className="w-full px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-lg text-red-200 hover:bg-red-600/30 transition-colors duration-200">
                      Eliminar Todo
                    </button>
                  </div>
                </div>
              </div>

              {/* Información legal */}
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-8">
                <div className="flex items-start space-x-4">
                  <Info className="w-6 h-6 text-blue-400 mt-1" />
                  <div>
                    <h3 className="text-blue-200 font-semibold mb-2">Información sobre tus Derechos</h3>
                    <p className="text-blue-300/80 text-sm leading-relaxed">
                      Tienes derecho a acceder, rectificar, portar y eliminar tus datos personales según las 
                      leyes de protección de datos aplicables. Tus archivos están cifrados end-to-end y solo 
                      tú tienes acceso a las claves de descifrado. Para ejercer estos derechos o resolver 
                      dudas, contacta nuestro equipo de soporte.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
