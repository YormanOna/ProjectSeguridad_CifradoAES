import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({ children, onNavigate, current }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <Topbar />
      <div className="flex">
        <Sidebar onNavigate={onNavigate} current={current} />
        <main className="flex-1 p-8 min-h-[calc(100vh-64px)] overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(16,185,129,0.2),transparent_50%)]"></div>
      </div>
    </div>
  );
}
