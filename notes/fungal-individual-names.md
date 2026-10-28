# Names in `assignFungalIndividuals`

Notes from the pass that renamed the records in `src/lib/assignFungalIndividuals.js`. The behavior is the same. The names now say what each value holds.

`notes/fungal-individuals.md` still uses letters in its example ("individual A", mushrooms 2 and 3, firs 5 and 6). Those letters were only a way to keep the example readable. The code does not store them.

## The finished record

`fungalIndividuals` is the list this function returns. Each entry is one fungal individual:

```js
{
  id: 0,
  mushroomIndices: [0, 1, 2],
  treeIndices: [4],
  rootIndices: [4],
  myceliumStrands: [
    {
      from: { kind: 'mushroom', index: 0 },
      to: { kind: 'mushroom', index: 1 },
      length: 3,
    },
  ],
}
```

`id` is the group number: `0`, then `1`, then `2`. `individualLabel` is gone. Nothing in `src` was reading the letters `'A'` and `'B'`.

`Terrain` keeps that same list under `fungalIndividuals`. `rootIndices` there is still one flat list of every individual's fir indexes. A click does not filter it yet.

## What is not the finished individual

`mushroomPlacements` is the full list of placement records (`x`, `y`, `elevation`, `rotationY`, `scale`). It is not the 3D model. The fly agaric model is instanced from those records in `ScatteredMushrooms`.

`mushroomIndexGroups` is a list of lists of mushroom indexes, built before any fir is attached:

```js
mushroomIndexGroups = [
  [0, 1, 2], // mushroomIndices for the first individual
  [4, 5],    // mushroomIndices for the next individual
]
```

One inner list is `mushroomIndices`. It holds index numbers, not placements and not models. `mushroomIndexGroups[0]` becomes the first record's `mushroomIndices`.

`individualIdByMushroom` is one slot per mushroom. The slot starts at `-1` ("not in a group yet"). After grouping it looks like `[0, 0, 0, 1, 1]`: the value is the group number, which is also the index into `fungalIndividuals`.

`seed` in `collectMushroomGroups` is the first ungrouped mushroom index the loop reaches. It is not the random number that placed the mushrooms. That random value is `mushroomSeed` in `scatterObjectsOnTerrain`.

`queue` is the mushroom indexes this group still has to check. It starts as `[seed]`. A mushroom within `maxDistance` is marked with the group number and pushed on the queue, so a chain can join: 0 close to 1, and 1 close to 2, puts 2 in the group even when 0 and 2 are farther apart than `maxDistance`.

`mushroomStrands` pairs mushrooms inside one group's `mushroomIndices` only. `length` on a strand is the ground distance of that one link. A strand between two mushrooms, and a strand from a mushroom to a root, both use that field.

## The fir loop

`closestMushroomToFirWithinMaxDistance` is the closest mushroom to the fir being checked, when that gap is within `maxDistance`. It is not a placement. It is:

```js
{
  mushroomIndex,
  mushroomFirDistance,
  individualId,
}
```

`mushroomFirDistance` is that ground gap. It used to be called `length` on this object, which read like an array length. The number is still passed into `strand` as the strand's `length`.

If the variable is still `null` after every mushroom is checked, the fir stays out of every individual. Otherwise the fir's index is appended to that individual's `treeIndices` and `rootIndices`, and a mushroom-to-root strand is added.

## Removed files

`src/debug/CameraDebug.jsx` and `src/lib/usePersistedControls.js` had no imports left in the scene. `Experience` frames the forest with `OrbitControls` directly. `pickNearestMushroom.js` stays: `ScatteredMushrooms` uses it for the click and the hand cursor.

## Lesson added earlier in this work

`lessons/network/reveal-one-individual.html` is the pseudocode lesson for the line, the click, the hand cursor, and `ForestOrbit`. It is linked from the network list and from `one-species-many-individuals.html`. Those scene files are not built yet.
