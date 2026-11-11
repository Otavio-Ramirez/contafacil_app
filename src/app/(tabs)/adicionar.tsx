import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao, Campo, Ionicons, Opcoes } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { brParaISO, mascaraData, paraNumero } from '@/lib/utils';
import { criarConta } from '@/services/contas';
import { cores } from '@/theme';

const CATEGORIAS = ['Contas de casa', 'Moradia', 'Cartão', 'Telefone e internet', 'Outros'];
const REPETIR = ['Não repetir', 'Todo mês', 'Todo ano'];
const LEMBRETES = ['No dia do vencimento', '1 dia antes do vencimento', '3 dias antes do vencimento', '7 dias antes do vencimento'];

export default function Adicionar() {
  const router = useRouter();
  const { user } = useAuth();
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [venc, setVenc] = useState('');
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const [repetir, setRepetir] = useState('Todo mês');
  const [lembrete, setLembrete] = useState(LEMBRETES[2]);
  const [salvando, setSalvando] = useState(false);

  const salvar = async () => {
    const iso = brParaISO(venc);
    const v = paraNumero(valor);
    if (!nome.trim()) return Alert.alert('Atenção', 'Informe o nome da conta.');
    if (v <= 0) return Alert.alert('Atenção', 'Informe um valor maior que zero.');
    if (!iso) return Alert.alert('Atenção', 'Data inválida. Use dd/mm/aaaa.');
    try {
      setSalvando(true);
      await criarConta(user!.uid, { nome: nome.trim(), valor: v, vencimento: iso, categoria, repetir, lembrete });
      setNome(''); setValor(''); setVenc('');
      router.navigate('/');
    } catch (e) {
      console.log(e);
      Alert.alert('Erro', 'Não foi possível salvar. Verifique sua conexão.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: cores.fundo }} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 18, gap: 18 }} keyboardShouldPersistTaps="handled">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <Pressable onPress={() => router.navigate('/')} hitSlop={10}>
              <Ionicons name="arrow-back" size={28} color={cores.texto} />
            </Pressable>
            <Text style={{ fontSize: 28, fontWeight: '800', color: cores.texto }}>Adicionar conta</Text>
          </View>

          <Campo rotulo="Nome da conta" placeholder="Ex.: Energia elétrica" value={nome} onChangeText={setNome} />
          <View style={{ flexDirection: 'row', gap: 14 }}>
            <View style={{ flex: 1 }}>
              <Campo rotulo="Valor" placeholder="R$ 0,00" value={valor} onChangeText={setValor} keyboardType="decimal-pad" />
            </View>
            <View style={{ flex: 1 }}>
              <Campo rotulo="Vencimento" placeholder="dd/mm/aaaa" value={venc} onChangeText={(t) => setVenc(mascaraData(t))} keyboardType="number-pad" />
            </View>
          </View>
          <Opcoes rotulo="Categoria" opcoes={CATEGORIAS} valor={categoria} aoMudar={setCategoria} />
          <Opcoes rotulo="Repetir" opcoes={REPETIR} valor={repetir} aoMudar={setRepetir} />
          <Opcoes rotulo="Quando quer ser lembrado" opcoes={LEMBRETES} valor={lembrete} aoMudar={setLembrete} />

          <View style={{ marginTop: 10 }}>
            <Botao titulo="Salvar conta" onPress={salvar} carregando={salvando} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}