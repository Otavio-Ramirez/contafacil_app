import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao, Campo, Logo } from '@/components/ui';
import { traduzErro, useAuth } from '@/context/AuthContext';
import { cores } from '@/theme';

export default function Login() {
  const { entrar } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const fazerLogin = async () => {
    if (!email.trim() || !senha) return Alert.alert('Atenção', 'Informe e-mail e senha.');
    try {
      setCarregando(true);
      await entrar(email, senha);
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
            <Text style={{ fontSize: 34, fontWeight: '800', color: cores.texto }}>Entrar</Text>
            <Text style={{ fontSize: 17, color: cores.texto2 }}>Que bom te ver de novo.</Text>
          </View>
          <Campo rotulo="E-mail" placeholder="voce@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Campo rotulo="Senha" placeholder="Sua senha" value={senha} onChangeText={setSenha} secureTextEntry />
          <Botao titulo="Entrar" onPress={fazerLogin} carregando={carregando} />
          <Text style={{ textAlign: 'center', fontSize: 16, color: cores.texto2 }}>
            Não tem conta?{' '}
            <Link href="/cadastro" style={{ color: cores.primaria, fontWeight: '700' }}>Criar conta</Link>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}