/* ControlSidebar()
 * ===============
 * Toggles the state of the control sidebar
 *
 * @Usage: ControlSider.init(button_element, options);
 *         or add [data-toggle="control-sidebar"] to the trigger
 *         Pass any option as data-option="value"
 */
/* global runner */
/* global Utilities */
const ControlSidebar = (() => {
  /**
   * Default Options
   * @type {Object}
   */
  const Default = {
    slide: true,
  };

  /**
   * Selectors for query selections
   * @type {Object}
   */
  const Selector = {
    data: '[data-toggle="control-sidebar"]',
    bg: '.control-sidebar-bg',
    wrapper: '.wrapper',
    sidebar: '.control-sidebar',
  };

  /**
   * DOM Class Names
   * @type {Object}
   */
  const ClassName = {
    open: 'control-sidebar-open',
    boxed: 'layout-boxed',
  };

  /**
   * Custom Events
   * @type {Object}
   */
  const Event = {
    expanded: 'controlsidebar_expanded',
    collapsed: 'controlsidebar_collapsed',
  };

  /**
   * User defined options
   */
  let options = {};

  /**
   * Main controller element for menu
   */
  let element;

  /**
   * Body
   */
  let body;

  /**
   * Fix sidebar height
   */
  const fix = () => {
    if (body.classList.contains(ClassName.boxed)) {
      const sbg = document.querySelector(Selector.bg);
      const wrapper = document.querySelector(Selector.wrapper);

      if (sbg && wrapper) {
        sbg.style.position = 'absolute';
        sbg.style.height = wrapper.innerHeight;
      }
    }
  };

  /**
   * Open Sidebar
   */
  const expand = () => {
    if (!options.slide) {
      body.classList.add(ClassName.open);
    } else {
      element.classList.add(ClassName.open);
    }

    element.dispatchEvent(new CustomEvent(Event.expanded));
  };

  /**
   * Close Sidebr
   */
  const collapse = () => {
    body.classList.remove(ClassName.open);
    element.classList.remove(ClassName.open);

    element.dispatchEvent(new CustomEvent(Event.collapsed));
  };

  /**
   * Toggle sidebar open/close
   */
  const toggle = () => {
    const sidebar = document.querySelector(Selector.sidebar);

    if (!sidebar) return;

    fix();

    if (!sidebar.classList.contains(ClassName.open) &&
        !body.classList.contains(ClassName.open)) {
      expand();
    } else {
      collapse();
    }
  };

  /**
   * Contrust object
   * @param {Object} el   The main sidebar element
   * @param {Object} opts list of options
   */
  const Constructor = (el, opts) => {
    // Set options here
    options = Utilities.grabOptions(Default, opts, el);

    // Add parameters to global scope
    // @todo data-bind-to
    element = document.querySelector(Selector.sidebar);

    // Get main page body element
    const { 0: b } = document.getElementsByTagName('body');
    body = b;

    // Toggle open/close
    toggle();

    fix();

    window.addEventListener('resize', fix);
  };

  return {
    /**
     * Constructor. Binds listeners onto sidebar elements
     */
    bind: () => {
      const buttons = document.querySelectorAll(Selector.data);

      if (!buttons) return;

      Array.prototype.forEach.call(
        buttons,
        button => ControlSidebar.init(button),
      );
    },

    /**
     * Manually Assign
     * @param  {Object} sidebar Element to bind to
     * @param  {Object} options Options to override ()
     */
    init: (button, opts) => {
      button.addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          Constructor(button, opts);
        },
      );
    },

    /**
     * Public method proxies
     */
    fix: () => fix(),
  };
})();

runner.push(ControlSidebar.bind);
