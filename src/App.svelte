<script>
  import { Router, Link, Route } from "svelte-routing";

  import Menu from "./components/Menu.svelte";
  import Home from "./pages/Home.svelte";
  import Plan from "./pages/Plan.svelte";
</script>

<style>
  main {
    position: relative;
    width: 100%;
    min-height: calc(100vh - 3rem);
    margin-top: 3rem;
    margin-left: 0;
    padding: 1rem;
    font-size: 1.5rem;
  }
</style>

<Router>
  <Menu />
  <main>
    <Route path="/plan/:id" component={Plan} />
    <Route path="/" component={Home} />
  </main>
</Router>
