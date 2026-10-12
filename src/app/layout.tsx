import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond } from "next/font/google";
import { categorias } from "@/content/menu";
import { duvidas, site } from "@/content/site";
import "./globals.css";

/* Tipografia do manual da marca: Cinzel (títulos) + Cormorant Garamond (textos e cardápio). */
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--fonte-cinzel",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--fonte-cormorant",
  display: "swap",
});

const descricao = `Cafeteria em ${site.endereco.cidade}. Cafés, cappuccinos, tapiocas, doces e bolos. Peça pelo site para retirar no balcão ou receber em casa.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.nome} Cafeteria | ${site.endereco.cidade}`,
  description: descricao,
  openGraph: {
    title: `${site.nome} Cafeteria`,
    description: site.slogan + " " + site.apresentacao,
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/marca/og.jpg", width: 1200, height: 630, alt: "Selo do Espaço Café" }],
  },
  icons: { apple: "/marca/selo-quadrado.jpg" },
};

export const viewport: Viewport = {
  themeColor: "#2E1A16",
  width: "device-width",
  initialScale: 1,
};

const DIAS_SCHEMA = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Dados estruturados para o Google: endereço, horário, cardápio e dúvidas. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CafeOrCoffeeShop",
      name: `${site.nome} Cafeteria`,
      url: site.url,
      image: `${site.url}/marca/og.jpg`,
      telephone: `+${site.whatsapp.numero}`,
      servesCuisine: ["Café", "Lanches", "Doces"],
      address: {
        "@type": "PostalAddress",
        streetAddress: site.endereco.logradouro,
        addressLocality: site.endereco.cidade,
        addressRegion: site.endereco.uf,
        postalCode: site.endereco.cep,
        addressCountry: "BR",
      },
      openingHoursSpecification: site.expediente.map((e) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: DIAS_SCHEMA[e.dia],
        opens: e.abre,
        closes: e.fecha,
      })),
      sameAs: [site.instagram.url],
      hasMenu: {
        "@type": "Menu",
        hasMenuSection: categorias.map((c) => ({
          "@type": "MenuSection",
          name: c.titulo,
          hasMenuItem: c.itens.map((i) => ({
            "@type": "MenuItem",
            name: i.nome,
            description: i.descricao,
            offers: { "@type": "Offer", price: i.preco.toFixed(2), priceCurrency: "BRL" },
          })),
        })),
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: duvidas
        .filter((d) => !d.pendente)
        .map((d) => ({ "@type": "Question", name: d.pergunta, acceptedAnswer: { "@type": "Answer", text: d.resposta } })),
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${cinzel.variable} ${cormorant.variable}`}>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
