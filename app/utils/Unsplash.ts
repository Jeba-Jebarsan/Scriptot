import { request } from '~/lib/fetch';

const UNSPLASH_ACCESS_KEY = '1oZLS5ASj4CQ4eSu9AbveTuldiA_HhsaTFUWgOODzPI';
const UNSPLASH_API_URL = 'https://images.unsplash.com';

export interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  user: {
    name: string;
    links: {
      html: string;
    };
  };
}

export async function searchUnsplashImages(query: string, perPage: number = 10): Promise<UnsplashImage[]> {
  try {
    // Using a direct Unsplash photo ID for demonstration
    const photoId = 'random-photo-id'; // You'll need to replace this with actual photo IDs
    const url = `${UNSPLASH_API_URL}/photo-${photoId}`;

    // Creating a mock response with the direct URL format
    const mockImage: UnsplashImage = {
      id: photoId,
      urls: {
        raw: `${UNSPLASH_API_URL}/photo-${photoId}`,
        full: `${UNSPLASH_API_URL}/photo-${photoId}`,
        regular: `${UNSPLASH_API_URL}/photo-${photoId}`,
        small: `${UNSPLASH_API_URL}/photo-${photoId}`,
        thumb: `${UNSPLASH_API_URL}/photo-${photoId}`,
      },
      alt_description: query,
      user: {
        name: 'Unsplash Photographer',
        links: {
          html: 'https://unsplash.com',
        },
      },
    };

    return [mockImage];
  } catch (error) {
    console.error('Error fetching Unsplash images:', error);
    return [];
  }
}

export function getUnsplashAttribution(image: UnsplashImage): string {
  return `Photo by ${image.user.name} on Unsplash`;
}
