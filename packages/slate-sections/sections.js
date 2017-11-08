import $ from 'jquery';
import omit from 'lodash-es/omit';
import remove from 'lodash-es/remove';
import find from 'lodash-es/find';
import filter from 'lodash-es/filter';

function Sections() {
  this.$document = $(document);
  this.namespace = '.section-js-events';

  document.addEventListener('shopify:section:load', evt => {
    const id = evt.detail.sectionId;
    const container = evt.target.querySelector(`[data-section-id="${id}"]`);
    const type = container.getAttribute('data-section-type');

    this.load(type, container);
  });
}

$.extend(Sections.prototype, {
  /**
   * Indexed list of all registered section types
   */
  registered: {},

  /**
   * List of all section instances
   */
  instances: [],

  /**
   * Indexed list of all registered global extensions
   */
  extensions: {
    '*': [],
  },

  /**
   * Registers a section type with properties. Adds a new section constructor to
   * the registered list of sections.
   *
   * @param {string} type
   * @param {object} properties
   */
  register(type, properties) {
    function Section(data) {
      this.type = type;
      Master.call(this, data);
    }

    Section.constructor = this.registered[type];
    Section.prototype = Object.create(Master.prototype);
    $.extend(Section.prototype, properties);

    this.registered[type] = Section;
  },

  /**
   * Loads all or the specified section types
   */
  load(types, containers) {
    types = this._normalizeTypeParam(types);
    containers = this._normalizeContainersParam(containers);

    types.forEach(type => {
      const Section = this.registered[type];
      let selection = containers;

      if (typeof Section === 'undefined') {
        return;
      }

      if (typeof selection === 'undefined') {
        selection = document.querySelectorAll(`[data-section-type="${type}"]`);
      }

      // Convert selection NodeList into an array
      selection = Array.prototype.slice.call(selection);

      selection.forEach(container => {
        if (this._instanceExists(container)) {
          return;
        }

        const extensions = this.extensions['*'].concat(
          this.extensions[type] || []
        );
        const instance = new Section({
          container,
          extensions,
          id: container.getAttribute('data-section-id'),
        });

        instance.trigger('section_load');

        this.instances.push(instance);
      });
    });
  },

  /**
   * Extend single, multiple, or all sections with additional functionality.
   */
  extend(types, extension) {
    types = this._normalizeTypeParam(types);

    types.forEach(type => {
      this.extensions[type] = this.extensions[type] || [];
      this.extensions[type].push(extension);

      if (typeof this.registered[type] === 'undefined') {
        return;
      }

      this.instances.forEach(instance => {
        if (instance.type !== type) {
          return;
        }
        instance.extend(extension);
      });
    });
  },

  /**
   * Checks if a particular section type has been loaded on the page.
   */
  isInstance(type) {
    return typeof find(this.instances, {type}) === 'object';
  },

  /**
   * Returns all instances of a section type on the page.
   */
  getInstances(type) {
    return $.Deferred(defer => {
      const instances = filter(this.instances, {type});

      if (instances.length === 0) {
        defer.reject();
      } else {
        defer.resolve(instances);
      }
    });
  },

  /**
   * Attaches an event handler to the document that is fired whenever any section
   * instance triggers an event of specified type. Automatically adds a namespace
   * for easy removal with `sections.off('event')`
   */
  on() {
    // Convert arguments object into an array
    const args = Array.prototype.slice.call(arguments);

    // Apply the section namespace to any event handler created by this section
    args[0] = args[0].concat(this.namespace);

    this.$document.on.apply(this.$document, args);
  },

  /**
   * Removes an event handler attached using `sections.on()`.
   */
  off() {
    // Convert arguments object into an array
    const args = Array.prototype.slice.call(arguments);

    // Apply the section namespace to any event handler created by this section
    args[0] = args[0].concat(this.namespace);

    this.$document.off.apply(this.$document, arguments);
  },

  /**
   * Triggers and event in every section instance
   */
  trigger() {
    const triggerArgs = arguments;
    this.instances.forEach(instance => {
      instance.trigger(...triggerArgs);
    });
  },

  _sectionTrigger() {
    this.$document.trigger.apply(this.$document, arguments);
  },

  _normalizeTypeParam(types) {
    if (types === '*') {
      types = Object.keys(this.registered);
    } else if (typeof types === 'string') {
      types = [types];
    }

    types = types.map(type => {
      return type.toLowerCase();
    });

    return types;
  },

  _normalizeContainersParam(containers) {
    if (!Array.isArray(containers) && typeof containers === 'object') {
      // If a single container object is specified not inside a function
      containers = [containers];
    }
    return containers;
  },

  _instanceExists(container) {
    const instance = find(this.instances, {
      id: container.getAttribute('data-section-id'),
    });
    return typeof instance !== 'undefined';
  },
});

const sections = new Sections();
export default sections;

/**
 * Master section class that all sections inherit from
 * @constructor
 *
 */
function Master(data) {
  this.container = data.container;
  this.$container = $(this.container);
  this.id = data.id;
  this.namespace = `.${data.id}`;
  this.extensions = data.extensions || [];
  this.$eventBinder = this.$container;

  _applyExtensions.call(this);
  _applyEditorHandlers.call(this);
  _applyDefaultHandlers.call(this);
}

Master.prototype = {
  /* eslint-disable no-empty-function */
  onLoad() {},
  onUnload() {},
  onSelect() {},
  onDeselect() {},
  onBlockSelect() {},
  onBlockDeselect() {},

  /* eslint-enable no-empty-function */

  /**
   * Attaches an event handler to an instance of a section. Only listens to
   * events triggered by that section instance.
   */
  on() {
    // Convert arguments object into an array
    const args = Array.prototype.slice.call(arguments);

    // Apply the section namespace to any event handler created by this section
    args[0] = args[0].concat(this.namespace);

    this.$eventBinder.on.apply(this.$eventBinder, args);
    this.$eventBinder = this.$container;
  },

  /**
   * Attaches an event handler to an instance of a section that is removed after
   * being called once. Only listens to events triggered by that section instance.
   */
  one() {
    // Convert arguments object into an array
    const args = Array.prototype.slice.call(arguments);

    // Apply the section namespace to any event handler created by this section
    args[0] = args[0].concat(this.namespace);

    this.$eventBinder.one.apply(this.$eventBinder, args);
    this.$eventBinder = this.$container;
  },

  /**
   * Removes an event handler that was attached using the `this.on()` method
   */
  off() {
    // Convert arguments object into an array
    const args = Array.prototype.slice.call(arguments);

    // Apply the section namespace to any event handler created by this section
    args[0] = args[0] || '';
    args[0] = args[0].concat(this.namespace);

    this.$eventBinder.off.apply(this.$eventBinder, arguments);
    this.$eventBinder = this.$container;
  },

  /*
  * Triggers an event on both this section instance and the sections object so
  * so that any event handlers attached using `sections.on()` will be also
  * triggered.
  */
  trigger() {
    // Convert arguments object into an array
    const args = Array.prototype.slice.call(arguments);

    // Check what the second argument is. If there is already an array keep it.
    args[1] = args[1] || [];

    // Add the section instance as the first item in the array. This will force
    // it to be the first param in the .on() callback
    args[1].splice(0, 0, this);

    this.$eventBinder.trigger.apply(this.$eventBinder, args);
    this.$eventBinder = this.$container;
  },

  /**
   * Extends this section instance with additional functionality.
   */
  extend(extension) {
    const init = extension.init;
    this.extensions.push(extension);

    $.extend(this, omit(extension, 'init'));

    if ($.isFunction(init)) {
      init.apply(this);
    }
  },
};

/**
 * Shortcut methods that are automatically namespaced for easy removal, e.g.
 * $(document).on('event' + this.namespace);
 */
Master.prototype.document = function() {
  const $document = $(document);
  const self = this;
  return {
    on() {
      self.$eventBinder = $document;
      self.on(...arguments);
    },
    off() {
      self.$eventBinder = $document;
      self.off(...arguments);
    },
    trigger() {
      self.$eventBinder = $document;
      self.trigger(...arguments);
    },
  };
};

/**
 * Shortcut methods that are automatically namespaced for easy removal, e.g.
 * $(window).on('event' + this.namespace);
 */
Master.prototype.window = function() {
  const $window = $(window);
  const self = this;
  return {
    on() {
      self.$eventBinder = $window;
      self.on(...arguments);
    },
    off() {
      self.$eventBinder = $window;
      self.off(...arguments);
    },
    trigger() {
      self.$eventBinder = $window;
      self.trigger(...arguments);
    },
  };
};

function _applyExtensions() {
  this.extensions.forEach(extension => {
    this.extend(extension);
  });
}

function _applyEditorHandlers() {
  $(document)
    .on(`shopify:section:unload${this.namespace}`, _onSectionUnload.bind(this))
    .on(`shopify:section:select${this.namespace}`, _onSelect.bind(this))
    .on(`shopify:section:deselect${this.namespace}`, _onDeselect.bind(this))
    .on(`shopify:block:select${this.namespace}`, _onBlockSelect.bind(this))
    .on(`shopify:block:deselect${this.namespace}`, _onBlockDeselect.bind(this));
}

function _applyDefaultHandlers() {
  this.on('section_load', this.onLoad.bind(this));
  this.on('section_unload', this.onUnload.bind(this));
  this.on('section_select', this.onSelect.bind(this));
  this.on('section_deselect', this.onDeselect.bind(this));
  this.on('block_select', this.onBlockSelect.bind(this));
  this.on('block_deselect', this.onBlockDeselect.bind(this));
}

function _onSectionUnload(event) {
  if (this.id !== event.detail.sectionId) {
    return;
  }

  event.type = 'section_unload';
  this.trigger(event);

  this.off(this.namespace);
  sections.off(this.namespace);
  $(document).off(this.namespace);
  $(window).off(this.namespace);

  remove(sections.instances, {id: this.id});
}

function _onSelect(event) {
  if (this.id !== event.detail.sectionId) {
    return;
  }

  event.type = 'section_select';
  this.trigger(event);
}

function _onDeselect(event) {
  if (this.id !== event.detail.sectionId) {
    return;
  }

  event.type = 'section_deselect';
  this.trigger(event);
}

function _onBlockSelect(event) {
  if (this.id !== event.detail.sectionId) {
    return;
  }

  event.type = 'block_select';
  this.trigger(event);
}

function _onBlockDeselect(event) {
  if (this.id !== event.detail.sectionId) {
    return;
  }

  event.type = 'block_deselect';
  this.trigger(event);
}
