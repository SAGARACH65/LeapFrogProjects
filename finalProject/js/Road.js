const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 768;

const ROAD_WIDTH = 6500;
const SEGMENT_LENGTH = 450;  // length of a single segment
const SIDE_STRIP_LENGTH = 3;                       // number of  this.segments per red/white sideStrip strip

const LANES = 4;
const FIELD_OF_VIEW = 100;     // angle in degrees for field of view
const CAMERA_HEIGHT = 9000;       // z CANVAS_HEIGHT of camera
const CAMERA_DEPTH = 1;                  // z distance camera is from screen 
const NO_OF_SEG_TO_DRAW = 300;

const COLORS = {
    LIGHT: { road: '#696969', grass: '#10AA10', sideStrip: 'red', lane: 'white' },
    DARK: { road: '#696969', grass: '#009A00', sideStrip: 'white' },
    START: { road: 'white', grass: 'white', sideStrip: 'white' },
    FINISH: { road: 'black', grass: 'black', sideStrip: 'black' }
};


class Road {

    constructor() {
        // this.segments are the elements joined to form the road
        this.segments = [];

        //550  this.segments are drawn as it produced the best result than fewer segments
        for (let n = 0; n < 550; n++) {
            this.segments.push({
                index: n,
                p1: { world: { z: n * SEGMENT_LENGTH }, camera: {}, screen: {} },
                p2: { world: { z: (n + 1) * SEGMENT_LENGTH }, camera: {}, screen: {} },
                color: Math.floor(n / SIDE_STRIP_LENGTH) % 2 ? COLORS.DARK : COLORS.LIGHT
            });
        }
    }

    makeSegments() {

        this.segments[this.findSegment(playerZ).index + 2].color = COLORS.START;
        this.segments[this.findSegment(playerZ).index + 3].color = COLORS.START;
        for (let n = 0; n < SIDE_STRIP_LENGTH; n++)
            this.segments[this.segments.length - 1 - n].color = COLORS.FINISH;

    }

    drawRoad(ctx, position, playerX) {
        let baseSegment = this.findSegment(position);

        let maxy = CANVAS_HEIGHT;
        let n, segment;
        for (n = 0; n < NO_OF_SEG_TO_DRAW; n++) {

            segment = this.segments[(baseSegment.index + n) % this.segments.length];

            this.project(segment.p1, (playerX * ROAD_WIDTH), CAMERA_HEIGHT, position, CAMERA_DEPTH, CANVAS_WIDTH, CANVAS_HEIGHT, ROAD_WIDTH);
            this.project(segment.p2, (playerX * ROAD_WIDTH), CAMERA_HEIGHT, position, CAMERA_DEPTH, CANVAS_WIDTH, CANVAS_HEIGHT, ROAD_WIDTH);

            if ((segment.p1.camera.z <= CAMERA_DEPTH) || // behind us
                (segment.p2.screen.y >= maxy))          // clip by (already rendered) segment
                continue;

            this.renderSegment(ctx, CANVAS_WIDTH, LANES,
                segment.p1.screen.x,
                segment.p1.screen.y,
                segment.p1.screen.w,
                segment.p2.screen.x,
                segment.p2.screen.y,
                segment.p2.screen.w,
                segment.color);

            maxy = segment.p2.screen.y;
        }
    }

    project(p, cameraX, cameraY, cameraZ, CAMERA_DEPTH, CANVAS_WIDTH, CANVAS_HEIGHT, ROAD_WIDTH) {

        p.camera.x = (p.world.x || 0) - cameraX;
        p.camera.y = (p.world.y || 0) - cameraY;
        p.camera.z = (p.world.z || 0) - cameraZ;

        p.screen.scale = CAMERA_DEPTH / p.camera.z;

        p.screen.x = Math.round((CANVAS_WIDTH / 2) + (p.screen.scale * p.camera.x * CANVAS_WIDTH / 2));
        p.screen.y = Math.round((CANVAS_HEIGHT / 2) - (p.screen.scale * p.camera.y * CANVAS_HEIGHT / 2));
        p.screen.w = Math.round((p.screen.scale * ROAD_WIDTH * CANVAS_WIDTH / 2));
    }

    renderSegment(ctx, CANVAS_WIDTH, LANES, x1, y1, w1, x2, y2, w2, color) {
        let r1 = this.sideStripWidth(w1, LANES),
            r2 = this.sideStripWidth(w2, LANES),
            l1 = this.laneMarkerWidth(w1, LANES),
            l2 = this.laneMarkerWidth(w2, LANES),
            lanew1, lanew2, lanex1, lanex2, lane;

        ctx.fillStyle = color.grass;
        ctx.fillRect(0, y2, CANVAS_WIDTH, y1 - y2);

        drawPolygon(ctx, x1 - w1 - r1, y1, x1 - w1, y1, x2 - w2, y2, x2 - w2 - r2, y2, color.sideStrip);
        drawPolygon(ctx, x1 + w1 + r1, y1, x1 + w1, y1, x2 + w2, y2, x2 + w2 + r2, y2, color.sideStrip);
        drawPolygon(ctx, x1 - w1, y1, x1 + w1, y1, x2 + w2, y2, x2 - w2, y2, color.road);

        //width and x posiiton of the starting lane
        lanew1 = w1 * 2 / LANES;
        lanex1 = x1 - w1 + lanew1;

        lanew2 = w2 * 2 / LANES;
        lanex2 = x2 - w2 + lanew2;

        //drawing the strips on the road
        for (lane = 1; lane < LANES; lane++) {
            drawPolygon(ctx, lanex1 - l1 / 2, y1, lanex1 + l1 / 2, y1, lanex2 + l2 / 2, y2, lanex2 - l2 / 2, y2, color.lane);
            lanex1 += lanew1;
            lanex2 += lanew2;
        }
    }

    sideStripWidth(projectedRoadWidth, LANES) { return projectedRoadWidth / Math.max(3, 2 * LANES); }
    laneMarkerWidth(projectedRoadWidth, LANES) { return projectedRoadWidth / Math.max(32, 8 * LANES); }

    findSegment(z) {
        return this.segments[Math.floor(z / SEGMENT_LENGTH) % this.segments.length];
    }
}