import { render } from "./src/ReactDOM/render";
import { App } from "./index.tsx";

const root = document.createElement("div");
document.body.appendChild(root);
root.setAttribute("id", "root");
render(App, root);
