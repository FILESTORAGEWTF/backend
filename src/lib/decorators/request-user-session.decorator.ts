import { createParamDecorator } from "@nestjs/common";

export const RequestUserSession = createParamDecorator((data, context) => {
  const req = context.switchToHttp().getRequest();

  return req.user;
});
