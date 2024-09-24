/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from "@nestjs/common";
import { FirebaseUserRepository } from "src/firebase/firebase-auth.repository";
import { ReturnUserDto } from "./dto/ReturnUserDto";

@Injectable()
export class UserService {
  constructor(private firebaseUserRepository: FirebaseUserRepository) {}
  async findAllUsersExceptMe(userId: string) {
    const users = await this.firebaseUserRepository.getAllUsersExceptMe(userId);
    return users.map((user) => new ReturnUserDto(user));
  }

  findUserById(id: string) {
    return this.firebaseUserRepository.getUserById(id);
  }
}
