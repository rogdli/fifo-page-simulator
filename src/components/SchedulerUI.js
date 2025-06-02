// Trabajo Final de Sistemas Operativos
// Alumno: Rodrigo Villegas

import React, { useState } from 'react';

const SchedulerUI = () => {
  const [pages, setPages] = useState([]);
  const [accessHistory, setAccessHistory] = useState([]);
  const [memorySize, setMemorySize] = useState(4);
  const [newPage, setNewPage] = useState('');
  const [pageFaults, setPageFaults] = useState(0);
  const [hits, setHits] = useState(0);
  const [lastOperation, setLastOperation] = useState(null);

  const resetSimulation = () => {
    setPages([]);
    setAccessHistory([]);
    setPageFaults(0);
    setHits(0);
    setLastOperation(null);
  };

  const handlePageAccess = (pageId) => {
    // Agregar al historial de accesos
    setAccessHistory(prev => [...prev, pageId]);
    
    if (pages.includes(pageId)) {
      // HIT: La página ya está en memoria
      setHits(prev => prev + 1);
      setLastOperation({
        type: 'hit',
        page: pageId,
        message: `Página ${pageId} encontrada en memoria`
      });
    } else {
      // MISS: Fallo de página
      setPageFaults(prev => prev + 1);
      
      if (pages.length >= memorySize) {
        // Memoria llena - aplicar FIFO
        const oldestPage = pages[0]; // El primero es el más antiguo
        const newPages = [...pages.slice(1), pageId]; // Remover el primero, agregar al final
        setPages(newPages);
        setLastOperation({
          type: 'replacement',
          page: pageId,
          replacedPage: oldestPage,
          message: `Página ${pageId} reemplaza a ${oldestPage} (FIFO)`
        });
      } else {
        // Memoria no llena - solo agregar
        setPages(prev => [...prev, pageId]);
        setLastOperation({
          type: 'load',
          page: pageId,
          message: `Página ${pageId} cargada en memoria`
        });
      }
    }
  };

  const addNewPage = () => {
    if (newPage && newPage.trim() !== '') {
      handlePageAccess(newPage.trim());
      setNewPage('');
    }
  };

  const hitRate = accessHistory.length > 0 ? (hits / accessHistory.length * 100).toFixed(1) : 0;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Simulador FIFO - Reemplazo de Páginas</h1>
          <button
            onClick={resetSimulation}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Reiniciar
          </button>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            Accesos: {accessHistory.length}
          </span>
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
            Fallos: {pageFaults}
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
            Hits: {hits}
          </span>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
            Hit Rate: {hitRate}%
          </span>
        </div>
      </div>

      {lastOperation && (
        <div className={`p-4 rounded-lg mb-6 ${
          lastOperation.type === 'hit' ? 'bg-green-50 border-l-4 border-green-500' :
          lastOperation.type === 'replacement' ? 'bg-red-50 border-l-4 border-red-500' :
          'bg-blue-50 border-l-4 border-blue-500'
        }`}>
          <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-3 ${
              lastOperation.type === 'hit' ? 'bg-green-500' :
              lastOperation.type === 'replacement' ? 'bg-red-500' :
              'bg-blue-500'
            }`}></span>
            <span className="font-medium">{lastOperation.message}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            Memoria Principal (Capacidad: {memorySize})
          </h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {Array.from({ length: memorySize }, (_, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border-2 border-dashed min-h-16 flex items-center justify-center ${
                  pages[index] 
                    ? 'bg-blue-100 border-blue-300 text-blue-800' 
                    : 'bg-gray-50 border-gray-300 text-gray-400'
                }`}
              >
                {pages[index] ? (
                  <div className="text-center">
                    <div className="font-bold text-lg">{pages[index]}</div>
                    <div className="text-xs">
                      {index === 0 ? 'Más antiguo' : `Posición ${index + 1}`}
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-sm">Slot {index + 1}</div>
                    <div className="text-xs">Vacío</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
            <strong>FIFO:</strong> El primer elemento (izquierda superior) es el más antiguo y será reemplazado primero.
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Historial de Accesos
          </h2>
          <div className="max-h-40 overflow-y-auto mb-4">
            <div className="flex flex-wrap gap-2">
              {accessHistory.map((page, index) => (
                <div 
                  key={index} 
                  className={`px-3 py-1 rounded text-sm ${
                    index === accessHistory.length - 1 
                      ? 'bg-yellow-200 text-yellow-800 ring-2 ring-yellow-300' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {page}
                </div>
              ))}
            </div>
          </div>
          {accessHistory.length === 0 && (
            <p className="text-gray-500 text-center py-8">Sin accesos registrados</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-6">
        <h2 className="text-xl font-semibold mb-4">Controles de Simulación</h2>
        
        <div className="flex items-center space-x-4 mb-6">
          <input
            type="text"
            value={newPage}
            onChange={(e) => setNewPage(e.target.value)}
            placeholder="Nueva página (ej: P1, A, 1, etc.)"
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1 max-w-xs"
            onKeyPress={(e) => e.key === 'Enter' && addNewPage()}
          />
          <button
            onClick={addNewPage}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Acceder
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Páginas de Prueba:</h3>
          <div className="flex flex-wrap gap-3">
            {['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'A', 'B', 'C'].map((page) => (
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
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-sm font-medium">Tamaño de memoria:</span>
            <input
              type="range"
              min="1"
              max="8"
              value={memorySize}
              onChange={(e) => {
                const newSize = parseInt(e.target.value);
                setMemorySize(newSize);
                if (pages.length > newSize) {
                  // Si reducimos el tamaño, mantenemos solo las páginas más recientes
                  const excessPages = pages.length - newSize;
                  setPages(pages.slice(excessPages));
                }
              }}
              className="w-48"
            />
            <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded">{memorySize}</span>
          </div>
          
          <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded">
            <strong>Tip:</strong> Prueba la secuencia: P1 → P2 → P3 → P4 → P5 → P1 → P2 → P6 para ver cómo funciona FIFO con diferentes patrones de acceso.
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">¿Cómo funciona FIFO?</h2>
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 mb-3">
            <strong>First In, First Out (FIFO)</strong> es un algoritmo de reemplazo de páginas que mantiene las páginas en memoria en el orden en que llegaron.
          </p>
          <ul className="text-gray-700 space-y-2">
            <li><strong>Hit:</strong> Si la página solicitada ya está en memoria, no hay reemplazo.</li>
            <li><strong>Miss con espacio:</strong> Si hay espacio libre, la página se carga directamente.</li>
            <li><strong>Miss sin espacio:</strong> Se reemplaza la página más antigua (la primera que entró).</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SchedulerUI;
