import { AsyncDependenciesBlock } from "webpack";
import { createElement } from "./src/React/createElement";
import { render } from "./src/ReactDOM/render";
const App = (
  <div>
    <span>1</span>
    <span>2</span>
    <span>3</span>
  </div>
);

const root = document.createElement("div");
console.log(root);
document.body.appendChild(root);
root.setAttribute("id", "root");
render(App, root);
