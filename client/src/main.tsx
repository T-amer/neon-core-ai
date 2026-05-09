import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootEl = document.getElementById("root") || document.body.appendChild(document.createElement("div"));
rootEl.id = "root";
createRoot(rootEl).render(<App />);