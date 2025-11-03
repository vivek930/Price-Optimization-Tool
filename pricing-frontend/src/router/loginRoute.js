import { Suspense } from "react";
import Layout from "../components/Layout";
import FallbackLoader from "./FallbackLoader";
import LoginProtectedRoute from "./LoginProtectedRoute";

const loginRoute = [
  {
    path: "/",
    element: (
      <Suspense fallback={<FallbackLoader />}>
        <LoginProtectedRoute>
          <Layout />
        </LoginProtectedRoute>
      </Suspense>
    ),
  },
];

export default loginRoute;
