import Sortable from 'sortablejs/modular/sortable.core.esm.js';

export function dragDrop(node, options) {
  const sortable = Sortable.create(node, {
    draggable: ".draggable",
    handle: ".draggable-handle",
    animation: 150,
    delay: 20,
    direction: 'vertical',
    invertSwap: true,
    swapThreshold: 0.5,
    ...options,
  });

  return {
    destroy() {
      sortable.destroy();
    },
  };
}
