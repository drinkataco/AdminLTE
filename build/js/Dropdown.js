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
    clearOthers: true,
    boxClickClose: true,
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
    open: 'open',
    disabled: 'disabled',
  };

  /**
   * Contextual Options
   */
  let options;

  /**
   * Handle Keydown ESC to clear dropdowns
   * @param {Object} e event
   */
  const handleKeydown = (e) => {
    const escKeyCode = 27;

    if (e.which != 27 ||
        /input|textarea/i.test(e.target.tagName)) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    clearMenus();
  }

  /**
   * Clear all other open dropdown elements
   * @param {Object} el clicked dom element
   */
  const clearMenus = (e) => {
    if (e && e.which === 3) return;

    Array.prototype.forEach.call(
      document.querySelectorAll(Selector.data),
      (drop) => {
        const parent = getParent(drop);

        if (!parent.classList.contains(ClassName.open)) return;

        parent.classList.remove(ClassName.open);
      },
    );
  };

  /**
   * Get parent or controller element
   * @param {Object} el clicked dom element
   */
  const getParent = (el) => {
    if (el.dataset.target) {
      return document.querySelector(el.dataset.target);
    }

    return el.parentNode;
  }

  /**
   * Toggle to show/hide dropdown item
   * @param {Object} el clicked dom element
   */
  const toggle = (element) => {
    // Don't toggle if element is disabled
    if (element.classList.contains(ClassName.disabled) ||
        element.disabled) {
      return;
    }

    const parent = getParent(element);
    const isActive = parent.classList.contains(ClassName.open);

    if (options.clearOthers) clearMenus();

    if (!isActive) {
      parent.classList.add(ClassName.open);
    } else {
      parent.classList.remove(ClassName.open);
    }
  };

  /**
   * Constructor
   * @param {Object} el   Element of dropdown
   * @param {Object} opts list of options
   */
  const Constructor = (element, opts) => {
    // Set options here
    options = Utilities.grabOptions(Default, opts, element);

    // Show dropdown element on click
    element.addEventListener('click', (e) => {
      toggle(element);
      e.stopPropagation();
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
    // Handle off-click
    document.addEventListener('click', clearMenus);

    // Handle keypress – Esc for example
    document.addEventListener('keydown', (e) => {
      handleKeydown(e);
    });
  };

  return {
    /**
     * Constructor. Binds listeners onto sidebar elements
     */
    bind: () => {
      ClearListeners();
      // Bind toggling
      Array.prototype.forEach.call(
        document.querySelectorAll(Selector.data),
        el => Constructor(el),
      );
    },

    /**
     * Manually Assign
     * @param {Object} sidebar Element to bind to
     * @param {Object} options Options to override ()
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
 * - handle up/down
 * - handle boxClickClose etc
 * - backdrop for mobile (whats this)
 */