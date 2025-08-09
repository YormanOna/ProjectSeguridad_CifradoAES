export default function TextField({ label, error, icon: Icon, ...props }) {
  return (
    <div className="space-y-2 mb-6">
      <label className="block text-sm font-medium text-slate-300">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-slate-400" />
          </div>
        )}
        <input
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            error 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-slate-600'
          }`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
