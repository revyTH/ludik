/*global describe, it, before, after */

import Particles from '../../src/core/System';
import Texture from '../../src/initializer/Texture';
import { TextureLoader } from 'three';
import chai from 'chai';
import domino from 'domino';
import eightdiagrams from './fixtures/json/eightdiagramsAsync.json';
import sinon from 'sinon';

const { stub, spy } = sinon;
const { assert } = chai;

global.window = domino.createWindow();
global.document = window.document;

describe('fromJSONAsync', () => {
  let textureLoaderStub, consoleWarnStub;

  before(() => {
    // stop three warns from being printed, these happen because we're stubbing
    // things below
    consoleWarnStub = stub(console, 'warn');
    textureLoaderStub = stub(TextureLoader.prototype, 'load').callsFake(
      (texture, callback) => callback()
    );
  });

  after(() => {
    textureLoaderStub.restore();
    consoleWarnStub.restore();
  });

  it('should call the Texture initializer fromJSON method if the properties contain a texture', async () => {
    const fromJSONSpy = spy(Texture, 'fromJSON');

    await Particles.fromJSONAsync(eightdiagrams);

    assert(fromJSONSpy.calledTwice);

    fromJSONSpy.restore();
  });

  it('should instantiate the eightdiagramsAsync example', async () => {
    const system = await Particles.fromJSONAsync(eightdiagrams);

    assert.lengthOf(system.emitters, eightdiagrams.emitters.length);
    assert.lengthOf(
      system.emitters[0].initializers,
      eightdiagrams.emitters[0].initializers.length
    );
    assert.lengthOf(
      system.emitters[1].initializers,
      eightdiagrams.emitters[1].initializers.length
    );
    assert.lengthOf(
      system.emitters[0].behaviours,
      eightdiagrams.emitters[0].behaviours.length
    );
    assert.lengthOf(
      system.emitters[1].behaviours,
      eightdiagrams.emitters[1].behaviours.length
    );

    assert.equal(
      system.emitters[0].position.x,
      eightdiagrams.emitters[0].position.x
    );
    assert.equal(
      system.emitters[1].position.x,
      eightdiagrams.emitters[1].position.x
    );
    assert.equal(
      system.emitters[0].rotation.x,
      eightdiagrams.emitters[0].rotation.x
    );
    assert.equal(
      system.emitters[0].rotation.y,
      eightdiagrams.emitters[0].rotation.y
    );
    assert.equal(
      system.emitters[0].rotation.z,
      eightdiagrams.emitters[0].rotation.z
    );

    textureLoaderStub.restore();
  });
});
