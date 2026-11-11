import { useEffect, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { Conta, ouvirContas } from '@/services/contas';

export function useContas() {
  const { user } = useAuth();
  const [contas, setContas] = useState<Conta[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!user) {
      setContas([]);
      return;
    }
    const parar = ouvirContas(
      user.uid,
      (lista) => {
        setContas(lista);
        setCarregando(false);
      },
      (erro) => {
        console.log('Erro Firestore:', erro);
        setCarregando(false);
      },
    );
    return parar; // para de ouvir quando a tela fecha
  }, [user]);

  return { contas, carregando };
}