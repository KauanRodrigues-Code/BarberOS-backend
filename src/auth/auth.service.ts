import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    console.log("BODY RECEBIDO:", data);

    if (!data) {
      throw new ConflictException(
        "Dados de cadastro não enviados.",
      );
    }

    if (
      !data.nome ||
      !data.email ||
      !data.senha ||
      !data.nomeBarbearia
    ) {
      throw new ConflictException(
        "Nome, email, senha e nome da barbearia são obrigatórios.",
      );
    }

    const existingUser = await this.prisma.usuario.findFirst({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      throw new ConflictException(
        "Este email já está cadastrado.",
      );
    }

    const senhaHash = await bcrypt.hash(data.senha, 10);

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const barbearia = await tx.barbearia.create({
          data: {
            nome: data.nomeBarbearia,
            email: data.email,
            telefone: data.telefoneBarbearia,
          },
        });

        const usuario = await tx.usuario.create({
          data: {
            nome: data.nome,
            email: data.email,
            senha: senhaHash,
            perfil: "DONO",
            status: "ATIVO",
            barbeariaId: barbearia.id,
          },
        });

        return {
          barbearia,
          usuario,
        };
      });

      const token = this.jwtService.sign({
        sub: result.usuario.id,
        barbeariaId: result.barbearia.id,
        perfil: result.usuario.perfil,
      });

      return {
        message: "Cadastro realizado com sucesso.",
        token,

        usuario: {
          id: result.usuario.id,
          nome: result.usuario.nome,
          email: result.usuario.email,
          perfil: result.usuario.perfil,
        },

        barbearia: {
          id: result.barbearia.id,
          nome: result.barbearia.nome,
        },
      };
    } catch (error) {
      console.error("Erro ao realizar cadastro:", error);

      throw new InternalServerErrorException(
        "Não foi possível realizar o cadastro.",
      );
    }
  }
}
