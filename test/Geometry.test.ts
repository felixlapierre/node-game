import { expect } from 'chai';
import { Point, Rectangle, Circle } from '../src/my_modules/Utils/Geometry';

describe('Point', () => {
    describe('Point Overlap', () => {
        it('should be true for identical points', () => {
            const p1 = new Point(5, 5);
            const p2 = new Point(5, 5);

            expect(p1.Overlaps(p2)).to.be.true;
        })

        it('should be false for non-identical points', () => {
            const p1 = new Point(5, 5);
            const p2 = new Point(5, 6);

            expect(p1.Overlaps(p2)).to.be.false;
        })
    })
    describe('Rectangle Overlap', () => {
        it('should be true if the point is in the rectangle', () => {
            const rectangle = new Rectangle(
                new Point(5, 5),
                new Point(3, 3)
            );
            const point = new Point(6, 6);

            expect(point.Overlaps(rectangle)).to.be.true;
        })

        it('should be false if the point is outside the rectangle', () => {
            const rectangle = new Rectangle(
                new Point(5, 5),
                new Point(3, 3)
            );
            const point = new Point(9, 6);

            expect(point.Overlaps(rectangle)).to.be.false;
        })

        it('should be false if the point is on the edge of the rectangle', () => {
            const rectangle = new Rectangle(
                new Point(5, 5),
                new Point(3, 3)
            );
            const point = new Point(8, 6);

            expect(point.Overlaps(rectangle)).to.be.false;
        })
    })

    describe('Circle Overlap', () => {
        it('should overlap if the point is in the circle', () => {
            const circle = new Circle(
                new Point(5, 5),
                5
            )
            const point = new Point(6, 6);
            expect(point.Overlaps(circle)).to.be.true;
        })

        it('should overlap if the point is outside the circle', () => {
            const circle = new Circle(
                new Point(5, 5),
                5
            )
            const point = new Point(8.6, 8.6);
            expect(point.Overlaps(circle)).to.be.false;
        })

        it('should not overlap if the point is on the edge of the circle', () => {
            const circle = new Circle(
                new Point(5, 5),
                5
            )
            const point = new Point(5, 10);
            expect(point.Overlaps(circle)).to.be.false;
        })
    })
})

describe('Rectangle', () => {
    describe('Rectangle Overlap', () => {
        it('should overlap if the rectangles overlap', () => {
            const r1 = new Rectangle(new Point(0, 0), new Point(5, 5));
            const r2 = new Rectangle(new Point(2, 2), new Point(5, 5));
            expect(r1.Overlaps(r2)).to.be.true;
        })

        it('should not overlap if the rectangles do not overlap', () => {
            const r1 = new Rectangle(new Point(0, 0), new Point(5, 5));
            const r2 = new Rectangle(new Point(6, 0), new Point(5, 5));
            expect(r1.Overlaps(r2)).to.be.false;
        })

        it('should not overlap if the rectangles are touching edges', () => {
            const r1 = new Rectangle(new Point(0, 0), new Point(5, 5));
            const r2 = new Rectangle(new Point(5, 0), new Point(5, 5));
            expect(r1.Overlaps(r2)).to.be.false;
        })
    })

    describe('Circle Overlap', () => {
        it('should overlap if the shapes are overlapping', () => {
            const rectangle = new Rectangle(new Point(0, 0), new Point(7, 5));
            const circle = new Circle(new Point(3, 6), 3);
            expect(rectangle.Overlaps(circle)).to.be.true;
        })

        it('should not overlap if the shapes are not overlapping', () => {
            const rectangle = new Rectangle(new Point(0, 0), new Point(7, 5));
            const circle = new Circle(new Point(10, 10), 2);
            expect(rectangle.Overlaps(circle)).to.be.false;
        })

        it('should not overlap if the shapes are touching edges', () => {
            const rectangle = new Rectangle(new Point(0, 0), new Point(7, 5));
            const circle = new Circle(new Point(3, 6), 1);
            expect(rectangle.Overlaps(circle)).to.be.false;
        })
    })
})

describe('Circle', () => {
    describe('Circle Overlap', () => {
        it('should overlap if the circles overlap', () => {
            const c1 = new Circle(new Point(0, 0), 5);
            const c2 = new Circle(new Point(7, 7,), 5);
            expect(c1.Overlaps(c2)).to.be.true;
        })

        it('should not overlap if the circles do not overlap', () => {
            const c1 = new Circle(new Point(0, 0), 5);
            const c2 = new Circle(new Point(7, 7,), 2);
            expect(c1.Overlaps(c2)).to.be.false;
        })

        it('should overlap if the circles overlap', () => {
            const c1 = new Circle(new Point(0, 0), 5);
            const c2 = new Circle(new Point(6, 0), 1);
            expect(c1.Overlaps(c2)).to.be.false;
        })
    })
})
