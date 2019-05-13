import {
  DEFAULT_AGE,
  DEFAULT_ALPHA,
  DEFAULT_BODY,
  DEFAULT_DEAD,
  DEFAULT_EASING,
  DEFAULT_ENERGY,
  DEFAULT_LIFE,
  DEFAULT_MASS,
  DEFAULT_PARENT,
  DEFAULT_RADIUS,
  DEFAULT_SCALE,
  DEFAULT_SLEEP,
  DEFAULT_USE_ALPHA,
  DEFAULT_USE_COLOR
} from './constants';
import { Util, uid } from '../utils';

import { PI } from '../constants';
import { Vector3D } from '../math';
import { CORE_TYPE_PARTICLE as type } from './types';

/**
 * A Particle is an object that is emitted by an emitter.
 *
 */
export default class Particle {
  /**
   * Constructs a Particle instance.
   *
   * @param {object} properties - The properties to instantiate the particle with
   * @property {number} properties.life - The particle's life
   * @property {number} properties.age - The particle's age
   * @property {number} properties.energy - The particle's energy loss
   * @property {boolean} properties.dead - Determines if the particle is dead or not
   * @property {boolean} properties.sleep - Determines if the particle is sleeping or not
   * @property {object} properties.target - The particle's target
   * @property {object} properties.body - The particle's body
   * @property {number} properties.mass - The particle's mass
   * @property {number} properties.radius - The particle's radius
   * @property {number} properties.alpha - The particle's alpha
   * @property {number} properties.scale - The particle's scale
   * @property {number} properties.rotation - The particle's rotation
   * @property {string|number} properties.color - The particle's color
   * @property {function} properties.easing - The particle's easing
   * @property {Vector3D} properties.position - The particle's position
   * @property {Vector3D} properties.velocity - The particle's velocity
   * @property {Vector3D} properties.acceleration - The particle's acceleration
   * @property {array} properties.behaviours - The particle's behaviours array
   * @property {object} properties.transform - The particle's transform collection
   * @return void
   */
  constructor(properties) {
    /**
     * @desc The particle's unique id
     * @type {number}
     */
    this.id = `particle-${uid()}`;

    /**
     * @desc The class type.
     * @type {string}
     */
    this.type = type;
    /**
     * @desc The particle's life
     * @type {number}
     */
    this.life = DEFAULT_LIFE;
    /**
     * @desc The particle's age
     * @type {number}
     */
    this.age = DEFAULT_AGE;
    /**
     * @desc The particle's energy loss
     * @type {number}
     */
    this.energy = DEFAULT_ENERGY;
    /**
     * @desc Determines if the particle is dead or not
     * @type {number}
     */
    this.dead = DEFAULT_DEAD;
    /**
     * @desc Determines if the particle is sleeping or not
     * @type {number}
     */
    this.sleep = DEFAULT_SLEEP;
    /**
     * @desc The particle's body
     * @type {object}
     */
    this.body = DEFAULT_BODY;
    /**
     * @desc The particle's parent
     * @type {?Emitter}
     */
    this.parent = DEFAULT_PARENT;
    /**
     * @desc The particle's mass
     * @type {number}
     */
    this.mass = DEFAULT_MASS;
    /**
     * @desc The particle's radius
     * @type {number}
     */
    this.radius = DEFAULT_RADIUS;
    /**
     * @desc The particle's alpha
     * @type {number}
     */
    this.alpha = DEFAULT_ALPHA;
    /**
     * @desc The particle's scale
     * @type {number}
     */
    this.scale = DEFAULT_SCALE;
    /**
     * @desc Determines whether to use color or not
     * @type {boolean}
     */
    this.useColor = DEFAULT_USE_COLOR;
    /**
     * @desc Determines whether to use alpha or not
     * @type {boolean}
     */
    this.useAlpha = DEFAULT_USE_ALPHA;
    /**
     * @desc The particle's easing
     * @type {number}
     */
    this.easing = DEFAULT_EASING;
    /**
     * @desc The particle's position
     * @type {Vector3D}
     */
    this.position = new Vector3D();
    /**
     * @desc The particle's velocity
     * @type {Vector3D}
     */
    this.velocity = new Vector3D();
    /**
     * @desc The particle's acceleration
     * @type {Vector3D}
     */
    this.acceleration = new Vector3D();
    /**
     * @desc The particle's last position, velocity and acceleration
     * @type {object}
     */
    this.old = {};
    /**
     * @desc The particle's old position
     * @type {number}
     */
    this.old.position = this.position.clone();
    /**
     * @desc The particle's old velocity
     * @type {number}
     */
    this.old.velocity = this.velocity.clone();
    /**
     * @desc The particle's old acceleration
     * @type {number}
     */
    this.old.acceleration = this.acceleration.clone();
    /**
     * @desc The particle's behaviours array
     * @type {number}
     */
    this.behaviours = [];
    /**
     * @desc The particle's transform collection
     * @type {number}
     */
    this.transform = {};
    /**
     * @desc The particle's color store
     * @type {number}
     */
    this.color = { r: 0, g: 0, b: 0 };
    /**
     * @desc The particle's rotation
     * @type {number}
     */
    this.rotation = new Vector3D();

    // override constructor props with passed properties.
    Util.setPrototypeByObj(this, properties);
  }

  /**
   * Gets the particle's current direction.
   *
   * @return {number}
   */
  getDirection() {
    return Math.atan2(this.velocity.x, -this.velocity.y) * (180 / PI);
  }

  /**
   * Resets the particle's default properties and clear's its particle's position,
   * velocity, acceleration, color and rotation. Also destroy's the particle's
   * transform collection & removes all behaviours.
   *
   * @return {Particle}
   */
  reset() {
    this.life = DEFAULT_LIFE;
    this.age = DEFAULT_AGE;
    this.energy = DEFAULT_ENERGY;
    this.dead = DEFAULT_DEAD;
    this.sleep = DEFAULT_SLEEP;
    this.body = DEFAULT_BODY;
    this.parent = DEFAULT_PARENT;
    this.mass = DEFAULT_MASS;
    this.radius = DEFAULT_RADIUS;
    this.alpha = DEFAULT_ALPHA;
    this.scale = DEFAULT_SCALE;
    this.useColor = DEFAULT_USE_COLOR;
    this.useAlpha = DEFAULT_USE_ALPHA;
    this.easing = DEFAULT_EASING;
    this.position.set(0, 0, 0);
    this.velocity.set(0, 0, 0);
    this.acceleration.set(0, 0, 0);
    this.old.position.set(0, 0, 0);
    this.old.velocity.set(0, 0, 0);
    this.old.acceleration.set(0, 0, 0);
    this.color.r = 0;
    this.color.g = 0;
    this.color.b = 0;

    this.rotation.clear();
    Util.destroyObject(this.transform);
    this.removeAllBehaviours();

    return this;
  }

  /**
   * Updates the particle's properties by applying each behaviour to the particle.
   * Will also update the particle's energy, unless it's age is greater than it's life
   * in which case it will be destroyed.
   *
   * @param {number} time - Integration time
   * @param {integer} index - Particle index
   * @return void
   */
  update(time, index) {
    if (!this.sleep) {
      this.age += time;

      let i = this.behaviours.length;

      while (i--) {
        let behaviour = this.behaviours[i];

        behaviour && behaviour.applyBehaviour(this, time, index);
      }
    }

    if (this.age >= this.life) {
      this.destroy();
    } else {
      const scale = this.easing(this.age / this.life);

      this.energy = Math.max(1 - scale, 0);
    }
  }

  /**
   * Adds a behaviour to the particle.
   *
   * @param {Behaviour} behaviour - The behaviour to add to the particle
   * @return void
   */
  addBehaviour(behaviour) {
    this.behaviours.push(behaviour);
    behaviour.initialize(this);
  }

  /**
   * Adds multiple behaviours to the particle.
   *
   * @param {array<Behaviour>} behaviours - An array of behaviours to add to the particle
   * @return void
   */
  addBehaviours(behaviours) {
    let i = behaviours.length;

    while (i--) {
      this.addBehaviour(behaviours[i]);
    }
  }

  /**
   * Removes the behaviour from the particle.
   *
   * @param {Behaviour} behaviour - The behaviour to remove from the particle
   * @return void
   */
  removeBehaviour(behaviour) {
    const index = this.behaviours.indexOf(behaviour);

    if (index > -1) {
      this.behaviours.splice(index, 1);
    }
  }

  /**
   * Removes all behaviours from the particle.
   *
   * @return void
   */
  removeAllBehaviours() {
    Util.destroyArray(this.behaviours);
  }

  /**
   * Destroys the particle.
   *
   * @return void
   */
  destroy() {
    this.removeAllBehaviours();
    this.energy = 0;
    this.dead = true;
    this.parent = null;
  }
}
