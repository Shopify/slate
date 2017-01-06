slate.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

slate.Sections.prototype = $.extend({}, slate.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (typeof constructor === 'undefined') {
      return;
    }

    var instance = $.extend(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function(evt) {
    var instances = remove(this.instances, function(instance) {
      return instance.id === event.detail.sectionId;
    });

    instances.forEach(function(instance) {
      if (typeof instance.onUnload === 'function') {
        instance.onUnload(event);
      }
    });
  },

  _onSelect: function(evt) {
    var instance = find(this.instances, function(instance) {
      return instance.id === event.detail.sectionId;
    });

    if (instance && typeof instance.onSelect === 'function') {
      instance.onSelect(event);
    }
  },

  _onDeselect: function(evt) {
    var instance = find(this.instances, function(instance) {
      return instance.id === event.detail.sectionId;
    });

    if (instance && typeof instance.onDeselect === 'function') {
      instance.onDeselect(event);
    }
  },

  _onBlockSelect: function(evt) {
    var instance = find(this.instances, function(instance) {
      return instance.id === event.detail.sectionId;
    });

    if (instance && typeof instance.onBlockSelect === 'function') {
      instance.onBlockSelect(event);
    }
  },

  _onBlockDeselect: function(evt) {
    var instance = find(this.instances, function(instance) {
      return instance.id === event.detail.sectionId;
    });

    if (instance && typeof instance.onBlockDeselect === 'function') {
      instance.onBlockDeselect(event);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each(function(index, container) {
      this._createInstance(container, constructor);
    }.bind(this));
  }
});
