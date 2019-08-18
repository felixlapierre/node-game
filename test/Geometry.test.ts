import { expect } from 'chai';
import { Point } from '../src/my_modules/Utils/Geometry';

describe('Point', () => {
    describe('Overlaps', () => {
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
})
