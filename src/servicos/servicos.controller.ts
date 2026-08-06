import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { ServicosService } from "./servicos.service";

@Controller("servicos")
export class ServicosController {
  constructor(
    private readonly servicosService: ServicosService,
  ) {}

  @Post()
  criar(
    @Body()
    body: {
      barbeariaId: string;
      nome: string;
      descricao?: string;
      preco: number;
      duracao: number;
    },
  ) {
    return this.servicosService.criar(body);
  }

  @Get()
  listar(
    @Body("barbeariaId") barbeariaId: string,
  ) {
    return this.servicosService.listar(
      barbeariaId,
    );
  }

  @Get(":id")
  buscarPorId(
    @Param("id") id: string,
    @Body("barbeariaId") barbeariaId: string,
  ) {
    return this.servicosService.buscarPorId(
      id,
      barbeariaId,
    );
  }

  @Patch(":id")
  atualizar(
    @Param("id") id: string,
    @Body()
    body: {
      barbeariaId: string;
      nome?: string;
      descricao?: string;
      preco?: number;
      duracao?: number;
      ativo?: boolean;
    },
  ) {
    const { barbeariaId, ...dados } = body;

    return this.servicosService.atualizar(
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
    return this.servicosService.remover(
      id,
      barbeariaId,
    );
  }
}