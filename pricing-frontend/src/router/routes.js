import dashboardRoutes from "./dashboardRoutes";
import loginRoute from "./loginRoute";
import signupRoute from "./signupRoute";

const routes = [...loginRoute, ...signupRoute, ...dashboardRoutes];

export default routes;
