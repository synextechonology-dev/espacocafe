import { duvidas, site } from "@/content/site";
import { textos } from "@/content/textos";
import { horarioAgrupado } from "@/lib/horario";
import { linkWhatsApp } from "@/lib/pedido";
import { HojeNoHorario } from "./HojeNoHorario";
import { Filete, Monograma } from "./Ornamentos";
import { TempoDePausa } from "./TempoDePausa";

/* ------------------------------------------------------------------ */
/* Como pedir                                                          */
/* ------------------------------------------------------------------ */

export function ComoPedir() {
  const t = textos.comoPedir;
  return (
    <section className="secao fundo-espresso como-pedir" aria-labelledby="como-pedir-titulo">
      <div className="como-pedir__textura" aria-hidden="true" />
      <div className="secao__cabeca secao__cabeca--claro">
        <p className="chamada chamada--clara">{t.chamada}</p>
        <h2 id="como-pedir-titulo" className="titulo-secao">
          {t.titulo}
        </h2>
        <Filete claro />
      </div>
      <ol className="como-pedir__passos">
        {t.passos.map((p, i) => (
          <li key={p.titulo} className="como-pedir__passo" data-revelar style={{ "--atraso": `${i * 120}ms` } as React.CSSProperties}>
            <span className="como-pedir__numero" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3>{p.titulo}</h3>
            <p>{p.texto}</p>
          </li>
        ))}
      </ol>
      <div className="como-pedir__final">
        <a className="botao botao--creme" href="#cardapio">
          {t.botao}
        </a>
        <p className="como-pedir__nota">
          A comanda fica guardada neste aparelho por{" "}
          {site.pedidos.expiraEmMinutos === 60 ? "1 hora" : `${site.pedidos.expiraEmMinutos} minutos`} depois da última
          alteração. Nenhum dado seu fica salvo em servidor: tudo vai direto para a conversa no WhatsApp.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Visite                                                              */
/* ------------------------------------------------------------------ */

export function Visite() {
  const linhas = horarioAgrupado();
  const e = site.endereco;
  const t = textos.visite;
  return (
    <section id="visite" className="secao fundo-creme visite" aria-labelledby="visite-titulo">
      <div className="visite__grade">
        <div className="visite__info" data-revelar>
          <p className="chamada">{t.chamada}</p>
          <h2 id="visite-titulo" className="titulo-secao visite__titulo">
            {t.titulo}
          </h2>
          <Filete />
          <p className="visite__texto">{t.texto}</p>

          <address className="visite__endereco">
            <span className="visite__rotulo">Endereço</span>
            {e.logradouro}
            {e.bairro && <>, {e.bairro}</>}
            <br />
            {e.cidade}, {e.uf}
            <br />
            <span className="sem-quebra">CEP {e.cep}</span>
          </address>

          <div className="visite__bloco-horario">
            <span className="visite__rotulo">Horário</span>
            <dl className="visite__horario">
              {linhas.map((l) => (
                <div key={l.dias} className="visite__dia" data-dias={l.diasIds.join(",")}>
                  <dt>{l.dias}</dt>
                  <dd>{l.horas}</dd>
                </div>
              ))}
            </dl>
            <HojeNoHorario />
          </div>

          <div className="visite__acoes">
            <a className="botao botao--cobre" href={e.rotaUrl} target="_blank" rel="noopener noreferrer">
              <IconeRota />
              Traçar rota
            </a>
            <a className="botao botao--contorno-escuro" href={e.mapsUrl} target="_blank" rel="noopener noreferrer">
              Abrir no Google Maps
            </a>
          </div>
          <p className="visite__contatos">
            <a href={linkWhatsApp("Olá! Vim pelo site e tenho uma dúvida:")} target="_blank" rel="noopener noreferrer">
              WhatsApp {site.whatsapp.exibicao}
            </a>
            <span aria-hidden="true">·</span>
            <a href={site.instagram.url} target="_blank" rel="noopener noreferrer">
              @{site.instagram.usuario}
            </a>
          </p>
        </div>

        <div className="visite__mapa-area" data-revelar>
          <div className="visite__mapa">
            <iframe
              title={`Mapa: ${site.nome}, ${e.logradouro}, ${e.cidade}`}
              src={e.mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <a className="visite__cartao-mapa" href={e.mapsUrl} target="_blank" rel="noopener noreferrer">
            <Monograma className="visite__cartao-monograma" />
            <span>
              <strong>{site.nome}</strong>
              <span>{e.logradouro}</span>
              <span className="visite__cartao-link">Ver no Google Maps</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

function IconeRota() {
  return (
    <svg className="icone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Dúvidas                                                             */
/* ------------------------------------------------------------------ */

export function Duvidas() {
  const t = textos.duvidas;
  return (
    <section id="duvidas" className="secao fundo-grao duvidas" aria-labelledby="duvidas-titulo">
      <div className="duvidas__grade">
        <div className="duvidas__cabeca">
          <p className="chamada chamada--clara">{t.chamada}</p>
          <h2 id="duvidas-titulo" className="titulo-secao">
            {t.titulo}
          </h2>
          <Filete claro />
          <p className="duvidas__whatsapp-texto">{t.whatsapp}</p>
          <a
            className="botao botao--creme"
            href={linkWhatsApp("Olá! Vim pelo site e tenho uma dúvida:")}
            target="_blank"
            rel="noopener noreferrer"
          >
            Perguntar no WhatsApp
          </a>
        </div>
        <div className="duvidas__lista">
          {duvidas.map((d, i) => (
            <details key={d.pergunta} className="duvida" data-pendente={d.pendente ? "Resposta a confirmar" : undefined}>
              <summary>
                <span className="duvida__indice" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="duvida__pergunta">{d.pergunta}</span>
              </summary>
              <p>{d.resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Fidelidade (só aparece se ativo em site.ts)                         */
/* ------------------------------------------------------------------ */

export function Fidelidade() {
  if (!site.fidelidade.ativo) return null;
  return (
    <section className="secao fundo-cobre fidelidade" aria-labelledby="fidelidade-titulo">
      <div className="fidelidade__cartao">
        <div className="fidelidade__topo">
          <h2 id="fidelidade-titulo">Cartão fidelidade</h2>
          <p>{site.fidelidade.texto}</p>
        </div>
        <ol className="fidelidade__carimbos" aria-hidden="true">
          {Array.from({ length: 10 }, (_, i) => (
            <li key={i} className={i < 6 ? "carimbado" : i === 9 ? "premio" : ""}>
              {i < 6 ? "EC" : i === 9 ? "★" : ""}
            </li>
          ))}
        </ol>
        <p className="fidelidade__nota">Peça o seu no balcão.</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Rodapé                                                              */
/* ------------------------------------------------------------------ */

export function Rodape() {
  const linhas = horarioAgrupado();
  return (
    <footer className="rodape fundo-espresso">
      <div className="rodape__textura" aria-hidden="true" />
      <div className="rodape__despedida">
        <p className="rodape__frase">{textos.rodape.despedida}</p>
        <TempoDePausa />
      </div>
      <div className="rodape__conteudo">
        <div className="rodape__marca">
          <Monograma className="rodape__monograma" />
          <p className="rodape__nome">Espaço Café</p>
          <p className="rodape__complemento">Cafeteria</p>
          <Filete claro />
          <p className="rodape__slogan">{site.slogan}</p>
        </div>
        <div className="rodape__colunas">
          <div>
            <h2>Onde estamos</h2>
            <p>
              <a href={site.endereco.mapsUrl} target="_blank" rel="noopener noreferrer">
                {site.endereco.logradouro}
                <br />
                {site.endereco.cidade}, {site.endereco.uf}
              </a>
            </p>
          </div>
          <div>
            <h2>Horário</h2>
            {linhas.map((l) => (
              <p key={l.dias}>
                {l.dias}: {l.horas}
              </p>
            ))}
          </div>
          <div>
            <h2>Fale com a gente</h2>
            <p>
              <a href={linkWhatsApp("Olá! Vim pelo site.")} target="_blank" rel="noopener noreferrer">
                WhatsApp {site.whatsapp.exibicao}
              </a>
            </p>
            <p>
              <a href={site.instagram.url} target="_blank" rel="noopener noreferrer">
                Instagram @{site.instagram.usuario}
              </a>
            </p>
          </div>
        </div>
      </div>
      <p className="rodape__fim">
        © {new Date().getFullYear()} Espaço Café Cafeteria. {site.endereco.cidade}, {site.endereco.uf}.
      </p>
    </footer>
  );
}
