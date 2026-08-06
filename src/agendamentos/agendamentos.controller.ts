import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";

import { JwtGuard } from "../auth/jwt.guard";
import { AgendamentosService } from "./agendamentos.service";


@Controller("agendamentos")
export class AgendamentosController {

  constructor(
    private readonly agendamentosService: AgendamentosService,
  ) {}



  // ==========================
  // ROTAS PÚBLICAS
  // ==========================


  @Get("disponiveis")
  buscarHorariosDisponiveis(
    @Query("barbeiroId")
    barbeiroId: string,

    @Query("data")
    data: string,
  ) {

    return this.agendamentosService.buscarHorariosDisponiveis(
      barbeiroId,
      data,
    );

  }



  @Post("public")
  criarPublico(
    @Body()
    body: {

      slug: string;

      clienteNome: string;

      clienteTelefone: string;

      servicoId: string;

      barbeiroId?: string;

      dataHora: string;

      observacoes?: string;

    },
  ) {

    return this.agendamentosService.criarPublico(
      body,
    );

  }





  // ==========================
  // ROTAS ADMIN
  // ==========================


  @UseGuards(JwtGuard)
  @Post()
  criar(
    @Req() req,

    @Body()
    body: {

      clienteId: string;

      barbeiroId?: string;

      servicoId: string;

      dataHora: string;

      observacoes?: string;

    },
  ) {

    return this.agendamentosService.criar(
      req.user.barbeariaId,
      body,
    );

  }





  @UseGuards(JwtGuard)
  @Get()
  listar(
    @Req() req,
  ) {

    return this.agendamentosService.listar(
      req.user.barbeariaId,
    );

  }





  @UseGuards(JwtGuard)
  @Get(":id")
  buscarPorId(
    @Req() req,

    @Param("id")
    id: string,
  ) {

    return this.agendamentosService.buscarPorId(
      id,
      req.user.barbeariaId,
    );

  }





  @UseGuards(JwtGuard)
  @Patch(":id")
  atualizar(
    @Req() req,

    @Param("id")
    id: string,

    @Body()
    body,
  ) {

    return this.agendamentosService.atualizar(
      id,
      req.user.barbeariaId,
      body,
    );

  }





  @UseGuards(JwtGuard)
  @Delete(":id")
  remover(
    @Req() req,

    @Param("id")
    id: string,
  ) {

    return this.agendamentosService.remover(
      id,
      req.user.barbeariaId,
    );

  }

}