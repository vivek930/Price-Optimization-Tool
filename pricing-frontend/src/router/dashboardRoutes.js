import React, { Suspense } from "react";
import ProtectedRoute from "./ProtectedRoute";
import FallbackLoader from "./FallbackLoader";

const Dashboard = React.lazy(() => import("../components/Dashboard"));
const ProductGrid = React.lazy(() =>
  import("../components/manageProduct/ProductGrid")
);
const PriceGrid = React.lazy(() =>
  import("../components/priceOptimization/PriceGrid")
);
const ProductList = React.lazy(() =>
  import("../components/productList/ProductList")
);

const dashboardRoutes = [
  {
    path: "/dashboard",
    element: (
      <Suspense fallback={<FallbackLoader />}>
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: "/manage-products",
    element: (
      <Suspense fallback={<FallbackLoader />}>
        <ProtectedRoute requiredRoute="/manage-products">
          <ProductGrid />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: "/price-optimization",
    element: (
      <Suspense fallback={<FallbackLoader />}>
        <ProtectedRoute requiredRoute="/price-optimization">
          <PriceGrid />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: "/product-listing",
    element: (
      <Suspense fallback={<FallbackLoader />}>
        <ProtectedRoute requiredRoute="/product-listing">
          <ProductList />
        </ProtectedRoute>
      </Suspense>
    ),
  },
];

export default dashboardRoutes;
