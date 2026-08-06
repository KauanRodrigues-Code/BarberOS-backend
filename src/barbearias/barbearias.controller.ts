import {
  Controller,
  Get,
  Param,
} from "@nestjs/common";

import { BarbeariasService } from "./barbearias.service";

@Controller("barbearias")
export class BarbeariasController {
  constructor(
    private readonly barbeariasService: BarbeariasService,
  ) {}

  @Get("public/:slug")
  buscarPublica(
    @Param("slug") slug: string,
  ) {
    return this.barbeariasService.buscarPublica(slug);
  }
}