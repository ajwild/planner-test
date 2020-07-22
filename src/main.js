import App from "./App.svelte";

// Import SCSS for carbon-components-svelte
import "./theme/_carbon.scss";

const app = new App({
  target: document.body,
  props: {},
});

export default app;
