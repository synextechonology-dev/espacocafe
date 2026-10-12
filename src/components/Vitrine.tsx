"use client";

import { itensPorId, vitrine } from "@/content/menu";
import { textos } from "@/content/textos";
import { preco } from "@/lib/format";
import { marcasDoItem } from "@/lib/pedido";
import { useComanda } from "./ComandaProvider";
import { Foto } from "./Foto";
import { Ilustracao } from "./Ilustracoes";
import { Filete } from "./Ornamentos";

export function Vitrine() {
  const { abrirItem } = useComanda();
  const itens = vitrine
    .map((v) => ({ ...v, achado: itensPorId.get(v.id) }))
    .filter((v) => v.achado);

  return (
    <section className="secao fundo-linho vitrine" aria-labelledby="vitrine-titulo">
      <div className="secao__cabeca">
        <p className="chamada">{textos.vitrine.chamada}</p>
        <h2 id="vitrine-titulo" className="titulo-secao">
          {textos.vitrine.titulo}
        </h2>
        <Filete />
        <p className="secao__linha-fina">{textos.vitrine.linhaFina}</p>
      </div>

      <ul className="vitrine__lista">
        {itens.map(({ id, foto, arquivoSugerido, ilustracao, chamada, achado }, i) => {
          const { item, categoria } = achado!;
          const soNoSalao = marcasDoItem(item, categoria).includes("so-no-salao");
          return (
            <li key={id} className="vitrine__item" data-revelar style={{ "--atraso": `${(i % 3) * 90}ms` } as React.CSSProperties}>
              <button type="button" className="vitrine__botao" onClick={() => abrirItem(id)}>
                <span className="vitrine__numero" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="vitrine__moldura">
                  {foto ? (
                    <Foto src={foto} alt={item.nome} largura={800} altura={1000} sizes="(max-width: 900px) 72vw, 30vw" />
                  ) : (
                    <span className="vitrine__arte" data-pendente={`Foto: ${arquivoSugerido}`}>
                      <Ilustracao tipo={ilustracao} />
                    </span>
                  )}
                  {soNoSalao && <span className="vitrine__selo">Só no salão</span>}
                </span>
                <span className="oval vitrine__preco">
                  <span className="visualmente-oculto">{item.variacoes ? "a partir de R$ " : "R$ "}</span>
                  {preco(item.preco)}
                </span>
                <span className="vitrine__categoria">{categoria.titulo}</span>
                <span className="vitrine__nome">{item.nome}</span>
                <span className="vitrine__descricao">{chamada}</span>
                <span className="vitrine__ver" aria-hidden="true">
                  Ver detalhes
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
