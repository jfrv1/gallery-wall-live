import { ArtworkResponse } from '@/types/artwork';

const BASE_URL = 'https://api.harvardartmuseums.org';
const API_KEY = 'bb4d4d9e-e469-4b9b-83b1-a4e2a2c42b63'; // Harvard Art Museums free demo key

export class HarvardArtAPI {
  private static async fetchWithRetry(url: string, retries = 3): Promise<Response> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        if (response.ok) return response;
        if (response.status === 429) {
          // Rate limited, wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          continue;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    throw new Error('Max retries exceeded');
  }

  static async getArtworks(page = 1, size = 20): Promise<ArtworkResponse> {
    const params = new URLSearchParams({
      apikey: API_KEY,
      page: page.toString(),
      size: size.toString(),
      hasimage: '1', // Only return artworks with images
      sort: 'random', // Randomize results
      fields: 'id,title,dated,url,primaryimageurl,images,people,culture,medium,dimensions,creditline,classification,department',
    });

    const url = `${BASE_URL}/object?${params}`;
    
    try {
      const response = await this.fetchWithRetry(url);
      const data = await response.json();
      
      // Filter out artworks without proper images
      const filteredRecords = data.records?.filter((artwork: any) => 
        artwork.primaryimageurl && 
        artwork.primaryimageurl.includes('https://') &&
        artwork.title &&
        artwork.title !== 'Untitled'
      ) || [];

      return {
        ...data,
        records: filteredRecords
      };
    } catch (error) {
      console.error('Error fetching artworks:', error);
      throw new Error('Failed to fetch artworks from Harvard Art Museums');
    }
  }

  static async searchArtworks(query: string, page = 1): Promise<ArtworkResponse> {
    const params = new URLSearchParams({
      apikey: API_KEY,
      q: query,
      page: page.toString(),
      size: '20',
      hasimage: '1',
      fields: 'id,title,dated,url,primaryimageurl,images,people,culture,medium,dimensions,creditline,classification,department',
    });

    const url = `${BASE_URL}/object?${params}`;
    
    try {
      const response = await this.fetchWithRetry(url);
      const data = await response.json();
      
      const filteredRecords = data.records?.filter((artwork: any) => 
        artwork.primaryimageurl && 
        artwork.primaryimageurl.includes('https://') &&
        artwork.title
      ) || [];

      return {
        ...data,
        records: filteredRecords
      };
    } catch (error) {
      console.error('Error searching artworks:', error);
      throw new Error('Failed to search artworks');
    }
  }

  static getHighResImageUrl(artwork: any): string {
    // Try to get the highest resolution image available
    if (artwork.images && artwork.images.length > 0) {
      const image = artwork.images[0];
      if (image.iiifbaseuri) {
        // Use IIIF for high resolution
        return `${image.iiifbaseuri}/full/!2000,2000/0/default.jpg`;
      }
      if (image.baseimageurl) {
        return image.baseimageurl;
      }
    }
    return artwork.primaryimageurl || '';
  }
}