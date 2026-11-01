const mushroomTaxonomy = [
  { label: 'Common name', value: 'Fly agaric', emphasis: 'bold' },
  { label: 'Scientific name', value: 'Amanita muscaria', emphasis: 'italic' },
  { label: 'Species', value: 'A. muscaria', emphasis: 'italic' },
  { label: 'Genus', value: 'Amanita', emphasis: 'italic' },
  { label: 'Family', value: 'Amanitaceae', emphasis: 'italic' },
  { label: 'Order', value: 'Agaricales', emphasis: 'italic' },
  { label: 'Class', value: 'Agaricomycetes', emphasis: 'italic' },
  { label: 'Division', value: 'Basidiomycota', emphasis: 'italic' },
  { label: 'Kingdom', value: 'Fungi', emphasis: 'italic' },
]

const firTaxonomy = [
  { label: 'Common name', value: 'Fir', emphasis: 'bold' },
  { label: 'Scientific name', value: 'Abies', emphasis: 'italic' },
  { label: 'Genus', value: 'Abies', emphasis: 'italic' },
  { label: 'Family', value: 'Pinaceae', emphasis: 'italic' },
  { label: 'Order', value: 'Pinales', emphasis: 'italic' },
  { label: 'Class', value: 'Pinopsida', emphasis: 'italic' },
  { label: 'Division', value: 'Pinophyta', emphasis: 'italic' },
  { label: 'Clade', value: 'Gymnospermae', emphasis: 'italic' },
  { label: 'Clade', value: 'Tracheophytes', emphasis: 'italic' },
  { label: 'Kingdom', value: 'Plantae', emphasis: 'italic' },
]

export const chapters = [
  {
    id: 'enter-the-forest',
    title: 'Enter the forest',
    body: 'The forest is alive — and so are the fungi beneath your feet. Look around.',
    action: {
      label: 'Move your cursor or swipe to look around.',
    },
  },
  {
    id: 'meet-the-mushroom',
    title: 'Meet the mushroom',
    body: mushroomTaxonomy,
    'extra-info': mushroomTaxonomy,
    source: {
      label: 'Wikipedia - Amanita muscaria',
      url: 'https://en.wikipedia.org/wiki/Amanita_muscaria',
    },
    habitat: `habitat
Temperate and boreal forests of the Northern Hemisphere, often with birch, pine, spruce, and fir. Also introduced in parts of the Southern Hemisphere.`,
    uses: `Caps crumbled into milk to trap flies
Ritual intoxicant in parts of Siberia and northern Europe
Red pigment taken from the cap in folk craft`,
    credits: {
      text: 'Timothy Hsu - Fly Agaric Mushroom',
      url: 'https://sketchfab.com/3d-models/fly-agaric-mushroom-d6c3876f091b4de49a38553a177bab0f',
    },
  },
  {
    id: 'meet-the-firs',
    title: 'Meet the firs',
    body: firTaxonomy,
    'extra-info': firTaxonomy,
    source: {
      label: 'Wikipedia - Fir',
      url: 'https://en.wikipedia.org/wiki/Fir',
    },
    habitat: `habitat
Cool, moist mountain forests of North and Central America, Europe, Asia, and North Africa.`,
    uses: `Timber for building and interiors
Christmas trees
Resin and paper pulp`,
    credits: {
      text: 'evolveduk - Fir tree',
      url: 'https://sketchfab.com/3d-models/fir-tree-3f39aa5485e94477a36b435f7a1a8b54',
    },
  },
  {
    id: 'fungal-individual',
    title: 'Did you know that...',
    body: {
      text: 'Mushrooms growing close together can be one fungus, not many. That organism is a fungal individual and contains:',
      contains: [
        'the mushrooms that belong to it',
        'the firs near enough to join them',
        'the roots of those firs',
        'the mycelium strands that connect them',
      ],
      note: 'Click or tap any mushroom to discover the fungal individual.',
    },
  },
  {
    id: 'reflection',
    title: 'Reflect on the World Wide Web',
    body: "The forest is more than what you see. It's a network of life, connection and constant exchange. Look around again and take in the full picture",
    action: {
      icon: 'eye',
      label: 'Look around again and take in the full picture.',
    },
  }
  /*
  {
    id: 'follow-the-spores',
    title: 'Follow the spores',
    body: 'The camera will move with the spores, revealing a hidden path through the forest.',
    action: {
      icon: 'hand',
      label: 'Click and drag to follow the spores.',
    },
  },
  {
    id: 'discover-the-ground',
    title: 'Discover the ground',
    body: 'Reveal the mycelium network beneath the surface.',
    action: {
      icon: 'arrow',
      label: 'Move closer to the ground to see the network.',
    },
  },
  {
    id: 'connect-the-trees',
    title: 'Connect the trees',
    body: 'Follow the glowing mycelium to see how it connects the forest. Click a node to send a signal through the network.',
  },
  {
    id: 'watch-the-signal',
    title: 'Watch the signal',
    body: 'The signal travels through the mycelium, reaching other trees and living organisms. See how everything is connected.',
  },
  {
    id: 'examine-the-spore',
    title: 'Examine the spore',
    body: 'A spore can grow, spread, and start new life.',
    action: {
      icon: 'hand',
      label: 'Tap a spore to activate it.',
    },
  },
  {
    id: 'the-cycle-continues',
    title: 'The cycle continues',
    body: 'The spore grows, releases new spores, and the network expands. New mushrooms can emerge, continuing the cycle.',
    action: {
      icon: 'eye',
      label: 'Watch how one spore creates new life.',
    },
  },
  {
    id: 'zoom-in-optional',
    title: 'Zoom in (optional)',
    body: 'Follow a spore into a microscopic world to see the structure up close.',
    action: {
      icon: 'zoom',
      label: 'Click a spore to zoom in.',
    },
  },
  {
    id: 'the-bigger-picture',
    title: 'The bigger picture',
    body: 'Return to the forest and see how all the pieces work together — from the mushroom to the trees, from the forest to the microscopic world.',
    action: {
      icon: 'explore',
      label: 'Explore the cycle.',
    },
  },
  */
]
