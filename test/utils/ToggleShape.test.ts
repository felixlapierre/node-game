import { expect, use } from 'chai';
import { createSandbox } from 'sinon'
import * as sinonChai from 'sinon-chai';
use(sinonChai);
import { ToggleShape } from '../../src/my_modules/Utils/ToggleShape';

describe('ToggleShape', () => {
    let sandbox = createSandbox();
    beforeEach(() => {
        sandbox.restore();
    })

    let getFakeShape = function() {
        return {
            SetCenter: sandbox.stub(),
            GetCenter: sandbox.stub(),
            Overlaps: sandbox.stub()
        }
    }

    it('should be toggled on by default', () => {
        const fakeShape = getFakeShape();
        const toggle = new ToggleShape(fakeShape);
        toggle.Overlaps(fakeShape);
        expect(fakeShape.Overlaps).to.have.been.called;
    })

    it('should never overlap when toggled off', () => {
        const fakeShape = getFakeShape();
        const toggle = new ToggleShape(fakeShape);
        toggle.Disable();
        toggle.Overlaps(fakeShape);
        expect(fakeShape.Overlaps).to.not.have.been.called;
    })

    it('should overlap if toggled on after being toggled off', () => {
        const fakeShape = getFakeShape();
        const toggle = new ToggleShape(fakeShape);
        toggle.Disable();
        toggle.Enable();
        toggle.Overlaps(fakeShape);
        expect(fakeShape.Overlaps).to.have.been.called;
    })
})