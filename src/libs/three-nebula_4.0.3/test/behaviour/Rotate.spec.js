/*global describe, it */

import * as Nebula from '../../src';

import { TIME } from '../constants';
import chai from 'chai';
import { getEasingByName } from '../../src/ease';

const { assert } = chai;

describe('behaviour -> Rotate', () => {
  const random = new Nebula.Rotate('random');
  const same = new Nebula.Rotate();
  const set = new Nebula.Rotate(1);
  const to = new Nebula.Rotate(1, 2);
  const add = new Nebula.Rotate(1, 2, 3);
  const randomParticle = new Nebula.Particle();
  const sameParticle = new Nebula.Particle();
  const setParticle = new Nebula.Particle();
  const toParticle = new Nebula.Particle();
  const addParticle = new Nebula.Particle();

  it('should set the rotation type to "same" if the first argument is undefined or "same"', done => {
    assert.strictEqual(same.rotationType, 'same');

    const _same = new Nebula.Rotate('same');

    assert.strictEqual(_same.rotationType, 'same');

    done();
  });

  it('should set the rotation type to "set" if the second argument is undefined', done => {
    assert.strictEqual(set.rotationType, 'set');

    done();
  });

  it('should set the rotation type to "to" if the third argument is undefined', done => {
    assert.strictEqual(to.rotationType, 'to');

    done();
  });

  it('should set the rotation type to "add" if all arguments are defined', done => {
    assert.strictEqual(add.rotationType, 'add');

    done();
  });

  it('should instantiate with the correct properties', done => {
    assert.equal(random.type, 'Rotate');
    assert.strictEqual(random.x, 'random');
    assert.strictEqual(same.x, 0);
    assert.strictEqual(same.y, 0);
    assert.strictEqual(same.z, 0);
    assert.strictEqual(set.x, 1);
    assert.strictEqual(set.y, 0);
    assert.strictEqual(set.z, 0);
    assert.strictEqual(to.x, 1);
    assert.strictEqual(to.y, 2);
    assert.strictEqual(to.z, 0);
    assert.instanceOf(add.x, Nebula.Span);
    assert.instanceOf(add.y, Nebula.Span);
    assert.instanceOf(add.z, Nebula.Span);
    assert.isFalse(add.x._isArray);
    assert.isFalse(add.y._center);
    assert.isFalse(add.z._isArray);
    assert.isFalse(add.y._center);
    assert.isFalse(add.z._isArray);
    assert.isFalse(add.z._center);
    assert.strictEqual(add.x.a, 0.017455555555555554);
    assert.strictEqual(add.x.b, 0.017455555555555554);
    assert.strictEqual(add.y.a, 0.03491111111111111);
    assert.strictEqual(add.y.b, 0.03491111111111111);
    assert.strictEqual(add.z.a, 0.05236666666666666);
    assert.strictEqual(add.z.b, 0.05236666666666666);

    done();
  });

  it('should initialize the randomParticle with the correct properties', done => {
    random.initialize(randomParticle);

    const {
      rotation,
      rotation: { x, y, z },
    } = randomParticle;

    assert.instanceOf(rotation, Nebula.Vector3D);
    assert.notEqual(x, 0);
    assert.notEqual(y, 0);
    assert.notEqual(z, 0);

    done();
  });

  it('should initialize the sameParticle with the correct properties', done => {
    same.initialize(sameParticle);

    const {
      rotation,
      rotation: { x, y, z },
    } = sameParticle;

    assert.instanceOf(rotation, Nebula.Vector3D);
    assert.equal(x, 0);
    assert.equal(y, 0);
    assert.equal(z, 0);

    done();
  });

  it('should initialize the setParticle with the correct properties', done => {
    set.initialize(setParticle);

    const {
      rotation,
      rotation: { x, y, z },
    } = setParticle;

    assert.instanceOf(rotation, Nebula.Vector3D);
    assert.equal(x, 0);
    assert.equal(y, 0);
    assert.equal(z, 0);

    done();
  });

  it('should initialize the toParticle with the correct properties', done => {
    to.initialize(toParticle);

    const {
      rotation,
      transform: { fR, tR },
    } = toParticle;

    assert.instanceOf(rotation, Nebula.Vector3D);
    assert.instanceOf(fR, Nebula.Vector3D);
    assert.instanceOf(tR, Nebula.Vector3D);

    done();
  });

  it('should initialize the addParticle with the correct properties', done => {
    add.initialize(addParticle);

    const {
      rotation,
      transform: {
        addR,
        addR: { x, y, z },
      },
    } = addParticle;

    assert.instanceOf(rotation, Nebula.Vector3D);
    assert.instanceOf(addR, Nebula.Vector3D);
    assert.strictEqual(x, 0.017455555555555554);
    assert.strictEqual(y, 0.03491111111111111);
    assert.strictEqual(z, 0.05236666666666666);

    done();
  });

  it('should have the correct sameParticle properties after applying behaviour', done => {
    same.applyBehaviour(sameParticle, TIME);

    const {
      rotation,
      rotation: { x, y, z },
    } = sameParticle;

    assert.instanceOf(rotation, Nebula.Vector3D);
    assert.equal(x, 0);
    assert.equal(y, 0);
    assert.equal(z, 0);

    done();
  });

  it('should have the correct setParticle properties after applying behaviour', done => {
    set.applyBehaviour(setParticle, TIME);

    const {
      rotation,
      rotation: { x, y, z },
    } = setParticle;

    assert.instanceOf(rotation, Nebula.Vector3D);
    assert.equal(x, 0);
    assert.equal(y, 0);
    assert.equal(z, 0);

    done();
  });

  it('should have the correct toParticle properties after applying behaviour', done => {
    to.applyBehaviour(toParticle, TIME);

    const {
      rotation,
      transform: { fR, tR },
    } = toParticle;

    assert.instanceOf(rotation, Nebula.Vector3D);
    assert.instanceOf(fR, Nebula.Vector3D);
    assert.instanceOf(tR, Nebula.Vector3D);

    done();
  });

  it('should have the correct addParticle properties after applying behaviour', done => {
    add.applyBehaviour(addParticle, TIME);

    const {
      rotation,
      transform: {
        addR,
        addR: { x, y, z },
      },
    } = addParticle;

    assert.instanceOf(rotation, Nebula.Vector3D);
    assert.instanceOf(addR, Nebula.Vector3D);
    assert.strictEqual(x, 0.017455555555555554);
    assert.strictEqual(y, 0.03491111111111111);
    assert.strictEqual(z, 0.05236666666666666);
    assert.strictEqual(rotation.x, 0.017455555555555554);
    assert.strictEqual(rotation.y, 0.03491111111111111);
    assert.strictEqual(rotation.z, 0.05236666666666666);

    done();
  });

  it('should construct the behaviour from a JSON object', done => {
    const instance = Nebula.Rotate.fromJSON({
      x: 1,
      y: 2,
      z: 3,
      life: 3,
      easing: 'easeInOutExpo',
    });

    assert.instanceOf(instance, Nebula.Rotate);
    assert.equal(instance.life, 3);
    assert.instanceOf(instance.x, Nebula.Span);
    assert.instanceOf(instance.y, Nebula.Span);
    assert.instanceOf(instance.z, Nebula.Span);
    assert.deepEqual(instance.easing, getEasingByName('easeInOutExpo'));
    assert.isTrue(instance.isEnabled);

    done();
  });
});
