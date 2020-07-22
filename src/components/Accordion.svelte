<script>
  export let action = () => {};
  export let actionOptions = {};
  export let id;
  export let type;
</script>

<ul class="accordion" data-id={id} data-type={type} use:action={actionOptions}>
  <slot />
</ul>
