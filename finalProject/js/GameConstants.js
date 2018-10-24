//////////////////////////////////////////////constants used in Game.js////////////////////////////////////////////////////
const trackMap = [
    { type: 'straight', number: 100, curvature: 0 },
    { type: 'curve', number: 300, curvature: -65 },
    { type: 'straight', number: 300, curvature: 0 },
    { type: 'curve', number: 300, curvature: 65 },
    { type: 'curve', number: 300, curvature: 20 },
    { type: 'straight', number: 300, curvature: 0 },
    { type: 'curve', number: 300, curvature: -65 },
    { type: 'straight', number: 300, curvature: 0 },
    { type: 'curve', number: 300, curvature: 65 },
    { type: 'straight', number: 300, curvature: 0 },
];

const TOTAL_LENGTH_OF_ROAD = function () {
    let total = 0;
    for (let i = 0; i < trackMap.length - 1; i++)
        total += trackMap[i].number;

    //140 is added as we havent added the last sector
    return total + 140;
}();

//position of sprite in the spritesheet
const CAR_CENTRE = {
    x: 0,
    y: 130,
    w: 69,
    h: 38
};

const CAR_LEFT = {
    x: 70,
    y: 130,
    w: 77,
    h: 38
};

const CAR_RIGHT = {
    x: 148,
    y: 130,
    w: 77,
    h: 38
};

//game Sounds
const CAR_ACCELERATE = createSoundObject('../sounds/main-engine.wav');
const CAR_DECELERATE = createSoundObject('../sounds/car+geardown.mp3');
const CAR_SKID = createSoundObject('../sounds/skid.wav');
const CAR_START = createSoundObject('../sounds/carstartgarage.mp3');


//////////////////////////////////////////////constants used in Player.js////////////////////////////////////////////////////
const MAX_SPEED = 950;
const OFF_ROAD_MAX_SPEED = MAX_SPEED / 4;
const ACCELERATION = MAX_SPEED / 150;
const BREAKING = -MAX_SPEED / 30;
const DECELERATION = -MAX_SPEED / 140;
const TURNING_SPEED = 0.03;

const MAX_NITRO = 400;


//////////////////////////////////////////////constants used in Road.js////////////////////////////////////////////////////
const ROAD_PARAM = {
    WIDTH: 9000,
    SEGMENT_LENGTH: 550,  // length of a single segment
    SIDE_STRIP_LENGTH: 3,  // number of segments per red/white sideStrip strip
    NO_OF_LANES: 4,
    CAMERA_HEIGHT: 4400,       // z height of camera
    CAMERA_DEPTH: 0.2,           // z distance camera is from the screen 
    NO_OF_SEG_TO_DRAW: 150,      //number of seg we draw at a time
    COLORS: [
        { road: '#696969', grass: '#097D04', sideStrip: 'red', lane: 'white' },
        { road: '#696969', grass: '#066102', sideStrip: 'white' },
    ],
    CANVAS_WIDTH: 1920,
    CANVAS_HEIGHT: 1080
}

const TREES = [
    { img: '../images/tree.png', width: 64, height: 154 },
    { img: '../images/tree2.png', width: 62, height: 95 }
];
