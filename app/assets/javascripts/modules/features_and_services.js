app.modules.featuresAndServices = (function(self) {

  var
    _filteredFeatures,
    _filteredServices,
    _normalizedArray;

  function _renderFeatures() {
    const featuresTemplate = require('../templates/features.hbs');

    $('.js-features').html(featuresTemplate({items: _filteredFeatures}));
  }

  function _renderServices() {
    const servicesTemplate = require('../templates/services.hbs');

    $('.js-services').html(servicesTemplate({item: _filteredServices}));
  }

  function _getOptionsFor(optionsKey, menuId) {
    var filteredData;

    filteredData = $.extend(true, {id: menuId}, app.config[optionsKey]);
    filteredData.data = filteredData.data.filter(function(item) {
      item.price = item.price.hasOwnProperty(menuId) && item.price[menuId];
      return !!item.price;
    });
    filteredData.price = filteredData.data[0] && filteredData.data[0].price;

    return !!filteredData.data.length && filteredData;
  }

  function _filterFeatures(id) {
    _filteredFeatures = [];
    _filteredFeatures.push(_getOptionsFor('windowLedge', id));
    _filteredFeatures.push(_getOptionsFor('windowSill', id));
    _filteredFeatures.push(_getOptionsFor('windowReveal', id));
    _renderFeatures();
    _normalizeData();
  }

  function _filterServices(id) {
    _filteredServices = _getOptionsFor('services', id);
    _renderServices();
    _normalizeData();
  }

  function _normalizeData() {
    _normalizedArray = [];
    _normalizedArray = _normalizedArray.concat(_filteredFeatures);
    _normalizedArray = _normalizedArray.concat(_filteredServices.data);
  }

  function _toggleFeature($checkbox) {
    var
      slug = $checkbox.data('slug'),
      isChecked = $checkbox.prop('checked'),
      featureObject;

    featureObject = _normalizedArray.find(function(item) {
      return item.slug === slug;
    });
    $(document).trigger('toggleFeature:calculator', [$.extend(true, {}, featureObject), isChecked]);
  }

  function _setPrice($this) {
    var
      slug = $this.data('slug'),
      price = parseInt($this.val());

    $this.parents('.feature-item').find('.js-price').text(price);
    _normalizedArray.forEach(function(item) {
      if (item.slug === slug) {
        item.price = price;
      }
    });
    $(document).trigger('updateFeaturePrice:calculator', [slug, price]);
  }

  function _changeSet(options) {
    options.forEach(function(item) {
      var
        $checkbox = $('.js-checkbox[data-slug="'+item.slug +'"]'),
        $select = $('.js-select[data-slug="'+item.slug +'"]');

      if ($checkbox) {
        $checkbox.prop({checked: true});
      }
      if ($select) {
        $select.find('option[value="'+item.price +'"]').attr({selected: true});
      }
    });
  }

  function _init() {
    _filterServices(1);
    _filterFeatures(1);
  }

  function _listener() {
    $(document)
      .on('changeWindowType:calculator', function(e, id) {
        _filterFeatures(id);
        _filterServices(id);
      })
      .on('click', '.js-checkbox', function() {
        _toggleFeature($(this));
      })
      .on('change', '.js-select', function() {
        _setPrice($(this));
      })
      .on('changeWindowSet:renderWindow', function(e, window) {
        _changeSet(window.currentSelection.options);
      });
  }

  self.load = function() {
    _init();
    _listener();
  };

  return self;
})(app.modules.featuresAndServices || {});
