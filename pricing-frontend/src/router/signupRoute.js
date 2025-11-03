import { Suspense } from "react";
import Signup from "../components/Signup";
import FallbackLoader from "./FallbackLoader";
import LoginProtectedRoute from "./LoginProtectedRoute";

const signupRoute = [
  {
    path: "/signup",
    element: (
      <Suspense fallback={<FallbackLoader />}>
        <LoginProtectedRoute>
          <Signup />
        </LoginProtectedRoute>
      </Suspense>
    ),
  },
];

export default signupRoute;
