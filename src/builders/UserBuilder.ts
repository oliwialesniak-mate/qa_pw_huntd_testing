/**
 * UserBuilder
 * Implements Builder pattern for creating user test data.
 * Provides default values if fields are not explicitly set.
 */

type PartialUser = {
  username?: string;
  password?: string;
  email?: string;
  role?: string;
};

export class UserBuilder {
  private user: PartialUser = {};

  withUsername(username: string): this {
    this.user.username = username;
    return this;
  }

  withPassword(password: string): this {
    this.user.password = password;
    return this;
  }

  withEmail(email: string): this {
    this.user.email = email;
    return this;
  }

  withRole(role: string): this {
    this.user.role = role;
    return this;
  }

  build(): { username: string; password: string; email: string; role: string } {
    return {
      username: this.user.username ?? `user_${Date.now()}`,
      password: this.user.password ?? 'Passw0rd!',
      email: this.user.email ?? `user+${Date.now()}@huntd.io`,
      role: this.user.role ?? 'player',
    };
  }
}
