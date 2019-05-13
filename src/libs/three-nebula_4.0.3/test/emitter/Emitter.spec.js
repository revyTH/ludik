/*global describe, it */

import * as Nebula from '../../src';
import * as integration from '../../src/math/integration';

import {
  DEFAULT_BIND_EMITTER,
  DEFAULT_DAMPING,
  DEFAULT_EMITTER_RATE,
} from '../../src/emitter/constants';
import EventDispatcher, {
  PARTICLE_CREATED,
  PARTICLE_DEAD,
  PARTICLE_UPDATE,
} from '../../src/events/';

import { TIME } from '../constants';
import chai from 'chai';
import sinon from 'sinon';

const { spy } = sinon;
const { assert } = chai;
const { Emitter } = Nebula;

describe('emitter -> Emitter', () => {
  it('should instantiate with the correct properties', done => {
    const emitter = new Emitter();

    const {
      type,
      particles,
      initializers,
      behaviours,
      emitterBehaviours,
      currentEmitTime,
      totalEmitTimes,
      damping,
      bindEmitter,
      rate,
      id,
      eventDispatcher,
    } = emitter;

    assert.equal(type, 'Emitter');
    assert.isArray(particles);
    assert.isEmpty(particles);
    assert.isArray(initializers);
    assert.isEmpty(initializers);
    assert.isArray(behaviours);
    assert.isEmpty(behaviours);
    assert.isArray(emitterBehaviours);
    assert.isEmpty(emitterBehaviours);
    assert.equal(currentEmitTime, 0);
    assert.equal(totalEmitTimes, -1);
    assert.equal(damping, DEFAULT_DAMPING);
    assert.equal(bindEmitter, DEFAULT_BIND_EMITTER);
    assert.equal(rate, DEFAULT_EMITTER_RATE);
    assert.isString(id);
    assert.instanceOf(eventDispatcher, EventDispatcher);

    done();
  });

  it('should set the emitter rate and return the emitter', done => {
    const emitter = new Emitter();
    const rate = new Nebula.Rate(1, 2);

    assert.instanceOf(emitter.setRate(rate), Emitter);

    const { numPan, timePan } = emitter.rate;

    assert.equal(numPan.a, 1);
    assert.equal(numPan.b, 1);
    assert.equal(timePan.a, 2);
    assert.equal(timePan.b, 2);

    done();
  });

  it('should set the emitter postion and return the emitter', done => {
    const emitter = new Emitter();
    const _position = { x: 4, y: 2, z: 9 };

    assert.instanceOf(emitter.setPosition(_position), Emitter);

    const { position } = emitter;
    const { x, y, z } = position;

    assert.deepEqual(Object.values(position), [x, y, z]);

    done();
  });

  it('should set the the totalEmitTimes and life and call the rate init method', done => {
    const emitter = new Emitter();
    const rateInitSpy = spy(emitter.rate, 'init');

    emitter.emit(5, 11);

    const { currentEmitTime, totalEmitTimes, life } = emitter;

    assert.equal(currentEmitTime, 0);
    assert.equal(totalEmitTimes, 5);
    assert.equal(life, 11);

    assert(rateInitSpy.calledOnce);

    rateInitSpy.restore();

    done();
  });

  it('should set the life to 1 if the totalEmitTimes is 1', done => {
    const emitter = new Emitter();

    emitter.emit(1, 1002);

    assert.equal(emitter.totalEmitTimes, 1);
    assert.equal(emitter.life, 1);

    done();
  });

  it('should set the correct properties to stop particles emitting', done => {
    const emitter = new Emitter();

    emitter.emit(5, 11).stopEmit();

    assert.equal(emitter.currentEmitTime, 0);
    assert.equal(emitter.totalEmitTimes, -1);

    done();
  });

  it("should kill all of the emitter's particles", done => {
    const emitter = new Emitter();

    for (let i = 0; i < 500; i++) {
      emitter.particles.push(new Nebula.Particle());
    }

    emitter.removeAllParticles();
    emitter.particles.forEach(particle => assert.isTrue(particle.dead));

    done();
  });

  it('should get a particle from the pool, call the setupParticle method, dispatch events and return the particle', done => {
    const system = new Nebula.System();
    const emitter = new Emitter();
    const initializer = new Nebula.Mass();
    const behaviour = new Nebula.Attraction();
    const setupParticleSpy = spy(emitter, 'setupParticle');
    const systemDispatchSpy = spy(system, 'dispatch');
    const emitterDispatchSpy = spy(emitter, 'dispatch');
    const spies = [setupParticleSpy, systemDispatchSpy, emitterDispatchSpy];

    system.addEmitter(emitter);

    const particle = emitter.createParticle(initializer, behaviour);

    assert.instanceOf(particle, Nebula.Particle);
    assert(setupParticleSpy.calledOnceWith(particle));
    assert(systemDispatchSpy.secondCall.calledWith(PARTICLE_CREATED, particle));
    assert(emitterDispatchSpy.notCalled);

    spies.forEach(spy => spy.restore());
    done();
  });

  it("should call the emitter's dispatch when creating a particle with bindEmitterEvent set to true", done => {
    const system = new Nebula.System();
    const emitter = new Emitter();
    const emitterDispatchSpy = spy(emitter, 'dispatch');
    const spies = [emitterDispatchSpy];

    system.addEmitter(emitter);
    emitter.bindEmitterEvent = true;

    const particle = emitter.createParticle(
      new Nebula.Mass(),
      new Nebula.Attraction()
    );

    assert(emitterDispatchSpy.calledOnceWith(PARTICLE_CREATED, particle));

    spies.forEach(spy => spy.restore());
    done();
  });

  it('should add an initializer to the emitter', done => {
    const emitter = new Emitter();
    const mass = new Nebula.Mass();

    assert.instanceOf(emitter.addInitializer(mass), Emitter);
    assert.notEmpty(emitter.initializers);
    assert.instanceOf(emitter.initializers[0], Nebula.Mass);

    done();
  });

  it('should add all the initializers passed', done => {
    const emitter = new Emitter();
    const mass = new Nebula.Mass();
    const life = new Nebula.Life();
    const radius = new Nebula.Radius();
    const initializers = [mass, life, radius];

    assert.instanceOf(emitter.addInitializers(initializers), Emitter);
    assert.lengthOf(emitter.initializers, initializers.length);
    assert.instanceOf(emitter.initializers[0], Nebula.Radius);
    assert.instanceOf(emitter.initializers[1], Nebula.Life);
    assert.instanceOf(emitter.initializers[2], Nebula.Mass);

    done();
  });

  it('should set the emitter initializers to the initializers passed', done => {
    const emitter = new Emitter();
    const mass = new Nebula.Mass();
    const life = new Nebula.Life();
    const radius = new Nebula.Radius();
    const initializers = [mass, life, radius];

    assert.instanceOf(emitter.setInitializers(initializers), Emitter);
    assert.deepEqual(emitter.initializers, initializers);

    done();
  });

  it('should remove the initializer', done => {
    const emitter = new Emitter();
    const mass = new Nebula.Mass();
    const life = new Nebula.Life();

    emitter.addInitializers([mass, life]);

    assert.lengthOf(emitter.initializers, 2);

    emitter.removeInitializer(mass);

    assert.lengthOf(emitter.initializers, 1);
    assert.instanceOf(emitter.initializers[0], Nebula.Life);

    done();
  });

  it('should remove all the initializers from the emitter', done => {
    const emitter = new Emitter();
    const mass = new Nebula.Mass();
    const life = new Nebula.Life();
    const radius = new Nebula.Radius();
    const initializers = [mass, life, radius];

    emitter.addInitializers(initializers);

    assert.instanceOf(emitter.removeAllInitializers(), Emitter);
    assert.lengthOf(emitter.initializers, 0);

    done();
  });

  it('should add a behaviour to the emitter', done => {
    const emitter = new Emitter();
    const attraction = new Nebula.Attraction();

    assert.instanceOf(emitter.addBehaviour(attraction), Emitter);
    assert.lengthOf(emitter.behaviours, 1);
    assert.deepEqual(emitter.behaviours[0], attraction);

    done();
  });

  it('should add all the behaviours to the emitter', done => {
    const emitter = new Emitter();
    const attraction = new Nebula.Attraction();
    const repulsion = new Nebula.Repulsion();
    const gravity = new Nebula.Gravity();
    const behaviours = [attraction, repulsion, gravity];

    assert.instanceOf(emitter.addBehaviours(behaviours), Emitter);
    assert.lengthOf(emitter.behaviours, behaviours.length);
    assert.instanceOf(emitter.behaviours[0], Nebula.Gravity);
    assert.instanceOf(emitter.behaviours[1], Nebula.Repulsion);
    assert.instanceOf(emitter.behaviours[2], Nebula.Attraction);

    done();
  });

  it('should set the emitter behaviours to the behaviours passed', done => {
    const emitter = new Emitter();
    const attraction = new Nebula.Attraction();
    const repulsion = new Nebula.Repulsion();
    const gravity = new Nebula.Gravity();
    const behaviours = [attraction, repulsion, gravity];

    assert.instanceOf(emitter.setBehaviours(behaviours), Emitter);
    assert.lengthOf(emitter.behaviours, behaviours.length);
    assert.deepEqual(emitter.behaviours, behaviours);

    done();
  });

  it('should remove the emitter behaviour', done => {
    const emitter = new Emitter();
    const attraction = new Nebula.Attraction();
    const repulsion = new Nebula.Repulsion();
    const gravity = new Nebula.Gravity();
    const behaviours = [attraction, repulsion, gravity];

    emitter.setBehaviours(behaviours);
    emitter.removeBehaviour(repulsion);

    assert.lengthOf(emitter.behaviours, 2);
    assert.deepEqual(emitter.behaviours, [attraction, gravity]);

    done();
  });

  it('should remove all emitter behaviours', done => {
    const emitter = new Emitter();

    emitter.setBehaviours([
      new Nebula.Attraction(),
      new Nebula.Repulsion(),
      new Nebula.Gravity(),
    ]);

    assert.instanceOf(emitter.removeAllBehaviours(), Emitter);
    assert.empty(emitter.behaviours);

    done();
  });

  it('should get a particle from the pool when creating the particle and return the particle', done => {
    const system = new Nebula.System();
    const emitter = new Emitter();

    system.addEmitter(emitter);

    const poolSpy = spy(system.pool, 'get');

    assert.instanceOf(emitter.createParticle(), Nebula.Particle);
    assert(poolSpy.calledOnce);

    poolSpy.restore();

    done();
  });

  it('should call the setupParticle method on the particle when creating it', done => {
    const system = new Nebula.System();
    const emitter = new Emitter();

    system.addEmitter(emitter);

    const setupParticleSpy = spy(emitter, 'setupParticle');
    const particle = emitter.createParticle();

    assert(setupParticleSpy.calledOnceWith(particle));

    setupParticleSpy.restore();

    done();
  });

  it('should dispatch the correct events when creating a particle', done => {
    const system = new Nebula.System();
    const emitter = new Emitter();
    const systemDispatchSpy = spy(system, 'dispatch');
    const emitterDispatchSpy = spy(emitter, 'dispatch');

    system.addEmitter(emitter);

    const particle = emitter.createParticle();

    assert(systemDispatchSpy.secondCall.calledWith(PARTICLE_CREATED, particle));

    emitter.bindEmitterEvent = true;

    const particle2 = emitter.createParticle();

    assert(emitterDispatchSpy.calledOnceWith(PARTICLE_CREATED, particle2));

    systemDispatchSpy.restore();
    emitterDispatchSpy.restore();

    done();
  });

  it("should call the InitializerUtil.initialize method on the particle passing the correct arguments. This should call every initializer's init method on the particle", done => {
    const emitter = new Emitter();
    const particle = new Nebula.Particle();
    const initializeSpy = spy(Nebula.InitializerUtil, 'initialize');
    const mass = new Nebula.Mass();
    const life = new Nebula.Life();
    const radius = new Nebula.Radius();
    const attraction = new Nebula.Attraction();
    const repulsion = new Nebula.Repulsion();
    const gravity = new Nebula.Gravity();
    const behaviours = [attraction, repulsion, gravity];
    const initializers = [mass, life, radius];
    const initSpies = [
      spy(mass, 'init'),
      spy(life, 'init'),
      spy(radius, 'init'),
    ];

    emitter
      .setBehaviours(behaviours)
      .setInitializers(initializers)
      .setupParticle(particle);

    assert(initializeSpy.calledOnceWith(emitter, particle, initializers));
    initSpies.forEach(spy => {
      assert(spy.calledOnceWith(emitter, particle));
      spy.restore();
    });

    initializeSpy.restore();

    done();
  });

  it('should set the particle beahviours as well as its parent and push the particle into the emitter.particles array', done => {
    const emitter = new Emitter();
    const particle = new Nebula.Particle();
    const attraction = new Nebula.Attraction();
    const repulsion = new Nebula.Repulsion();
    const gravity = new Nebula.Gravity();
    const behaviours = [attraction, repulsion, gravity];
    const addBehavioursSpy = spy(particle, 'addBehaviours');

    emitter.setBehaviours(behaviours).setupParticle(particle);

    assert.lengthOf(emitter.particles, 1);
    assert.deepEqual(emitter.particles[0], particle);
    assert.deepEqual(particle.parent, emitter);
    assert(addBehavioursSpy.calledOnceWith(behaviours));
    // reverse here because the addBehaviours method uses a while loop to add them in reverse order
    assert.deepEqual(particle.behaviours, behaviours.reverse());

    addBehavioursSpy.restore();

    done();
  });

  it('should destroy the emitter and clear all initializers, behaviour and the parent if there are no particles', done => {
    const system = new Nebula.System();
    const emitter = new Emitter();
    const mass = new Nebula.Mass();
    const life = new Nebula.Life();
    const radius = new Nebula.Radius();
    const attraction = new Nebula.Attraction();
    const repulsion = new Nebula.Repulsion();
    const gravity = new Nebula.Gravity();
    const behaviours = [attraction, repulsion, gravity];
    const initializers = [mass, life, radius];

    system.addEmitter(emitter);
    emitter.setBehaviours(behaviours).setInitializers(initializers);

    assert.empty(emitter.particles);

    emitter.destroy();

    assert.isTrue(emitter.dead);
    assert.equal(emitter.energy, 0);
    assert.equal(emitter.totalEmitTimes, -1);
    assert.isEmpty(emitter.initializers);
    assert.isEmpty(emitter.behaviours);
    assert.isEmpty(system.emitters);
    assert.isNull(emitter.parent);

    done();
  });

  it('should stop the emitter but not clear initializers, behaviours or the parent if the emitter has particles', done => {
    const system = new Nebula.System();
    const emitter = new Emitter();
    const particle = new Nebula.Particle();
    const mass = new Nebula.Mass();
    const life = new Nebula.Life();
    const radius = new Nebula.Radius();
    const attraction = new Nebula.Attraction();
    const repulsion = new Nebula.Repulsion();
    const gravity = new Nebula.Gravity();
    const behaviours = [attraction, repulsion, gravity];
    const initializers = [mass, life, radius];

    system.addEmitter(emitter);
    emitter
      .setBehaviours(behaviours)
      .setInitializers(initializers)
      .setupParticle(particle);

    assert.isNotEmpty(emitter.particles);

    emitter.destroy();

    assert.isTrue(emitter.dead);
    assert.equal(emitter.energy, 0);
    assert.equal(emitter.totalEmitTimes, -1);
    assert.isNotEmpty(emitter.initializers);
    assert.isNotEmpty(emitter.behaviours);
    assert.isNotEmpty(system.emitters);
    assert.isNotNull(emitter.parent);

    done();
  });
});

describe('emitter -> Emitter -> update', () => {
  it('should set the emitter age according to the time passed', done => {
    const emitter = new Emitter();

    assert.equal(emitter.age, 0);

    emitter.update(TIME);

    assert.equal(emitter.age, TIME);

    done();
  });

  it('should destroy the emitter if the emitter is dead', done => {
    const emitter = new Emitter();
    const destroySpy = spy(emitter, 'destroy');

    emitter.dead = true;

    emitter.update(TIME);

    assert(destroySpy.calledOnce);

    destroySpy.restore();

    done();
  });
  it('should destroy the emitter if the emitter age is >= to its life', done => {
    const emitterA = new Emitter();
    const emitterB = new Emitter();
    const destroySpyA = spy(emitterA, 'destroy');
    const destroySpyB = spy(emitterB, 'destroy');

    emitterA.emit(100, 4);
    emitterA.update(TIME);

    emitterB.emit(100, TIME);
    emitterB.update(TIME);

    assert.isAbove(emitterA.age, emitterA.life);
    assert.equal(emitterB.age, emitterB.life);

    assert(destroySpyA.calledOnce);
    assert(destroySpyB.calledOnce);

    destroySpyA.restore();
    destroySpyB.restore();

    done();
  });

  it('should call the generate and integrate methods, passing the update time argument to both', done => {
    const emitter = new Emitter();
    const generateSpy = spy(emitter, 'generate');
    const integrateSpy = spy(emitter, 'integrate');

    emitter.update(TIME);

    assert(generateSpy.calledOnceWith(TIME));
    assert(integrateSpy.calledOnceWith(TIME));

    generateSpy.restore();
    integrateSpy.restore();

    done();
  });

  it('should call the required methods while updating the emitter if a particle is dead', done => {
    const system = new Nebula.System();
    const emitter = new Emitter();
    const liveParticlesCount = 10;
    const deadParticlesCount = 23;
    const systemDispatchSpy = spy(system, 'dispatch');
    const poolExpireSpy = spy(system.pool, 'expire');
    const particleResetSpy = spy(Nebula.Particle.prototype, 'reset');

    system.addEmitter(emitter);

    for (let i = 0; i < liveParticlesCount; i++) {
      emitter.particles.push(new Nebula.Particle());
    }

    for (let i = 0; i < deadParticlesCount; i++) {
      emitter.particles.push(new Nebula.Particle({ dead: true }));
    }

    emitter.update(TIME);

    assert.equal(poolExpireSpy.callCount, deadParticlesCount);
    assert.equal(particleResetSpy.callCount, deadParticlesCount);
    assert.lengthOf(emitter.particles, liveParticlesCount);
    // +1 for the add emitter dispatch
    assert(systemDispatchSpy.callCount, deadParticlesCount + 1);
    assert(systemDispatchSpy.calledWith(PARTICLE_DEAD));

    done();
  });
});

describe('emitter -> Emitter -> integrate', () => {
  it('should integrate the emitter', done => {
    const emitter = new Emitter();
    const integrationSpy = spy(integration, 'integrate');

    emitter.integrate(TIME);

    assert(integrationSpy.calledOnceWith(emitter, TIME, 1 - emitter.damping));

    integrationSpy.restore();

    done();
  });

  it('should update and integrate each particle', done => {
    const emitter = new Emitter();
    const integrationSpy = spy(integration, 'integrate');
    const particleUpdateSpy = spy(Nebula.Particle.prototype, 'update');
    const particlesCount = 33;

    for (let i = 0; i < particlesCount; i++) {
      emitter.particles.push(new Nebula.Particle());
    }

    emitter.integrate(TIME);

    assert(integrationSpy.callCount, particlesCount + 1);
    assert(particleUpdateSpy.callCount, particlesCount);
    assert(particleUpdateSpy.calledWith(TIME));

    integrationSpy.restore();
    particleUpdateSpy.restore();

    done();
  });

  it('should dispatch the correct events after updating and integrating particles', done => {
    const system = new Nebula.System();
    const emitter = new Emitter();
    const systemDispatchSpy = spy(system, 'dispatch');
    const particle = new Nebula.Particle();

    system.addEmitter(emitter);
    emitter.particles.push(particle);

    emitter.integrate(TIME);

    assert(systemDispatchSpy.secondCall.calledWith(PARTICLE_UPDATE, particle));

    systemDispatchSpy.restore();

    done();
  });
});

describe('emitter -> Emitter -> generate', () => {
  it('should set the cID, call createParticle the right number of times and set the totalEmitTimes to 0 if the totalEmitTimes was 1', done => {
    const system = new Nebula.System();
    const emitter = new Emitter();
    const createParticleSpy = spy(emitter, 'createParticle');

    system.addEmitter(emitter.emit(1));
    emitter.generate(TIME);

    assert.equal(emitter.cID, 1);
    assert(createParticleSpy.calledOnce);
    assert.equal(emitter.totalEmitTimes, 0);

    createParticleSpy.restore();

    done();
  });

  it('should set the currentEmitTime', done => {
    const system = new Nebula.System();
    const emitter = new Emitter();

    system.addEmitter(emitter.emit());
    emitter.generate(0.01);

    assert.equal(emitter.currentEmitTime, 0.01);

    done();
  });

  it('should create the correct number of particles if currentEmitTime < totalEmitTimes', done => {
    const system = new Nebula.System();
    const emitter = new Emitter();
    const getValueSpy = spy(Nebula.Rate.prototype, 'getValue');
    const createParticleSpy = spy(emitter, 'createParticle');
    const time = 0.0184;

    system.addEmitter(emitter.emit());
    emitter.setRate(new Nebula.Rate(5, 0.01));
    emitter.generate(time);

    assert(getValueSpy.calledOnceWith(time));
    assert.equal(emitter.cID, 5);
    assert.equal(createParticleSpy.callCount, 5);

    getValueSpy.restore();
    createParticleSpy.restore();

    done();
  });
});
