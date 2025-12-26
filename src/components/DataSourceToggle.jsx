import React from 'react';
import { Database, Cloud, RefreshCw } from 'lucide-react';

const DataSourceToggle = ({ dataSource, onToggle, onRefresh, loading, language }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        <Database className="text-blue-600" size={24} />
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {language === 'en' ? 'Data Source' : 'Fuente de Datos'}
          </p>
          <p className="text-xs text-gray-600">
            {dataSource === 'seattle' 
              ? (language === 'en' ? 'Seattle Open Data (Live)' : 'Datos Abiertos de Seattle (En Vivo)')
              : (language === 'en' ? 'Demo Data (Mock)' : 'Datos de Demostración (Simulados)')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Toggle Switch */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggle('mock')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              dataSource === 'mock'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {language === 'en' ? 'Demo' : 'Demo'}
          </button>
          <button
            onClick={() => onToggle('seattle')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              dataSource === 'seattle'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Cloud size={16} />
            {language === 'en' ? 'Seattle Live' : 'Seattle En Vivo'}
          </button>
        </div>

        {/* Refresh Button */}
        {dataSource === 'seattle' && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            title={language === 'en' ? 'Refresh data' : 'Actualizar datos'}
          >
            <RefreshCw 
              size={20} 
              className={loading ? 'animate-spin' : ''} 
            />
          </button>
        )}
      </div>

      {/* Info Badge */}
      {dataSource === 'seattle' && (
        <div className="w-full bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
          <Cloud className="text-green-600 flex-shrink-0" size={18} />
          <div className="text-xs text-green-800">
            <p className="font-semibold mb-1">
              {language === 'en' 
                ? '✓ Connected to Seattle Open Data' 
                : '✓ Conectado a Datos Abiertos de Seattle'}
            </p>
            <p>
              {language === 'en'
                ? 'Displaying real customer service requests from data.seattle.gov'
                : 'Mostrando solicitudes reales de servicio al cliente de data.seattle.gov'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSourceToggle;