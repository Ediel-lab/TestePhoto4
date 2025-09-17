import React, { useEffect, useState } from 'react';
import './App.css';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('https://picsum.photos/v2/list?limit=10');
        if (!response.ok) {
          throw new Error('Falha ao buscar imagens');
        }
        const data = await response.json();
        setImages(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Ocorreu um erro desconhecido');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return <div className="container"><h1>Carregando...</h1></div>;
  }

  if (error) {
    return <div className="container"><h1>Erro: {error}</h1></div>;
  }

  return (
    <div className="container">
      <h1>Galeria de Imagens Picsum</h1>
      <div className="gallery">
        {images.map(image => (
          <div key={image.id} className="gallery-item">
            <img
              src={`https://picsum.photos/id/${image.id}/300/300`}
              alt={image.author}
            />
            <p className="author-name">{image.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;