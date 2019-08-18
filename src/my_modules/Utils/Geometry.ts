export interface Shape {
    Overlaps(shape: Shape): boolean;
}

export class Point implements Shape {
    constructor(public x: number, public y: number) { }

    Overlaps(shape: Shape) {
        if (shape instanceof Point) {
            return PointPointOverlap(this, shape);
        }
        if (shape instanceof Rectangle) {
            return PointRectangleOverlap(this, shape);
        }
        if (shape instanceof Circle) {
            return PointCircleOverlap(this, shape);
        }
        throw new NoOverlapFunctionFoundError(this, shape);
    }
}

function PointPointOverlap(p1: Point, p2: Point) {
    return p1.x == p2.x && p1.y == p2.y;
}

function PointCircleOverlap(point: Point, circle: Circle) {
    return Distance(point, circle.center) < circle.radius;
}

function PointRectangleOverlap(point: Point, rectangle: Rectangle) {
    return point.x < rectangle.Right()
        && point.x > rectangle.Left()
        && point.y < rectangle.Top()
        && point.y > rectangle.Bottom();
}

export class Rectangle implements Shape {
    constructor(public corner: Point, public width: number, public height: number) { }

    Overlaps(shape: Shape) {
        if (shape instanceof Point) {
            return PointRectangleOverlap(shape, this);
        }
        if (shape instanceof Rectangle) {
            return RectangleRectangleOverlap(this, shape);
        }
        if (shape instanceof Circle) {
            return CircleRectangleOverlap(shape, this)
        }
        throw new NoOverlapFunctionFoundError(this, shape);
    }

    Left() { return this.corner.x }

    Right() { return this.corner.x + this.width; }

    Top() { return this.corner.y + this.height }

    Bottom() { return this.corner.y }

    TopLeft() { return new Point(this.Left(), this.Top()) }

    TopRight() { return new Point(this.Right(), this.Top()) }

    BottomLeft() { return new Point(this.Left(), this.Bottom()) }

    BottomRight() { return new Point(this.Right(), this.Bottom()) }
}

function RectangleRectangleOverlap(r1: Rectangle, r2: Rectangle) {
    // If any corner of a rectangle is inside the other rectangle, they are overlapping.
    return PointRectangleOverlap(r1.TopLeft(), r2)
    || PointRectangleOverlap(r1.TopRight(), r2)
    || PointRectangleOverlap(r1.BottomLeft(), r2)
    || PointRectangleOverlap(r1.BottomRight(), r2);
}

export class Circle implements Shape {
    constructor(public center: Point, public radius: number) { }

    Overlaps(shape: Shape) {
        if (shape instanceof Rectangle) {
            return CircleRectangleOverlap(this, shape);
        }
        if (shape instanceof Circle) {
            return CircleCircleOverlap(this, shape);
        }
        throw new NoOverlapFunctionFoundError(this, shape);
    }
}

function CircleCircleOverlap(c1: Circle, c2: Circle) {
    return Distance(c1.center, c2.center) < c1.radius + c2.radius
}

function CircleRectangleOverlap(circle: Circle, rectangle: Rectangle) {
    return false;
}

export function Distance(point1: Point, point2: Point) {
    const deltaX = point2.x - point1.x;
    const deltaY = point2.y - point1.y;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

class NoOverlapFunctionFoundError extends Error {
    constructor(shape1: Shape, shape2: Shape) {
        super(`No overlap function found between shapes ${shape1.constructor.name} and ${shape2.constructor.name}`);
    }
}