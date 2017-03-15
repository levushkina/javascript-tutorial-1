app.modules.init = ((self) => {
  function _api(data) {
    return $.ajax({
      url: data.url,
      data: data.data,
      dataType: 'json',
      type: data.type || 'GET',
      beforeSend: data.beforeSend
    });
  }

  function _handlebarsExampleOfUsage() {
    const titleTemplate = require('../templates/title_example.hbs');
    $('.js-title-example').html(titleTemplate({title: 'Javascript tutorial part 1'}));
  }

  function _init() {
    _handlebarsExampleOfUsage(); // Метод, показываеющий как работать с handlebars-loader
  }

  function _resolveData() {
    return $.when(
      _api({url: 'api/menu-items'}),
      _api({url: 'api/window-sills'}),
      _api({url: 'api/window-ledges'}),
      _api({url: 'api/window-reveals'}),
      _api({url: 'api/windows'}),
      _api({url: 'api/services'})
    ).done((menuItems, windowSills, windowLedges, windowReveals, windows, services) => {
      app.config.mainMenu = menuItems[0];
      app.config.windowSill = windowSills[0];
      app.config.windowLedge = windowLedges[0];
      app.config.windowReveal = windowReveals[0];
      app.config.windows = windows[0];
      app.config.services = services[0];
    });
  }

  self.load = () => {
    _init();
  };

  self.resolve = _resolveData;

  return self;
})(app.modules.init || {});
