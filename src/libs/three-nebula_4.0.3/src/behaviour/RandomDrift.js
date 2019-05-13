import { MathUtils, Vector3D, createSpan } from '../math';

import Behaviour from './Behaviour';
import { DEFAULT_RANDOM_DRIFT_DELAY } from './constants';
import { getEasingByName } from '../ease';
import { BEHAVIOUR_TYPE_RANDOM_DRIFT as type } from './types';

/**
 * Behaviour that causes particles to drift to random coordinates in 3D space.
 *
 */
export default class RandomDrift extends Behaviour {
  /**
   * Constructs a RandomDrift behaviour instance.
   *
   * @param {number} driftX - x axis drift
   * @param {number} driftY - y axis drift
   * @param {number} driftZ - z axis drift
   * @param {number} [delay=DEFAULT_RANDOM_DRIFT_DELAY] - drift delay
   * @param {number} life - The life of the particle
   * @param {function} easing - The behaviour's decaying trend
   * @return void
   */
  constructor(
    driftX,
    driftY,
    driftZ,
    delay = DEFAULT_RANDOM_DRIFT_DELAY,
    life,
    easing,
    isEnabled = true
  ) {
    super(life, easing, type, isEnabled);

    this.reset(driftX, driftY, driftZ, delay);

    /**
     * @desc Internal time used for calculating drift vs internal delay.
     * @type {number}
     */
    this.time = 0;
  }

  /**
   * Resets the behaviour properties.
   *
   * @param {number} driftX - x axis drift
   * @param {number} driftY - y axis drift
   * @param {number} driftZ - z axis drift
   * @param {number} [delay=DEFAULT_RANDOM_DRIFT_DELAY] - drift delay
   * @param {number} life - The life of the particle
   * @param {function} easing - The behaviour's decaying trend
   */
  reset(
    driftX,
    driftY,
    driftZ,
    delay = DEFAULT_RANDOM_DRIFT_DELAY,
    life,
    easing
  ) {
    /**
     * @desc A Vector3D that stores the drift properties.
     * @type {Vector3D}
     */
    this.randomForce = this.normalizeForce(
      new Vector3D(driftX, driftY, driftZ)
    );
    /**
     * @desc A Span containing the delay supplied.
     * @type {Span}
     */
    this.delayPan = createSpan(delay);
    this.time = 0;

    life && super.reset(life, easing);
  }

  /**
   * Mutates the particle.acceleration property.
   *
   * @param {object} particle - the particle to apply the behaviour to
   * @param {number} time - engine time
   * @param {integer} index - the particle index
   * @return void
   */
  mutate(particle, time, index) {
    this.energize(particle, time, index);

    this.time += time;

    if (this.time >= this.delayPan.getValue()) {
      const ax = MathUtils.randomAToB(-this.randomForce.x, this.randomForce.x);
      const ay = MathUtils.randomAToB(-this.randomForce.y, this.randomForce.y);
      const az = MathUtils.randomAToB(-this.randomForce.z, this.randomForce.z);

      particle.acceleration.addValue(ax, ay, az);

      this.time = 0;
    }
  }

  static fromJSON(json) {
    const { x, y, z, delay, life, easing, isEnabled = true } = json;

    return new RandomDrift(
      x,
      y,
      z,
      delay,
      life,
      getEasingByName(easing),
      isEnabled
    );
  }
}
