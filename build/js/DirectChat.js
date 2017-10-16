/* global runner */
/* global Utilities */
const DirectChat = (() => {
  /**
   * Default Options
   * @type {Object}
   */
  const Default = {};

  /**
   * Selectors for query selections
   * @type {Object}
   */
  const Selector = {}

  /**
   * DOM Class Names
   * @type {Object}
   */
  const ClassName = {}

  /**
   * Contextual Options
   */
  let options;

  /**
   * Contextual Element
   */
  let element;

  return {
    /**
     * Constructor. Binds listeners onto elements
     */
    bind: () => {},
    /**
     * Manually Assign
     * @param {Object} el Element to bind to
     * @param {Object} opts Options to override ()
     */
    init: (el, opts) => {},
  };
})();

runner.push(DirectChat.bind);
