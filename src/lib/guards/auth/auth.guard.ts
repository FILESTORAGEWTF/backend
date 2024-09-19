import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { FirebaseAuthService } from "src/firebase/firebase-auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private firebaseAuthService: FirebaseAuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    try {
      const userData = await this.firebaseAuthService.verifyToken(token);
      if (userData) {
        request["user"] = userData;
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error, "token");
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
