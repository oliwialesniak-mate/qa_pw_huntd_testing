/**
 * ApiFacade
 * Provides a simple interface for GraphQL operations against the Huntd backend.
 * Implements retry logic and safe error handling.
 */

export class ApiFacade {
  private baseUrl: string;
  private headers: Record<string, string>;

  /**
   * @param baseUrl - API base URL (e.g., https://app.huntd.io)
   * @param apiKey - optional bearer token for authenticated requests
   */
  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.headers = {
      'Content-Type': 'application/json',
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
    };
  }

  /** Generic POST request helper */
  private async post(path: string, body: any) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body)
    });

    const text = await response.text();
    try {
      return { status: response.status, body: JSON.parse(text) };
    } catch {
      return { status: response.status, body: text };
    }
  }

  /**
   * Execute a GraphQL query or mutation.
   * Retries up to 3 times in case of failure or network issues.
   */
  async graphql(query: string, variables?: any): Promise<any> {
    const payload = { query, variables };

    for (let attempt = 1; attempt <= 3; attempt++) {
      const { status, body } = await this.post('/graphql', payload);

      if (status >= 200 && status < 300 && body && !body.errors) {
        return body.data;
      }

      if (attempt === 3) {
        throw new Error(
          `GraphQL request failed after ${attempt} attempts: ${JSON.stringify(body)}`
        );
      }

      // Backoff before retrying
      await new Promise((r) => setTimeout(r, attempt * 300));
    }
  }

  /** Create a new user via GraphQL mutation */
  async createUser(user: { username: string; password: string; email: string }) {
    const mutation = `
      mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          id
          username
          email
        }
      }
    `;
    const variables = { input: user };
    return this.graphql(mutation, variables);
  }

  /** Create a new hunt via GraphQL mutation */
  async createHunt(huntInput: { name: string; description?: string }) {
    const mutation = `
      mutation CreateHunt($input: CreateHuntInput!) {
        createHunt(input: $input) {
          id
          name
        }
      }
    `;
    const variables = { input: huntInput };
    return this.graphql(mutation, variables);
  }
}
