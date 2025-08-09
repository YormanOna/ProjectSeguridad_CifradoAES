import { useState } from "react";
import Cookies from "js-cookie";
import AppShell from "./components/layout/AppShell";
import Protected from "./components/common/Protected";

import Login from "./pages/auth/Login";
import Registro from "./pages/auth/Registro";
import Dashboard from "./pages/dashboard/Dashboard";
import ArchivosListado from "./pages/archivos/ArchivosListado";
import ArchivoSubir from "./pages/archivos/ArchivoSubir";
import ClaveGestion from "./pages/claves/ClaveGestion";
import AuditoriaListado from "./pages/auditoria/AuditoriaListado";
import UsuariosListado from "./pages/admin/UsuariosListado";

export default function App() {
  const [ruta, setRuta] = useState("dashboard");
  const [vistaAuth, setVistaAuth] = useState("login"); // "login" o "registro"
  const [recientes, setRecientes] = useState([]);
  const [recargarArchivos, setRecargarArchivos] = useState(0); // Para forzar recarga
  const token = Cookies.get("access_token");

  if (!token) {
    // Renderizar vistas de autenticación
    if (vistaAuth === "registro") {
      return <Registro onBackToLogin={() => setVistaAuth("login")} />;
    }
    return <Login 
      onLoggedIn={() => window.location.reload()} 
      onGoToRegister={() => setVistaAuth("registro")}
    />;
  }

  const onUploaded = (arch) => {
    setRecientes((prev) => [arch, ...prev].slice(0, 10));
    setRecargarArchivos(prev => prev + 1); // Incrementar para forzar recarga
  };

  const renderVista = () => {
    switch (ruta) {
      case "archivos": return <ArchivosListado recientes={recientes} recargar={recargarArchivos} />;
      case "subir": return <ArchivoSubir onUploaded={onUploaded} />;
      case "claves": return <ClaveGestion />;
      case "auditoria": return <AuditoriaListado />;
      case "usuarios": return <UsuariosListado />;
      default: return <Dashboard />;
    }
  };

  return (
    <Protected>
      <AppShell onNavigate={setRuta} current={ruta}>
        {renderVista()}
      </AppShell>
    </Protected>
  );
}
