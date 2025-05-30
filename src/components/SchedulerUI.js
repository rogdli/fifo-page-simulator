import React, { useState } from 'react';

const SchedulerUI = () => {
  const [pages, setPages] = useState([]);
  const [accessHistory, setAccessHistory] = useState([]);
  // Capacidad de memoria se inicializa con 4 pero si quiero lo puedo cambiar.
  const [memorySize, setMemorySize] = useState(4);
  const [newPage, setNewPage] = useState('');
  const [pageFaults, setPageFaults] = useState(0);

  const handlePageAccess = (pageId) => {
    if (!pages.includes(pageId)) {

      // Fallo de página

      setPageFaults(prev => prev + 1);
      
      if (pages.length >= memorySize) {
        // Aquí ocurre el reemplazo FIFO.
        const oldestPage = accessHistory[0];
        const newPages = pages.filter(p => p !== oldestPage);
        setPages([...newPages, pageId]);
        setAccessHistory([...accessHistory.slice(1), pageId]);
      } else 
      // Si la capacidad no está llena...
      {
        setPages([...pages, pageId]);
        setAccessHistory([...accessHistory, pageId]);
      }
    } else {
      // Si la página ya en memoria...
      setAccessHistory([...accessHistory.filter(p => p !== pageId), pageId]);
    }
  };

  const addNewPage = () => {
    if (newPage && !pages.includes(newPage)) {
      handlePageAccess(newPage);
      setNewPage('');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Scheduler FIFO</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full">
            Fallos: {pageFaults}
          </span>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newPage}
              onChange={(e) => setNewPage(e.target.value)}
              placeholder="Nueva página (ej: P1)"
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && addNewPage()}
            />
            <button
              onClick={addNewPage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Agregar
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            Memoria (Capacidad: {memorySize})
          </h2>
          <div className="flex flex-wrap gap-3 min-h-20">
            {pages.map((page, index) => (
              <div 
                key={index} 
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg flex items-center"
              >
                {page}
                {accessHistory[0] === page && (
                  <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">Siguiente</span>
                )}
              </div>
            ))}
            {pages.length === 0 && (
              <p className="text-gray-500">Memoria vacía</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Historial de Accesos (FIFO)
          </h2>
          <div className="flex flex-wrap gap-3 min-h-20">
            {accessHistory.map((page, index) => (
              <div 
                key={index} 
                className={`px-4 py-2 rounded-lg flex items-center ${
                  index === 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}
              >
                {page}
                {index === 0 && <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">Siguiente</span>}
              </div>
            ))}
            {accessHistory.length === 0 && (
              <p className="text-gray-500">Sin accesos registrados</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Simulador de Accesos</h2>
        <div className="flex flex-wrap gap-3 mb-6">
          {['P1', 'P2', 'P3', 'P4', 'P5', 'P6'].map((page) => (
            <button
              key={page}
              onClick={() => handlePageAccess(page)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center"
            >
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              {page}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">Tamaño de memoria:</span>
          <input
            type="range"
            min="1"
            max="6"
            value={memorySize}
            onChange={(e) => {
              const newSize = parseInt(e.target.value);
              setMemorySize(newSize);
              if (pages.length > newSize) {
                // Ajustar páginas si reducimos el tamaño de memoria
                const excess = pages.length - newSize;
                setPages(pages.slice(excess));
                setAccessHistory(accessHistory.slice(excess));
              }
            }}
            className="w-48"
          />
          <span className="text-sm font-medium">{memorySize}</span>
        </div>
      </div>
    </div>
  );
};

export default SchedulerUI;