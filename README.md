# 🔐 SecureVault - Sistema de Cifrado AES-GCM

**SecureVault** es un sistema avanzado de gestión y cifrado de archivos que utiliza el algoritmo AES-256-GCM para proporcionar seguridad de nivel empresarial. El sistema incluye funciones de gestión de usuarios, auditoría de seguridad y administración centralizada.

## 🚀 Características Principales

- **🔒 Cifrado AES-256-GCM**: Cifrado robusto con autenticación integrada
- **🔑 Gestión de Claves**: Generación automática y rotación de claves de cifrado
- **👥 Control de Acceso**: Sistema de roles (Usuario/Administrador) con JWT
- **📊 Panel de Administración**: Dashboard completo para supervisión del sistema
- **📋 Auditoría Completa**: Registro detallado de todas las operaciones
- **💾 Almacenamiento Híbrido**: Soporte para base de datos (blob) y sistema de archivos
- **⚡ Interfaz Moderna**: Frontend React con Tailwind CSS y diseño responsivo
- **🔄 Descarga Dual**: Archivos cifrados y descifrados disponibles

## 🏗️ Arquitectura del Sistema

### Backend (Flask + PostgreSQL)
- **Framework**: Flask con SQLAlchemy ORM
- **Base de Datos**: PostgreSQL con soporte para blobs binarios
- **Autenticación**: JWT con roles y expiración automática
- **Cifrado**: Implementación personalizada de AES-256-GCM con Python cryptography
- **APIs REST**: Endpoints completos para todas las operaciones

### Frontend (React + Vite)
- **Framework**: React 19.1.1 con Vite para desarrollo rápido
- **Estilos**: Tailwind CSS 4.1.1 para diseño moderno
- **Iconos**: Lucide React para iconografía consistente
- **HTTP**: Axios con interceptores automáticos para JWT
- **Estado**: React Hooks para gestión de estado local

## 📋 Prerrequisitos

Antes de instalar el sistema, asegúrate de tener instalado:

- **Python 3.12+** (para el backend)
- **Node.js 18+** y **npm** (para el frontend)
- **PostgreSQL 13+** (base de datos)
- **Git** (para clonar el repositorio)

## 🛠️ Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/YormanOna/ProjectSeguridad_CifradoAES.git
cd ProjectSeguridad_CifradoAES
```

### 2. Configuración del Backend

#### 2.1 Crear Entorno Virtual

```bash
# Navegar al directorio del backend
cd Backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate
```

#### 2.2 Instalar Dependencias

```bash
pip install -r requirements.txt
```

#### 2.3 Configurar Base de Datos

1. Crear una base de datos PostgreSQL:
```sql
CREATE DATABASE securevault_db;
CREATE USER securevault_user WITH PASSWORD 'tu_password_seguro';
GRANT ALL PRIVILEGES ON DATABASE securevault_db TO securevault_user;
```

2. Crear archivo `.env` en el directorio `Backend/`:
```env
DATABASE_URL=postgresql://securevault_user:tu_password_seguro@localhost/securevault_db
SECRET_KEY=tu_clave_secreta_muy_larga_y_segura
JWT_SECRET=tu_jwt_secret_muy_seguro
JWT_ACCESS_TOKEN_EXPIRES_MIN=30
JWT_REFRESH_TOKEN_EXPIRES_DAYS=7
MASTER_SECRET=tu_master_secret_para_cifrado
FILE_STORAGE_BACKEND=fs
FILE_STORAGE_PATH=./app/data_archivos
MAX_CONTENT_LENGTH=52428800
```

#### 2.4 Inicializar Base de Datos

```bash
# Las migraciones se ejecutan automáticamente al iniciar la aplicación
# El sistema creará las tablas y el usuario administrador por defecto
```

### 3. Configuración del Frontend

#### 3.1 Instalar Dependencias

```bash
# Navegar al directorio del frontend (desde la raíz del proyecto)
cd Frontend/frontend-aes

# Instalar dependencias
npm install
```

## 🚀 Ejecutar el Sistema

### Iniciar el Backend

```bash
# Desde el directorio Backend/ con el entorno virtual activado
cd Backend
python -c "import sys; sys.path.insert(0, '.'); from app import crear_app; app = crear_app(); app.run(host='127.0.0.1', port=8000, debug=True)"
```

El backend estará disponible en: `http://127.0.0.1:8000`

### Iniciar el Frontend

```bash
# Desde el directorio Frontend/frontend-aes/
cd Frontend/frontend-aes
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## 👨‍💻 Uso del Sistema

### Credenciales por Defecto

El sistema crea automáticamente un usuario administrador:
- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Email**: `admin@securevault.com`

### Funcionalidades Principales

#### Para Usuarios Normales:
1. **Subir Archivos**: Cifrado automático con AES-256-GCM
2. **Descargar Archivos**: Descifrado automático al descargar
3. **Gestión de Claves**: Generación automática de claves de usuario
4. **Historial Personal**: Ver archivos subidos y actividad

#### Para Administradores:
1. **Panel de Control**: Estadísticas completas del sistema
2. **Gestión de Usuarios**: Crear, editar, activar/desactivar usuarios
3. **Auditoría de Seguridad**: Monitoreo completo de actividades
4. **Configuración del Sistema**: Ajustes de almacenamiento y seguridad
5. **Gestión de Claves**: Rotación y administración de claves maestras

### Navegación del Sistema

```
📱 SecureVault
├── 🏠 Panel Principal (Dashboard)
├── 📁 Mis Archivos (Gestión de archivos personales)
├── ⬆️ Subir Archivo (Upload con cifrado automático)
├── 🔑 Gestión de Claves (Generación y rotación)
└── 👑 Panel de Administración (Solo admins)
    ├── 👥 Gestión de Usuarios
    ├── 📊 Estadísticas del Sistema
    ├── 🔍 Auditoría de Seguridad
    └── ⚙️ Estado de Seguridad
```

## 🔧 Configuración Avanzada

### Tipos de Almacenamiento

El sistema soporta dos tipos de almacenamiento:

1. **Base de Datos (db_blob)**:
   ```env
   FILE_STORAGE_BACKEND=db_blob
   ```
   - Archivos se almacenan como blobs en PostgreSQL
   - Mejor para archivos pequeños
   - Respaldos integrados con la base de datos

2. **Sistema de Archivos (fs)**:
   ```env
   FILE_STORAGE_BACKEND=fs
   FILE_STORAGE_PATH=./app/data_archivos
   ```
   - Archivos se almacenan en el sistema de archivos
   - Mejor rendimiento para archivos grandes
   - Requiere respaldos separados del filesystem

### Seguridad Adicional

- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **CORS Configurado**: Permite solo orígenes autorizados
- **JWT con Expiración**: Tokens con tiempo de vida limitado
- **Validación de Entrada**: Sanitización de todos los inputs
- **Logging de Auditoría**: Registro completo de actividades

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `POST /api/auth/register` - Registrar usuario

### Archivos
- `GET /api/archivos/` - Listar archivos del usuario
- `POST /api/archivos/subir` - Subir archivo cifrado
- `GET /api/archivos/descargar/{id}` - Descargar descifrado
- `GET /api/archivos/descargar-cifrado/{id}` - Descargar cifrado

### Administración (Solo Admins)
- `GET /api/admin/stats` - Estadísticas del sistema
- `GET /api/admin/usuarios` - Gestión de usuarios
- `GET /api/auditoria/` - Registros de auditoría

## 🛡️ Seguridad

### Cifrado
- **Algoritmo**: AES-256-GCM (Galois Counter Mode)
- **Claves**: 256 bits generadas con `secrets.token_bytes()`
- **IV/Nonce**: Único para cada archivo (96 bits)
- **Autenticación**: Tag de autenticación integrado
- **Key Wrapping**: Claves DEK envueltas con UEK del usuario

### Autenticación
- **JWT**: Tokens firmados con HS256
- **Roles**: Sistema granular (USER, ADMIN)
- **Expiración**: Configurable (30 min por defecto)
- **Validación**: Interceptores automáticos en frontend

## 🐛 Solución de Problemas

### Backend no inicia
1. Verificar que PostgreSQL esté ejecutándose
2. Comprobar las credenciales de la base de datos en `.env`
3. Asegurar que el entorno virtual esté activado
4. Verificar que todas las dependencias estén instaladas

### Frontend no carga
1. Verificar que el backend esté ejecutándose en puerto 8000
2. Comprobar que npm install se ejecutó correctamente
3. Verificar que no hay conflictos de puertos

### Problemas de CORS
1. Asegurar que el frontend esté en `localhost:5173`
2. Verificar configuración de CORS en el backend
3. Comprobar que las URLs en `api/config.js` sean correctas

## 🤝 Contribuir

1. Fork del repositorio
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 🙏 Agradecimientos

- **Flask Community** por el framework web
- **React Team** por la librería de UI
- **Python Cryptography** por las funciones criptográficas
- **Tailwind CSS** por el sistema de diseño

---
**SecureVault** - Protegiendo tus datos con cifrado de nivel empresarial 🔐