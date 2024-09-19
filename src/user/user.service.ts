/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from "@nestjs/common";
import { FirebaseUserRepository } from "src/firebase/firebase-auth.repository";

@Injectable()
export class UserService {
  constructor(private firebaseUserRepository: FirebaseUserRepository) {}
  findAll() {
    return this.firebaseUserRepository.getAllUsers();
  }
}
