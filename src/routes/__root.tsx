import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";

import "../styles.css";
import { StoreProvider, Layout } from "../components/Store";

const siteName = "NOUVELLE ALLURE | Révélez votre allure";
const siteDescription =
  "Mode femme au Maroc : chaussures, bottines, vêtements et accessoires. Découvrez Nouvelle Allure, avec paiement à la livraison et assistance WhatsApp.";

export const Route = createRootRoute({
  head: () => ({
    links: [{ rel: "icon", type: "image/svg+xml", href: "/logo-mark.svg" }],
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: siteName,
      },
      {
        name: "description",
        content: siteDescription,
      },
      {
        property: "og:title",
        content: siteName,
      },
      {
        property: "og:description",
        content: siteDescription,
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="section empty">
      <h1>Page introuvable</h1>
      <a className="btn" href="/">
        Retour à l’accueil
      </a>
    </div>
  ),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        <StoreProvider>
          <Layout>{children}</Layout>
        </StoreProvider>
        <Scripts />
      </body>
    </html>
  );
}
