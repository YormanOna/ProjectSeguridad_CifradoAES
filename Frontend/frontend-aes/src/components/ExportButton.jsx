import React, { useState } from 'react';
import { Download, FileText, Table, FileSpreadsheet, ChevronDown } from 'lucide-react';

const ExportButton = ({ 
  data, 
  filename = 'export', 
  title = 'Exportar',
  variant = 'primary',
  className = '',
  onExport = null // Callback opcional para exportación personalizada
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Función para convertir datos a CSV
  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escapar valores que contienen comas o comillas
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || '';
        }).join(',')
      )
    ].join('\n');

    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  };

  // Función para convertir datos a JSON
  const exportToJSON = (data, filename) => {
    if (!data || data.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `${filename}.json`, 'application/json');
  };

  // Función para convertir datos a TXT
  const exportToTXT = (data, filename) => {
    if (!data || data.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const headers = Object.keys(data[0]);
    const txtContent = data.map(row => 
      headers.map(header => `${header}: ${row[header] || 'N/A'}`).join(' | ')
    ).join('\n');

    downloadFile(txtContent, `${filename}.txt`, 'text/plain');
  };

  // Función helper para descargar archivos
  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Manejar exportación
  const handleExport = async (format) => {
    setExporting(true);
    setIsOpen(false);

    try {
      // Si hay un callback personalizado, usarlo
      if (onExport) {
        await onExport(format, filename);
        return;
      }

      // Exportación estándar
      switch (format) {
        case 'csv':
          exportToCSV(data, filename);
          break;
        case 'json':
          exportToJSON(data, filename);
          break;
        case 'txt':
          exportToTXT(data, filename);
          break;
        default:
          console.error('Formato de exportación no soportado');
      }
    } catch (error) {
      console.error('Error exportando:', error);
      alert('Error al exportar los datos');
    } finally {
      setExporting(false);
    }
  };

  const baseClasses = `
    relative inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border border-slate-600/50',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    outline: 'border border-blue-500/50 text-blue-400 hover:bg-blue-500/10'
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={exporting || (!data && !onExport)}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      >
        {exporting ? (
          <>
            <Download className="w-4 h-4 mr-2 animate-spin" />
            <span>Exportando...</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            <span>{title}</span>
            <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700/50 rounded-lg shadow-xl py-2 z-[9999]">
          <div className="px-3 py-2 text-xs text-slate-400 border-b border-slate-700/50">
            Seleccionar formato
          </div>
          
          <button
            onClick={() => handleExport('csv')}
            className="w-full flex items-center space-x-3 px-3 py-2 text-slate-300 hover:bg-slate-700/50 transition-colors"
          >
            <Table className="w-4 h-4 text-green-400" />
            <div className="text-left">
              <div className="text-sm font-medium">CSV</div>
              <div className="text-xs text-slate-500">Excel compatible</div>
            </div>
          </button>

          <button
            onClick={() => handleExport('json')}
            className="w-full flex items-center space-x-3 px-3 py-2 text-slate-300 hover:bg-slate-700/50 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
            <div className="text-left">
              <div className="text-sm font-medium">JSON</div>
              <div className="text-xs text-slate-500">Datos estructurados</div>
            </div>
          </button>

          <button
            onClick={() => handleExport('txt')}
            className="w-full flex items-center space-x-3 px-3 py-2 text-slate-300 hover:bg-slate-700/50 transition-colors"
          >
            <FileText className="w-4 h-4 text-purple-400" />
            <div className="text-left">
              <div className="text-sm font-medium">TXT</div>
              <div className="text-xs text-slate-500">Texto plano</div>
            </div>
          </button>
        </div>
      )}

      {/* Backdrop para cerrar el dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9998]" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ExportButton;
