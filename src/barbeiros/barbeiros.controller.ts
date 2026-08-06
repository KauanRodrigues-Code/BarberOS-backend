import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import { BarbeirosService } from "./barbeiros.service";
import { JwtGuard } from "../auth/jwt.guard";

@Controller("barbeiros")
@UseGuards(JwtGuard)
export class BarbeirosController {
  constructor(
    private readonly barbeirosService: BarbeirosService,
  ) {}

  @Post()
  criar(
    @Req() req: any,
    @Body()
    body: {
      nome: string;
      telefone?: string;
    },
  ) {
    return this.barbeirosService.criar({
      ...body,
      barbeariaId: req.user.barbeariaId,
    });
  }

  @Get()
  listar(@Req() req: any) {
    return this.barbeirosService.listar(
      req.user.barbeariaId,
    );
  }

  @Get(":id")
  buscarPorId(
    @Req() req: any,
    @Param("id") id: string,
  ) {
    return this.barbeirosService.buscarPorId(
      id,
      req.user.barbeariaId,
    );
  }

  @Patch(":id")
  atualizar(
    @Req() req: any,
    @Param("id") id: string,
    @Body()
    body: {
      nome?: string;
      telefone?: string;
      status?: "ATIVO" | "FOLGA" | "INATIVO";
    },
  ) {
    return this.barbeirosService.atualizar(
      id,
      req.user.barbeariaId,
      body,
    );
  }

  @Delete(":id")
  remover(
    @Req() req: any,
    @Param("id") id: string,
  ) {
    return this.barbeirosService.remover(
      id,
      req.user.barbeariaId,
    );
  }
}