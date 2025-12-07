export class ApiFacade {
  private baseUrl: string;
  private headers: Record<string,string>;

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
      ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {})
    };
  }

  async graphql(query: string, variables?: any) {
    const res = await fetch(this.baseUrl + '/graphql', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ query, variables })
    });
    const body = await res.json();
    if (!res.ok || body.errors) {
      throw new Error(`GraphQL error: ${JSON.stringify(body.errors || body)}`);
    }
    return body.data;
  }

  // Example helper: create user
  async createUser(user: { username: string; password: string; email: string }) {
    const query = `
      mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          id
          username
          email
        }
      }
    `;
    const variables = { input: user };
    return this.graphql(query, variables);
  }

  // Example: prepare hunt
  async createHunt(huntInput: any) {
    const query = `
      mutation CreateHunt($input: CreateHuntInput!) {
        createHunt(input: $input) {
          id
          name
        }
      }
    `;
    const variables = { input: huntInput };
    return this.graphql(query, variables);
  }
}
