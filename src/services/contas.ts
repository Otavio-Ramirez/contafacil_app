import {
    addDoc,
    collection,
    doc,
    onSnapshot,
    serverTimestamp,
    writeBatch,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';
import { addMeses } from '@/lib/utils';

export type Conta = {
  id: string;
  nome: string;
  valor: number;
  vencimento: string; // "2026-11-03"
  categoria: string;
  repetir: string;
  lembrete: string;
  paga: boolean;
  dataPagamento?: string;
  valorPago?: number;
};

export type NovaConta = Omit<Conta, 'id' | 'paga' | 'dataPagamento' | 'valorPago'>;

// Caminho no banco: users / {uid do usuário} / contas / {id da conta}
const colecao = (uid: string) => collection(db, 'users', uid, 'contas');

// LER (em tempo real): sempre que algo mudar no banco, a função "aoMudar" é chamada
export function ouvirContas(uid: string, aoMudar: (c: Conta[]) => void, aoErrar: (e: Error) => void) {
  return onSnapshot(
    colecao(uid),
    (snap) => aoMudar(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Conta)),
    aoErrar,
  );
}

// CRIAR
export async function criarConta(uid: string, dados: NovaConta) {
  await addDoc(colecao(uid), { ...dados, paga: false, criadaEm: serverTimestamp() });
}

// ATUALIZAR (marcar como paga) e, se repete, já cria a próxima conta
export async function pagarConta(uid: string, conta: Conta, dataPagamento: string, valorPago: number) {
  const batch = writeBatch(db); // "batch" = tudo ou nada
  batch.update(doc(db, 'users', uid, 'contas', conta.id), { paga: true, dataPagamento, valorPago });

  const meses = conta.repetir === 'Todo mês' ? 1 : conta.repetir === 'Todo ano' ? 12 : 0;
  if (meses > 0) {
    batch.set(doc(colecao(uid)), {
      nome: conta.nome,
      valor: conta.valor,
      vencimento: addMeses(conta.vencimento, meses),
      categoria: conta.categoria,
      repetir: conta.repetir,
      lembrete: conta.lembrete,
      paga: false,
      criadaEm: serverTimestamp(),
    });
  }
  await batch.commit();
}

// prefixo: "2026-11" (mês) ou "2026" (ano)
export function totalPago(contas: Conta[], prefixo: string) {
  return contas
    .filter((c) => c.paga && c.dataPagamento?.startsWith(prefixo))
    .reduce((soma, c) => soma + (c.valorPago ?? c.valor), 0);
}