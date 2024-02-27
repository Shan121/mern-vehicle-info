import React from "react";
import ReactDOM from "react-dom/client";
import "./globals.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import Login from "./pages/Login.tsx";
import SubmitInfo from "./pages/SubmitInfo.tsx";
import Layout from "./Layout.tsx";
import UserRoute from "./components/ProtectedRoutes/UserRoute.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Login />
      </Layout>
    ),
  },
  {
    path: "/submit-vehicle-info",
    element: (
      <Layout>
        <UserRoute>
          <SubmitInfo />
        </UserRoute>
      </Layout>
    ),
  },
  {
    path: "*",
    element: (
      <Layout>
        <div>404</div>
      </Layout>
    ),
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
