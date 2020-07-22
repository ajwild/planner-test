import { derived, writable } from "svelte/store";

import { COLORS, TYPES } from "../utils/defaults";

function createCycleStore() {
  const { subscribe, update, _set } = writable({});

  return {
    subscribe,
    addCycle: (cycle) => update((cycles) => ({ ...cycles, [cycle.id]: cycle })),
    addCycles: (newCycles) =>
      update((cycles) => ({
        ...cycles,
        ...newCycles.reduce(
          (accumulator, cycle) => ({ ...accumulator, [cycle.id]: cycle }),
          {}
        ),
      })),
    updateCycle: (id, values) =>
      update((cycles) => ({
        ...cycles,
        [id]: { ...cycles[id], ...values },
      })),
    addChild: (parentId, childId) =>
      update((cycles) => ({
        ...cycles,
        [parentId]: {
          ...cycles[parentId],
          children: [...cycles[parentId].children, childId],
        },
      })),
    reorderCycle: (parentId, childId, newIndex) =>
      update(({ [parentId]: cycle, ...cycles }) => {
        const remainingItems = cycle.children.filter(
          (cycleId) => cycleId !== childId
        );
        const children = [
          ...remainingItems.slice(0, newIndex),
          childId,
          ...remainingItems.slice(newIndex),
        ];

        return {
          ...cycles,
          [parentId]: { ...cycle, children },
        };
      }),
    moveCycle: (fromParentId, toParentId, childId, newIndex) =>
      update(
        ({ [fromParentId]: fromCycle, [toParentId]: toCycle, ...cycles }) => {
          const fromCycleChildren = fromCycle.children.filter(
            (cycleId) => cycleId !== childId
          );
          const toCycleChildren = [
            ...toCycle.children.slice(0, newIndex),
            childId,
            ...toCycle.children.slice(newIndex),
          ];

          return {
            ...cycles,
            [fromParentId]: { ...fromCycle, children: fromCycleChildren },
            [toParentId]: { ...toCycle, children: toCycleChildren },
          };
        }
      ),
    removeCycle: (id) =>
      update(({ [id]: cycle, ...cycles }) => {
        const parentId = cycle.parents[cycle.parents.length - 1];
        return Object.keys(cycles).reduce(
          (accumulator, cycleId) =>
            cycleId === parentId
              ? {
                  ...accumulator,
                  [cycleId]: {
                    ...cycles[cycleId],
                    children: cycles[cycleId].children.filter(
                      (childId) => childId !== id
                    ),
                  },
                }
              : cycles[cycleId].parents.includes(id)
              ? accumulator
              : { ...accumulator, [cycleId]: cycles[cycleId] },
          {}
        );
      }),
  };
}

export const cycleStore = createCycleStore();

export const activePlanId = writable();

const getColor = (cycle) => cycle.color || COLORS[cycle.type];
const getStartDate = (cycle, startDate, cycleCounter) => {
  const offset = ["plan", "phase", "block"].includes(cycle.type) ? 0 : -1;
  const dayInMilliseconds = 1000 * 60 * 60 * 24;
  return startDate instanceof Date
    ? new Date(
        startDate.valueOf() + dayInMilliseconds * (cycleCounter.day + offset)
      )
    : cycleCounter.day + offset + 1;
};
const getStatus = (cycle, startDate) =>
  cycle.status
    ? cycle.status
    : startDate.toDateString() === new Date().toDateString()
    ? "current"
    : startDate > Date.now()
    ? "planned"
    : null;
const getTitle = (cycle, startDate, cycleCounter) =>
  cycle.title
    ? cycle.title
    : cycle.type === "day" && startDate instanceof Date
    ? startDate.toDateString()
    : `${cycle.type.charAt(0).toUpperCase()}${cycle.type.slice(1)} ${
        cycleCounter[cycle.type]
      }`;

const generateDefaults = (cycle, startDate, cycleCounter) => {
  const newStartDate = getStartDate(cycle, startDate, cycleCounter);
  return {
    color: getColor(cycle),
    startDate: newStartDate,
    status: getStatus(cycle, newStartDate),
    title: getTitle(cycle, newStartDate, cycleCounter),
  };
};

const populate = (
  cycles,
  id,
  startDate = 1,
  cycleCounter = TYPES.reduce(
    (accumulator, type) => ({ ...accumulator, [type]: 0 }),
    {}
  )
) => {
  cycleCounter[cycles[id].type]++;
  return {
    ...cycles[id],
    ...generateDefaults(cycles[id], startDate, cycleCounter),
    children: cycles[id].children.map((childId) =>
      populate(cycles, childId, startDate, cycleCounter)
    ),
  };
};

export const activePlan = derived(
  [activePlanId, cycleStore],
  ([$activePlanId, $cycles]) =>
    $activePlanId &&
    $cycles[$activePlanId] && {
      [$activePlanId]: populate(
        $cycles,
        $activePlanId,
        $cycles[$activePlanId].startDate
      ),
    }
);
