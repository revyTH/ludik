/*global describe, it */

import * as Nebula from '../../src';

import { TIME } from '../constants';
import chai from 'chai';
import { getEasingByName } from '../../src/ease';

const { assert } = chai;

describe('behaviour -> Repulsion', () => {
  const behaviour = new Nebula.Repulsion();

  it('should instantiate with the correct properties', done => {
    const {
      life,
      easing,
      age,
      energy,
      dead,
      targetPosition,
      radius,
      force,
      radiusSq,
      attractionForce,
      lengthSq,
    } = behaviour;

    assert.equal(behaviour.type, 'Repulsion');
    assert.strictEqual(life, Infinity);
    assert.isFunction(easing);
    assert.strictEqual(age, 0);
    assert.strictEqual(energy, 1);
    assert.isFalse(dead);
    assert.isTrue(targetPosition instanceof Nebula.Vector3D);
    assert.strictEqual(radius, 1000);
    assert.strictEqual(force, -10000);
    assert.strictEqual(radiusSq, 1000000);
    assert.isTrue(attractionForce instanceof Nebula.Vector3D);
    assert.strictEqual(lengthSq, 0);

    done();
  });

  it('should have the correct properties after applying behaviour', done => {
    const {
      life,
      easing,
      age,
      energy,
      dead,
      targetPosition,
      radius,
      force,
      radiusSq,
      attractionForce,
      lengthSq,
    } = behaviour;
    const particle = new Nebula.Particle();

    behaviour.applyBehaviour(particle, TIME);

    assert.strictEqual(life, Infinity);
    assert.isFunction(easing);
    assert.strictEqual(age, 0);
    assert.strictEqual(energy, 1);
    assert.isFalse(dead);
    assert.isTrue(targetPosition instanceof Nebula.Vector3D);
    assert.strictEqual(radius, 1000);
    assert.strictEqual(force, -10000);
    assert.strictEqual(radiusSq, 1000000);
    assert.isTrue(attractionForce instanceof Nebula.Vector3D);
    assert.strictEqual(lengthSq, 0);

    done();
  });

  it('should construct the behaviour from a JSON object', done => {
    const instance = Nebula.Repulsion.fromJSON({
      x: 1,
      y: 4,
      z: 1,
      force: 4,
      radius: 12,
      life: 3,
      easing: 'easeInOutExpo',
    });

    assert.instanceOf(instance, Nebula.Repulsion);
    assert.deepEqual(Object.values(instance.targetPosition), [1, 4, 1]);
    assert.instanceOf(instance.targetPosition, Nebula.Vector3D);
    assert.equal(instance.force, -400);
    assert.equal(instance.radius, 12);
    assert.equal(instance.life, 3);
    assert.deepEqual(instance.easing, getEasingByName('easeInOutExpo'));
    assert.isTrue(instance.isEnabled);

    done();
  });
});
