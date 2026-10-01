import { Injectable } from '@nestjs/common';

export interface User {
  id: string;
  googleId: string;
  email: string;
  name: string;
  picture: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [];

  findByGoogleId(googleId: string): User | undefined {
    return this.users.find((user) => user.googleId === googleId);
  }

  findById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  createUser(data: {
    googleId: string;
    email: string;
    name: string;
    picture: string;
  }): User {
    const user: User = {
      id: Date.now().toString(),
      googleId: data.googleId,
      email: data.email,
      name: data.name,
      picture: data.picture,
    };

    this.users.push(user);

    return user;
  }
}