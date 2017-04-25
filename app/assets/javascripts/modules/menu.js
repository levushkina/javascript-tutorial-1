app.modules.menu = (function(self) {

  function _serializeData() {
    app.config.mainMenu.data.forEach(function(menuItem) {
      menuItem.serializedItems = [];
      menuItem.items.forEach(function(id) {
        menuItem.serializedItems.push(app.config.windows.data.find(function(window) {
          return window.id === id;
        }));
      });
    });
    _renderMenu();
  }

  function _initMenu() {
    $('.js-menu-item').eq(0).addClass('active');
    $('.js-menu-subitems').eq(0).addClass('active').find('.js-menu-subitem').eq(0).addClass('active');
  }

  function _renderMenu() {
    const menuTemplate = require('../templates/main_menu.hbs');
    $('.js-main-menu').html(menuTemplate({item: app.config.mainMenu.data}));
  }

  function _init() {
    _serializeData();
    _initMenu();
  }
  function _changeMenuItem() {
    var
      $this = $(this),
      index = $this.index();

    $('.js-menu-item, .js-menu-subitems, .js-menu-subitem').removeClass('active');
    $this.addClass('active');
    $('.js-menu-subitems').eq(index).addClass('active').find('.js-menu-subitem').eq(0).addClass('active');
  }

  function _changeMenuSubitem() {
    var
      $this = $(this);

    $('.js-menu-subitem').removeClass('active');
    $this.addClass('active');
    $(document).trigger('selectWindow:calculator', [$this.data('id')]);
    $(document).trigger('changeWindowType:calculator', [$this.parent().data('id')]);
  }
  function _changeSet($this) {
    var id = $this.parent().data('id');

    $('.js-menu-item, .js-menu-subitems, .js-menu-subitem').removeClass('active');
    $this.addClass('active').parent().addClass('active');
    $('.js-menu-item[data-id="' + id + '"]').addClass('active');
    $(document).trigger('changeWindowType:calculator', [id]);
  }

  function _listener() {
    $(document)
      .on('click', '.js-menu-item', _changeMenuItem)
      .on('click', '.js-menu-subitem', _changeMenuSubitem)
      .on('changeWindowSet:renderWindow', function(e, window) {
        _changeSet($('.js-menu-subitem[data-id='+window.currentSelection.id + ']'));
      });
  }

  self.load = function() {
    _init();
    _listener();
  };

  return self;
})(app.modules.menu || {});
