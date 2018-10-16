const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 768;

const ROAD_WIDTH = 6500;
const SEGMENT_LENGTH = 450;  // length of a single segment
const SIDE_STRIP_LENGTH = 3;  // number of segments per red/white sideStrip strip

const LANES = 4;
const CAMERA_HEIGHT = 3400;       // z height of camera
const CAMERA_DEPTH = 1;           // z distance camera is from the screen 
const NO_OF_SEG_TO_DRAW = 300;//number of seg we draw before reinitializing the camera
let i=1;
const COLORS = [
    { road: '#696969', grass: '#10AA10', sideStrip: 'red', lane: 'white' },
    { road: '#696969', grass: '#009A00', sideStrip: 'white' },
];

class Road {

    constructor() {
        // segments are the elements joined to form the road
        this.segments = [];

        //550  this.segments are drawn as it produced the best result than fewer segments
        for (let i = 0; i < 550; i++) {
            this.segments.push({
                index: i,
                ///each segment is constrcuted of two points p1 and p2 which are the two opposite ends 
                p1: {
                    worldCoordinates: { x: 0, y: 0, z: i * SEGMENT_LENGTH },
                    cameraCoordinates: { x: 0, y: 0, z: 0 },
                    screenCoordinates: { x: 0, y: 0 }
                },
                p2: {
                    worldCoordinates: { x: 0, y: 0, z: (i + 1) * SEGMENT_LENGTH },
                    cameraCoordinates: { x: 0, y: 0, z: 0 },
                    screenCoordinates: { x: 0, y: 0 }
                },
                color: Math.floor(i / SIDE_STRIP_LENGTH) % 2 ? COLORS[0] : COLORS[1]
            });
        }
    }

    initializeSegments() {
        //TODO create checker boardpattern later here 
    }

    drawRoad(ctx, position, playerX) {
        let baseSegment = this.findSegment(position);

        let maxHeight = CANVAS_HEIGHT;
        for (let n = 0; n < NO_OF_SEG_TO_DRAW; n++) {

            let segment = this.segments[(baseSegment.index + n)];

            this.project(segment.p1, (playerX * ROAD_WIDTH), CAMERA_HEIGHT, position, CAMERA_DEPTH, CANVAS_WIDTH, CANVAS_HEIGHT, ROAD_WIDTH);
            this.project(segment.p2, (playerX * ROAD_WIDTH), CAMERA_HEIGHT, position, CAMERA_DEPTH, CANVAS_WIDTH, CANVAS_HEIGHT, ROAD_WIDTH);

            //the segments that are behind us doont need to be rendered
            if ((segment.p2.screenCoordinates.y >= maxHeight)) continue;

            this.renderSegment(ctx, CANVAS_WIDTH, LANES, segment.p1.screenCoordinates.x, segment.p1.screenCoordinates.y,
                segment.p1.screenCoordinates.w, segment.p2.screenCoordinates.x, segment.p2.screenCoordinates.y, segment.p2.screenCoordinates.w,
                segment.color);

            maxHeight = segment.p2.screenCoordinates.y;
        }
    }

    project(p, cameraX, cameraY, cameraZ, CAMERA_DEPTH, CANVAS_WIDTH, CANVAS_HEIGHT, ROAD_WIDTH) {

        //translation the workd coordinates into camera coordiantes
        p.cameraCoordinates.x = p.worldCoordinates.x - cameraX;
      
        p.cameraCoordinates.y = p.worldCoordinates.y - cameraY;
        p.cameraCoordinates.z = p.worldCoordinates.z - cameraZ;

        p.screenCoordinates.scale = CAMERA_DEPTH / p.cameraCoordinates.z;

        //combination of projection from camera coordiantes to projection plane and 
        //scaling the projected cordinates to physical screen coordinates
        p.screenCoordinates.x = Math.round((CANVAS_WIDTH / 2) + (p.screenCoordinates.scale * p.cameraCoordinates.x * CANVAS_WIDTH / 2));
        p.screenCoordinates.y = Math.round((CANVAS_HEIGHT / 2) - (p.screenCoordinates.scale * p.cameraCoordinates.y * CANVAS_HEIGHT / 2));
        p.screenCoordinates.w = Math.round((p.screenCoordinates.scale * ROAD_WIDTH * CANVAS_WIDTH / 2));
    }

    renderSegment(ctx, CANVAS_WIDTH, LANES, x1, y1, w1, x2, y2, w2, color) {
        let r1 = w1 / 10, r2 = w2 / 10, l1 = w1 / 32, l2 = w2 / 32;

        let laneW1, laneW2, laneX1, laneX2;

        ctx.fillStyle = color.grass;
        ctx.fillRect(0, y2, CANVAS_WIDTH, y1 - y2);

        drawPolygon(ctx, x1 - w1 - r1, y1, x1 - w1, y1, x2 - w2, y2, x2 - w2 - r2, y2, color.sideStrip);
        drawPolygon(ctx, x1 + w1 + r1, y1, x1 + w1, y1, x2 + w2, y2, x2 + w2 + r2, y2, color.sideStrip);
        drawPolygon(ctx, x1 - w1, y1, x1 + w1, y1, x2 + w2, y2, x2 - w2, y2, color.road);

        //width and x positon of the starting lane
        laneW1 = w1 * 2 / LANES;
        laneX1 = x1 - w1 + laneW1;

        laneW2 = w2 * 2 / LANES;
        laneX2 = x2 - w2 + laneW2;

        //drawing the strips on the road
        for (let lane = 0; lane < LANES - 1; lane++) {
            drawPolygon(ctx, laneX1 - l1 / 2, y1, laneX1 + l1 / 2, y1, laneX2 + l2 / 2, y2, laneX2 - l2 / 2, y2, color.lane);
            laneX1 += laneW1;
            laneX2 += laneW2;
        }
    }

    //finds the segment depending on the z value provided
    findSegment(z) {
        return this.segments[Math.floor(z / SEGMENT_LENGTH) % this.segments.length];
    }
}