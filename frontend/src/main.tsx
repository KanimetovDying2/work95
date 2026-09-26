import { GoogleOAuthProvider } from "@react-oauth/google";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="105151608883-4qfbjr2d6v335eqa9t9vjfsqvlcgo1am.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>,
);
