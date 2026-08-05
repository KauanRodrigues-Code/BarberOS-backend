import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Req,
} from "@nestjs/common";

import { ClientesService } from "./clientes.service";
import { JwtGuard } from "../auth/jwt.guard";

@Controller("clientes")
@UseGuards(JwtGuard)
export class ClientesController {
  constructor(
    private readonly clientesService: ClientesService,
  ) {}

  @Post()
  criar(
    @Req() req: any,
    @Body()
    body: {
      nome: string;
      telefone: string;
      email?: string;
      observacoes?: string;
    },
  ) {
    return this.clientesService.criar({
      ...body,
      barbeariaId: req.user.barbeariaId,
    });
  }

  @Get()
  listar(@Req() req: any) {
    return this.clientesService.listar(
      req.user.barbeariaId,
    );
  }

  @Get(":id")
  buscarPorId(
    @Param("id") id: string,
    @Req() req: any,
  ) {
    return this.clientesService.buscarPorId(
      id,
      req.user.barbeariaId,
    );
  }

  @Patch(":id")
  atualizar(
    @Param("id") id: string,
    @Req() req: any,
    @Body()
    body: {
      nome?: string;
      telefone?: string;
      email?: string;
      observacoes?: string;
    },
  ) {
    return this.clientesService.atualizar(
      id,
      req.user.barbeariaId,
      body,
    );
  }

  @Delete(":id")
  remover(
    @Param("id") id: string,
    @Req() req: any,
  ) {
    return this.clientesService.remover(
      id,
      req.user.barbeariaId,
    );
  }
}