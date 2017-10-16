/* Tree()
 * ======
 * Converts a nested list into a multilevel
 * tree view menu.
 *
 * @author Josh Walwyn <me@joshwalwyn.com>
 *
 * Adapted from Admin LTE Sidebar.js jQuery Plugin
 *
 * @Usage: Tree.init(element, options)
 *         Add [data-widget="tree"] to the ul element
 *         Pass any option as data-option-name="value"
 */
/* global runner */
/* global Velocity */
/* global Utilities */
const Tree = (() => {
  /**
   * Default Options
   * @type {Object}
   */
  const Default = {
    animationSpeed: 300,
    accordion: true,
    followLink: true,
    trigger: '.treeview a',
    easing: 'easeInSine',
  };

  /**
   * Selectors for query selections
   * @type {Object}
   */
  const Selector = {
    data: '[data-widget="tree"]',
    activeTreeview: '.treeview.active',
  };

  /**
   * DOM Class Names
   * @type {Object}
   */
  const ClassName = {
    open: 'menu-open',
    tree: 'tree',
    treeview: 'treeview',
    treeviewMenu: 'treeview-menu',
  };

  /**
   * Custom Events
   * @type {Object}
   */
  const Event = {
    expanded: 'tree_expanded',
    collapsed: 'tree_collapsed',
  };

  /**
   * Contextual Options
   */
  let options;

  /**
   * Contextual Element
   */
  let element;

  /**
   * Collapse element
   * @param  {Object} tree     The child tree/menu
   * @param  {Object} parentLi The parent element that contains the tree
   */
  const collapse = (tree, parentLi) => {
    parentLi.classList.remove(ClassName.open);

    const treeLocal = tree;

    Array.prototype.forEach.call(treeLocal, (t) => {
      const treeItem = t;
      Velocity(treeItem, 'slideUp', {
        easing: options.easing,
        duration: options.animationSpeed,
      }).then(() => {
        // Call custom event to indicate collapse
        element.dispatchEvent(new CustomEvent(Event.collapsed));
      });
    });
  };

  /**
   * Expand menu selection, and close all siblings
   * @param  {Object} tree     The child tree/menu
   * @param  {Object} parentLi The parent element that contains the tree
   */
  const expand = (tree, parentLi) => {
    // We need to access direct siblings to support multilevel menus remaining open
    const openMenus = Utilities.findChildren('LI', ClassName.open, parentLi.parentNode);

    // For each currently opened menu (which should be just 1) we should close
    if (options.accordion) {
      Array.prototype.forEach.call(openMenus, (menu) => {
        const openTree = Utilities.findChildren('UL', ClassName.treeviewMenu, menu);

        // Collapse
        collapse(openTree, menu);
      });
    }

    // Open this menu
    parentLi.classList.add(ClassName.open);

    const firstTree = tree[0]; // Only the direct descendant needs to be closed
    Velocity(firstTree, 'slideDown', {
      easing: options.easing,
      duration: options.animationSpeed,
    }).then(() => {
      // Call custom event to indicate expansion
      element.dispatchEvent(new CustomEvent(Event.expanded));
    });
  };

  /**
   * Handle show/hide of collapsible menus
   * @param  {Object} link  The link element clicked
   * @param  {Object} event The Triggered Event
   */
  const toggle = (link, event) => {
    // Get contextual DOM elements
    const parentLi = link.parentNode;
    const isOpen = parentLi.classList.contains(ClassName.open);
    const treeviewMenu = Utilities.findChildren('UL', ClassName.treeviewMenu, parentLi);

    // Stop if not a menu tree
    if (!parentLi.classList.contains(ClassName.treeview)) {
      return;
    }

    // Stop link follow
    if (!options.followLink || link.getAttribute('href') === '#') {
      event.preventDefault();
    }

    // Open or close depending on current statw
    if (isOpen) {
      collapse(treeviewMenu, parentLi);
    } else {
      expand(treeviewMenu, parentLi);
    }
  };

  /**
   * Binds an event listener to each parent menu element
   * @return {Object}
   */
  const setUpListeners = () => {
    // Binds a click event listener for each element
    Array.prototype.forEach.call(
      element.querySelectorAll(options.trigger),
      (context) => {
        context.addEventListener('click', (event) => {
          toggle(context, event);
        });
      },
    );
  };

  /**
   * Opens existing active element(s) and calls method to bind
   * click event listeners onto the sidebar itself
   * @param  {Object} el   The main sidebar element
   * @param  {Object} opts list of options
   */
  const Constructor = (el, opts) => {
    // Set options here
    options = Utilities.grabOptions(Default, opts, el);

    // Add parameters to global scope
    element = el;
    element.classList.add(ClassName.tree);

    // Open menu for active element
    const active = element.querySelector(Selector.activeTreeview);

    if (active !== null) {
      active.classList.add(ClassName.open);
    }

    // bind listeners
    setUpListeners();
  };

  return {
    /**
     * Constructor. Binds listeners onto sidebar elements
     */
    bind: () => {
      Array.prototype.forEach.call(
        document.querySelectorAll(Selector.data),
        sidebar => Constructor(sidebar),
      );
    },
    /**
     * Manually Assign
     * @param {Object} sidebar Element to bind to
     * @param {Object} options Options to override ()
     */
    init: (sidebar, opts) => Constructor(sidebar, opts),
  };
})();

runner.push(Tree.bind);
