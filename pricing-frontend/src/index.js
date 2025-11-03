import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { SnackbarProvider } from "notistack";
import SnackbasrListener from "./components/SnackbasrListener";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./config/theme";
import ErrorBoundary from "./components/ErrorBoundary";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary fallbackMessage="The application encountered an error. Please refresh the page.">
      <ThemeProvider theme={theme}>
        {/* Redux store provider */}
        <Provider store={store}>
          {/* React Router for routing */}
          <BrowserRouter>
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              {/* Custom listener to integrate Redux with Snackbar */}
              <SnackbasrListener />
              <App />
            </SnackbarProvider>
          </BrowserRouter>
        </Provider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
