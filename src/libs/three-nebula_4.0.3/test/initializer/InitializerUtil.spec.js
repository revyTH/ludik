/*global describe, it */

import * as Nebula from '../../src';

import InitializerUtil from '../../src/initializer/InitializerUtil';
import chai from 'chai';
import sinon from 'sinon';

const { assert } = chai;
const { spy } = sinon;

describe('initializer -> InitializeUtil', () => {
  const mass = new Nebula.Mass(1);
  const life = new Nebula.Life(2);
  const body = new Nebula.Body('#FF0000');
  const radius = new Nebula.Radius(80);
  const velocity = new Nebula.RadialVelocity(
    200,
    new Nebula.Vector3D(0, 0, -1),
    0
  );
  const emitter = new Nebula.Emitter();
  const particle = new Nebula.Particle();
  const initializers = [mass, life, body, radius, velocity];

  it('should run each initializer\'s initialize method on all particles', done => {
    const massSpy = spy(mass, 'initialize');
    const lifeSpy = spy(life, 'initialize');
    const bodySpy = spy(body, 'initialize');
    const radiusSpy = spy(radius, 'initialize');
    const velocitySpy = spy(velocity, 'initialize');
    const spies = [massSpy, lifeSpy, bodySpy, radiusSpy, velocitySpy];

    InitializerUtil.initialize(emitter, particle, initializers);

    spies.forEach(spy => {
      assert(spy.calledOnce);
      assert(spy.calledWith(particle));
      assert(spy.neverCalledWith(emitter));

      spy.restore();
    });

    done();
  });

  it('should call the bindEmitter method if the emitter has its bindEmitter prop set to true', done => {
    const bindEmitterSpy = spy(InitializerUtil, 'bindEmitter');
    const particlePositionAddSpy = spy(particle.position, 'add');
    const particleVelocityAddSpy = spy(particle.velocity, 'add');
    const particleVelocityApplyEulerSpy = spy(particle.velocity, 'applyEuler');
    const particleAccelerationAddSpy = spy(particle.acceleration, 'add');
    const spies = [
      bindEmitterSpy,
      particlePositionAddSpy,
      particleVelocityAddSpy,
      particleVelocityApplyEulerSpy,
      particleAccelerationAddSpy
    ];

    InitializerUtil.initialize(emitter, particle, initializers);

    spies.forEach(spy => {
      assert(spy.calledOnce);

      spy.restore();
    });

    done();
  });
});
