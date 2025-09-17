import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// Interface para definir a estrutura dos dados da imagem
interface ImageData {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

function App() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar imagens, agora usando 'useCallback' para otimização
  const fetchImages = useCallback(async () => {
    if (loading) return; // Previne buscas múltiplas simultâneas
    setLoading(true);
    try {
      // Usamos o estado 'page' para buscar páginas diferentes a cada chamada
      const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=15`);
      if (!response.ok) {
        throw new Error('Falha ao buscar mais imagens.');
      }
      const newImages = await response.json();
      if (newImages.length === 0) {
        // Se a API não retornar mais imagens, paramos de tentar carregar
        setLoading(false);
        return;
      }
      // Adicionamos as novas imagens à lista existente
      setImages(prevImages => [...prevImages, ...newImages]);
      setPage(prevPage => prevPage + 1); // Preparamos para a próxima página
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [page, loading]);

  // useEffect para buscar a primeira leva de imagens ao carregar o componente
  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // O array vazio garante que isso rode apenas uma vez

  // useEffect para adicionar o listener de scroll
  useEffect(() => {
    const handleScroll = () => {
      // Condição para carregar mais:
      // Se a soma da altura visível da janela + o quanto já foi rolado
      // for maior ou igual à altura total do documento, menos um "buffer" de 200px.
      // E também verificamos se já não está carregando algo.
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200 && !loading) {
        fetchImages();
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Função de limpeza: remove o listener quando o componente é desmontado
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchImages, loading]);


  return (
    <div className="container">
      <header>
        <h1>Galeria Infinita</h1>
        <p>Role para baixo para carregar mais imagens</p>
      </header>
      
      {error && <p className="error-message">Erro: {error}</p>}

      <div className="masonry-gallery">
        {images.map(image => (
          <div key={image.id} className="masonry-item">
            <img
              src={image.download_url}
              alt={`Foto por ${image.author}`}
            />
            <div className="overlay">
              <span>{image.author}</span>
            </div>
          </div>
        ))}
      </div>
      
      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Carregando mais imagens...</p>
        </div>
      )}
    </div>
  );
}

export default App;