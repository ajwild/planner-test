<script>
  import { createEventDispatcher } from "svelte";
  import { Button } from "carbon-components-svelte";
  import ChevronRight20 from "carbon-icons-svelte/lib/ChevronRight20";

  export let accentColor;
  export let collapsed = false;
  export let draggable = false;
  export let id;
  export let type;

  const dispatch = createEventDispatcher();
  function onArrowClick() {
    dispatch("toggle", !collapsed);
  }
</script>

<style>
  .accordion-item {
    border-color: var(--accent-color);
    border-style: solid;
    border-width: 1px 0 0 1rem;
    transition: none;
  }

  .header {
    display: flex;
    padding: 1rem;
  }

  .title {
    flex-grow: 1;
    order: 1;
  }

  .toggle {
    order: 2;
  }
  .toggle-icon {
    transform: rotate(90deg);
  }
  .toggle-icon.collapsed {
    transform: rotate(-90deg);
  }

  .accordion-item > .content {
    border-bottom: 1px solid #fff;
  }
  .accordion-item:last-child > .content {
    border-bottom-color: var(--accent-color);
  }
  .accordion-item.collapsed:last-child > .header {
    border-bottom: 1px solid var(--accent-color);
  }
  .accordion-item.collapsed > .content {
    display: none;
  }
</style>

<li
  class="accordion-item"
  class:collapsed
  class:draggable
  data-id={id}
  data-type={type}
  style="--accent-color: {accentColor};">
  <div class="header">
    <span class="toggle">
      <Button
        hasIconOnly
        iconDescription={`${collapsed ? 'Expand' : 'Collapse'} ${type}`}
        kind="tertiary"
        on:click={onArrowClick}
        tooltipAlignment="center"
        tooltipPosition="bottom">
        <span class="toggle-icon" class:collapsed>
          <ChevronRight20 />
        </span>
      </Button>
    </span>
    <div class="title">
      <slot name="title" />
    </div>
  </div>
  <div class="content" class:collapsed>
    <slot />
  </div>
</li>
