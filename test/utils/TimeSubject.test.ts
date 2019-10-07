import { expect, use } from 'chai';
import { createSandbox } from 'sinon'
import * as sinonChai from 'sinon-chai';
use(sinonChai);

import { TimeSubject } from '../../src/my_modules/Utils/TimeSubject';

describe('TimeSubject', () => {
    let sandbox = createSandbox();

    beforeEach(() => {
        sandbox.restore();
    })
    it('should trigger observer after time has elapsed', () => {
        const onTimeElapsed = sandbox.stub();
        const timeSubject = TimeSubject.GetInstance();
        timeSubject.Register({OnTimeElapsed: onTimeElapsed});
        timeSubject.TimeElapsed(200);
        expect(onTimeElapsed).to.have.been.calledWith(200);
    })
})