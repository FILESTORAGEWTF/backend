import { IsString, IsEmail } from "class-validator";

export class ReturnUserDto {
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  constructor(user: any) {
    this.id = user.uid;
    this.email = user.email;
  }
}
