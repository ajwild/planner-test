import { generate as generateShortId } from "shortid";
import { cycleStore } from "../stores";

export function addToParentCycle(parentCycle, type) {
  const id = generateShortId();
  const children =
    type === "block"
      ? Array(7)
          .fill()
          .map(() => ({
            id: generateShortId(),
            type: "day",
            parents: [...parentCycle.parents, parentCycle.id, id],
            children: [],
          }))
      : [];

  const cycle = {
    id,
    type,
    parents: [...parentCycle.parents, parentCycle.id],
    children: children.map((child) => child.id),
  };
  cycleStore.addCycles([cycle, ...children]);
  cycleStore.addChild(parentCycle.id, id);
}

export function updateCycleProp(id, prop, value) {
  return cycleStore.updateCycle(id, { [prop]: value });
}

export function moveCycle(fromParentId, toParentId, childId, newIndex) {
  return fromParentId === toParentId
    ? cycleStore.reorderCycle(toParentId, childId, newIndex)
    : cycleStore.moveCycle(fromParentId, toParentId, childId, newIndex);
}

export function removeCycle(cycle) {
  cycleStore.removeCycle(cycle.id);
}
