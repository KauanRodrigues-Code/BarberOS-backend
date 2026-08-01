import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { ClientesModule } from './clientes/clientes.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { BarbeariasModule } from './barbearias/barbearias.module';

@Module({
  imports: [PrismaModule, ClientesModule, AuthModule, UsuariosModule, BarbeariasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}