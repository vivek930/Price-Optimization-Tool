import routes from "./routes";

import { useRoutes } from "react-router-dom";

function AppRouter() {
  return useRoutes(routes);
}

export default AppRouter;
