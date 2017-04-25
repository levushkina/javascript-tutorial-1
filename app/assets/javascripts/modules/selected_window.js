app.modules.selectedWindow = (function(self) {

  var _currentWindow;

  function _setCurrentWindow(id) {
    _currentWindow = app.config.windows.data.find(function(window) {
      return window.id === id;
    });
    _renderCurrentWindow();
  }

  function _init() {
    _setCurrentWindow(app.config.mainMenu.data[0].items[0]);
  }

  function _renderCurrentWindow() {
    const menuTemplate = require('../templates/selected_window.hbs');

    $('.js-selected-window').html(menuTemplate({item: _currentWindow}));
  }

  function _verifyInput(val) {
    if (Number.isInteger(val)) {
      alert('введите число');
    } else {
      $(document).trigger('changeSpecs:calculator', [_currentWindow]);
    }
  }

  function _listener() {
    $(document)
      .on('selectWindow:calculator', function(e, id) {
        _setCurrentWindow(id);
      })
      .on('changeWindowSet:renderWindow', function(e, window) {
        _setCurrentWindow(window.currentSelection.id);
      })
      .on('input paste', '.js-size',  function() {
        _verifyInput($(this).val());
      });
  }

  self.load = function() {
    _init();
    _listener();
  };

  return self;
})(app.modules.selectedWindow || {});
