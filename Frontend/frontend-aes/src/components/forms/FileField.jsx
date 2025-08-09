import { Upload } from "lucide-react";

export default function FileField({ label, onChange, accept, disabled }) {
  return (
    <label className="block space-y-2 mb-6 cursor-pointer">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <div className="relative">
        <input
          type="file"
          onChange={onChange}
          accept={accept}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className={`w-full border-2 border-dashed rounded-xl px-6 py-8 text-center transition-all duration-200 ${
          disabled 
            ? 'border-slate-600 bg-slate-800/20 cursor-not-allowed' 
            : 'border-slate-600 bg-slate-700/30 hover:border-slate-500 hover:bg-slate-700/50'
        }`}>
          <div className="flex flex-col items-center space-y-3">
            <div className={`p-3 rounded-full ${
              disabled ? 'bg-slate-700/50' : 'bg-slate-600/50'
            }`}>
              <Upload className={`w-6 h-6 ${
                disabled ? 'text-slate-500' : 'text-slate-400'
              }`} />
            </div>
            <div>
              <p className={`font-medium ${
                disabled ? 'text-slate-500' : 'text-slate-300'
              }`}>
                {disabled ? 'Subida deshabilitada' : 'Haz clic para seleccionar archivo'}
              </p>
              <p className={`text-sm mt-1 ${
                disabled ? 'text-slate-600' : 'text-slate-400'
              }`}>
                {disabled ? 'Función no disponible' : 'o arrastra y suelta aquí'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </label>
  );
}
