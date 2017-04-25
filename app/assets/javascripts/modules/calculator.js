app.modules.calculator = (function(self) {

  var _result,
    _results = [],
    _currentSet = 0;

  function _init() {
    _updateResult(app.config.windows.data.find(function(window) { return window.id === app.config.mainMenu.data[0].items[0]; }));
    _renderCalculator();
  }

  function _renderCalculator() {
    _updateArrResults(_currentSet);
    _priceTemplate();
  }

  function _priceTemplate() {
    const featuresTemplate = require('../templates/calculator.hbs');

    $('.js-total-price').html(featuresTemplate({item: _results[_currentSet], sum: _results.sum}));
  }

  function _updateResult(object) {
    object.options = [];
    _result = {
      currentSelection: object,
      totalPrice: object.price
    };
  }

  function _toggleFeature(feature, isChecked) {
    if (isChecked) {
      _result.currentSelection.options.push(feature);
      _result.totalPrice = _result.totalPrice + feature.price;
    } else {
      _result.totalPrice = _result.totalPrice - feature.price;
      _result.currentSelection.options.forEach(function(item, index) {
        if (item.slug === feature.slug) {
          _result.currentSelection.options.splice(index, 1);
        }
      });
    }
    _renderCalculator();
  }

  function _updatePrice(slug, price) {
    var currentSetItem = _results[_currentSet];

    currentSetItem.currentSelection.options.forEach(function(option) {
      let delta;

      if (option.slug === slug) {
        delta = price - option.price;
        option.price = price;
        currentSetItem.totalPrice = currentSetItem.totalPrice + delta;
        _renderCalculator();
      }
    });
  }

  function _updateArrResults(index) {
    _results.sum = 0;
    if (_results.length > 0) {
      _results.sum = 0;
      _results.splice(index, 1, _result);
      _results.forEach(function(item) {
        _results.sum = _results.sum + item.totalPrice;
      });
    } else {
      _results.push(_result);
      _results.sum = _result.totalPrice;
    }
    _renderAllResults();
  }

  function calculateSum() {
    _results.sum = 0;
    _results.forEach(function(item) {
      _results.sum = _results.sum + item.totalPrice;
    });
  }

  function _renderAllResults() {
    const resultsTemplate = require('../templates/all_results.hbs');

    $('.js-total-item').html(resultsTemplate({items:_results}));
  }

  function _addWindow(index) {
    _currentSet = index;
    _setDefaultWindow();
  }

  function _deleteWindow(index) {
    _currentSet = 0;
    _results.splice(index, 1);
    if (_results.length > 0) {
     _changeWindowSet(_currentSet)
    } else {
      _setDefaultWindow()
    }
    _renderAllResults();
  }

  function _setDefaultWindow() {
    var $window = $('.js-menu-subitems').eq(0).find('.js-menu-subitem').eq(0);

    $('.js-menu-item, .js-menu-subitems, .js-menu-subitem').removeClass('active');
    $('.js-menu-item').eq(0).addClass('active');
    $window.addClass('active').parents('.js-menu-subitems').addClass('active');
    $(document)
      .trigger('selectWindow:calculator', [$window.data('id')])
      .trigger('changeWindowType:calculator', [$window.parent().data('id')]);
  }

  function _changeWindowSet(newWindowSet) {
    _currentSet = newWindowSet;
    $(document).trigger('changeWindowSet:renderWindow', [_results[_currentSet]]);
    calculateSum();
    _priceTemplate();
  }

  function _listener() {
    $(document)
      .on('selectWindow:calculator', function(e, id) {
        _updateResult(app.config.windows.data.find(function(window) { return window.id === id; }));
        _renderCalculator();
      })
      .on('toggleFeature:calculator', function(e, feature, isChecked) {
        _toggleFeature(feature, isChecked);
      })
      .on('updateFeaturePrice:calculator', function(e, slug, price) {
          _updatePrice(slug, price);
      })
      .on('click', '.js-add-window', function() {
        _addWindow(Number($(this).data('index')));
      })
      .on('click', '.js-delete-window', function() {
        _deleteWindow(Number($(this).parent().data('index')));
      })
      .on('click', '.js-edit-window', function() {
        _changeWindowSet(Number($(this).parent().data('index')));
      });
  }

  self.load = function() {
    _init();
    _listener();
  };

  return self;
})(app.modules.calculator || {});
