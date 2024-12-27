export const IMAGES_BIRD = [
  { url: "https://image.ibb.co/by5TQQ/font.png", name: "pixelFont", img: null },
  {
    url: "https://image.ibb.co/kiYF5Q/oiseau.png",
    name: "bird",
    spriteCount: 6,
    row: 4,
    animationSpeed: 0.6,
    img: null,
  },
  {
    url: "https://image.ibb.co/mvORC5/effets.png",
    name: "effects",
    spriteCount: 7,
    row: 3,
    animationSpeed: 0.6,
    img: null,
  },
  { url: "https://image.ibb.co/hCPoQQ/feuille.png", name: "leaf", img: null },
  {
    url: "https://image.ibb.co/dojBek/piece.png",
    name: "coin",
    spriteCount: 6,
    img: null,
  },
  { url: "https://image.ibb.co/gU7a5Q/motif.png", name: "pattern", img: null },
];
export const alphabets =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ?!:',.()<>[]";

export const parameters = {
  size: 8,
  zoom: 4,

  tileDefinitions: [
    { type: "tile", name: "empty", id: 0, isCollidable: true },
    {
      type: "tile",
      name: "wall",
      id: 1,
      isCollidable: false,
      appearance: "auto",
      row: 1,
    },
    {
      type: "tile",
      name: "background",
      id: 2,
      isCollidable: false,
      appearance: 0,
    },
    {
      type: "tile",
      name: "spikeTop",
      id: 3,
      isCollidable: false,
      appearance: 2,
      action: "isDead",
    },
    {
      type: "tile",
      name: "spikeBottom",
      id: 4,
      isCollidable: false,
      appearance: 3,
      action: "isDead",
    },
    {
      type: "tile",
      name: "spikeLeft",
      id: 5,
      isCollidable: false,
      appearance: 4,
      action: "isDead",
    },
    {
      type: "tile",
      name: "spikeRight",
      id: 6,
      isCollidable: false,
      appearance: 5,
      action: "isDead",
    },
    {
      type: "sprite",
      name: "next",
      id: 7,
      isCollidable: false,
      action: "bonus",
      appearance: "coin",
      row: 1,
      animationSpeed: 0.2,
    },
  ],
};

export const levels = [
  {
    name: "lvl1",
    geometry: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0, 0, 0],
      [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
      [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
      [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
      [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
      [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
      [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
      [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
      [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
      [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
      [0, 0, 0, 1, 4, 4, 4, 4, 4, 4, 4, 4, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },
];
