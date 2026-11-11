import { useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao, IconeConta, Ionicons, Selo } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useContas } from '@/hooks/useContas';
import { brl, DIAS_SEMANA, diasEntre, hojeISO, isoCurto, MESES } from '@/lib/utils';
import { totalPago } from '@/services/contas';
import { cores } from '@/theme';

export default function Inicio() {
  const router = useRouter();
  const { user, sair } = useAuth();
  const { contas } = useContas();

  const hoje = hojeISO();
  const agora = new Date();
  const nomeMes = MESES[agora.getMonth()];
  const gastoMes = totalPago(contas, hoje.slice(0, 7));
  const gastoAno = totalPago(contas, hoje.slice(0, 4));

  const pendentes = contas.filter((c) => !c.paga).sort((a, b) => a.vencimento.localeCompare(b.vencimento));
  const aVencer7 = pendentes.filter((c) => diasEntre(hoje, c.vencimento) <= 7).reduce((s, c) => s + c.valor, 0);

  const primeiroNome = (user?.displayName ?? '').split(' ')[0] || 'você';

  const perfil = () =>
    Alert.alert(user?.displayName ?? 'Perfil', user?.email ?? '', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: sair },
    ]);

  const selo = (venc: string) => {
    const d = diasEntre(hoje, venc);
    if (d < 0) return <Selo texto={`Atrasada há ${-d} dia${d === -1 ? '' : 's'}`} tom="perigo" icone="alert-circle-outline" />;
    if (d === 0) return <Selo texto="Vence hoje" tom="perigo" icone="alert-circle-outline" />;
    return <Selo texto={`Vence em ${d} dia${d === 1 ? '' : 's'}`} tom="alerta" icone="time-outline" />;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: cores.fundo }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 18, gap: 18 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 15, color: cores.texto2 }}>
              {DIAS_SEMANA[agora.getDay()]}, {agora.getDate()} de {nomeMes}
            </Text>
            <Text style={{ fontSize: 30, fontWeight: '800', color: cores.texto }}>Olá, {primeiroNome}</Text>
          </View>
          <Pressable onPress={perfil} style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: cores.primariaClara, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="person-outline" size={24} color={cores.primaria} />
          </Pressable>
        </View>

        <View style={{ backgroundColor: cores.primaria, borderRadius: 24, padding: 22, gap: 14 }}>
          <View>
            <Text style={{ color: '#DBE6FF', fontSize: 16 }}>Gasto em {nomeMes}</Text>
            <Text style={{ color: '#fff', fontSize: 44, fontWeight: '800' }}>{brl(gastoMes)}</Text>
          </View>
          <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.3)' }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ color: '#DBE6FF', fontSize: 14 }}>Gasto em {agora.getFullYear()}</Text>
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>{brl(gastoAno)}</Text>
            </View>
            <View>
              <Text style={{ color: '#DBE6FF', fontSize: 14 }}>A vencer em 7 dias</Text>
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>{brl(aVencer7)}</Text>
            </View>
          </View>
        </View>

        <Text style={{ fontSize: 22, fontWeight: '800', color: cores.texto }}>Próximos vencimentos</Text>

        {pendentes.length === 0 && (
          <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center', gap: 12 }}>
            <Text style={{ fontSize: 16, color: cores.texto2, textAlign: 'center' }}>
              Nenhuma conta pendente. Toque em "Adicionar" para cadastrar a primeira.
            </Text>
            <Botao titulo="Adicionar conta" onPress={() => router.navigate('/adicionar')} pequeno icone="add" />
          </View>
        )}

        {pendentes.map((c) => (
          <View key={c.id} style={{ backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: cores.borda, padding: 16, gap: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <IconeConta nome={c.nome} destaque />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 19, fontWeight: '700', color: cores.texto }}>{c.nome}</Text>
                <Text style={{ fontSize: 15, color: cores.texto2 }}>Vence em {isoCurto(c.vencimento)}</Text>
              </View>
              <Text style={{ fontSize: 18, fontWeight: '800', color: cores.texto }}>{brl(c.valor)}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              {selo(c.vencimento)}
              <View style={{ width: 170 }}>
                <Botao
                  titulo="Marcar como paga"
                  tipo="contorno"
                  pequeno
                  onPress={() => router.push({ pathname: '/confirmar-pagamento', params: { id: c.id } })}
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}