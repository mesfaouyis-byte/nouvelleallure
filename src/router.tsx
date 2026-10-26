import { createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    defaultErrorComponent: ({ reset }) => (
      <main className="section empty">
        <h1>La page n’a pas pu s’afficher.</h1>
        <p>Réessayez dans quelques instants.</p>
        <button className="btn" onClick={reset}>
          Réessayer
        </button>
        <a href="/">Retour à l’accueil</a>
      </main>
    ),
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
