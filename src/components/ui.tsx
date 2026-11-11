import { ActivityIndicator, Pressable, Text, TextInput, TextInputProps, View } from 'react-native';

import { cores } from '@/theme';
import { Image } from 'expo-image';

// Cada nome do app aponta para o nome do ícone no Google (Material Symbols)
const nomes = {
  'checkmark': 'check',
  'add': 'add',
  'arrow-back': 'arrow_back',
  'person-outline': 'person',
  'home-outline': 'home',
  'add-circle-outline': 'add_circle',
  'time-outline': 'schedule',
  'stats-chart-outline': 'bar_chart',
  'flash-outline': 'bolt',
  'wifi-outline': 'wifi',
  'water-outline': 'water_drop',
  'flame-outline': 'local_fire_department',
  'phone-portrait-outline': 'smartphone',
  'card-outline': 'credit_card',
  'receipt-outline': 'receipt_long',
  'information-circle-outline': 'info',
  'alert-circle-outline': 'error',
  'flag-outline': 'flag',
} as const;

type Icone = keyof typeof nomes;

function Icone2({ name, size = 24, color = '#000' }: { name: Icone; size?: number; color?: string }) {
  return (
    <Image
      source={{ uri: `https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/${nomes[name]}/default/24px.svg` }}
      style={{ width: size, height: size }}
      tintColor={color}
      contentFit="contain"
    />
  );
}

export const Ionicons = Object.assign(Icone2, { glyphMap: nomes });

export function Logo() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: cores.primaria, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="checkmark" size={32} color="#fff" />
      </View>
      <Text style={{ fontSize: 26, fontWeight: '800', color: cores.texto }}>Conta Fácil</Text>
    </View>
  );
}

export function Botao({
  titulo, onPress, tipo = 'primario', carregando, icone, pequeno,
}: {
  titulo: string; onPress: () => void; tipo?: 'primario' | 'contorno' | 'sucesso';
  carregando?: boolean; icone?: Icone; pequeno?: boolean;
}) {
  const fundo = tipo === 'primario' ? cores.primaria : tipo === 'sucesso' ? cores.sucesso : 'transparent';
  const texto = tipo === 'contorno' ? cores.primaria : '#fff';
  return (
    <Pressable
      onPress={onPress}
      disabled={carregando}
      style={({ pressed }) => [
        {
          backgroundColor: fundo, borderRadius: pequeno ? 12 : 16, height: pequeno ? 46 : 56,
          alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8,
          opacity: pressed ? 0.85 : 1, paddingHorizontal: 12,
        },
        tipo === 'contorno' && { borderWidth: 1.5, borderColor: cores.primaria },
      ]}>
      {carregando ? (
        <ActivityIndicator color={texto} />
      ) : (
        <>
          {icone && <Ionicons name={icone} size={20} color={texto} />}
          <Text style={{ color: texto, fontSize: pequeno ? 14 : 17, fontWeight: '700' }}>{titulo}</Text>
        </>
      )}
    </Pressable>
  );
}

export function Campo({ rotulo, ...props }: { rotulo: string } & TextInputProps) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontSize: 15, fontWeight: '600', color: '#334155' }}>{rotulo}</Text>
      <TextInput
        placeholderTextColor="#8A93A3"
        {...props}
        style={{
          height: 54, borderRadius: 14, borderWidth: 1.5, borderColor: cores.bordaInput,
          backgroundColor: '#fff', paddingHorizontal: 16, fontSize: 17, color: cores.texto,
        }}
      />
    </View>
  );
}

// No celular não existe "select" como na web. Usamos botões de escolha.
export function Opcoes({
  rotulo, opcoes, valor, aoMudar,
}: { rotulo: string; opcoes: string[]; valor: string; aoMudar: (v: string) => void }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontSize: 15, fontWeight: '600', color: '#334155' }}>{rotulo}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {opcoes.map((o) => {
          const ativo = o === valor;
          return (
            <Pressable
              key={o}
              onPress={() => aoMudar(o)}
              style={{
                paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5,
                borderColor: ativo ? cores.primaria : cores.bordaInput,
                backgroundColor: ativo ? cores.primariaClara : '#fff',
              }}>
              <Text style={{ color: ativo ? cores.primaria : cores.texto, fontWeight: ativo ? '700' : '500', fontSize: 15 }}>{o}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function Caixa({ marcado, aoMudar, texto }: { marcado: boolean; aoMudar: (v: boolean) => void; texto: string }) {
  return (
    <Pressable onPress={() => aoMudar(!marcado)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View
        style={{
          width: 26, height: 26, borderRadius: 6, borderWidth: 1.5, borderColor: marcado ? cores.primaria : cores.bordaInput,
          backgroundColor: marcado ? cores.primaria : '#fff', alignItems: 'center', justifyContent: 'center',
        }}>
        {marcado && <Ionicons name="checkmark" size={18} color="#fff" />}
      </View>
      <Text style={{ flex: 1, fontSize: 15, color: '#334155' }}>{texto}</Text>
    </Pressable>
  );
}

export function Selo({ texto, tom, icone }: { texto: string; tom: 'perigo' | 'alerta' | 'sucesso'; icone: Icone }) {
  const bg = tom === 'perigo' ? cores.perigoBg : tom === 'alerta' ? cores.alertaBg : cores.sucessoBg;
  const fg = tom === 'perigo' ? cores.perigo : tom === 'alerta' ? cores.alerta : cores.sucesso;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: bg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, alignSelf: 'flex-start' }}>
      <Ionicons name={icone} size={15} color={fg} />
      <Text style={{ color: fg, fontWeight: '700', fontSize: 13 }}>{texto}</Text>
    </View>
  );
}

export function iconeDaConta(nome: string): Icone {
  const n = nome.toLowerCase();
  if (n.includes('energia') || n.includes('luz')) return 'flash-outline';
  if (n.includes('internet') || n.includes('wifi')) return 'wifi-outline';
  if (n.includes('água') || n.includes('agua')) return 'water-outline';
  if (n.includes('gás') || n.includes('gas')) return 'flame-outline';
  if (n.includes('condom') || n.includes('alug')) return 'home-outline';
  if (n.includes('celular') || n.includes('telefone')) return 'phone-portrait-outline';
  if (n.includes('cartão') || n.includes('cartao')) return 'card-outline';
  return 'receipt-outline';
}

export function IconeConta({ nome, tamanho = 52, destaque }: { nome: string; tamanho?: number; destaque?: boolean }) {
  return (
    <View style={{ width: tamanho, height: tamanho, borderRadius: 14, backgroundColor: destaque ? cores.primariaClara : '#F1F3F7', alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={iconeDaConta(nome)} size={tamanho * 0.5} color={destaque ? cores.primaria : '#334155'} />
    </View>
  );
}