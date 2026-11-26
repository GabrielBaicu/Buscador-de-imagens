import React, { useState } from 'react';
import { Search, Image as ImageIcon, ExternalLink, Loader2, AlertCircle } from 'lucide-react';

const ImageSearchApp = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Substitua pela sua chave de API real do TheSys/OpenUI
  // API KEY        VVVVVVVVVVVVVV    
  const API_KEY = "REACT_APP_API_KEY"; 

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch("https://api.thesys.dev/v1/search/images", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          query: query, 
          num_results: 20 
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na busca: ${response.status}. Verifique sua API Key.`);
      }

      const data = await response.json();
      // A API retorna a lista de imagens com a URL da imagem e a página de origem
       setResults(Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 font-sans">
      {/* Header e Busca */}
      <div className="max-w-4xl mx-auto text-center mb-12 pt-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <ImageIcon className="w-10 h-10 text-blue-400" />
          <h1 className="text-4xl font-bold tracking-tight">Universal <span className="text-blue-400">ImageFinder</span></h1>
         </div>
        
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex: Johnny Bravo roupa de Papai Noel ou hentai coxudas..." 
            className="w-full p-4 pl-6 pr-16 rounded-full bg-slate-800 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="absolute right-2 top-2 p-2 bg-blue-600 hover:bg-blue-500 rounded-full transition-colors disabled:bg-slate-600"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
          </button>
        </form>
      </div>

      {/* Mensagens de Erro */}
      {error && (
        <div className="max-w-md mx-auto mb-8 p-4 bg-red-900/30 border border-red-500 text-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {/* Grid de Resultados */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((item, index) => (
          <div key={index} className="group bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-all hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="aspect-square overflow-hidden bg-slate-700">
              <img 
                src={item.url || item.image_url} 
                alt={item.title || "Resultado"} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Imagem+Indisponivel'; }}
              />
            </div>
            <div className="p-4">
              <p className="text-sm font-medium truncate mb-3" title={item.title}>
                {item.title || "Imagem sem título"}
              </p>
              <a 
                href={item.source_url || item.page_url || item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider transition-colors"
              >
                Ver Site <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Estado Vazio */}
      {!loading && results.length === 0 && !error && (
        <div className="text-center text-slate-500 mt-20">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p>Digite algo acima para começar a busca global.</p>
        </div>
      )}
    </div>
  );
};

export default ImageSearchApp;