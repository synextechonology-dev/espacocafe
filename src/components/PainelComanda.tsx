"use client";

import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { site } from "@/content/site";
import { reais } from "@/lib/format";
import { horariosParaAgendar, situacao } from "@/lib/horario";
import { linkWhatsApp, montarMensagem, type DadosPedido, type Recebimento } from "@/lib/pedido";
import { useComanda } from "./ComandaProvider";
import { Filete, Monograma } from "./Ornamentos";

type Etapa = "itens" | "dados" | "enviado";

export function PainelComanda() {
  const { aberta, fechar } = useComanda();
  const ref = useRef<HTMLDialogElement>(null);
  const [etapa, setEtapa] = useState<Etapa>("itens");

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (aberta && !d.open) d.showModal();
    if (!aberta && d.open) d.close();
    document.body.classList.toggle("sem-rolagem", aberta);
    if (!aberta) setEtapa((e) => (e === "enviado" ? "itens" : e));
  }, [aberta]);

  return (
    <dialog
      ref={ref}
      className="painel"
      aria-labelledby="comanda-titulo"
      onClose={fechar}
      onClick={(e) => {
        if (e.target === e.currentTarget) fechar();
      }}
    >
      {aberta && <Conteudo etapa={etapa} irPara={setEtapa} />}
    </dialog>
  );
}

function Conteudo({ etapa, irPara }: { etapa: Etapa; irPara: (e: Etapa) => void }) {
  const { comanda, linhas, total, fechar } = useComanda();

  return (
    <div className="comanda">
      <div className="comanda__serrilha" aria-hidden="true" />
      <header className="comanda__cabeca">
        <Monograma className="comanda__monograma" />
        <div>
          <h2 id="comanda-titulo" className="comanda__titulo">
            Comanda
          </h2>
          {linhas.length > 0 && <p className="comanda__numero">nº {comanda.numero}</p>}
        </div>
        <button type="button" className="comanda__fechar" onClick={fechar}>
          <span className="visualmente-oculto">Fechar comanda</span>
          <span aria-hidden="true">×</span>
        </button>
      </header>

      {linhas.length === 0 && etapa !== "enviado" ? (
        <Vazia />
      ) : etapa === "itens" ? (
        <Itens onContinuar={() => irPara("dados")} total={total} />
      ) : etapa === "dados" ? (
        <Dados onVoltar={() => irPara("itens")} onEnviado={() => irPara("enviado")} />
      ) : (
        <Enviado onVoltar={() => irPara("itens")} />
      )}
    </div>
  );
}

function Vazia() {
  const { fechar } = useComanda();
  return (
    <div className="comanda__vazia">
      <p className="comanda__vazia-titulo">Sua comanda está vazia</p>
      <p>Escolha algo no cardápio e toque no item para anotar aqui.</p>
      <a href="#cardapio" className="botao botao--cobre" onClick={fechar}>
        Ver o cardápio
      </a>
    </div>
  );
}

function Itens({ onContinuar, total }: { onContinuar: () => void; total: number }) {
  const { linhas, alterarQtd, remover, expiraEm } = useComanda();
  const ate = expiraEm
    ? new Date(expiraEm).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <>
      <ul className="comanda__linhas">
        {linhas.map((l) => (
          <li key={l.linha.uid} className="comanda__linha">
            <div className="comanda__linha-topo">
              <span className="comanda__linha-nome">{l.nome}</span>
              <span className="comanda__pontos" aria-hidden="true" />
              <span className="comanda__linha-valor">{reais(l.total)}</span>
            </div>
            {(l.detalhes.length > 0 || l.adicionais.length > 0 || l.linha.observacao) && (
              <ul className="comanda__detalhes">
                {l.detalhes.map((d) => (
                  <li key={d}>{d}</li>
                ))}
                {l.adicionais.map((a) => (
                  <li key={a.id}>
                    + {a.nome} ({reais(a.preco ?? 0)})
                  </li>
                ))}
                {l.linha.observacao && <li>Obs.: {l.linha.observacao}</li>}
              </ul>
            )}
            <div className="comanda__linha-acoes">
              <div className="contador contador--pequeno" role="group" aria-label={`Quantidade de ${l.nome}`}>
                <button type="button" onClick={() => alterarQtd(l.linha.uid, l.linha.qtd - 1)}>
                  <span className="visualmente-oculto">Diminuir</span>
                  <span aria-hidden="true">−</span>
                </button>
                <output>{l.linha.qtd}</output>
                <button type="button" onClick={() => alterarQtd(l.linha.uid, l.linha.qtd + 1)}>
                  <span className="visualmente-oculto">Aumentar</span>
                  <span aria-hidden="true">+</span>
                </button>
              </div>
              <button type="button" className="comanda__remover" onClick={() => remover(l.linha.uid)}>
                Tirar da comanda
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="comanda__rodape">
        <div className="comanda__total">
          <span>Subtotal</span>
          <span className="comanda__pontos" aria-hidden="true" />
          <strong>{reais(total)}</strong>
        </div>
        {ate && (
          <p className="comanda__validade">
            Sua comanda fica guardada neste aparelho até {ate}. Depois disso ela é esvaziada.
          </p>
        )}
        <button type="button" className="botao botao--cobre botao--largo" onClick={onContinuar}>
          Continuar para o pedido
        </button>
      </div>
    </>
  );
}

function Dados({ onVoltar, onEnviado }: { onVoltar: () => void; onEnviado: () => void }) {
  const { comanda, linhas, total } = useComanda();
  const uid = useId();
  const agenda = useMemo(() => horariosParaAgendar(), []);
  const status = useMemo(() => situacao(), []);
  const entregaAtiva = site.pedidos.entrega.ativa;

  const [recebimento, setRecebimento] = useState<Recebimento>("retirada");
  const [nome, setNome] = useState("");
  const [rua, setRua] = useState("");
  const [bairro, setBairro] = useState("");
  const [complemento, setComplemento] = useState("");
  const [referencia, setReferencia] = useState("");
  const [quando, setQuando] = useState<"agora" | "agendado">(status.aberto ? "agora" : "agendado");
  const [horario, setHorario] = useState(agenda.horarios[0] ?? "");
  const [pagamento, setPagamento] = useState(site.pedidos.pagamentos[0]);
  const [troco, setTroco] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [maior18, setMaior18] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});

  const temMais18 = linhas.some((l) => l.marcas.includes("mais-18"));
  const temQuente = linhas.some((l) => l.marcas.includes("quente"));
  const taxa = site.pedidos.entrega.taxa;

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    const novo: Record<string, string> = {};
    if (!nome.trim()) novo.nome = "Diga seu nome para a gente identificar o pedido.";
    if (recebimento === "entrega" && !rua.trim()) novo.rua = "Informe a rua e o número para a entrega.";
    if (recebimento === "entrega" && !bairro.trim()) novo.bairro = "Informe o bairro.";
    if (quando === "agendado" && !horario) novo.horario = "Escolha um horário.";
    if (temMais18 && !maior18) novo.maior18 = "Confirme que tem 18 anos ou mais para pedir bebidas alcoólicas.";
    setErros(novo);
    if (Object.keys(novo).length) {
      document.getElementById(`${uid}-${Object.keys(novo)[0]}`)?.focus();
      return;
    }

    const dados: DadosPedido = {
      nome,
      recebimento,
      quando,
      horario,
      rotuloDia: agenda.rotulo,
      endereco: recebimento === "entrega" ? { rua, bairro, complemento, referencia } : undefined,
      pagamento,
      trocoPara: troco,
      observacoes,
    };
    window.open(linkWhatsApp(montarMensagem(comanda, dados)), "_blank", "noopener");
    onEnviado();
  };

  const erro = (campo: string) =>
    erros[campo] ? (
      <p id={`${uid}-${campo}-erro`} className="campo-erro">
        {erros[campo]}
      </p>
    ) : null;
  const descr = (campo: string) => (erros[campo] ? `${uid}-${campo}-erro` : undefined);

  return (
    <form className="comanda__form" onSubmit={enviar} noValidate>
      <fieldset className="grupo">
        <legend className="grupo__titulo">Como você quer receber?</legend>
        <div className="alternador">
          <label className={recebimento === "retirada" ? "ativo" : ""}>
            <input type="radio" name="recebimento" checked={recebimento === "retirada"} onChange={() => setRecebimento("retirada")} />
            Retirar no balcão
          </label>
          {entregaAtiva && (
            <label className={recebimento === "entrega" ? "ativo" : ""}>
              <input type="radio" name="recebimento" checked={recebimento === "entrega"} onChange={() => setRecebimento("entrega")} />
              Entrega
            </label>
          )}
        </div>
        {recebimento === "retirada" && <p className="grupo__ajuda">{site.endereco.logradouro}</p>}
      </fieldset>

      <div className="grupo">
        <label className="grupo__titulo" htmlFor={`${uid}-nome`}>
          Seu nome
        </label>
        <input
          id={`${uid}-nome`}
          className="campo"
          autoComplete="name"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          aria-invalid={!!erros.nome}
          aria-describedby={descr("nome")}
        />
        {erro("nome")}
      </div>

      {recebimento === "entrega" && (
        <fieldset className="grupo">
          <legend className="grupo__titulo">Endereço de entrega</legend>
          <label className="rotulo" htmlFor={`${uid}-rua`}>
            Rua e número
          </label>
          <input
            id={`${uid}-rua`}
            className="campo"
            autoComplete="street-address"
            value={rua}
            onChange={(e) => setRua(e.target.value)}
            aria-invalid={!!erros.rua}
            aria-describedby={descr("rua")}
          />
          {erro("rua")}
          <label className="rotulo" htmlFor={`${uid}-bairro`}>
            Bairro
          </label>
          <input
            id={`${uid}-bairro`}
            className="campo"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            aria-invalid={!!erros.bairro}
            aria-describedby={descr("bairro")}
          />
          {erro("bairro")}
          <div className="campos-duplos">
            <div>
              <label className="rotulo" htmlFor={`${uid}-comp`}>
                Complemento <span className="grupo__opcional">opcional</span>
              </label>
              <input id={`${uid}-comp`} className="campo" value={complemento} onChange={(e) => setComplemento(e.target.value)} />
            </div>
            <div>
              <label className="rotulo" htmlFor={`${uid}-ref`}>
                Ponto de referência <span className="grupo__opcional">opcional</span>
              </label>
              <input id={`${uid}-ref`} className="campo" value={referencia} onChange={(e) => setReferencia(e.target.value)} />
            </div>
          </div>
          <p className="grupo__ajuda">
            {taxa === null
              ? "A taxa de entrega é combinada pelo WhatsApp, junto com a confirmação do pedido."
              : `Taxa de entrega: ${reais(taxa)}.`}
            {site.pedidos.entrega.area && ` ${site.pedidos.entrega.area}`}
          </p>
          {temQuente && <p className="aviso-suave">Bebidas quentes podem perder temperatura no caminho.</p>}
        </fieldset>
      )}

      <fieldset className="grupo">
        <legend className="grupo__titulo">Para quando?</legend>
        {!status.aberto && <p className="aviso-suave">{status.resumo}. Agende um horário e a gente prepara quando abrir.</p>}
        <div className="alternador">
          <label className={quando === "agora" ? "ativo" : ""}>
            <input type="radio" name="quando" checked={quando === "agora"} onChange={() => setQuando("agora")} />O quanto antes
          </label>
          <label className={quando === "agendado" ? "ativo" : ""}>
            <input type="radio" name="quando" checked={quando === "agendado"} onChange={() => setQuando("agendado")} />
            Escolher horário
          </label>
        </div>
        {quando === "agendado" && (
          <>
            <label className="rotulo" htmlFor={`${uid}-horario`}>
              {agenda.rotulo}, às
            </label>
            <select
              id={`${uid}-horario`}
              className="campo"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              aria-invalid={!!erros.horario}
              aria-describedby={descr("horario")}
            >
              {agenda.horarios.map((h) => (
                <option key={h} value={h}>
                  {h.replace(":", "h")}
                </option>
              ))}
            </select>
            {erro("horario")}
          </>
        )}
      </fieldset>

      <fieldset className="grupo">
        <legend className="grupo__titulo">Pagamento</legend>
        <p className="grupo__ajuda">O pagamento é feito na retirada ou na entrega.</p>
        <div className="grupo__escolhas grupo__escolhas--compacto">
          {site.pedidos.pagamentos.map((p) => (
            <label key={p} className="escolha">
              <input type="radio" name="pagamento" checked={pagamento === p} onChange={() => setPagamento(p)} />
              <span className="escolha__nome">{p}</span>
            </label>
          ))}
        </div>
        {pagamento === "Dinheiro" && (
          <>
            <label className="rotulo" htmlFor={`${uid}-troco`}>
              Troco para quanto? <span className="grupo__opcional">deixe em branco se não precisar</span>
            </label>
            <input
              id={`${uid}-troco`}
              className="campo"
              inputMode="decimal"
              placeholder="Ex.: 100"
              value={troco}
              onChange={(e) => setTroco(e.target.value.replace(/[^\d,.]/g, ""))}
            />
          </>
        )}
      </fieldset>

      <div className="grupo">
        <label className="grupo__titulo" htmlFor={`${uid}-obs`}>
          Algo mais? <span className="grupo__opcional">opcional</span>
        </label>
        <textarea
          id={`${uid}-obs`}
          className="campo"
          rows={2}
          maxLength={240}
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          placeholder="Ex.: é para presente, pode caprichar no laço"
        />
      </div>

      {temMais18 && (
        <div className="grupo">
          <label className="escolha escolha--confirmar">
            <input
              id={`${uid}-maior18`}
              type="checkbox"
              checked={maior18}
              onChange={(e) => setMaior18(e.target.checked)}
              aria-describedby={descr("maior18")}
            />
            <span className="escolha__nome">Tenho 18 anos ou mais</span>
          </label>
          {erro("maior18")}
        </div>
      )}

      <div className="comanda__rodape">
        <div className="comanda__total">
          <span>Total</span>
          <span className="comanda__pontos" aria-hidden="true" />
          <strong>
            {reais(recebimento === "entrega" && taxa !== null ? total + taxa : total)}
            {recebimento === "entrega" && taxa === null && <small> + entrega</small>}
          </strong>
        </div>
        <button type="submit" className="botao botao--cobre botao--largo">
          Enviar pedido pelo WhatsApp
        </button>
        <button type="button" className="botao-texto" onClick={onVoltar}>
          Voltar para os itens
        </button>
      </div>
    </form>
  );
}

function Enviado({ onVoltar }: { onVoltar: () => void }) {
  const { fechar } = useComanda();
  return (
    <div className="comanda__enviado">
      <Filete />
      <p className="comanda__enviado-titulo">Pedido pronto no WhatsApp</p>
      <p>
        Confira a mensagem e toque em enviar na conversa. A gente responde por lá confirmando o pedido
        {site.pedidos.entrega.taxa === null ? " e a taxa de entrega, se houver." : "."}
      </p>
      <p className="comanda__validade">Se a conversa não abriu, volte para a comanda e tente de novo.</p>
      <div className="ficha__feito-acoes">
        <button type="button" className="botao botao--contorno-escuro" onClick={onVoltar}>
          Voltar para a comanda
        </button>
        <button type="button" className="botao botao--cobre" onClick={fechar}>
          Fechar
        </button>
      </div>
    </div>
  );
}
