import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GeocodeService {
  private readonly logger = new Logger(GeocodeService.name);

  private readonly baseUrl = 'https://nominatim.openstreetmap.org';

  async reverse(lat: number, lng: number) {
    try {
      const response = await axios.get(`${this.baseUrl}/reverse`, {
        params: {
          lat,
          lon: lng,
          format: 'json',
          addressdetails: 1,
        },
        headers: {
          'User-Agent': 'roadfixng (devabdulganiyy@gmail.com)',
        },
      });

      const data = response.data;

      return {
        address: data.display_name ?? null,
        city:
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          null,
        state: data.address?.state ?? null,
        country: data.address?.country ?? null,
      };
    } catch (error) {
      this.logger.error('Reverse geocoding failed', error);

      return {
        address: null,
        city: null,
        state: null,
        country: null,
      };
    }
  }

  async forward(address: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          q: address,
          format: 'json',
          limit: 1,
        },
        headers: {
          'User-Agent': 'road-report-app',
        },
      });

      const result = response.data[0];

      if (!result) return null;

      return {
        latitude: Number(result.lat),
        longitude: Number(result.lon),
        address: result.display_name,
      };
    } catch (error) {
      this.logger.error('Forward geocoding failed', error);
      return null;
    }
  }
}
