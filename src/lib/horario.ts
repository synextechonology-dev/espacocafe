import { site, type DiaSemana, type Expediente } from "@/content/site";

export const NOMES_DIAS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
] as const;

const minutos = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const paraHHMM = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

/** Dia da semana e minuto do dia no fuso da cafeteria, independente do fuso do visitante. */
export function agoraNaCafeteria(data = new Date()) {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: site.fusoHorario,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(data);
  const get = (t: string) => partes.find((p) => p.type === t)?.value ?? "";
  const dias = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    dia: dias.indexOf(get("weekday")) as DiaSemana,
    minuto: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export const expedienteDo = (dia: DiaSemana): Expediente | undefined =>
  site.expediente.find((e) => e.dia === dia);

export interface Situacao {
  aberto: boolean;
  /** Texto curto para o selo de status. */
  resumo: string;
  /** Próxima abertura, quando fechado. */
  proxima?: { dia: DiaSemana; abre: string; hoje: boolean; amanha: boolean };
  fechaAs?: string;
}

export function situacao(data = new Date()): Situacao {
  const { dia, minuto } = agoraNaCafeteria(data);
  const hoje = expedienteDo(dia);
  if (hoje && minuto >= minutos(hoje.abre) && minuto < minutos(hoje.fecha)) {
    const faltam = minutos(hoje.fecha) - minuto;
    return {
      aberto: true,
      fechaAs: hoje.fecha,
      resumo: faltam <= 30 ? `Aberto, fecha em ${faltam} min` : `Aberto até ${hhmmCurto(hoje.fecha)}`,
    };
  }
  const proxima = proximaAbertura(dia, minuto);
  const quando = proxima.hoje ? "hoje" : proxima.amanha ? "amanhã" : NOMES_DIAS[proxima.dia].toLowerCase().replace("-feira", "");
  return {
    aberto: false,
    proxima,
    resumo: `Fechado agora. Abre ${quando} às ${hhmmCurto(proxima.abre)}`,
  };
}

function proximaAbertura(dia: DiaSemana, minuto: number) {
  for (let i = 0; i < 8; i++) {
    const d = ((dia + i) % 7) as DiaSemana;
    const e = expedienteDo(d);
    if (!e) continue;
    if (i === 0 && minuto >= minutos(e.abre)) continue;
    return { dia: d, abre: e.abre, hoje: i === 0, amanha: i === 1 };
  }
  return { dia, abre: "08:00", hoje: false, amanha: false };
}

export function hhmmCurto(hhmm: string) {
  const [h, m] = hhmm.split(":");
  return m === "00" ? `${Number(h)}h` : `${Number(h)}h${m}`;
}

/**
 * Horários disponíveis para agendar retirada/entrega, de 15 em 15 minutos,
 * no próximo período de funcionamento (hoje, se ainda dá tempo).
 */
export function horariosParaAgendar(data = new Date()) {
  const { antecedenciaMinutos, encerraAntesDoFechamentoMinutos } = site.pedidos;
  const { dia, minuto } = agoraNaCafeteria(data);

  for (let i = 0; i < 8; i++) {
    const d = ((dia + i) % 7) as DiaSemana;
    const e = expedienteDo(d);
    if (!e) continue;
    const inicio = i === 0 ? Math.max(minutos(e.abre), minuto + antecedenciaMinutos) : minutos(e.abre);
    const fim = minutos(e.fecha) - encerraAntesDoFechamentoMinutos;
    const primeiro = Math.ceil(inicio / 15) * 15;
    if (primeiro > fim) continue;
    const horarios: string[] = [];
    for (let m = primeiro; m <= fim; m += 15) horarios.push(paraHHMM(m));
    const rotulo = i === 0 ? "Hoje" : i === 1 ? "Amanhã" : NOMES_DIAS[d];
    return { dia: d, rotulo, horarios };
  }
  return { dia, rotulo: "Hoje", horarios: [] as string[] };
}

/** Linhas agrupadas para exibir o horário: "Segunda a sexta 7h30 às 18h30". */
export function horarioAgrupado() {
  const linhas: { dias: string; horas: string; diasIds: DiaSemana[] }[] = [];
  const ordem: DiaSemana[] = [1, 2, 3, 4, 5, 6, 0];
  for (const d of ordem) {
    const e = expedienteDo(d);
    const horas = e ? `${hhmmCurto(e.abre)} às ${hhmmCurto(e.fecha)}` : "Fechado";
    const ultima = linhas[linhas.length - 1];
    if (ultima && ultima.horas === horas) ultima.diasIds.push(d);
    else linhas.push({ dias: "", horas, diasIds: [d] });
  }
  const curto = (d: DiaSemana) => NOMES_DIAS[d].replace("-feira", "").toLowerCase();
  for (const l of linhas) {
    const a = l.diasIds[0];
    const b = l.diasIds[l.diasIds.length - 1];
    const txt = l.diasIds.length > 1 ? `${curto(a)} a ${curto(b)}` : curto(a);
    l.dias = txt.charAt(0).toUpperCase() + txt.slice(1);
  }
  return linhas;
}
