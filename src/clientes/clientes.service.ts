import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(data: {
    barbeariaId: string;
    nome: string;
    telefone: string;
    email?: string;
    observacoes?: string;
  }) {
    return this.prisma.cliente.create({
      data: {
        barbeariaId: data.barbeariaId,
        nome: data.nome,
        telefone: data.telefone,
        email: data.email,
        observacoes: data.observacoes,
      },
    });
  }

  async listar(barbeariaId: string) {
    return this.prisma.cliente.findMany({
      where: {
        barbeariaId,
      },
      orderBy: {
        nome: "asc",
      },
    });
  }

  async buscarPorId(id: string, barbeariaId: string) {
    return this.prisma.cliente.findFirst({
      where: {
        id,
        barbeariaId,
      },
      include: {
        agendamentos: {
          orderBy: {
            dataHora: "desc",
          },
          include: {
            servico: true,
            barbeiro: true,
          },
        },
      },
    });
  }

  async atualizar(
    id: string,
    barbeariaId: string,
    data: {
      nome?: string;
      telefone?: string;
      email?: string;
      observacoes?: string;
    },
  ) {
    return this.prisma.cliente.updateMany({
      where: {
        id,
        barbeariaId,
      },
      data,
    });
  }

  async remover(id: string, barbeariaId: string) {
    return this.prisma.cliente.deleteMany({
      where: {
        id,
        barbeariaId,
      },
    });
  }
}