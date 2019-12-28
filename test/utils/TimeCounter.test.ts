import { expect, use } from 'chai';
import { createSandbox } from 'sinon'
import * as sinonChai from 'sinon-chai';
use(sinonChai);

import {TimeCounter} from './../../src/backend/Utils/TimeCounter';
import {TimeSubject} from './../../src/backend/Utils/TimeSubject';

describe('TimeCounter', () => {
    let sandbox = createSandbox();

    beforeEach(() => {
        sandbox.restore();
    })

    it('should invoke the callback after time has elapsed', () => {
        const onTimeElapsed = sandbox.stub();
        new TimeCounter(200, onTimeElapsed);
        const timeSubject = TimeSubject.GetInstance();
        timeSubject.TimeElapsed(200);
        expect(onTimeElapsed).to.have.been.calledOnce;
    })
})
