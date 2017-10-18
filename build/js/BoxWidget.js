/* global runner */
/* global Utilities */
const BoxWidget = (() => {
  /**
   * Default Options
   * @type {Object}
   */
  const Default = {
    animationSpeed: 500,
    collapseTrigger: '[data-widget="collapse"]',
    removeTrigger: '[data-widget="remove"]',
    collapseIcon: 'fa-minus',
    expandIcon: 'fa-plus',
    removeIcon: 'fa-times',
  };

  /**
   * Selectors for query selections
   * @type {Object}
   */
  const Selector = {
    collapsed: '.collapsed-box',
    body: '.box-body',
    footer: '.box-footer',
    tools: '.box-tools',
  };

  /**
   * DOM Class Names
   * @type {Object}
   */
  const ClassName = {
    collapsed: 'collapsed-box',
  };

  /**
   * [Event description]
   * @type {Object}
   */
  const Event = {
    collapsed: 'collapsed.boxwidget',
    expanded: 'expanded.boxwidget',
    removed: 'removed.boxwidget',
  }

  /**
   * Contextual Options
   */
  let options;

  /**
   * Contextual Element
   */
  let element;

  /**
   * Binds Listeners to DOM
   * @param {Object} el   The main sidebar element
   * @param {Object} opts list of options
   */
  const Constructor = (el, opts) => {
    // Set options here
    options = Utilities.grabOptions(Default, opts, el);

    // Add parameters to global scope
    element = el;

    const collapsers = element.querySelector(options.collapseTrigger);
    Array.prototype.forEach.call(
      collapsers,
      (e) => {
        e.preventDefault();

      }
    ).bind(this);

  };

  return {
    /**
     * Constructor. Binds listeners onto elements
     */
    bind: () => {

    },
    /**
     * Manually Assign
     * @param {Object} el Element to bind to
     * @param {Object} opts Options to override ()
     */
    init: (el, opts) => {},
  };
})();

runner.push(BoxWidget.bind);