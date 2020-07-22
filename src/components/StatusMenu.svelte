<script>
  import { createEventDispatcher } from "svelte";
  import {
    Button,
    Icon,
    OverflowMenu,
    OverflowMenuItem
  } from "carbon-components-svelte";
  import CheckmarkOutline20 from "carbon-icons-svelte/lib/CheckmarkOutline20";
  import CloseOutline20 from "carbon-icons-svelte/lib/CloseOutline20";
  import RadioButton20 from "carbon-icons-svelte/lib/RadioButton20";
  import Unknown20 from "carbon-icons-svelte/lib/Unknown20";
  import PlayOutline20 from "carbon-icons-svelte/lib/PlayOutline20";
  import SubtractAlt20 from "carbon-icons-svelte/lib/SubtractAlt20";

  export let status;
  export let type;

  const icons = {
    complete: CheckmarkOutline20, // past cycle successfully completed
    current: PlayOutline20, // active cycle
    partial: SubtractAlt20, // past cycle partially completed
    planned: RadioButton20, // future cycle
    skipped: CloseOutline20, // past cycle not started
    unknown: Unknown20 // past cycle without status
  };
  $: statusIconProperties = {
    render: icons[status] || icons.unknown,
    class: status
  };

  const dispatch = createEventDispatcher();
  function dispatchStatus(newStatus) {
    dispatch("change", newStatus);
  }
</script>

<style>
  .overflow-menu :global(svg) {
    fill: grey;
  }
  .overflow-menu :global(svg.complete) {
    fill: green;
  }
  .overflow-menu :global(svg.partial) {
    fill: yellow;
  }
  .overflow-menu :global(svg.skipped) {
    fill: red;
  }
  .overflow-menu :global(svg.current) {
    fill: black;
  }
</style>

{#if type === 'activity'}
  <span class="overflow-menu">
    <OverflowMenu style="width: auto;">
      <span slot="menu">
        <div
          class="bx--btn bx--btn--tertiary bx--btn--icon-only
          bx--tooltip__trigger bx--tooltip--a11y bx--tooltip--bottom
          bx--tooltip--align-center">
          <Icon {...statusIconProperties} />
        </div>
      </span>
      {#each ['complete', 'partial', 'skipped'] as option}
        <OverflowMenuItem
          class="bx--btn"
          on:click={() => dispatchStatus(option)}>
          {`${option[0].toUpperCase()}${option.slice(1)}`}&nbsp;
          <Icon class={`bx--btn__icon ${option}`} render={icons[option]} />
        </OverflowMenuItem>
      {/each}
      <OverflowMenuItem hasDivider on:click={() => dispatchStatus(null)}>
        Clear
      </OverflowMenuItem>
    </OverflowMenu>
  </span>
{:else}
  <Button
    class={status}
    hasIconOnly
    kind="tertiary"
    icon={statusIconProperties.render}
    iconDescription={`Status of ${type}`}
    tooltipAlignment="center"
    tooltipPosition="bottom" />
{/if}
