'use client';

import React, { useEffect, useState } from 'react';
import { getUnsplashAttribution, searchUnsplashImages, type UnsplashImage } from '~/utils/Unsplash';
import { ImageSkeleton } from './ImageSkeleton';

interface UnsplashImageProps {
  query: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}

export const Unsplashimage: React.FC<UnsplashImageProps> = ({ 
  query, 
  alt = '', 
  className = '',
  width = 800,
  height = 600
}) => {
  const [image, setImage] = useState<UnsplashImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchImage = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching image for query:', query);
        
        const images = await searchUnsplashImages(query, 1);
        console.log('Received images:', images);
        
        if (!mounted) return;
        
        if (images && images.length > 0) {
          setImage(images[0]);
        } else {
          setError('No image found');
        }
      } catch (err) {
        console.error('Error in component:', err);
        if (mounted) {
          setError('Failed to load image');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchImage();
    return () => { mounted = false; };
  }, [query]);

  if (loading) {
    return <ImageSkeleton className={className} />;
  }

  if (error || !image) {
    return <div className="text-red-500">{error || 'No image found'}</div>;
  }

  return (
    <figure className="relative">
      <img
        src={image.urls.regular}
        alt={image.alt_description || alt}
        className={`rounded-lg object-cover ${className}`}
        width={width}
        height={height}
        loading="lazy"
      />
      <figcaption className="text-xs text-gray-500 mt-1">
        {getUnsplashAttribution(image)}
      </figcaption>
    </figure>
  );
};