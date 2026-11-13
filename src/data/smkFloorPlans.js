// src/data/smkFloorPlans.js
//
// Data-driven SMK floor plans. All geometry is expressed in the pixel
// coordinates of the source plan images and positioned in the shared
// viewBox with a per-level `transform`, so every tab has identical bounds.
//
// NOTE: the geometry was hand-traced from rough plans. To refine it, replace
// the `d` strings below with exact paths; the template never needs to change.
//
// Level "first" has no plan yet (planAvailable: false). Add its geometry
// here when the plan exists and set planAvailable to true.

export const VIEWBOX = '0 0 1300 620'

const rect = (x1, y1, x2, y2) => `M${x1} ${y1}H${x2}V${y2}H${x1}Z`

const poly = (...p) => {
  let d = `M${p[0]} ${p[1]}`
  for (let i = 2; i < p.length; i += 2) d += `L${p[i]} ${p[i + 1]}`
  return `${d}Z`
}

// Numbered gallery/room on a level. placeId is derived from the room number.
const room = (number, d, x, y, extra = {}) => ({
  placeId: `room-${number.toLowerCase()}`,
  number,
  label: number,
  d,
  x,
  y,
  ...extra,
})

export const levels = [
  // ---------------------------------------------------------------- Level 0
  {
    id: 'ground',
    planAvailable: true,
    transform: 'translate(-19 -235) scale(2.2)',
    labelSize: 12,
    shell: ['M136 190H390V330H368V313H352V222H345V335H175V345H136Z'],
    spaces: [rect(390, 290, 442, 328)],
    bridges: [],
    voids: [],
    fixtures: [rect(311, 238, 330, 264)],
    icons: [],
    rooms: [
      {
        placeId: 'wc-ground',
        label: '',
        d: rect(172, 152, 355, 190),
        x: 264,
        y: 171,
        icon: { type: 'wc', x: 264, y: 171, r: 26 },
      },
      {
        placeId: 'biograf',
        label: 'Biograf',
        d: rect(390, 152, 472, 264),
        x: 431,
        y: 212,
      },
      {
        placeId: 'lockers',
        label: 'Garderobe',
        d: poly(178, 220, 302, 220, 302, 274, 340, 274, 340, 333, 198, 333, 198, 274, 178, 274),
        x: 269,
        y: 306,
      },
    ],
  },

  // ---------------------------------------------------------------- Level 1
  {
    id: 'first',
    planAvailable: false,
    transform: '',
    labelSize: 26,
    shell: [],
    spaces: [],
    bridges: [],
    voids: [],
    fixtures: [],
    icons: [],
    rooms: [],
  },

  // ---------------------------------------------------------------- Level 2
  {
    id: 'second',
    planAvailable: true,
    transform: '',
    labelSize: 26,
    shell: [
      // Upper (angled) wing
      poly(145, 139, 520, 139, 520, 88, 1275, 192, 1275, 210, 1205, 215, 1205, 258, 205, 258, 205, 196, 145, 150),
      // Lower (main) wing
      rect(200, 320, 1152, 572),
    ],
    // Unlabelled spaces (corridors, cores, hatched areas)
    spaces: [
      rect(245, 370, 318, 522),
      rect(1035, 372, 1105, 517),
      rect(325, 200, 350, 258),
      rect(365, 200, 420, 258),
      rect(845, 200, 985, 256),
      rect(520, 200, 555, 258),
      rect(797, 200, 830, 258),
      rect(565, 330, 595, 545),
      rect(752, 330, 785, 545),
      rect(595, 516, 752, 545),
    ],
    bridges: [rect(525, 258, 550, 330), rect(805, 258, 822, 330)],
    voids: [rect(595, 410, 752, 516)],
    fixtures: [],
    icons: [
      { type: 'stairs', x: 1138, y: 376, r: 22 },
      { type: 'lift', x: 723, y: 462, r: 22 },
    ],
    rooms: [
      // Upper wing
      room('260', poly(145, 139, 213, 139, 213, 196, 150, 152), 182, 162),
      room('261', rect(213, 139, 358, 200), 292, 167),
      room('262', rect(358, 138, 520, 200), 437, 172),
      room('272', rect(205, 200, 295, 258), 250, 229),
      room('270B', rect(420, 200, 500, 258), 460, 230),
      room('263B', poly(555, 93, 680, 110, 680, 200, 555, 200), 615, 170),
      room('263C', poly(680, 110, 795, 126, 795, 200, 680, 200), 735, 163),
      room('269A', rect(575, 215, 688, 257), 632, 238),
      room('269B', rect(688, 215, 775, 257), 732, 238),
      room('264', poly(830, 131, 995, 153, 995, 200, 830, 200), 910, 178),
      room('265', poly(995, 153, 1065, 163, 1065, 200, 995, 200), 1018, 180),
      room('266', poly(1065, 163, 1275, 192, 1275, 210, 1205, 215, 1205, 252, 1065, 252), 1130, 217),
      // Lower wing, west side
      room('223', rect(205, 322, 278, 410), 222, 392),
      room('224', rect(205, 410, 245, 492), 222, 450),
      room('226', rect(205, 522, 278, 570), 240, 547),
      room('220', rect(318, 335, 400, 375), 358, 358),
      room('219', rect(400, 335, 478, 375), 438, 358),
      room('218A', rect(478, 335, 560, 375), 530, 358),
      room('217F', rect(318, 378, 440, 476), 345, 430),
      room('217A', rect(440, 378, 560, 476), 530, 430),
      room('227', rect(318, 480, 400, 530), 358, 507),
      room('228', rect(400, 480, 478, 530), 438, 507),
      room('229', rect(478, 480, 560, 530), 518, 507),
      // Lower wing, centre
      room('214', rect(595, 310, 752, 378), 675, 347),
      // Lower wing, east side
      room('211B', rect(790, 335, 870, 375), 810, 358),
      room('210A', rect(870, 335, 1030, 375), 930, 358),
      room('208B', rect(1032, 310, 1148, 372), 1065, 342),
      room('201B', rect(790, 378, 910, 476), 878, 428),
      room('201E', rect(910, 378, 1032, 476), 1000, 428),
      room('202', rect(790, 480, 870, 530), 830, 507),
      room('203', rect(870, 480, 950, 530), 910, 507),
      room('204', rect(950, 480, 1035, 530), 990, 505),
      room('207', rect(1105, 375, 1150, 515), 1127, 447),
      room('206', rect(1060, 518, 1150, 568), 1105, 543),
    ],
  },
]

// ------------------------------------------------------------------ Places
// `name` / `description` are English fallbacks; i18n keys under
// places.<id>.* take priority when they exist.

export const zones = [
  {
    id: 'european-art',
    kind: 'zone',
    levelId: 'ground',
    name: 'European Art 1300–1800',
    description:
      'Explore European paintings and sculpture from the late medieval period through the eighteenth century.',
  },
  {
    id: 'danish-golden-age',
    kind: 'zone',
    levelId: 'first',
    name: 'Danish Golden Age',
    description:
      'Discover the artists and changing cultural life of Denmark in the early nineteenth century.',
  },
  {
    id: 'modern-art',
    kind: 'zone',
    levelId: 'second',
    name: 'Modern Art',
    description: 'Move through modern and contemporary works from Denmark and around the world.',
  },
]

export const facilities = [
  {
    id: 'lockers',
    kind: 'facility',
    levelId: 'ground',
    name: 'Cloakroom and lockers',
    description: 'Find the cloakroom area and check with staff for current locker access.',
  },
  {
    id: 'cafe',
    kind: 'facility',
    levelId: 'first',
    name: 'Café',
    description: 'Take a pause at the museum café; ask staff for current service information.',
  },
  {
    id: 'restrooms',
    kind: 'facility',
    levelId: 'second',
    name: 'Restrooms',
    description: 'Use the museum signs to find the nearest restroom from your current gallery.',
  },
  {
    id: 'wc-ground',
    kind: 'facility',
    levelId: 'ground',
    name: 'Restrooms (ground level)',
    description: 'Restrooms next to the cloakroom on the ground level.',
  },
  {
    id: 'biograf',
    kind: 'facility',
    levelId: 'ground',
    name: 'Cinema (Biograf)',
    description: 'The museum cinema on the ground level.',
  },
]

// Every numbered room on the plans becomes a selectable place automatically.
const known = new Set([...zones, ...facilities].map((p) => p.id))
const generated = []
for (const level of levels) {
  for (const r of level.rooms) {
    if (r.placeId && !known.has(r.placeId)) {
      known.add(r.placeId)
      generated.push({
        id: r.placeId,
        kind: 'room',
        levelId: level.id,
        number: r.number,
        name: r.label,
        description: '',
      })
    }
  }
}

export const places = [...zones, ...facilities, ...generated]
