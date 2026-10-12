import Image from "next/image";
import { Xicara } from "./Ornamentos";

interface Props {
  src?: string;
  alt: string;
  /** Nome do arquivo esperado em /public, exibido quando a foto ainda não existe. */
  arquivoSugerido?: string;
  rotulo?: string;
  largura?: number;
  altura?: number;
  className?: string;
  sizes?: string;
  prioridade?: boolean;
}

/**
 * Mostra a foto quando `src` existe. Sem foto, mostra um espaço reservado
 * no estilo da marca, com o nome do arquivo que deve ser colocado ali.
 */
export function Foto({ src, alt, arquivoSugerido, rotulo, largura = 1200, altura = 900, className = "", sizes, prioridade }: Props) {
  if (src) {
    return (
      <Image
        className={`foto ${className}`}
        src={src}
        alt={alt}
        width={largura}
        height={altura}
        sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
        priority={prioridade}
      />
    );
  }
  return (
    <span className={`foto foto--reservada ${className}`} role="img" aria-label={alt} data-pendente={arquivoSugerido ? `Foto: ${arquivoSugerido}` : "Foto pendente"}>
      <Xicara className="foto__xicara" />
      {rotulo && <span className="foto__rotulo">{rotulo}</span>}
    </span>
  );
}
