import { useState, useEffect } from 'react';
import { searchUnsplashImages, type UnsplashImage } from '~/utils/Unsplash';

export function useUnsplashImage(query: string) {
  const [image, setImage] = useState<UnsplashImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);

        const images = await searchUnsplashImages(query, 1);

        if (images.length > 0) {
          setImage(images[0]);
        } else {
          setError('No image found');
        }
      } catch (err) {
        setError('Failed to load image');
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [query]);

  return { image, loading, error };
}
