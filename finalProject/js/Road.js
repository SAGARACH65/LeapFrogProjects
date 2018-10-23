
class Road {

    constructor() {
        // segments are the elements joined to form the road
        this.segments = [];
    }

    initializeSegments(curvature) {
        let i = this.segments.length;

        this.segments.push({
            ///each segment is constructed of two points p1 and p2 which are the two opposite ends 
            p1: {
                cameraCoordinates: { x: 0, y: 0, z: 0 },
                screenCoordinates: { x: 0, y: 0, scale: 0 },
                worldCoordinates: { x: 0, y: 0, z: i * ROAD_PARAM.SEGMENT_LENGTH }
            },
            p2: {
                cameraCoordinates: { x: 0, y: 0, z: 0 },
                screenCoordinates: { x: 0, y: 0, scale: 0 },
                worldCoordinates: { x: 0, y: 0, z: (i + 1) * ROAD_PARAM.SEGMENT_LENGTH }
            },
            tree: { ...TREES[generateRandomNO(1, 0)], ...{ sideToDrawTree: this.getSideToDrawTree(curvature) } },
            curvature: curvature,
            color: Math.floor(i / ROAD_PARAM.SIDE_STRIP_LENGTH) % 2 ? ROAD_PARAM.COLORS[0] : ROAD_PARAM.COLORS[1]
        });
    }

    /**
     * this function retruns -ve or +ve value for left and right side respectively.
     * the sign is decided by random for straight roads
     * for left turns it gives only gives +ve value
     * and for right turn it only gives -ve values
     */
    getSideToDrawTree(curvature) {
        if (curvature < 0) return 1;
        else if (curvature > 0) return -1.5;
        else return (((generateRandomNO(-1, 2) <= 0) ? 1 : -1.5));
    }

    drawRoad(ctx, position, playerX) {
        let baseSegmentIndex = this.findSegmentIndex(position);

        let dx = -this.segments[baseSegmentIndex].curvature, x = 0;

        for (let n = baseSegmentIndex; n < ROAD_PARAM.NO_OF_SEG_TO_DRAW + baseSegmentIndex; n++) {
            let segment = this.segments[n];

            this.project(segment.p1, (playerX * ROAD_PARAM.WIDTH) - x, ROAD_PARAM.CAMERA_HEIGHT,
                position, ROAD_PARAM.CAMERA_DEPTH, ROAD_PARAM.CANVAS_WIDTH, ROAD_PARAM.CANVAS_HEIGHT, ROAD_PARAM.WIDTH);

            this.project(segment.p2, (playerX * ROAD_PARAM.WIDTH) - x - dx, ROAD_PARAM.CAMERA_HEIGHT,
                position, ROAD_PARAM.CAMERA_DEPTH, ROAD_PARAM.CANVAS_WIDTH, ROAD_PARAM.CANVAS_HEIGHT, ROAD_PARAM.WIDTH);

            x += dx;
            dx += segment.curvature;

            //the segments that are behind us dont need to be rendered
            if ((segment.p2.screenCoordinates.y >= ROAD_PARAM.CANVAS_HEIGHT)) continue;

            this.renderSegment(ctx, ROAD_PARAM.CANVAS_WIDTH, ROAD_PARAM.NO_OF_LANES, segment.p1.screenCoordinates.x, segment.p1.screenCoordinates.y,
                segment.p1.screenCoordinates.w, segment.p2.screenCoordinates.x, segment.p2.screenCoordinates.y, segment.p2.screenCoordinates.w,
                segment.color);
        }
        for (let n = ROAD_PARAM.NO_OF_SEG_TO_DRAW + baseSegmentIndex; n >= baseSegmentIndex; n--) {

            //trees are drawn every 12 segments so as to maintain sparsity
            if (n % 10 === 0) {
                this.drawTrees(ctx, this.segments[n]);
            }
        }
    }

    drawTrees(ctx, currentSegment) {

        let sign = currentSegment.tree.sideToDrawTree;


        let treeScale = currentSegment.p2.screenCoordinates.scale;
        let treeX = currentSegment.p2.screenCoordinates.x + sign * (treeScale * ROAD_PARAM.WIDTH * ROAD_PARAM.CANVAS_WIDTH / 12);

        let treeY = currentSegment.p2.screenCoordinates.y;

        let treeWidth = (currentSegment.tree.width * treeScale * ROAD_PARAM.CANVAS_WIDTH * 80);
        let treeHeight = (currentSegment.tree.height * treeScale * ROAD_PARAM.CANVAS_WIDTH * 80);

        treeX += sign * treeWidth;
        treeY += - treeHeight;

        drawImage(ctx, currentSegment.tree.img, treeX, treeY, treeWidth, treeHeight);
    }

    project(p, cameraX, cameraY, cameraZ, CAMERA_DEPTH, CANVAS_WIDTH, CANVAS_HEIGHT, WIDTH) {
        //translation the world coordinates into camera coordiantes
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

        let r1 = w1 / 10,
            r2 = w2 / 10,
            l1 = w1 / 40,
            l2 = w2 / 40;

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

        //drawing the white strips on the road
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
  //    }
            //     for (let n = ROAD_PARAM.NO_OF_SEG_TO_DRAW + baseSegmentIndex; n >= baseSegmentIndex; n--) {
