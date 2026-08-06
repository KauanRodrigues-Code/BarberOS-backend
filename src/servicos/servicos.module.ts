import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { ServicosController } from "./servicos.controller";
import { ServicosService } from "./servicos.service";

@Module({
  imports: [PrismaModule],
  controllers: [ServicosController],
  providers: [ServicosService],
})
export class ServicosModule {}