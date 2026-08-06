import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class BarbeirosService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(data: {
    barbeariaId: string;
    nome: string;
    telefone?: string;
    status?: "ATIVO" | "FOLGA" | "INATIVO";
  }) {
    if (!data.nome || !data.barbeariaId) {
      throw new ConflictException(
        "Nome e barbeariaId são obrigatórios.",
      );
    }

    const barbearia =
      await this.prisma.barbearia.findUnique({
        where: {
          id: data.barbeariaId,
        },
      });

    if (!barbearia) {
      throw new NotFoundException(
        "Barbearia não encontrada.",
      );
    }

    return this.prisma.barbeiro.create({
      data: {
        barbeariaId: data.barbeariaId,
        nome: data.nome,
        telefone: data.telefone,
        status: data.status ?? "ATIVO",
      },
    });
  }

  async listar(barbeariaId: string) {
    if (!barbeariaId) {
      throw new ConflictException(
        "barbeariaId é obrigatório.",
      );
    }

    return this.prisma.barbeiro.findMany({
      where: {
        barbeariaId,
      },
      orderBy: {
        nome: "asc",
      },
    });
  }

  async buscarPorId(
    id: string,
    barbeariaId: string,
  ) {
    const barbeiro =
      await this.prisma.barbeiro.findFirst({
        where: {
          id,
          barbeariaId,
        },
      });

    if (!barbeiro) {
      throw new NotFoundException(
        "Barbeiro não encontrado.",
      );
    }

    return barbeiro;
  }

  async atualizar(
    id: string,
    barbeariaId: string,
    dados: {
      nome?: string;
      telefone?: string;
      status?: "ATIVO" | "FOLGA" | "INATIVO";
    },
  ) {
    await this.buscarPorId(id, barbeariaId);

    return this.prisma.barbeiro.update({
      where: {
        id,
      },
      data: dados,
    });
  }

  async remover(
    id: string,
    barbeariaId: string,
  ) {
    await this.buscarPorId(id, barbeariaId);

    return this.prisma.barbeiro.delete({
      where: {
        id,
      },
    });
  }
}