/*! Albatross app.js
* ================
* Development*
* @Author  Josh Walwyn
*/

const runner = [];

window.onload = () => runner.map(run => run());

/**
 * Utilities
 * @type {Object}
 */
const Utilities = () => {};

/**
 * Finds children of element
 * @param  {String} nodeType   Required node type, such as LI, DIV
 * @param  {String} className  Name of class to grab
 * @param  {Object} parentNode Node of who's children to traverse through
 * @return {List<Object>}      List of found elements
 */
Utilities.findChildren = (nodeType, className, parentNode) => {
  const found = [];
  let child = parentNode.firstChild;
  while (child) {
    if (child.nodeName === nodeType &&
        child.classList.contains(className)) {
      found.push(child);
    }
    child = child.nextSibling;
  }

  return found;
};

/**
 * Build options array from element set and defaults
 * @param  {Array<String, Mixed>}      default Default Options for fallback
 * @param  {Array<String, Mixed>|null} current Current Objects
 * @param  {Object|null}               element DOM Element to traverse for data attrs for options
 * @param  {List<String>|null}         fields  List of fields to resolve for options
 * @return {Object}                            Calculated Options
 */
Utilities.grabOptions = (def, current, element, fields) => {
  // Keep all option variations here
  const options = {};
  options.default = def;
  options.current = current || {};
  options.calculated = {};

  // Get FieldNames
  const fieldsToFetch = fields || Object.keys(def);

  // Loop through fields to get option match
  for (let i = 0; i < fieldsToFetch.length; i += 1) {
    const fieldName = fieldsToFetch[i];
    let value;

    // If field has already been defined, don't change selection
    if (fieldName in options.current) {
      value = options.current[fieldName];
    // Otherwise attempt to find it in the dataset
    } else if (element && fieldName in element.dataset) {
      value = element.dataset[fieldName];
      // Otherwise, let's just go with the default value
    } else {
      value = options.default[fieldName];
    }

    // convert false boolean
    value = (value === 'false') ? false : value;

    options.calculated[fieldName] = value;
  }

  return options.calculated;
};


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
   * Default Options list
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
   * DOM Class NAmes
   * @type {Object}
   */
  const ClassName = {
    open: 'menu-open',
    tree: 'tree',
    treeview: 'treeview',
    treeviewMenu: 'treeview-menu',
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
     * @param  {Object} sidebar Element to bind to
     * @param  {Object} options Options to override ()
     */
    init: (sidebar, opts) => Constructor(sidebar, opts),
  };
})();

runner.push(Tree.bind);

/**
 * TODO:
 * - Easing options
 * - uglify js (es6)
 * - Commit First iteration
 */


/* PushMenu()
 * ==========
 * Adds the push menu functionality to the sidebar.
 *
 * @Usage: PushMenu.init(element, options)
 *         Add [data-widget="push-menu"] to the ul element
 *         Pass any option as data-option-name="value"
 */
/* global runner */
/* global Utilities */
const PushMenu = (() => {
  /**
   * Default Options list
   * @type {Object}
   */
  const Default = {
    collapseScreenSize: 767,
    expandOnHover: false,
    expandTransitionDelay: 0,
  };

  /**
   * Selectors for query selections
   * @type {Object}
   */
  const Selector = {
    button: '[data-toggle="push-menu"]',
    mainLogo: '.main-header .logo',
    searchInput: '.sidebar-form .form-control',
  };

  /**
   * DOM Class NAmes
   * @type {Object}
   */
  const ClassName = {
    collapsed: 'sidebar-collapse',
    open: 'sidebar-open',
    mainSidebar: 'main-sidebar',
    mini: 'sidebar-mini',
    contentWrapper: 'content-wrapper',
    layoutFixed: 'fixed',
    expanded: 'sidebar-expanded-on-hover',
    expandFeature: 'sidebar-mini-expand-feature',
  };

  /**
   * Window width for distinguishing mobile
   */
  let windowWidth;

  /**
   * User defined options
   */
  let options = {};

  /**
   * Main html body element
   */
  let body;

  /**
   * Main controller element for menu
   */
  let element;

  /**
   * Expand with time delay via mouseover hover
   */
  const expand = () => {
    setTimeout(() => {
      body.classList.remove(ClassName.collapsed);
      body.classList.add(ClassName.expanded);
    }, options.expandTransitionDelay);
  };

  /**
   * Collapse with time delay via mouseout hover
   * @return {[type]} [description]
   */
  const collapse = () => {
    setTimeout(() => {
      body.classList.remove(ClassName.expanded);
      body.classList.add(ClassName.collapsed);
    }, options.expandTransitionDelay);
  };

  const expandOnHover = () => {
    Array.prototype.forEach.call(
      document.getElementsByClassName(ClassName.mainSidebar),
      (context) => {
        context.addEventListener('mouseover', () => {
          //
          if (body.classList.contains(ClassName.mini) &&
              body.classList.contains(ClassName.collapsed) &&
              windowWidth > options.collapseScreenSize) {
            expand();
          }
        });

        // handle Close the sidebar
        context.addEventListener('mouseleave', () => {
          collapse();
        });
      },
    );
  };

  /**
   * Open the sidebar
   */
  const open = () => {
    if (windowWidth > options.collapseScreenSize) {
      body.classList.remove(ClassName.collapsed);
    } else {
      body.classList.add(ClassName.open);
    }
  };

  /**
   * Close the sidebar
   */
  const close = () => {
    if (windowWidth > options.collapseScreenSize) {
      body.classList.remove(ClassName.expanded);
      body.classList.add(ClassName.collapsed);
    } else {
      body.classList.remove(ClassName.open);
      body.classList.remove(ClassName.collapsed);
    }
  };

  /**
   * Toggle sidebar open/close
   */
  const toggle = () => {
    let isOpen = !body.classList.contains(ClassName.collapsed);

    if (windowWidth <= options.collapseScreenSize) {
      isOpen = body.classList.contains(ClassName.open);
    }

    if (!isOpen) {
      open();
    } else {
      close();
    }
  };

  /**
   * Binds an event listener to each parent menu element
   * @return {Object}
   */
  const setUpListeners = () => {
    element.addEventListener('click', (event) => {
      // And contextual Window Width
      windowWidth = window.innerWidth;

      event.preventDefault();
      toggle();
    });
  };

  /**
   * Binds Listeners to DOM
   * @param  {Object} el   The main sidebar element
   * @param  {Object} opts list of options
   */
  const Constructor = (el, opts) => {
    // Set options here
    options = Utilities.grabOptions(Default, opts, el);

    // Add parameters to global scope
    element = el;

    // And  Window Width
    windowWidth = window.innerWidth;

    // Get main page body element
    const { 0: b } = document.getElementsByTagName('body');
    body = b;

    // Add Listeners to expand/collapse sidebar on hover
    if (options.expandOnHover ||
        (body.classList.contains(ClassName.mini) &&
         body.classList.contains(ClassName.layoutFixed))) {
      expandOnHover();
      body.classList.add(ClassName.expandFeature);
    }

    // Enable hide menu when clicking on the content-wrapper on small screens
    body.getElementsByClassName(ClassName.contentWrapper)[0]
      .addEventListener(
        'click',
        () => {
          if (windowWidth <= options.collapseScreenSize &&
              body.classList.contains(ClassName.open)) {
            close();
          }
        },
      );

    // Fix for android devices
    body.querySelector(Selector.searchInput)
      .addEventListener(
        'click',
        (e) => {
          e.stopPropagation();
        },
      );


    // Bind functionality to close/open sidebar
    setUpListeners();
  };

  return {
    /**
     * Constructor. Binds listeners onto sidebar elements
     */
    bind: () => {
      Array.prototype.forEach.call(
        document.querySelectorAll(Selector.button),
        button => Constructor(button),
      );
    },
    /**
     * Manually Assign
     * @param  {Object} sidebar Element to bind to
     * @param  {Object} options Options to override ()
     */
    init: (sidebar, opts) => Constructor(sidebar, opts),
  };
})();

runner.push(PushMenu.bind);

/**
 * Scope needs to be used appropriatly.
 */


