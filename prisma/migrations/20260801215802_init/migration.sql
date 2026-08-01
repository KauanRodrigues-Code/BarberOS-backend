-- CreateEnum
CREATE TYPE "StatusBarbearia" AS ENUM ('ATIVA', 'SUSPENSA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "StatusUsuario" AS ENUM ('ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "PerfilUsuario" AS ENUM ('DONO', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatusBarbeiro" AS ENUM ('ATIVO', 'FOLGA', 'INATIVO');

-- CreateEnum
CREATE TYPE "StatusAgendamento" AS ENUM ('PENDENTE', 'CONFIRMADO', 'CONCLUIDO', 'CANCELADO', 'NAO_COMPARECEU');

-- CreateEnum
CREATE TYPE "StatusPagamento" AS ENUM ('PENDENTE', 'PAGO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoMovimentacao" AS ENUM ('ENTRADA', 'SAIDA');

-- CreateTable
CREATE TABLE "barbearias" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "status" "StatusBarbearia" NOT NULL DEFAULT 'ATIVA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "barbearias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "barbeariaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "perfil" "PerfilUsuario" NOT NULL DEFAULT 'DONO',
    "status" "StatusUsuario" NOT NULL DEFAULT 'ATIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "barbeariaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "barbeiros" (
    "id" TEXT NOT NULL,
    "barbeariaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT,
    "status" "StatusBarbeiro" NOT NULL DEFAULT 'ATIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "barbeiros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicos" (
    "id" TEXT NOT NULL,
    "barbeariaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "preco" DECIMAL(10,2) NOT NULL,
    "duracao" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "servicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agendamentos" (
    "id" TEXT NOT NULL,
    "barbeariaId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "barbeiroId" TEXT,
    "servicoId" TEXT NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "status" "StatusAgendamento" NOT NULL DEFAULT 'PENDENTE',
    "pagamento" "StatusPagamento" NOT NULL DEFAULT 'PENDENTE',
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agendamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimentacoes" (
    "id" TEXT NOT NULL,
    "barbeariaId" TEXT NOT NULL,
    "agendamentoId" TEXT,
    "tipo" "TipoMovimentacao" NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movimentacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "barbearias_email_key" ON "barbearias"("email");

-- CreateIndex
CREATE INDEX "usuarios_barbeariaId_idx" ON "usuarios"("barbeariaId");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_barbeariaId_email_key" ON "usuarios"("barbeariaId", "email");

-- CreateIndex
CREATE INDEX "clientes_barbeariaId_idx" ON "clientes"("barbeariaId");

-- CreateIndex
CREATE INDEX "clientes_barbeariaId_nome_idx" ON "clientes"("barbeariaId", "nome");

-- CreateIndex
CREATE INDEX "barbeiros_barbeariaId_idx" ON "barbeiros"("barbeariaId");

-- CreateIndex
CREATE INDEX "servicos_barbeariaId_idx" ON "servicos"("barbeariaId");

-- CreateIndex
CREATE INDEX "agendamentos_barbeariaId_idx" ON "agendamentos"("barbeariaId");

-- CreateIndex
CREATE INDEX "agendamentos_barbeariaId_dataHora_idx" ON "agendamentos"("barbeariaId", "dataHora");

-- CreateIndex
CREATE INDEX "agendamentos_clienteId_idx" ON "agendamentos"("clienteId");

-- CreateIndex
CREATE INDEX "agendamentos_barbeiroId_idx" ON "agendamentos"("barbeiroId");

-- CreateIndex
CREATE UNIQUE INDEX "movimentacoes_agendamentoId_key" ON "movimentacoes"("agendamentoId");

-- CreateIndex
CREATE INDEX "movimentacoes_barbeariaId_idx" ON "movimentacoes"("barbeariaId");

-- CreateIndex
CREATE INDEX "movimentacoes_barbeariaId_data_idx" ON "movimentacoes"("barbeariaId", "data");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_barbeariaId_fkey" FOREIGN KEY ("barbeariaId") REFERENCES "barbearias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_barbeariaId_fkey" FOREIGN KEY ("barbeariaId") REFERENCES "barbearias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barbeiros" ADD CONSTRAINT "barbeiros_barbeariaId_fkey" FOREIGN KEY ("barbeariaId") REFERENCES "barbearias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicos" ADD CONSTRAINT "servicos_barbeariaId_fkey" FOREIGN KEY ("barbeariaId") REFERENCES "barbearias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_barbeariaId_fkey" FOREIGN KEY ("barbeariaId") REFERENCES "barbearias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_barbeiroId_fkey" FOREIGN KEY ("barbeiroId") REFERENCES "barbeiros"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "servicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes" ADD CONSTRAINT "movimentacoes_barbeariaId_fkey" FOREIGN KEY ("barbeariaId") REFERENCES "barbearias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes" ADD CONSTRAINT "movimentacoes_agendamentoId_fkey" FOREIGN KEY ("agendamentoId") REFERENCES "agendamentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
