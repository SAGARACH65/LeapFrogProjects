const ROAD_PARAM = {
    WIDTH: 8500,
    SEGMENT_LENGTH: 550,  // length of a single segment
    SIDE_STRIP_LENGTH: 3,  // number of segments per red/white sideStrip strip
    NO_OF_LANES: 4,
    CAMERA_HEIGHT: 4400,       // z height of camera
    CAMERA_DEPTH: 0.2,           // z distance camera is from the screen 
    NO_OF_SEG_TO_DRAW: 150,      //number of seg we draw at a time
    COLORS: [
        { road: '#696969', grass: '#10AA10', sideStrip: 'red', lane: 'white' },
        { road: '#696969', grass: '#009A00', sideStrip: 'white' },
    ],
    CANVAS_WIDTH: 1024,
    CANVAS_HEIGHT: 768
}

class Road {

    constructor() {
        // segments are the elements joined to form the road
        this.segments = [];
    }

    initializeSegments(curve) {
        let i = this.segments.length;

        this.segments.push({
            ///each segment is constructed of two points p1 and p2 which are the two opposite ends 
            p1: {
                worldCoordinates: { x: 0, y: 0, z: i * ROAD_PARAM.SEGMENT_LENGTH },
                cameraCoordinates: { x: 0, y: 0, z: 0 },
                screenCoordinates: { x: 0, y: 0 }
            },
            p2: {
                worldCoordinates: { x: 0, y: 0, z: (i + 1) * ROAD_PARAM.SEGMENT_LENGTH },
                cameraCoordinates: { x: 0, y: 0, z: 0 },
                screenCoordinates: { x: 0, y: 0 }
            },
            curve: curve,
            color: Math.floor(i / ROAD_PARAM.SIDE_STRIP_LENGTH) % 2 ? ROAD_PARAM.COLORS[0] : ROAD_PARAM.COLORS[1]
        });

    }

    drawRoad(ctx, position, playerX) {
        let baseSegmentIndex = this.findSegmentIndex(position);

        var basePercent = percentRemaining(position, ROAD_PARAM.SEGMENT_LENGTH);
        var dx = - (this.segments[baseSegmentIndex].curve * basePercent);
        var x = 0;

        let maxHeight = ROAD_PARAM.CANVAS_HEIGHT;

        for (let n = baseSegmentIndex; n < ROAD_PARAM.NO_OF_SEG_TO_DRAW + baseSegmentIndex; n++) {
            let segment = this.segments[n];

            this.project(segment.p1, (playerX * ROAD_PARAM.WIDTH) - x, ROAD_PARAM.CAMERA_HEIGHT,
                position, ROAD_PARAM.CAMERA_DEPTH, ROAD_PARAM.CANVAS_WIDTH, ROAD_PARAM.CANVAS_HEIGHT, ROAD_PARAM.WIDTH);

            this.project(segment.p2, (playerX * ROAD_PARAM.WIDTH) - x - dx, ROAD_PARAM.CAMERA_HEIGHT,
                position, ROAD_PARAM.CAMERA_DEPTH, ROAD_PARAM.CANVAS_WIDTH, ROAD_PARAM.CANVAS_HEIGHT, ROAD_PARAM.WIDTH);

            x = x + dx;
            dx = dx + segment.curve;

            //the segments that are behind us doont need to be rendered
            if ((segment.p2.screenCoordinates.y >= maxHeight)) continue;

            this.renderSegment(ctx, ROAD_PARAM.CANVAS_WIDTH, ROAD_PARAM.NO_OF_LANES, segment.p1.screenCoordinates.x, segment.p1.screenCoordinates.y,
                segment.p1.screenCoordinates.w, segment.p2.screenCoordinates.x, segment.p2.screenCoordinates.y, segment.p2.screenCoordinates.w,
                segment.color);

            maxHeight = segment.p2.screenCoordinates.y;
        }
    }

    project(p, cameraX, cameraY, cameraZ, CAMERA_DEPTH, CANVAS_WIDTH, CANVAS_HEIGHT, WIDTH) {
        //translation the workd coordinates into camera coordiantes
        p.cameraCoordinates.x = p.worldCoordinates.x - cameraX;

        p.cameraCoordinates.y = p.worldCoordinates.y - cameraY;
        p.cameraCoordinates.z = p.worldCoordinates.z - cameraZ;

        p.screenCoordinates.scale = CAMERA_DEPTH / p.cameraCoordinates.z;

        //combination of projection from camera coordiantes to projection plane and 
        //scaling the projected cordinates to physical screen coordinates
        p.screenCoordinates.x = Math.round((CANVAS_WIDTH / 2) + (p.screenCoordinates.scale * p.cameraCoordinates.x * CANVAS_WIDTH / 2));
        p.screenCoordinates.y = Math.round((CANVAS_HEIGHT / 2) - (p.screenCoordinates.scale * p.cameraCoordinates.y * CANVAS_HEIGHT / 2));
        p.screenCoordinates.w = Math.round((p.screenCoordinates.scale * WIDTH * CANVAS_WIDTH / 2));
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
    findSegmentIndex(z) {
        let segment = this.segments[Math.floor(z / ROAD_PARAM.SEGMENT_LENGTH) % this.segments.length];
        return this.segments.findIndex(x => x === segment);
    }
}