import {
  Body,
  Controller,
  Post,
} from "@nestjs/common";

import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post("register")
  async register(
    @Body() data: RegisterDto,
  ) {
    console.log("CONTROLLER BODY:", data);

    return this.authService.register(data);
  }

  @Post("login")
  async login(
    @Body()
    data: {
      email: string;
      senha: string;
    },
  ) {
    console.log("LOGIN BODY:", data);

    return this.authService.login(
      data.email,
      data.senha,
    );
  }
}