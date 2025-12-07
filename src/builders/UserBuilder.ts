type PartialUser = {
  username?: string;
  password?: string;
  email?: string;
  role?: string;
};

export class UserBuilder {
  private user: PartialUser = {};

  withUsername(username: string) {
    this.user.username = username;
    return this;
  }

  withPassword(password: string) {
    this.user.password = password;
    return this;
  }

  withEmail(email: string) {
    this.user.email = email;
    return this;
  }

  withRole(role: string) {
    this.user.role = role;
    return this;
  }

  build() {
    // defaults
    return {
      username: this.user.username ?? `user_${Date.now()}`,
      password: this.user.password ?? 'Passw0rd!',
      email: this.user.email ?? `user+${Date.now()}@example.com`,
      role: this.user.role ?? 'player'
    };
  }
}
