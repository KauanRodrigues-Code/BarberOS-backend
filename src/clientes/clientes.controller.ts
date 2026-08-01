import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { ClientesService } from "./clientes.service";

@Controller("clientes")
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  criar(
    @Body()
    body: {
      barbeariaId: string;
      nome: string;
      telefone: string;
      email?: string;
      observacoes?: string;
    },
  ) {
    return this.clientesService.criar(body);
  }

  @Get()
  listar(@Body("barbeariaId") barbeariaId: string) {
    return this.clientesService.listar(barbeariaId);
  }

  @Get(":id")
  buscarPorId(
    @Param("id") id: string,
    @Body("barbeariaId") barbeariaId: string,
  ) {
    return this.clientesService.buscarPorId(id, barbeariaId);
  }

  @Patch(":id")
  atualizar(
    @Param("id") id: string,
    @Body()
    body: {
      barbeariaId: string;
      nome?: string;
      telefone?: string;
      email?: string;
      observacoes?: string;
    },
  ) {
    const { barbeariaId, ...dados } = body;

    return this.clientesService.atualizar(
      id,
      barbeariaId,
      dados,
    );
  }

  @Delete(":id")
  remover(
    @Param("id") id: string,
    @Body("barbeariaId") barbeariaId: string,
  ) {
    return this.clientesService.remover(
      id,
      barbeariaId,
    );
  }
}