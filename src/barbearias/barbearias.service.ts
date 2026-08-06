import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class BarbeariasService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async buscarPublica(slug: string) {
    const barbearia =
      await this.prisma.barbearia.findUnique({
        where: {
          slug,
        },
        include: {
          servicos: {
            where: {
              ativo: true,
            },
            orderBy: {
              nome: "asc",
            },
          },

          barbeiros: {
            where: {
              status: "ATIVO",
            },
            orderBy: {
              nome: "asc",
            },
          },
        },
      });

    if (!barbearia) {
      throw new NotFoundException(
        "Barbearia não encontrada.",
      );
    }

    return {
      barbearia: {
        id: barbearia.id,
        nome: barbearia.nome,
        slug: barbearia.slug,
        telefone: barbearia.telefone,
      },

      servicos: barbearia.servicos.map(
        (servico) => ({
          id: servico.id,
          nome: servico.nome,
          descricao: servico.descricao,
          preco: servico.preco,
          duracao: servico.duracao,
        }),
      ),

      barbeiros: barbearia.barbeiros.map(
        (barbeiro) => ({
          id: barbeiro.id,
          nome: barbeiro.nome,
        }),
      ),
    };
  }
}