// src/facade/ApiFacade.ts
import fetch from 'node-fetch';

export class ApiFacade {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    if (!process.env.HUNTD_BASE_URL) {
      throw new Error(
        'HUNTD_BASE_URL environment variable is not set. Please set it before running tests.'
      );
    }
    this.baseUrl = process.env.HUNTD_BASE_URL;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Generic POST request helper
   */
  private async post(path: string, body: any) {
    const url = `${this.baseUrl}${path}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      return response.json();
    } catch (err) {
      console.error(`API POST request to ${url} failed: ${err}`);
      throw err;
    }
  }

  /**
   * Send a GraphQL query or mutation
   */
  async graphql(query: string, variables?: any) {
    return this.post('/graphql', { query, variables });
  }
}
