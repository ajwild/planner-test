<script>
  import { onMount } from "svelte";

  import { cycleStore, activePlanId, activePlan } from "../stores";
  import Accordion from "../components/Accordion.svelte";
  import Cycle from "../components/Cycle.svelte";

  export let id;

  let loading = true;

  onMount(() => {
    const plan = {
      id,
      type: "plan",
      status: "partial",
      title: "New plan",
      startDate: new Date(),
      parents: [],
      children: []
    };
    cycleStore.addCycle(plan);
    activePlanId.set(id);
    loading = false;
  });
</script>

<style>
  main {
    padding: 1rem;
    margin: 0 auto;
    font-size: 1.5rem;
  }
</style>

<main>
  {#if loading}
    Loading...
  {:else if $activePlanId && $activePlan[$activePlanId]}
    <Accordion id={$activePlanId} type={$activePlan[$activePlanId].type}>
      <Cycle cycle={$activePlan[$activePlanId]} />
    </Accordion>
  {:else}Plan not found!{/if}
</main>
