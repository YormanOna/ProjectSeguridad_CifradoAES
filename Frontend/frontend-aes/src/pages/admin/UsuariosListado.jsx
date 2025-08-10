import { useState, useEffect } from "react";
import api from "../../api/config";
import ExportButton from "../../components/ExportButton";
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  Edit, 
  Trash2, 
  Eye,
  Shield,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Activity,
  Key,
  MoreVertical,
  Download,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  X,
  User
} from "lucide-react";

export default function UsuariosListado() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filtros, setFiltros] = useState({
    busqueda: '',
    rol: 'TODOS',
    estado: 'TODOS'
  });

  const [stats, setStats] = useState({
    totalUsuarios: 0,
    usuariosActivos: 0,
    administradores: 0,
    suspendidos: 0,
    nuevosHoy: 0,
    sesionesActivas: 0
  });

  const [vistaDetalle, setVistaDetalle] = useState(null);
  const [actualizandoEstado, setActualizandoEstado] = useState(null);
  const [modalCrearUsuario, setModalCrearUsuario] = useState(false);
  const [modalEditarUsuario, setModalEditarUsuario] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre_usuario: '',
    correo: '',
    contrasena: '',
    rol: 'USER'
  });
  const [creandoUsuario, setCreandoUsuario] = useState(false);
  const [editandoUsuario, setEditandoUsuario] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError('');

      // Cargar estadísticas de admin
      const statsResponse = await api.get('/admin/stats');
      setStats(statsResponse.data);

      // Cargar usuarios con filtros
      const usuariosResponse = await api.get('/admin/usuarios', { params: filtros });
      setUsuarios(usuariosResponse.data);

    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setError('Error al cargar los datos de usuarios. Verifica que tengas permisos de administrador.');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (userId, nuevoEstado) => {
    try {
      setActualizandoEstado(userId);
      await api.patch(`/admin/usuarios/${userId}/estado`, { estado: nuevoEstado });
      
      // Actualizar estado local
      setUsuarios(usuarios.map(usuario => 
        usuario.id === userId ? { ...usuario, estado: nuevoEstado } : usuario
      ));
      
    } catch (error) {
      console.error('Error cambiando estado:', error);
      setError('Error al cambiar el estado del usuario');
    } finally {
      setActualizandoEstado(null);
    }
  };

  const verDetalle = async (usuario) => {
    try {
      // Si tenemos APIs completas, cargar detalles completos
      const response = await api.get(`/admin/usuarios/${usuario.id}`);
      setVistaDetalle(response.data);
    } catch (error) {
      console.error('Error cargando detalles:', error);
      // Si falla, usar datos básicos
      setVistaDetalle(usuario);
    }
  };

  // Función para crear usuario
  const crearUsuario = async (e) => {
    e.preventDefault();
    setCreandoUsuario(true);
    
    try {
      const response = await api.post('/admin/usuarios', nuevoUsuario);
      
      // Limpiar formulario y cerrar modal
      setNuevoUsuario({
        nombre_usuario: '',
        correo: '',
        contrasena: '',
        rol: 'USER'
      });
      setModalCrearUsuario(false);
      
      // Recargar datos
      await cargarDatos();
      
      alert('Usuario creado exitosamente');
    } catch (error) {
      console.error('Error creando usuario:', error);
      alert('Error al crear usuario: ' + (error.response?.data?.error || error.message));
    } finally {
      setCreandoUsuario(false);
    }
  };

  // Función para abrir modal de editar usuario
  const abrirModalEditar = (usuario) => {
    setUsuarioEditando({
      id: usuario.id,
      nombre_usuario: usuario.nombre_usuario,
      correo: usuario.correo,
      rol: usuario.rol?.toLowerCase() || 'user'
    });
    setModalEditarUsuario(true);
  };

  // Función para actualizar usuario
  const actualizarUsuario = async (e) => {
    e.preventDefault();
    setEditandoUsuario(true);
    
    try {
      const response = await api.put(`/admin/usuarios/${usuarioEditando.id}`, {
        nombre_usuario: usuarioEditando.nombre_usuario,
        correo: usuarioEditando.correo,
        rol: usuarioEditando.rol
      });
      
      // Cerrar modal y limpiar estado
      setModalEditarUsuario(false);
      setUsuarioEditando(null);
      
      // Recargar datos
      await cargarDatos();
      
      alert('Usuario actualizado exitosamente');
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      alert('Error al actualizar usuario: ' + (error.response?.data?.error || error.message));
    } finally {
      setEditandoUsuario(false);
    }
  };

  // Función para cambiar rol desde el modal de detalles
  const cambiarRol = async (usuarioId, nuevoRol) => {
    if (!confirm(`¿Estás seguro de cambiar el rol a ${nuevoRol}?`)) {
      return;
    }
    
    try {
      setActualizandoEstado(usuarioId);
      await api.put(`/admin/usuarios/${usuarioId}`, { rol: nuevoRol });
      
      // Actualizar estado local
      setUsuarios(usuarios.map(usuario => 
        usuario.id === usuarioId ? { ...usuario, rol: nuevoRol } : usuario
      ));
      
      // Actualizar vista de detalle si está abierta
      if (vistaDetalle && vistaDetalle.id === usuarioId) {
        setVistaDetalle({ ...vistaDetalle, rol: nuevoRol });
      }
      
      // Recargar datos para mantener consistencia
      await cargarDatos();
      
    } catch (error) {
      console.error('Error cambiando rol:', error);
      alert('Error al cambiar el rol del usuario: ' + (error.response?.data?.error || error.message));
    } finally {
      setActualizandoEstado(null);
    }
  };

  // Función para cambiar estado desde el modal de detalles
  const cambiarEstadoDesdeModal = async (usuarioId, nuevoEstado) => {
    const accion = nuevoEstado === 'ACTIVO' ? 'activar' : 'suspender';
    if (!confirm(`¿Estás seguro de ${accion} esta cuenta?`)) {
      return;
    }
    
    try {
      setActualizandoEstado(usuarioId);
      await api.patch(`/admin/usuarios/${usuarioId}/estado`, { estado: nuevoEstado });
      
      // Actualizar estado local
      setUsuarios(usuarios.map(usuario => 
        usuario.id === usuarioId ? { ...usuario, estado: nuevoEstado } : usuario
      ));
      
      // Actualizar vista de detalle si está abierta
      if (vistaDetalle && vistaDetalle.id === usuarioId) {
        setVistaDetalle({ ...vistaDetalle, estado: nuevoEstado });
      }
      
      // Recargar datos para mantener consistencia
      await cargarDatos();
      
    } catch (error) {
      console.error('Error cambiando estado:', error);
      alert('Error al cambiar el estado del usuario: ' + (error.response?.data?.error || error.message));
    } finally {
      setActualizandoEstado(null);
    }
  };

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter(usuario => {
    const nombre = usuario.nombre_usuario || usuario.nombre || '';
    const email = usuario.correo || usuario.email || '';
    const matchBusqueda = nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
                          email.toLowerCase().includes(filtros.busqueda.toLowerCase());
    const matchRol = filtros.rol === 'TODOS' || usuario.rol === filtros.rol;
    const matchEstado = filtros.estado === 'TODOS' || usuario.estado === filtros.estado;
    
    return matchBusqueda && matchRol && matchEstado;
  });

  const getRolColor = (rol) => {
    switch (rol) {
      case 'ADMIN': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'MODERADOR': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'USUARIO': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'ACTIVO': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'SUSPENDIDO': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'INACTIVO': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  // Función para preparar datos de exportación
  const prepararDatosExportacion = () => {
    return usuariosFiltrados.map(usuario => ({
      'ID': usuario.id,
      'Nombre de Usuario': usuario.nombre_usuario,
      'Correo': usuario.correo,
      'Rol': usuario.rol,
      'Estado': usuario.estado,
      'Archivos Subidos': usuario.archivosSubidos || 0,
      'Espacio Usado': usuario.espacioUsado || 'N/A',
      'Sesiones Activas': usuario.sesionesActivas || 0,
      'Fecha de Registro': usuario.fechaRegistro ? new Date(usuario.fechaRegistro).toLocaleDateString() : 'N/A',
      'Último Acceso': usuario.ultimoAcceso ? new Date(usuario.ultimoAcceso).toLocaleString() : 'N/A'
    }));
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'ACTIVO': return <CheckCircle className="w-4 h-4" />;
      case 'SUSPENDIDO': return <XCircle className="w-4 h-4" />;
      case 'INACTIVO': return <AlertTriangle className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          <span className="text-slate-400 ml-4">Cargando usuarios...</span>
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center space-x-3">
                <Users className="w-8 h-8 text-blue-400" />
                <span>Gestión de Usuarios</span>
              </h1>
              <p className="text-slate-400 mt-2">
                Administra usuarios, roles y permisos del sistema de cifrado
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={cargarDatos}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-600/20 border border-slate-500/30 rounded-xl text-slate-300 hover:text-white hover:bg-slate-600/30 transition-colors duration-200"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Actualizar</span>
              </button>

              <button
                onClick={() => setModalCrearUsuario(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-200 hover:bg-blue-600/30 transition-colors duration-200"
              >
                <UserPlus className="w-5 h-5" />
                <span>Nuevo Usuario</span>
              </button>
              
              <ExportButton
                data={prepararDatosExportacion()}
                filename={`usuarios-${new Date().toISOString().split('T')[0]}`}
                title="Exportar"
                variant="success"
                className="bg-green-600/20 border border-green-500/30 text-green-200 hover:bg-green-600/30"
              />
            </div>
          </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-6 h-6 text-blue-400" />
            <div className="text-2xl font-bold text-blue-400">{stats.totalUsuarios.toLocaleString()}</div>
          </div>
          <div className="text-slate-400 text-sm font-medium">Total Usuarios</div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div className="text-2xl font-bold text-green-400">{stats.usuariosActivos}</div>
          </div>
          <div className="text-slate-400 text-sm font-medium">Activos</div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-6 h-6 text-red-400" />
            <div className="text-2xl font-bold text-red-400">{stats.administradores}</div>
          </div>
          <div className="text-slate-400 text-sm font-medium">Admins</div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-6 h-6 text-yellow-400" />
            <div className="text-2xl font-bold text-yellow-400">{stats.suspendidos}</div>
          </div>
          <div className="text-slate-400 text-sm font-medium">Suspendidos</div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-6 h-6 text-purple-400" />
            <div className="text-2xl font-bold text-purple-400">{stats.nuevosHoy}</div>
          </div>
          <div className="text-slate-400 text-sm font-medium">Nuevos Hoy</div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-6 h-6 text-cyan-400" />
            <div className="text-2xl font-bold text-cyan-400">{stats.sesionesActivas}</div>
          </div>
          <div className="text-slate-400 text-sm font-medium">Sesiones</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={filtros.busqueda}
              onChange={(e) => setFiltros(prev => ({ ...prev, busqueda: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
            />
          </div>

          <select
            value={filtros.rol}
            onChange={(e) => setFiltros(prev => ({ ...prev, rol: e.target.value }))}
            className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
          >
            <option value="TODOS">Todos los roles</option>
            <option value="ADMIN">Administrador</option>
            <option value="MODERADOR">Moderador</option>
            <option value="USUARIO">Usuario</option>
          </select>

          <select
            value={filtros.estado}
            onChange={(e) => setFiltros(prev => ({ ...prev, estado: e.target.value }))}
            className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="ACTIVO">Activo</option>
            <option value="SUSPENDIDO">Suspendido</option>
            <option value="INACTIVO">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/30 border-b border-slate-600/50">
              <tr>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Usuario</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Rol</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Estado</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Archivos</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Último Acceso</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {(usuario.nombre_usuario || usuario.nombre || 'U').split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{usuario.nombre_usuario || usuario.nombre || 'Usuario'}</div>
                        <div className="text-slate-400 text-sm flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{usuario.correo || usuario.email || 'Sin email'}</span>
                        </div>
                        {usuario.telefono && (
                          <div className="text-slate-400 text-sm flex items-center space-x-1">
                            <Phone className="w-3 h-3" />
                            <span>{usuario.telefono}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium border ${getRolColor(usuario.rol)}`}>
                      {usuario.rol === 'ADMIN' && <Shield className="w-4 h-4" />}
                      {usuario.rol === 'MODERADOR' && <Key className="w-4 h-4" />}
                      {usuario.rol === 'USUARIO' && <Users className="w-4 h-4" />}
                      <span>{usuario.rol}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium border ${getEstadoColor(usuario.estado)}`}>
                      {getEstadoIcon(usuario.estado)}
                      <span>{usuario.estado}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">{usuario.archivosSubidos}</div>
                    <div className="text-slate-400 text-sm">{usuario.espacioUsado}</div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-slate-300">
                      {new Date(usuario.ultimoAcceso).toLocaleDateString()}
                    </div>
                    <div className="text-slate-400 text-sm">
                      {new Date(usuario.ultimoAcceso).toLocaleTimeString()}
                    </div>
                    {usuario.sesionesActivas > 0 && (
                      <div className="flex items-center space-x-1 text-green-400 text-sm">
                        <Activity className="w-3 h-3" />
                        <span>{usuario.sesionesActivas} activa(s)</span>
                      </div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="relative group">
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-600/50 rounded-lg transition-colors duration-200">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <div className="p-2">
                          <button 
                            onClick={() => verDetalle(usuario)}
                            className="w-full flex items-center space-x-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors duration-200"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Ver detalles</span>
                          </button>
                          
                          <button 
                            onClick={() => abrirModalEditar(usuario)}
                            className="w-full flex items-center space-x-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors duration-200"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Editar</span>
                          </button>
                          
                          <div className="border-t border-slate-700 my-2"></div>
                          
                          {usuario.estado === 'ACTIVO' ? (
                            <button 
                              onClick={() => cambiarEstado(usuario.id, 'SUSPENDIDO')}
                              disabled={actualizandoEstado === usuario.id}
                              className="w-full flex items-center space-x-2 px-3 py-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-600/10 rounded-lg transition-colors duration-200 disabled:opacity-50"
                            >
                              {actualizandoEstado === usuario.id ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <Lock className="w-4 h-4" />
                              )}
                              <span>Suspender</span>
                            </button>
                          ) : (
                            <button 
                              onClick={() => cambiarEstado(usuario.id, 'ACTIVO')}
                              disabled={actualizandoEstado === usuario.id}
                              className="w-full flex items-center space-x-2 px-3 py-2 text-green-400 hover:text-green-300 hover:bg-green-600/10 rounded-lg transition-colors duration-200 disabled:opacity-50"
                            >
                              {actualizandoEstado === usuario.id ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <Unlock className="w-4 h-4" />
                              )}
                              <span>Activar</span>
                            </button>
                          )}
                          
                          <button className="w-full flex items-center space-x-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-600/10 rounded-lg transition-colors duration-200">
                            <Trash2 className="w-4 h-4" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {usuariosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-slate-400 text-lg font-medium">No se encontraron usuarios</h3>
            <p className="text-slate-500 mt-2">Prueba ajustando los filtros de búsqueda</p>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {vistaDetalle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Detalles del Usuario</h2>
              <button 
                onClick={() => setVistaDetalle(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-2">Información Personal</label>
                  <div className="bg-slate-700/30 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Nombre de Usuario:</span>
                      <span className="text-white">{vistaDetalle.nombre_usuario}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Email:</span>
                      <span className="text-white">{vistaDetalle.correo}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-2">Actividad</label>
                  <div className="bg-slate-700/30 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Archivos:</span>
                      <span className="text-white">{vistaDetalle.archivosSubidos || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Espacio usado:</span>
                      <span className="text-white">{vistaDetalle.espacioUsado || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sesiones activas:</span>
                      <span className="text-white">{vistaDetalle.sesionesActivas || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-2">Estado de Cuenta</label>
                  <div className="bg-slate-700/30 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Rol:</span>
                      <div className={`px-3 py-1 rounded-lg text-sm border ${getRolColor(vistaDetalle.rol)}`}>
                        {vistaDetalle.rol}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Estado:</span>
                      <div className={`px-3 py-1 rounded-lg text-sm border ${getEstadoColor(vistaDetalle.estado)}`}>
                        {vistaDetalle.estado}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Registro:</span>
                      <span className="text-white">
                        {vistaDetalle.fechaRegistro ? new Date(vistaDetalle.fechaRegistro).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Último acceso:</span>
                      <span className="text-white">
                        {vistaDetalle.ultimoAcceso ? new Date(vistaDetalle.ultimoAcceso).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      setVistaDetalle(null);
                      abrirModalEditar(vistaDetalle);
                    }}
                    className="w-full px-4 py-3 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-200 hover:bg-blue-600/30 transition-colors duration-200"
                  >
                    Editar Usuario
                  </button>
                  <button 
                    onClick={() => {
                      const nuevoRol = vistaDetalle.rol === 'ADMIN' ? 'USER' : 'ADMIN';
                      cambiarRol(vistaDetalle.id, nuevoRol);
                    }}
                    disabled={actualizandoEstado === vistaDetalle.id}
                    className="w-full px-4 py-3 bg-yellow-600/20 border border-yellow-500/30 rounded-xl text-yellow-200 hover:bg-yellow-600/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actualizandoEstado === vistaDetalle.id ? 'Cambiando...' : 
                     vistaDetalle.rol === 'ADMIN' ? 'Cambiar a Usuario' : 'Cambiar a Admin'}
                  </button>
                  <button 
                    onClick={() => {
                      const nuevoEstado = vistaDetalle.estado === 'ACTIVO' ? 'SUSPENDIDO' : 'ACTIVO';
                      cambiarEstadoDesdeModal(vistaDetalle.id, nuevoEstado);
                    }}
                    disabled={actualizandoEstado === vistaDetalle.id}
                    className={`w-full px-4 py-3 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      vistaDetalle.estado === 'ACTIVO' 
                        ? 'bg-red-600/20 border border-red-500/30 text-red-200 hover:bg-red-600/30'
                        : 'bg-green-600/20 border border-green-500/30 text-green-200 hover:bg-green-600/30'
                    }`}
                  >
                    {actualizandoEstado === vistaDetalle.id ? 'Procesando...' : 
                     vistaDetalle.estado === 'ACTIVO' ? 'Suspender Cuenta' : 'Activar Cuenta'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Crear Usuario */}
      {modalCrearUsuario && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
          <div className="bg-slate-800 border border-slate-700/50 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500/20 rounded-xl p-2">
                  <UserPlus className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Crear Nuevo Usuario</h3>
                  <p className="text-sm text-slate-400">Complete la información del usuario</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setModalCrearUsuario(false);
                  setNuevoUsuario({
                    nombre_usuario: '',
                    correo: '',
                    contrasena: '',
                    rol: 'usuario'
                  });
                }}
                className="text-slate-400 hover:text-white p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); crearUsuario(); }} className="p-6 space-y-4">
              {/* Nombre de Usuario */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <span>Nombre de Usuario</span>
                  </div>
                </label>
                <input
                  type="text"
                  required
                  value={nuevoUsuario.nombre_usuario}
                  onChange={(e) => setNuevoUsuario({
                    ...nuevoUsuario,
                    nombre_usuario: e.target.value
                  })}
                  className="w-full px-3 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                  placeholder="Ingrese el nombre de usuario"
                />
              </div>

              {/* Correo Electrónico */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span>Correo Electrónico</span>
                  </div>
                </label>
                <input
                  type="email"
                  required
                  value={nuevoUsuario.correo}
                  onChange={(e) => setNuevoUsuario({
                    ...nuevoUsuario,
                    correo: e.target.value
                  })}
                  className="w-full px-3 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                  placeholder="Ingrese el correo electrónico"
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-blue-400" />
                    <span>Contraseña</span>
                  </div>
                </label>
                <input
                  type="password"
                  required
                  value={nuevoUsuario.contrasena}
                  onChange={(e) => setNuevoUsuario({
                    ...nuevoUsuario,
                    contrasena: e.target.value
                  })}
                  className="w-full px-3 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                  placeholder="Ingrese la contraseña"
                  minLength={8}
                />
                <p className="text-xs text-slate-400 mt-1">
                  La contraseña debe tener al menos 8 caracteres
                </p>
              </div>

              {/* Rol */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span>Rol</span>
                  </div>
                </label>
                <select
                  value={nuevoUsuario.rol}
                  onChange={(e) => setNuevoUsuario({
                    ...nuevoUsuario,
                    rol: e.target.value
                  })}
                  className="w-full px-3 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                >
                  <option value="usuario">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
                <p className="text-xs text-slate-400 mt-1">
                  Los administradores tienen acceso completo al sistema
                </p>
              </div>

              {/* Botones */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setModalCrearUsuario(false);
                    setNuevoUsuario({
                      nombre_usuario: '',
                      correo: '',
                      contrasena: '',
                      rol: 'usuario'
                    });
                  }}
                  className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-xl hover:bg-slate-600/50 transition-colors"
                  disabled={creandoUsuario}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creandoUsuario}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creandoUsuario ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Creando...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Crear Usuario</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Editar Usuario */}
      {modalEditarUsuario && usuarioEditando && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
          <div className="bg-slate-800 border border-slate-700/50 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500/20 rounded-xl p-2">
                  <Edit className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Editar Usuario</h3>
                  <p className="text-sm text-slate-400">Modificar información del usuario</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setModalEditarUsuario(false);
                  setUsuarioEditando(null);
                }}
                className="text-slate-400 hover:text-white p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={actualizarUsuario} className="p-6 space-y-4">
              {/* Nombre de Usuario */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <span>Nombre de Usuario</span>
                  </div>
                </label>
                <input
                  type="text"
                  required
                  value={usuarioEditando.nombre_usuario}
                  onChange={(e) => setUsuarioEditando({
                    ...usuarioEditando,
                    nombre_usuario: e.target.value
                  })}
                  className="w-full px-3 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                  placeholder="Ingrese el nombre de usuario"
                />
              </div>

              {/* Correo Electrónico */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span>Correo Electrónico</span>
                  </div>
                </label>
                <input
                  type="email"
                  required
                  value={usuarioEditando.correo}
                  onChange={(e) => setUsuarioEditando({
                    ...usuarioEditando,
                    correo: e.target.value
                  })}
                  className="w-full px-3 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                  placeholder="Ingrese el correo electrónico"
                />
              </div>

              {/* Rol */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span>Rol</span>
                  </div>
                </label>
                <select
                  value={usuarioEditando.rol}
                  onChange={(e) => setUsuarioEditando({
                    ...usuarioEditando,
                    rol: e.target.value
                  })}
                  className="w-full px-3 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
                <p className="text-xs text-slate-400 mt-1">
                  Los administradores tienen acceso completo al sistema
                </p>
              </div>

              {/* Botones */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setModalEditarUsuario(false);
                    setUsuarioEditando(null);
                  }}
                  className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-xl hover:bg-slate-600/50 transition-colors"
                  disabled={editandoUsuario}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={editandoUsuario}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editandoUsuario ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Actualizando...</span>
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4" />
                      <span>Actualizar Usuario</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}