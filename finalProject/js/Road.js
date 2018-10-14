const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 768;

const ROAD_WIDTH = 6500;
const SEGMENT_LENGTH = 450;  // length of a single segment
const SIDE_STRIP_LENGTH = 3;  // number of segments per red/white sideStrip strip

const LANES = 4;
const CAMERA_HEIGHT = 3400;       // z height of camera
const CAMERA_DEPTH = 1;           // z distance camera is from the screen 
const NO_OF_SEG_TO_DRAW = 300;//number of seg we draw before reinitializing the camera

const COLORS = [
    { road: '#696969', grass: '#10AA10', sideStrip: 'red', lane: 'white' },
    { road: '#696969', grass: '#009A00', sideStrip: 'white' },
];

class Road {

    constructor() {
        // this.segments are the elements joined to form the road
        this.segments = [];

        //550  this.segments are drawn as it produced the best result than fewer segments
        for (let n = 0; n < 550; n++) {
            this.segments.push({
                index: n,
                ///each segment is constrcuted of two points p1 and p2 which are the two opposite ends 
                p1: {
                    world: { x: 0, y: 0, z: n * SEGMENT_LENGTH },
                    camera: { x: 0, y: 0, z: 0 },
                    screen: { x: 0, y: 0 }
                },
                p2: {
                    world: { x: 0, y: 0, z: (n + 1) * SEGMENT_LENGTH },
                    camera: { x: 0, y: 0, z: 0 },
                    screen: { x: 0, y: 0 }
                },
                color: Math.floor(n / SIDE_STRIP_LENGTH) % 2 ? COLORS[0] : COLORS[1]
            });
        }
    }

    initializeSegments() {
        //create checker boardpattern later here 
    }


    drawRoad(ctx, position, playerX) {
        let baseSegment = this.findSegment(position);

        let maxHeight = CANVAS_HEIGHT;
        let n, segment;
        for (n = 0; n < NO_OF_SEG_TO_DRAW; n++) {

            segment = this.segments[(baseSegment.index + n) % this.segments.length];


            this.project(segment.p1, (playerX * ROAD_WIDTH), CAMERA_HEIGHT, position, CAMERA_DEPTH, CANVAS_WIDTH, CANVAS_HEIGHT, ROAD_WIDTH);
            this.project(segment.p2, (playerX * ROAD_WIDTH), CAMERA_HEIGHT, position, CAMERA_DEPTH, CANVAS_WIDTH, CANVAS_HEIGHT, ROAD_WIDTH);

            //the segments that are behind us doont need to be rendered
            if ((segment.p2.screen.y >= maxHeight))
                continue;

            this.renderSegment(ctx, CANVAS_WIDTH, LANES, segment.p1.screen.x, segment.p1.screen.y,
                segment.p1.screen.w, segment.p2.screen.x, segment.p2.screen.y, segment.p2.screen.w,
                segment.color);

            maxHeight = segment.p2.screen.y;
        }
    }

    project(p, cameraX, cameraY, cameraZ, CAMERA_DEPTH, CANVAS_WIDTH, CANVAS_HEIGHT, ROAD_WIDTH) {

        //translation the workd coordinates into camera coordiantes
        p.camera.x = p.world.x - cameraX;
        p.camera.y = p.world.y - cameraY;
        p.camera.z = p.world.z - cameraZ;

        p.screen.scale = CAMERA_DEPTH / p.camera.z;


        //combination of projection from cmaera coordiantes to projection plane and 
        //scaling the projected cordinates to physical screen coordinates
        p.screen.x = Math.round((CANVAS_WIDTH / 2) + (p.screen.scale * p.camera.x * CANVAS_WIDTH / 2));
        p.screen.y = Math.round((CANVAS_HEIGHT / 2) - (p.screen.scale * p.camera.y * CANVAS_HEIGHT / 2));
        p.screen.w = Math.round((p.screen.scale * ROAD_WIDTH * CANVAS_WIDTH / 2));
    }

    renderSegment(ctx, CANVAS_WIDTH, LANES, x1, y1, w1, x2, y2, w2, color) {
        let r1 = this.sideStripWidth(w1, LANES),
            r2 = this.sideStripWidth(w2, LANES),
            l1 = this.laneMarkerWidth(w1, LANES),
            l2 = this.laneMarkerWidth(w2, LANES);

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

    sideStripWidth(projectedRoadWidth, LANES) { return projectedRoadWidth / Math.max(3, 2 * LANES); }
    laneMarkerWidth(projectedRoadWidth, LANES) { return projectedRoadWidth / Math.max(32, 8 * LANES); }

    //finds the segment depending on the z value provided
    findSegment(z) {
        return this.segments[Math.floor(z / SEGMENT_LENGTH) % this.segments.length];
    }
}