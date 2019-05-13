/*global describe, it */

import * as Nebula from '../../src';

import { Object3D } from 'three';
import chai from 'chai';
import sinon from 'sinon';

const { assert } = chai;
const { Pool } = Nebula;

describe('core -> Pool', () => {
  it('should instantiate with the correct properties', done => {
    const { type, cID, list } = new Pool();

    assert.equal(type, 'Pool');
    assert.equal(cID, 0);
    assert.isObject(list);
    assert.isEmpty(list);

    done();
  });

  it('should get a new object with a unique id if the object can be instantiated', done => {
    const pool = new Pool();
    const particle = pool.get(Nebula.Particle);

    assert.instanceOf(particle, Nebula.Particle);
    assert.isString(particle.__puid);

    done();
  });

  it('should get a cloned object with a unique id if the object can be cloned', done => {
    const pool = new Pool();
    const object3d = new Object3D();
    const cloned = pool.get(object3d);

    assert.instanceOf(cloned, Object3D);
    assert.notEqual(object3d.id, cloned.id);
    assert.isString(cloned.__puid);

    done();
  });

  it('should throw an error if the supplied argument can neither be instantiated or cloned', done => {
    const pool = new Pool();

    assert.throws(
      () => pool.get(true),
      Error,
      'The pool is unable to create or clone the object supplied'
    );

    done();
  });

  it('should return an empty array if a pooled item id does not exist', done => {
    const pool = new Pool();
    const pooled = pool._getList(Math.random());

    assert.isArray(pooled);
    assert.isEmpty(pooled);

    done();
  });

  it('should store the object in the mapped list', done => {
    const pool = new Pool();
    const particle = pool.get(Nebula.Particle);
    const poolId = particle.__puid;

    pool.expire(particle);

    assert.isArray(pool.list[poolId]);
    assert.equal(poolId, pool.list[poolId][0].__puid);

    done();
  });

  it('should get the object out of the pool if it was previously expired', done => {
    const pool = new Pool();
    const particle = pool.get(Nebula.Particle);
    const createSpy = sinon.spy(pool, 'create');

    pool.expire(particle);

    const retrieved = pool.get(particle);

    assert(createSpy.notCalled);
    assert.equal(particle, retrieved);

    createSpy.restore();
    done();
  });

  it('should get the count of objects in the pool', done => {
    const pool = new Pool();
    const count = 123;
    const particles = [];

    for (let i = 0; i < count; i++) {
      particles.push(pool.get(Nebula.Particle));
    }

    particles.forEach(particle => pool.expire(particle));

    assert.equal(count, pool.getCount());

    done();
  });

  it('should destroy all pools', done => {
    const pool = new Pool();
    const count = 5;
    const particles = [];

    for (let i = 0; i < count; i++) {
      const particle = pool.get(Nebula.Particle);

      pool.get(new Object3D());
      particles.push(particle);
    }

    particles.forEach(particle => pool.expire(particle));

    pool.destroy();

    assert.isEmpty(pool.list);

    done();
  });
});
