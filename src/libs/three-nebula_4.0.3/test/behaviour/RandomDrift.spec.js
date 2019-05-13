/*global describe, it */

import * as Nebula from '../../src';

import { DEFAULT_RANDOM_DRIFT_DELAY } from '../../src/behaviour/constants';
import { TIME } from '../constants';
import chai from 'chai';
import { getEasingByName } from '../../src/ease';

const { assert } = chai;

describe('behaviour -> RandomDrift', () => {
  const behaviour = new Nebula.RandomDrift(1, 3, 2.5);

  it('should instantiate with the correct properties', done => {
    const {
      life,
      easing,
      age,
      energy,
      dead,
      randomForce,
      delayPan,
    } = behaviour;

    assert.equal(behaviour.type, 'RandomDrift');
    assert.strictEqual(life, Infinity);
    assert.isFunction(easing);
    assert.strictEqual(age, 0);
    assert.strictEqual(energy, 1);
    assert.isFalse(dead);
    assert.instanceOf(randomForce, Nebula.Vector3D);
    assert.instanceOf(delayPan, Nebula.Span);
    assert.strictEqual(randomForce.x, 100);
    assert.strictEqual(randomForce.y, 300);
    assert.strictEqual(randomForce.z, 250);
    assert.isFalse(delayPan._isArray);
    assert.isFalse(delayPan._center);
    assert.strictEqual(delayPan.a, DEFAULT_RANDOM_DRIFT_DELAY);
    assert.strictEqual(delayPan.b, DEFAULT_RANDOM_DRIFT_DELAY);

    done();
  });

  it('should have set the correct properties on the particle after applying the behaviour', done => {
    const particle = new Nebula.Particle();

    assert.equal(particle.acceleration.x, 0);
    assert.equal(particle.acceleration.y, 0);
    assert.equal(particle.acceleration.z, 0);

    behaviour.applyBehaviour(particle, TIME);

    const {
      acceleration: { x, y, z },
    } = particle;

    assert.notEqual(x, 0);
    assert.notEqual(y, 0);
    assert.notEqual(z, 0);

    done();
  });

  it('should construct the behaviour from a JSON object', done => {
    const instance = Nebula.RandomDrift.fromJSON({
      x: 1,
      y: 2,
      z: 1,
      delay: 5,
      life: 3,
      easing: 'easeInOutExpo',
    });

    assert.instanceOf(instance, Nebula.RandomDrift);
    assert.instanceOf(instance.randomForce, Nebula.Vector3D);
    assert.strictEqual(instance.randomForce.x, 100);
    assert.strictEqual(instance.randomForce.y, 200);
    assert.strictEqual(instance.randomForce.z, 100);
    assert.instanceOf(instance.delayPan, Nebula.Span);
    assert.equal(instance.life, 3);
    assert.deepEqual(instance.easing, getEasingByName('easeInOutExpo'));
    assert.isTrue(instance.isEnabled);

    done();
  });
});
