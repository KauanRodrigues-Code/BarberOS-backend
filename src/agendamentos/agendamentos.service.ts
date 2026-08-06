import {
  ConflictException,
  Injectable,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";


@Injectable()
export class AgendamentosService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}


  async criar(
    barbeariaId: string,
    data: {
      clienteId: string;
      barbeiroId?: string;
      servicoId: string;
      dataHora: string;
      observacoes?: string;
    },
  ) {

    const servico =
      await this.prisma.servico.findFirst({

        where: {
          id: data.servicoId,
          barbeariaId,
        },

      });


    if (!servico) {
      throw new ConflictException(
        "Serviço não encontrado.",
      );
    }


    if (data.barbeiroId) {

      const conflito =
        await this.prisma.agendamento.findFirst({

          where: {

            barbeiroId: data.barbeiroId,

            dataHora:
              new Date(data.dataHora),

            status: {
              in: [
                "PENDENTE",
                "CONFIRMADO",
              ],
            },

          },

        });


      if (conflito) {

        throw new ConflictException(
          "Este horário já está ocupado.",
        );

      }

    }


    return this.prisma.agendamento.create({

      data: {

        barbeariaId,

        clienteId:
          data.clienteId,

        barbeiroId:
          data.barbeiroId,

        servicoId:
          data.servicoId,

        dataHora:
          new Date(data.dataHora),

        valor:
          servico.preco,

        observacoes:
          data.observacoes,

      },


      include: {

        cliente: true,

        barbeiro: true,

        servico: true,

      },

    });

  }



  async listar(
    barbeariaId: string,
  ) {

    return this.prisma.agendamento.findMany({

      where: {
        barbeariaId,
      },

      include: {

        cliente: true,

        barbeiro: true,

        servico: true,

      },

      orderBy: {

        dataHora: "asc",

      },

    });

  }




  async buscarPorId(
    id: string,
    barbeariaId: string,
  ) {


    const agendamento =
      await this.prisma.agendamento.findFirst({

        where: {

          id,

          barbeariaId,

        },

        include: {

          cliente: true,

          barbeiro: true,

          servico: true,

        },

      });


    if (!agendamento) {

      throw new ConflictException(
        "Agendamento não encontrado.",
      );

    }


    return agendamento;

  }





  async atualizar(
    id: string,
    barbeariaId: string,
    dados: any,
  ) {


    await this.buscarPorId(
      id,
      barbeariaId,
    );


    return this.prisma.agendamento.update({

      where: {
        id,
      },

      data: dados,

      include: {

        cliente: true,

        barbeiro: true,

        servico: true,

      },

    });

  }





  async remover(
    id: string,
    barbeariaId: string,
  ) {


    await this.buscarPorId(
      id,
      barbeariaId,
    );


    return this.prisma.agendamento.delete({

      where: {
        id,
      },

    });

  }





  async buscarHorariosDisponiveis(
    barbeiroId: string,
    data: string,
  ) {


    const barbeiro =
      await this.prisma.barbeiro.findUnique({

        where: {
          id: barbeiroId,
        },

      });



    if (!barbeiro) {

      throw new ConflictException(
        "Barbeiro não encontrado.",
      );

    }



    const inicio =
      new Date(
        `${data}T${barbeiro.inicioExpediente}:00-03:00`,
      );


    const fim =
      new Date(
        `${data}T${barbeiro.fimExpediente}:00-03:00`,
      );



    const agendamentos =
      await this.prisma.agendamento.findMany({

        where: {

          barbeiroId,

          dataHora: {

            gte: inicio,

            lt: fim,

          },


          status: {

            in: [
              "PENDENTE",
              "CONFIRMADO",
            ],

          },

        },


        select: {

          dataHora: true,

        },

      });



    const ocupados =
      agendamentos.map(
        (a) =>
          a.dataHora.toLocaleTimeString(
            "pt-BR",
            {
              hour: "2-digit",
              minute: "2-digit",
            },
          ),
      );



    const livres: string[] = [];


    let atual = new Date(inicio);



    while (atual <= fim) {


      const horario =
        atual.toLocaleTimeString(
          "pt-BR",
          {
            hour: "2-digit",
            minute: "2-digit",
          },
        );


      if (!ocupados.includes(horario)) {

        livres.push(horario);

      }


      atual.setMinutes(
        atual.getMinutes()
        +
        barbeiro.intervaloMinutos,
      );

    }


    return livres;

  }





  async criarPublico(
    data: {

      slug: string;

      clienteNome: string;

      clienteTelefone: string;

      servicoId: string;

      barbeiroId?: string;

      dataHora: string;

      observacoes?: string;

    },
  ) {


    const barbearia =
      await this.prisma.barbearia.findUnique({

        where: {
          slug: data.slug,
        },

      });



    if (!barbearia) {

      throw new ConflictException(
        "Barbearia não encontrada.",
      );

    }



    const servico =
      await this.prisma.servico.findFirst({

        where: {

          id: data.servicoId,

          barbeariaId:
            barbearia.id,

          ativo: true,

        },

      });



    if (!servico) {

      throw new ConflictException(
        "Serviço não encontrado.",
      );

    }



    let cliente =
      await this.prisma.cliente.findFirst({

        where: {

          barbeariaId:
            barbearia.id,

          telefone:
            data.clienteTelefone,

        },

      });



    if (!cliente) {

      cliente =
        await this.prisma.cliente.create({

          data: {

            barbeariaId:
              barbearia.id,

            nome:
              data.clienteNome,

            telefone:
              data.clienteTelefone,

          },

        });

    }



    return this.prisma.agendamento.create({

      data: {

        barbeariaId:
          barbearia.id,

        clienteId:
          cliente.id,

        barbeiroId:
          data.barbeiroId,

        servicoId:
          data.servicoId,

        dataHora:
          new Date(data.dataHora),

        valor:
          servico.preco,

        observacoes:
          data.observacoes,

      },

    });

  }


}