export class QuadTree {
    constructor(boundary, capacity) {
        this.boundary = boundary; // { x, y, w, h }
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
    }

    subdivide() {
        const x = this.boundary.x;
        const y = this.boundary.y;
        const w = this.boundary.w / 2;
        const h = this.boundary.h / 2;

        this.northeast = new QuadTree({ x: x + w, y: y, w: w, h: h }, this.capacity);
        this.northwest = new QuadTree({ x: x, y: y, w: w, h: h }, this.capacity);
        this.southeast = new QuadTree({ x: x + w, y: y + h, w: w, h: h }, this.capacity);
        this.southwest = new QuadTree({ x: x, y: y + h, w: w, h: h }, this.capacity);

        this.divided = true;
    }

    insert(point) {
        if (!this.contains(this.boundary, point)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        }

        if (!this.divided) {
            this.subdivide();
        }

        if (this.northeast.insert(point)) return true;
        if (this.northwest.insert(point)) return true;
        if (this.southeast.insert(point)) return true;
        if (this.southwest.insert(point)) return true;

        return false;
    }

    contains(boundary, point) {
        return (
            point.x >= boundary.x &&
            point.x <= boundary.x + boundary.w &&
            point.y >= boundary.y &&
            point.y <= boundary.y + boundary.h
        );
    }

    intersects(range) {
        return !(
            range.x > this.boundary.x + this.boundary.w ||
            range.x + range.w < this.boundary.x ||
            range.y > this.boundary.y + this.boundary.h ||
            range.y + range.h < this.boundary.y
        );
    }

    query(range, found = []) {
        if (!this.intersects(range)) {
            return found;
        }

        for (let p of this.points) {
            if (this.contains(range, p)) {
                found.push(p);
            }
        }

        if (this.divided) {
            this.northwest.query(range, found);
            this.northeast.query(range, found);
            this.southwest.query(range, found);
            this.southeast.query(range, found);
        }

        return found;
    }

    clear() {
        this.points = [];
        this.divided = false;
        this.northeast = null;
        this.northwest = null;
        this.southeast = null;
        this.southwest = null;
    }
}
