import Cookies from "js-cookie";

export default function Protected({ children }) {
  const token = Cookies.get("access_token");
  if (!token) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No autenticado</h2>
          <p className="text-gray-600">Inicia sesión para continuar.</p>
        </div>
      </div>
    );
  }
  return children;
}
