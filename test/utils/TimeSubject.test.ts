import { expect, use } from 'chai';
import { createSandbox } from 'sinon'
import * as sinonChai from 'sinon-chai';
use(sinonChai);

import { TimeSubject } from '../../src/backend/Utils/TimeSubject';

describe('TimeSubject', () => {
    let sandbox = createSandbox();

    beforeEach(() => {
        sandbox.restore();
    })
    
    it('should notify  observer whenever time elapses', () => {
        const onTimeElapsed = sandbox.stub();
        const timeSubject = TimeSubject.GetInstance();
        timeSubject.Register({OnTimeElapsed: onTimeElapsed});
        timeSubject.TimeElapsed(200);
        expect(onTimeElapsed).to.have.been.calledWith(200);
    })

    it('should not notify an observer that has been unregistered', () => {
        const onTimeElapsed = sandbox.stub();
        const timeSubject = TimeSubject.GetInstance();
        const timeObserver = {OnTimeElapsed: onTimeElapsed};
        timeSubject.Register(timeObserver);
        timeSubject.Unregister(timeObserver);
        timeSubject.TimeElapsed(200);
        expect(onTimeElapsed).to.not.have.been.called;
    })
})