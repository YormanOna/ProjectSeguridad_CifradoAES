import React, { useState } from 'react';

const ArchivoEncriptar = () => {
  const [file, setFile] = useState(null);
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleKeyChange = (e) => {
    setKey(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !key) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('key', key);
    try {
      const res = await fetch('/api/archivos/encriptar', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Error al encriptar archivo');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name + '.enc';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Encriptar archivo (AES)</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} className="mb-2" />
        <input type="password" placeholder="Clave AES" value={key} onChange={handleKeyChange} className="mb-2 w-full border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? 'Encriptando...' : 'Encriptar y descargar'}
        </button>
      </form>
    </div>
  );
};

export default ArchivoEncriptar;
