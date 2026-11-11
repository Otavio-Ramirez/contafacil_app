import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao, Caixa, Campo, Logo } from '@/components/ui';
import { traduzErro, useAuth } from '@/context/AuthContext';
import { cores } from '@/theme';

export default function Cadastro() {
  const { cadastrar } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [aceito, setAceito] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const criar = async () => {
    if (!nome.trim() || !email.trim()) return Alert.alert('Atenção', 'Preencha nome e e-mail.');
    if (senha.length < 8) return Alert.alert('Atenção', 'A senha precisa ter no mínimo 8 caracteres.');
    if (!aceito) return Alert.alert('Atenção', 'Aceite os termos de uso para continuar.');
    try {
      setCarregando(true);
      await cadastrar(nome, email, senha); // depois disso o app te leva sozinho para o Início
    } catch (e) {
      Alert.alert('Erro', traduzErro(e));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: cores.fundo }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 22, gap: 20, flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
          <Logo />
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 34, fontWeight: '800', color: cores.texto }}>Crie sua conta</Text>
            <Text style={{ fontSize: 17, color: cores.texto2, lineHeight: 25 }}>
              Organize suas contas e receba um aviso antes de cada vencimento.
            </Text>
          </View>
          <Campo rotulo="Nome completo" placeholder="Seu nome" value={nome} onChangeText={setNome} />
          <Campo rotulo="E-mail" placeholder="voce@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Campo rotulo="Senha" placeholder="Mínimo de 8 caracteres" value={senha} onChangeText={setSenha} secureTextEntry />
          <Caixa marcado={aceito} aoMudar={setAceito} texto="Li e aceito os termos de uso e a política de privacidade" />
          <Botao titulo="Criar conta" onPress={criar} carregando={carregando} />
          <Text style={{ textAlign: 'center', fontSize: 16, color: cores.texto2 }}>
            Já tem conta?{' '}
            <Link href="/login" style={{ color: cores.primaria, fontWeight: '700' }}>Entrar</Link>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}