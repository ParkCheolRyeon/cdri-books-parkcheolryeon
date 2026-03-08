import { lazy, Suspense } from "react";
import { RootLayout } from "@/Layouts/RootLayout";
import { createBrowserRouter, Navigate } from "react-router-dom";

const BookSearchPage = lazy(() => import("@/pages/BookSearchPage"));
const FavoritesPage = lazy(() =>
  import("@/pages/FavoritesPage").then((m) => ({ default: m.FavoritesPage })),
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate replace to="/book-search" />,
      },
      {
        path: "book-search",
        element: (
          <Suspense>
            <BookSearchPage />
          </Suspense>
        ),
      },
      {
        path: "favorites",
        element: (
          <Suspense>
            <FavoritesPage />
          </Suspense>
        ),
      },
    ],
  },
]);
