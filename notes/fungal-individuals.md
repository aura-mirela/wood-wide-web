# Fungal individuals — decisions and what was built

Notes from the design conversation, up through the line attempt. The line pass was undone because the scene stayed black. This file does not change any code.

Lessons that match this:

- `lessons/network/fungal-individuals.html`
- `lessons/network/one-species-many-individuals.html`

## Nature

A mushroom is a fruiting body. It is to the fungus what an apple is to an apple tree. The organism is the underground individual: one connected mycelium, the mushrooms it fruits, and the fir roots it is attached to.

Every mushroom in the scene is a fly agaric (`Amanita muscaria`). Fly agaric is ectomycorrhizal and does partner with firs. The caps stay one model. Two fly agarics next to each other can still be two individuals. Their hyphae do not fuse, so network A never grows into network B.

The trade happens at the roots. The fungus passes water and minerals into the root. The fir passes sugars into the fungus there. Mycelium does not climb the trunk as that highway. Arrows on the bark, later, are the tree’s own path (minerals up, sugars down). Orange and cyan are reserved for that exchange. They are not individual colors.

A fir can host more than one fungus in a real forest. This scene keeps each fir with one individual, so a click has one answer.

## Behavior we agreed

The individual already exists when the scene loads. A click does not form it. A click reveals it.

On load, `assignFungalIndividuals` builds the list and keeps it in memory. No mycelium line is in the scene yet.

Example. Mushrooms 1, 2, and 3 belong to individual A, with firs 4 and 6. Mushrooms 4 and 5 belong to individual B, with fir C.

- Click mushroom 2. Reveal A: its mycelium lines, and the root flares under firs 4 and 6. Mushrooms 1, 2, and 3 stop breathing and stay at resting size.
- Mushrooms 4 and 5 keep the same pulse, even if one of them is the nearest mushroom in the scene.
- Click mushroom 4 later. Reveal B on its own. A stays revealed: its mushrooms stay still, and its lines stay. B’s lines are added.

Breathing is one shared pulse for the whole forest (`BREATH_AMPLITUDE` 0.4, `BREATH_SPEED` 2.5, phase `index * 1.73`). Individuals do not get different speeds or different amounts of growth. That would label the groups before the click. The caps are supposed to look like one species until the reveal.

The camera moves on the same click. `OrbitControls` in `Experience.jsx` is locked to a horizon view (`minPolarAngle` and `maxPolarAngle` are both `1.51`, target `[-2, 1, -3.5]`, distance 12–16). Lines on the soil would be edge-on from there. The click eases the target onto the clicked mushroom, shortens the distance, and lowers the polar angle so the patch is seen from above.

## How a patch is chosen

Proximity, in world units, on the ground plane (`x` and `y` of the placement, elevation ignored). The number is the farthest gap that still counts as one individual.

The device chooses the number. The library only receives it. Same table as the old point web:

| Tier | Max distance |
| --- | --- |
| xs | 3.2 |
| sm | 2.9 |
| md | 2.7 |
| desktop | 3.5 |

`myceliumMaxDistanceForBreakpoints` in `src/lib/assignFungalIndividuals.js` maps the breakpoint flags to that table. `Terrain` calls it.

Mushrooms form connected components. Two mushrooms are in the same individual when you can walk from one to the other through gaps no larger than that distance. A chain does not also get a shortcut across the whole patch. A direct `myceliumStrand` is stored only when those two members are themselves within the distance.

A fir joins the individual of the nearest mushroom inside the same distance. A fir farther away than that stays out of every individual.

Indexes are positions in the placement arrays for this visit. The scatter seed changes on reload, so “mushroom 1” is not a permanent plant. It means index 1 in `mushroomPlacements` right now.

## The record

```js
{
  id: 'A',
  mushroomIndices: [0, 1, 2],
  treeIndices: [0],
  rootIndices: [0],
  myceliumStrands: [
    {
      from: { kind: 'mushroom', index: 0 },
      to: { kind: 'mushroom', index: 1 },
      length: 3,
    },
    {
      from: { kind: 'mushroom', index: 1 },
      to: { kind: 'root', index: 0 },
      length: 0.2,
    },
  ],
}
```

`length` is the ground distance of that one strand, in the same units as the terrain. It is not the length of the mushroom array. In one test, individual A had three mushrooms and a strand of length 3 because those mushrooms were placed 3 units apart.

`myceliumStrands` is the name to use. Each strand is one hypha: mushroom to mushroom, or mushroom to the root collar of a fir.

`rootIndices` are indexes into `treePlacements`, the same list `ScatteredFirTrees` uses. Index 0 is the first scattered fir, not a mushroom. The root flare is that fir’s wood. The fungus does not own it. The hyphae are attached to it. `treeIndices` and `rootIndices` hold the same fir indexes: one list for the tree, one list for the flare under it.

A checked layout (max distance 3.5):

- Mushrooms at x = 0, 3, 6 became individual A, with the fir at x = 3.2. Strands were 0→1, 1→2, and mushroom 1 → root 0. No strand from 0 to 2, because that gap is 6.
- Mushrooms at x = 20 and 23 became individual B, with the nearby fir.
- A fir at (50, 50) was left out.

## Root model

`public/models/fir_trunk._spruce_trunk.glb` is a photogrammetry scan (Sketchfab title “Fir trunk. Spruce trunk”, license CC-BY-NC-SA). The fir model is CC-BY. The file is one scan split into five chunks of about 65,000 vertices each, about 300,000 vertices together. The chunks are the same shape. All five have to be drawn. Look at the scan once: both a fir stump and a spruce stump may be in the mesh.

In scene space the fir stands from about y = 0 to y = 4.4. The scan hangs from about y = -0.09 to y = -2.17, is about 2.3 units wide (as wide as the whole fir), and its center is about 0.37 off the origin on X.

`ScatteredRootFlares` is a separate component from `ScatteredFirTrees`. Different GLB, its own scale (`ROOT_SCALE` 0.4 times the fir scale), a correction so the top center sits on the trunk axis, and a small lift (`ROOT_LIFT` 0.03) so the collar is just above the soil. Same placement position and `rotationY` as that fir. Not a second scatter.

## What is in the repo now

Still present, and wired:

- `src/lib/assignFungalIndividuals.js` — builds the list on load. `Terrain` calls it.
- `src/3d-components/ScatteredRootFlares.jsx` — instances the scan.
- `Terrain` passes **every** individual’s `rootIndices` concatenated together. That is the current code. It is also why the scene went black (below).

Still present, not mounted by `Terrain`:

- `src/3d-components/MyceliumNetwork.jsx`
- `src/lib/buildMyceliumConnections.js`
- `src/shaders/mycelium-network/vertex.glsl`
- `src/shaders/mycelium-network/fragment.glsl`

Those three were the old point web (“any mushroom within range”, up to five neighbors). They were deleted, then came back with the undo. `Terrain` does not import them. Mushrooms currently all breathe; the old expandable-mushroom list is not what drives the pulse.

Removed with the undo, not in the repo:

- `src/3d-components/MyceliumLines.jsx`
- The click that revealed an individual
- Resting size for the mushrooms of a revealed individual
- `FocusRig` and the polar-angle change in `Experience.jsx`

## The line, as it was about to work

One drei `<Line>` per `myceliumStrand` of a **revealed** individual. `worldUnits`, width about `0.045`. Points sampled along the ground with `getTerrainElevation`, plus `0.07`, with a small stable sideways bend. A mushroom end uses that mushroom’s placement. A root end uses that fir’s placement.

Colors were a warm set (`#ffc56a`, then nearby ambers), one per individual, so two revealed webs stay distinct. Not orange versus cyan.

Lines are not instanced. A revealed patch has a handful of strands. `<Line>` is one polyline each.

The click looked up the mushroom index in `mushroomIndices`, appended that individual id, drew its lines, stopped the breath on its mushrooms, and moved the camera. Other individuals stayed dark until their own click.

## Why the scene went black

`ScatteredRootFlares` was mounted for every colonized fir at once. On a medium screen that was 56 copies of the five-chunk scan. One frame was about 23 million triangles. The canvas never finished a frame, so it stayed black. The ground, firs, and mushrooms alone are about 855,000 triangles in that same view.

The line component was not what made the frame that heavy. It draws nothing until a click. The undo removed the line anyway, and the all-firs root mounting is still what `Terrain` does.

When this is retried: pass `rootIndices` only for individuals that have been revealed. Before the first click, pass an empty list so the scan is not instanced. A click should add the flares for that one individual only. Even then, one individual with many firs is still five meshes of ~300,000 vertices times that fir count. Keep the revealed set small.

## UI, not built

`StoryOverlay` stays the click-through frame (`pointer-events: none`). `StoryChapter` is the heading and paragraph. `Action` is the gesture. The two science cards are a new sibling, `ExchangeLegend`, shown only after an individual is revealed.

Before a reveal: title “Meet one individual”, body that every mushroom is a fly agaric and a click reveals one individual, action “Click a mushroom.”

After a reveal: title “See the exchange”, body that this fly agaric is one individual and its mycelium reaches these firs, action “Watch the flow.” Legend: Tree → Fungi, sugars from photosynthesis. Fungi → Tree, water and minerals from the soil.

## Still later

- Spores stay `THREE.Points`, with birth, drift, and fade. Not the mycelium line. The old point shader can move to that cloud.
- Trunk ribbons for the orange and cyan arrows. Not a `<Line>`.
- Per-individual mycelium color only matters once two individuals can be visible together. Caps stay identical.
