import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail } from "class-validator";

export class ReturnUserDto {
  @ApiProperty({ description: "Unique identifier for the user" })
  @IsString()
  id: string;

  @ApiProperty({ description: "Email address of the user" })
  @IsEmail()
  email: string;

  constructor(user: any) {
    this.id = user.uid;
    this.email = user.email;
  }
}
