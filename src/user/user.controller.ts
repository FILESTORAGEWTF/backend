import { Controller, Get, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "src/lib/guards/auth/auth.guard";
import { RequestUserSession } from "src/lib/decorators/request-user-session.decorator";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ReturnUserDto } from "./dto/ReturnUserDto";

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    status: 200,
    type: [ReturnUserDto],
  })
  async findAll(@RequestUserSession() session: any) {
    return await this.userService.findAllUsersExceptMe(session.uid);
  }
}
