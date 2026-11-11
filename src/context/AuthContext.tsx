import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User,
} from 'firebase/auth';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { auth } from '@/lib/firebase';

type AuthCtx = {
  user: User | null;
  carregando: boolean;
  cadastrar: (nome: string, email: string, senha: string) => Promise<void>;
  entrar: (email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({} as AuthCtx);
export const useAuth = () => useContext(Ctx);

export function traduzErro(e: any): string {
  switch (e?.code) {
    case 'auth/email-already-in-use': return 'Este e-mail já está cadastrado.';
    case 'auth/invalid-email': return 'E-mail inválido.';
    case 'auth/weak-password': return 'A senha precisa ter pelo menos 8 caracteres.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found': return 'E-mail ou senha incorretos.';
    case 'auth/network-request-failed': return 'Sem conexão com a internet.';
    default: return 'Algo deu errado. Tente novamente.';
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // O Firebase avisa sempre que o usuário entra ou sai
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setCarregando(false);
    });
  }, []);

  const cadastrar = async (nome: string, email: string, senha: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), senha);
    await updateProfile(cred.user, { displayName: nome.trim() });
    setUser({ ...cred.user, displayName: nome.trim() } as User);
  };
  const entrar = async (email: string, senha: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), senha);
  };
  const sair = async () => {
    await signOut(auth);
  };

  return <Ctx.Provider value={{ user, carregando, cadastrar, entrar, sair }}>{children}</Ctx.Provider>;
}