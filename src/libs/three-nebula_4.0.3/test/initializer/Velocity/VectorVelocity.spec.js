/*global describe, it */

import * as Nebula from '../../../src';

import chai from 'chai';

const { assert } = chai;

describe('initializer -> Vector Velocity', () => {
  const vector3d = new Nebula.Vector3D(9, 4, 1);
  const initializer = new Nebula.VectorVelocity(vector3d, 23);
  const particle = new Nebula.Particle();

  it('should set the correct properties', done => {
    const {
      radiusPan: { a, b },
      dir: { x, y, z },
      tha,
      _useV,
      dirVec,
    } = initializer;

    assert.equal(initializer.type, 'VectorVelocity');
    assert.equal(a, 1);
    assert.equal(b, 1);
    assert.equal(x, 9);
    assert.equal(y, 4);
    assert.equal(z, 1);
    assert.equal(tha, 0.40147777777777777);
    assert.isTrue(_useV);
    assert.instanceOf(dirVec, Nebula.Vector3D);
    assert.deepEqual(Object.values(dirVec), [0, 0, 0]);

    done();
  });

  it('should set the particle initializer', done => {
    initializer.initialize(particle);

    const {
      velocity,
      velocity: { x, y, z },
    } = particle;

    assert.instanceOf(velocity, Nebula.Vector3D);
    assert.notEqual(x, 0);
    assert.notEqual(y, 0);
    assert.notEqual(z, 0);

    done();
  });

  it('should construct the initializer from a JSON object', done => {
    const instance = Nebula.VectorVelocity.fromJSON({
      x: 0.96,
      y: 0.88,
      z: 0.45,
      theta: 0.75,
    });

    assert.instanceOf(instance, Nebula.VectorVelocity);
    assert.instanceOf(instance.radiusPan, Nebula.Span);
    assert.instanceOf(instance.dir, Nebula.Vector3D);
    assert.equal(instance.tha, 0.013091666666666665);
    assert.deepEqual(Object.values(instance.dir), [0.96, 0.88, 0.45]);
    assert.deepEqual([instance.radiusPan.a, instance.radiusPan.b], [1, 1]);
    assert.isTrue(instance.isEnabled);

    done();
  });
});
