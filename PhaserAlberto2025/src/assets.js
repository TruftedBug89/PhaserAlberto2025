export default {
    // 'audio': {
    //     score: {
    //         key: 'sound',
    //         args: ['assets/sound.mp3', 'assets/sound.m4a', 'assets/sound.ogg']
    //     },
    // },
    // 'image': {
    //     spikes: {
    //         key: 'spikes',
    //         args: ['assets/spikes.png']
    //     },
    // },
    'spritesheet': {
        ships: {
            key: 'ships',
            args: ['assets/ships.png', {
                frameWidth: 64,
                frameHeight: 64,
            }]
        },
        tiles: {
            key: 'tiles',
            args: ['assets/tiles.png', {
                frameWidth: 32,
                frameHeight: 32
            }]
        },
        tiles2: {
            key: 'tiles2',
            args: ['assets/tiles2.png', {
                frameWidth: 32,
                frameHeight: 32
            }]
        },
        moneda: {
            key: 'moneda',
            args: ['assets/moneda.png', {
                frameWidth: 100,   // 567 ÷ 8 columnes
                frameHeight: 100   // 271px ÷ 3 files
            }]
        },
    }
};