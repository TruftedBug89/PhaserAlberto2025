import ASSETS from './assets.js';

export default {
    'explosion': 
    {
        key: 'explosion',
        texture: ASSETS.spritesheet.tiles.key,
        frameRate: 10,
        config: { start: 4, end: 8 },
    },
    // animacio de la moneda
    moneda: {
        key: 'moneda',
        texture: ASSETS.spritesheet.moneda.key,
        frameRate: 12,         // velocitat d’animació
        config: { start: 2,    // saltem els dos primers (text “PIXEL COIN”)
                end: 11 },    // fins a l’últim fotograma
        repeat: -1             // bucle infinit
    },
};