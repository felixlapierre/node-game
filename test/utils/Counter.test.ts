import { expect, use } from 'chai';
import { createSandbox } from 'sinon'
import * as sinonChai from 'sinon-chai';
use(sinonChai);

import { Counter } from '../../src/my_modules/Utils/Counter';

describe('Counter', () => {
    let sandbox = createSandbox();

    beforeEach(() => {
        sandbox.restore();
    })

    it('should call function after count is complete', () => {
        const onCountComplete = sandbox.stub();
        const counter = new Counter(200, onCountComplete);
        counter.Increment(200);
        expect(onCountComplete).to.have.been.calledOnce;
    })

    it('should not call function when count is not complete', () => {
        const onCountComplete = sandbox.stub();
        const counter = new Counter(200, onCountComplete);
        counter.Increment(199);
        expect(onCountComplete).to.not.have.been.called;
    })

    it('should only call function after entire count is complete', () => {
        const onCountComplete = sandbox.stub();
        const counter = new Counter(200, onCountComplete);
        counter.Increment(50);
        counter.Increment(50);
        counter.Increment(50);
        expect(onCountComplete).to.not.have.been.called;
        counter.Increment(50);
        expect(onCountComplete).to.have.been.calledOnce;
    })

    it('should only call the function once', () => {
        const onCountComplete = sandbox.stub();
        const counter = new Counter(200, onCountComplete);
        counter.Increment(200);
        counter.Increment(50);
        expect(onCountComplete).to.have.been.calledOnce;
    })

    describe('isComplete', () => {
        it('should return true if the count has been reached', () => {
            const counter = new Counter(200, sandbox.stub());
            counter.Increment(200);
            expect(counter.CountReached()).to.be.true;
        })

        it('should return false if the count has not been reached', () => {
            const counter = new Counter(200, sandbox.stub());
            counter.Increment(199);
            expect(counter.CountReached()).to.be.false;
        })
    })
})