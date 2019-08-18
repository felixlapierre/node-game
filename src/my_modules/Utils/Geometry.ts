export interface Shape {
    Overlaps(shape: Shape): boolean;
}

export class Point implements Shape {
    constructor(public x: number, public y: number) { }

    Overlaps(shape: Shape) {
        if (shape instanceof Point) {
            return PointsOverlap(this, shape);
        }
        if (shape instanceof Rectangle) {
            return PointAndRectangleOverlap(this, shape);
        }
        if (shape instanceof Circle) {
            return PointAndCircleOverlap(this, shape);
        }
    }
}

export class Rectangle implements Shape {
    constructor(public corner: Point, public width: number, public height: number) { }

    Overlaps(shape: Shape) {
        if (shape instanceof Rectangle) {
            return RectanglesOverlap(this, shape);
        }
        if (shape instanceof Circle) {
            return CircleAndRectangleOverlap(shape, this)
        }
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

export class Circle implements Shape {
    constructor(public center: Point, public radius: number) { }

    Overlaps(shape: Shape) {
        if (shape instanceof Rectangle) {
            return CircleAndRectangleOverlap(this, shape);
        }
        if (shape instanceof Circle) {
            return CirclesOverlap(this, shape);
        }
    }
}

export function RectanglesOverlap(r1: Rectangle, r2: Rectangle) {
    // If any corner of a rectangle is inside the other rectangle, they are overlapping.
    return PointAndRectangleOverlap(r1.TopLeft(), r2)
    || PointAndRectangleOverlap(r1.TopRight(), r2)
    || PointAndRectangleOverlap(r1.BottomLeft(), r2)
    || PointAndRectangleOverlap(r1.BottomRight(), r2);
}

export function CirclesOverlap(c1: Circle, c2: Circle) {
    return Distance(c1.center, c2.center) < c1.radius + c2.radius
}

export function PointsOverlap(p1: Point, p2: Point) {
    return p1.x == p2.x && p1.y == p2.y;
}

export function CircleAndRectangleOverlap(circle: Circle, rectangle: Rectangle) {

}

export function PointAndCircleOverlap(point: Point, circle: Circle) {
    return Distance(point, circle.center) < circle.radius;
}

export function PointAndRectangleOverlap(point: Point, rectangle: Rectangle) {
    return point.x < rectangle.Right()
        && point.x > rectangle.Left()
        && point.y < rectangle.Top()
        && point.y > rectangle.Bottom();
}

export function Distance(point1: Point, point2: Point) {
    const deltaX = point2.x - point1.x;
    const deltaY = point2.y - point1.y;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}