<script>
  import { afterUpdate } from "svelte";
  import { Button, Icon } from "carbon-components-svelte";
  import Add20 from "carbon-icons-svelte/lib/Add20";
  import DocumentBlank20 from "carbon-icons-svelte/lib/DocumentBlank20";
  import Move20 from "carbon-icons-svelte/lib/Move20";
  import TrashCan20 from "carbon-icons-svelte/lib/TrashCan20";

  import {
    addToParentCycle,
    moveCycle,
    removeCycle,
    updateCycleProp
  } from "./Cycle";
  import { TYPES } from "../utils/defaults";
  import { dragDrop } from "../utils/dragDrop";
  import Accordion from "./Accordion.svelte";
  import AccordionItem from "./AccordionItem.svelte";
  import StatusMenu from "./StatusMenu.svelte";

  export let cycle;
  let draggable = cycle.type !== "plan";
  let open = true;
  let showDetails = false;

  $: childTypes = cycle
    ? [
        TYPES[TYPES.indexOf(cycle.type) + 1],
        cycle.type === "day" ? TYPES[TYPES.indexOf(cycle.type) + 2] : null
      ].filter(childType => Boolean(childType))
    : [];

  const groups = ["session", "day"].includes(cycle.type)
    ? ["session", "day"]
    : [cycle.type];
  const dragDropOptions = {
    group: {
      name: cycle.type,
      pull: groups,
      put: groups
    },
    setData: dataTransfer => {
      const img = new Image();
      img.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
      dataTransfer.setDragImage(img, 0, 0);
    },
    onChoose: ({ from, item }) => {
      const placeholder = from.insertBefore(item.cloneNode(true), item);
      placeholder.classList.add("sortable-placeholder");
      placeholder.classList.remove("draggable");
      document
        .querySelectorAll(".sortable-autoscroll-header")
        .forEach(el => el.classList.add("sortable-no-pointer-events"));
    },
    onUnchoose: ({ from }) => {
      from
        .querySelectorAll(".sortable-placeholder")
        .forEach(el => el.parentNode.removeChild(el));
      document
        .querySelectorAll(".sortable-autoscroll-header")
        .forEach(el => el.classList.remove("sortable-no-pointer-events"));
    },
    onMove: ({ dragged, to, willInsertAfter }) =>
      dragged.dataset.type === "session" && to.dataset.type === "session"
        ? false
        : willInsertAfter
        ? 1
        : -1,
    onEnd: ({ from, to, item, newIndex }) => {
      if (from.querySelector(".sortable-placeholder")) {
        from.removeChild(from.querySelector(".sortable-placeholder"));
      }
      moveCycle(from.dataset.id, to.dataset.id, item.dataset.id, newIndex);
    }
  };

  afterUpdate(() => {
    console.log(`Updated ${cycle.id}`);
  });

  function onTitleBlur(event) {
    return updateCycleProp(cycle.id, "title", event.target.textContent);
  }

  function onRemove(event) {
    return cycle.children.length === 0 ||
      confirm(
        `Are you sure you want to remove this ${cycle.type} and all sub-cycles from the plan?`
      )
      ? removeCycle(cycle)
      : null;
  }

  function onToggleCollapse(event) {
    return updateCycleProp(cycle.id, "collapsed", event.detail);
  }

  function onStatusChange({ detail: status }) {
    return (
      status !== cycle.status && updateCycleProp(cycle.id, "status", status)
    );
  }
</script>

<style>
  header {
    display: flex;
    align-items: center;
    column-gap: 1rem;
  }

  h3 {
    margin: 0;
    line-height: 2rem;
  }

  .draggable-handle {
    cursor: grab;
  }

  .content {
    min-height: 3.5rem;
  }

  .placeholder {
    padding: 1rem;
    opacity: 0.5;
    border-color: #ccc;
    border-style: solid;
    border-width: 1px 0 1px 1rem;
  }
  .placeholder:only-child {
    display: block;
  }

  .add-cycle-group {
    display: inline-flex;
    column-gap: 1rem;
    padding: 1rem;
    grid-template-columns: 50% 50%;
    column-gap: 1rem;
  }

  :global(.sortable-chosen) {
    position: relative;
    height: 1rem;
    z-index: 100;
    margin: -0.5rem 0;
    background-color: var(--accent-color);
  }
  :global(.sortable-chosen::before) {
    content: "";
    position: absolute;
    left: -2rem;
    top: -1rem;
    height: 1rem;
    width: 1rem;
    background-color: white;
    border: 1rem solid var(--accent-color);
    border-radius: 2rem;
  }
  :global(.sortable-chosen > *) {
    visibility: hidden;
  }

  :global(.sortable-no-pointer-events) {
    pointer-events: none;
  }
</style>

<svelte:options immutable />
<AccordionItem
  accentColor={cycle.color}
  collapsed={cycle.collapsed}
  {draggable}
  id={cycle.id}
  on:toggle={onToggleCollapse}
  type={cycle.type}>
  <header slot="title">
    <h3
      contenteditable="true"
      bind:innerHTML={cycle.title}
      on:blur={onTitleBlur}>
      {cycle.title}
    </h3>

    <Button
      hasIconOnly
      icon={DocumentBlank20}
      iconDescription={`View ${cycle.type} details`}
      kind={showDetails ? 'primary' : 'tertiary'}
      on:click={event => {
        event.stopPropagation();
        showDetails = !showDetails;
      }}
      tooltipAlignment="center"
      tooltipPosition="bottom" />

    <span class="status-icon">
      <StatusMenu
        status={cycle.status}
        type={cycle.type}
        on:change={onStatusChange} />
    </span>

    {#if cycle.type !== 'plan'}
      <span
        class="bx--btn bx--btn--tertiary bx--btn--icon-only draggable-handle">
        <Icon render={Move20} />
      </span>
      <Button
        hasIconOnly
        icon={TrashCan20}
        iconDescription={`Remove ${cycle.type}`}
        kind="tertiary"
        on:click={onRemove}
        tooltipAlignment="left"
        tooltipPosition="bottom" />
    {/if}
  </header>

  {#if showDetails}
    <div>Details</div>
  {/if}

  <div class="content">
    <Accordion
      id={cycle.id}
      type={cycle.type}
      action={dragDrop}
      actionOptions={dragDropOptions}>
      {#if cycle.children.length === 0 && childTypes.length > 0}
        <li class="placeholder">
          <span>No {childTypes.join(' or ')} added.</span>
        </li>
      {/if}
      {#each cycle.children as child (child.id)}
        <svelte:self cycle={child} />
      {/each}
    </Accordion>
  </div>

  {#if childTypes.length > 0}
    <div class="add-cycle-group">
      {#each childTypes as childType, index (childType)}
        <Button
          icon={Add20}
          iconDescription={`Add ${childType}`}
          kind={index === 0 ? "primary" : "tertiary"}
          on:click={() => addToParentCycle(cycle, childType)}
          tooltipAlignment="center"
          tooltipPosition="bottom">
          Add {childType}
        </Button>
      {/each}
    </div>
  {/if}
</AccordionItem>
