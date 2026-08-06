import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ServicosService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(data: {
    barbeariaId: string;
    nome: string;
    descricao?: string;
    preco: number;
    duracao: number;
  }) {
    const barbearia = await this.prisma.barbearia.findUnique({
      where: {
        id: data.barbeariaId,
      },
    });

    if (!barbearia) {
      throw new NotFoundException(
        "Barbearia não encontrada.",
      );
    }

    return this.prisma.servico.create({
      data: {
        barbeariaId: data.barbeariaId,
        nome: data.nome,
        descricao: data.descricao,
        preco: data.preco,
        duracao: data.duracao,
      },
    });
  }

  async listar(barbeariaId: string) {
    return this.prisma.servico.findMany({
      where: {
        barbeariaId,
        ativo: true,
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
    const servico = await this.prisma.servico.findFirst({
      where: {
        id,
        barbeariaId,
      },
    });

    if (!servico) {
      throw new NotFoundException(
        "Serviço não encontrado.",
      );
    }

    return servico;
  }

  async atualizar(
    id: string,
    barbeariaId: string,
    data: {
      nome?: string;
      descricao?: string;
      preco?: number;
      duracao?: number;
      ativo?: boolean;
    },
  ) {
    const servico = await this.prisma.servico.findFirst({
      where: {
        id,
        barbeariaId,
      },
    });

    if (!servico) {
      throw new NotFoundException(
        "Serviço não encontrado.",
      );
    }

    return this.prisma.servico.update({
      where: {
        id,
      },
      data,
    });
  }

  async remover(
    id: string,
    barbeariaId: string,
  ) {
    const servico = await this.prisma.servico.findFirst({
      where: {
        id,
        barbeariaId,
      },
    });

    if (!servico) {
      throw new NotFoundException(
        "Serviço não encontrado.",
      );
    }

    return this.prisma.servico.update({
      where: {
        id,
      },
      data: {
        ativo: false,
      },
    });
  }
}