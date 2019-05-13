/*global describe, it */

import * as Nebula from '../../../src';

import chai from 'chai';

const { assert } = chai;

describe('initializer -> Polar Velocity', () => {
  const polar3d = new Nebula.Polar3D(4, 9, 2);
  const initializer = new Nebula.PolarVelocity(polar3d, 9);
  const particle = new Nebula.Particle();

  it('should set the correct properties', done => {
    const { tha, dirVec, _useV, radiusPan, dir } = initializer;

    assert.equal(initializer.type, 'PolarVelocity');
    assert.equal(tha, 0.1571);
    assert.instanceOf(dirVec, Nebula.Vector3D);
    assert.deepEqual(Object.values(dirVec), [
      -0.6860072156638288,
      -1.4989531127105078,
      -3.6445210475387078,
    ]);
    assert.isUndefined(radiusPan);
    assert.isUndefined(dir);
    assert.isFalse(_useV);

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
    const instance = Nebula.PolarVelocity.fromJSON({
      polarRadius: 1,
      polarTheta: 0.96,
      polarPhi: 0.88,
      velocityTheta: 0.45,
    });

    assert.instanceOf(instance, Nebula.PolarVelocity);
    assert.instanceOf(instance.dirVec, Nebula.Vector3D);
    assert.equal(instance.tha, 0.007855);
    assert.deepEqual(Object.values(instance.dirVec), [
      0.5219488450608104,
      -0.6313827909557999,
      0.5735199860724567,
    ]);
    assert.isTrue(instance.isEnabled);

    done();
  });
});
