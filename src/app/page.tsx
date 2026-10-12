import { BarraComanda } from "@/components/BarraComanda";
import { Cabecalho } from "@/components/Cabecalho";
import { Cardapio } from "@/components/Cardapio";
import { ComandaProvider } from "@/components/ComandaProvider";
import { Espaco } from "@/components/Espaco";
import { Faixa } from "@/components/Faixa";
import { FichaItem } from "@/components/FichaItem";
import { HoraCerta } from "@/components/HoraCerta";
import { Manifesto } from "@/components/Manifesto";
import { ModoRevisao } from "@/components/ModoRevisao";
import { PainelComanda } from "@/components/PainelComanda";
import { Revelar } from "@/components/Revelar";
import { ComoPedir, Duvidas, Fidelidade, Rodape, Visite } from "@/components/Secoes";
import { Topo } from "@/components/Topo";
import { Vitrine } from "@/components/Vitrine";

/**
 * Ordem das seções e alternância de fundos (cores do manual):
 * Espresso > faixa Cobre > Creme > Linho > Grão torrado > Espresso > Creme
 * > Espresso > Creme > Grão torrado > Espresso
 */
export default function Pagina() {
  return (
    <ComandaProvider>
      <a className="pular-link" href="#cardapio">
        Pular para o cardápio
      </a>
      <Cabecalho />
      <main>
        <Topo />
        <Faixa />
        <Manifesto />
        <Vitrine />
        <HoraCerta />
        <Cardapio />
        <Espaco />
        <ComoPedir />
        <Visite />
        <Duvidas />
        <Fidelidade />
      </main>
      <Rodape />
      <BarraComanda />
      <FichaItem />
      <PainelComanda />
      <ModoRevisao />
      <Revelar />
    </ComandaProvider>
  );
}
