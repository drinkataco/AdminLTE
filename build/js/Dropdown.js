/* Dropdown()
 * ======
 * Bootstrap compatible dropdown elements
 *
 * @author Josh Walwyn <me@joshwalwyn.com>
 *
 * Adapted from Admin LTE Sidebar.js jQuery Plugin
 *
 * @Usage:
 */
const Dropdown = (() => {
  /**
   * Default Options
   * @type {Object}
   */
  const Default = {
  };

  /**
   * Selectors for query selections
   * @type {Object}
   */
  const Selector = {
    data: '[data-toggle="dropdown"]',
  };

  /**
   * DOM Class Names
   * @type {Object}
   */
  const ClassName = {
    disabled: 'disabled',
    open: 'open',
  };

  /**
   * Contextual Options
   */
  let options;

  const clearMenus = (e) => {
    // TODO: What's this do?
    if (e && e.which === 3) return;

    Array.prototype.forEach.call(
      document.querySelectorAll(Selector.data),
      (drop) => {
        // TODO: get parent, support target
        drop.parentNode.classList.remove(ClassName.open);
      },
    );
  };

  const getParent = (el) => {
    console.log('getting parent');

    return el.parentNode;
  }

  const toggle = (element) => {
    console.log(element);
    // Don't toggle if element is disabled
    if (element.classList.contains(ClassName.disabled) ||
        element.disabled) {
      return;
    }

    const parent = element.parentNode; // TODO: get parent, support target
    const isActive = parent.classList.contains(ClassName.Open);

    clearMenus();

    if (!isActive) {
      parent.classList.add('open');
    }

  };

  /**
   * Constructor
   * @param  {Object} el   Element of dropdown
   * @param  {Object} opts list of options
   */
  const Constructor = (element, opts) => {
    // Show dropdown element on click
    element.addEventListener('click', (e) => {
      toggle(element);
    });

    // Allow forms to be handles
    Array.prototype.forEach.call(element.querySelectorAll('form'),
      (f) => f.addEventListener('click', (e) => e.stopPropagation())
    );
  };

  /**
   * Handle conditions where dropdown would cler
   */
  const ClearListeners = () => {

  };

  return {
    /**
     * Constructor. Binds listeners onto sidebar elements
     */
    bind: () => {
      // Bind toggling
      Array.prototype.forEach.call(
        document.querySelectorAll(Selector.data),
        el => Constructor(el),
      );
    },

    /**
     * Manually Assign
     * @param  {Object} sidebar Element to bind to
     * @param  {Object} options Options to override ()
     */
    init: (el, opts) => () => {
      Constructor(el, opts);
      ClearListeners();
    }
  }
})();

runner.push(Dropdown.bind);

/**
 * TODO:
 * - ARIA
 * - getParent method
 * - backdrop for mobile (whats this)
 */
