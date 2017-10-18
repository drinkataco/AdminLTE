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


/* global runner */
/* global Velocity */
/* global Utilities */

/* Tree()
 * ======
 * Converts a nested list into a multilevel
 * tree view menu.
 *
 * @author Josh Walwyn <me@joshwalwyn.com>
 *
 * Adapted from Admin LTE Sidebar.js jQuery Plugin
 *
 * @Usage: new Tree(element, options)
 *         Add [data-widget="tree"] to the ul element
 *         Pass any option as data-option-name="value"
 */
class Tree {
  /**
   * Binds listeners onto sidebar elements
   */
  static bind() {
    Array.prototype.forEach.call(
      document.querySelectorAll(Tree.Selector.data),
      element => new Tree(element),
    );
  }

  /**
   * Opens existing active element(s) and calls method to bind
   * click event listeners onto the sidebar itself
   * @param  {Object} el   The main sidebar element
   * @param  {Object} opts list of options
   */
  constructor(element, options) {
    // Add parameters to global scope
    this.Default = Tree.Default;
    this.ClassName = Tree.ClassName;
    this.Selector = Tree.Selector;
    this.Event = Tree.Event;
    this.element = element;
    this.element.classList.add(this.ClassName.tree);

    // Set options here
    this.options = Utilities.grabOptions(this.Default, options, this.element);

    // Open menu for active element
    const active = this.element.querySelector(this.Selector.activeTreeview);

    if (active !== null) {
      active.classList.add(this.ClassName.open);
    }

    // bind listeners
    this.setUpListeners();
  }

  /**
   * Binds an event listener to each parent menu element
   * @return {Object}
   */
  setUpListeners() {
    // Binds a click event listener for each element
    Array.prototype.forEach.call(
      this.element.querySelectorAll(this.options.trigger),
      (context) => {
        context.addEventListener('click', (event) => {
          this.toggle(context, event);
        });
      },
    );
  }

  /**
   * Handle show/hide of collapsible menus
   * @param {Object} link  The link element clicked
   * @param {Object} event The Triggered Event
   */
  toggle(link, event) {
    // Get contextual DOM elements
    const parentLi = link.parentNode;
    const isOpen = parentLi.classList.contains(this.ClassName.open);
    const treeviewMenu = Utilities.findChildren('UL', this.ClassName.treeviewMenu, parentLi);

    // Stop if not a menu tree
    if (!parentLi.classList.contains(this.ClassName.treeview)) {
      return;
    }

    // Stop link follow
    if (!this.options.followLink || link.getAttribute('href') === '#') {
      event.preventDefault();
    }

    // Open or close depending on current statw
    if (isOpen) {
      this.collapse(treeviewMenu, parentLi);
    } else {
      this.expand(treeviewMenu, parentLi);
    }
  }

  /**
   * Collapse element
   * @param  {Object} tree     The child tree/menu
   * @param  {Object} parentLi The parent element that contains the tree
   */
  collapse(tree, parentLi) {
    parentLi.classList.remove(this.ClassName.open);

    const treeLocal = tree;

    Array.prototype.forEach.call(treeLocal, (t) => {
      const treeItem = t;
      Velocity(treeItem, 'slideUp', {
        easing: this.options.easing,
        duration: this.options.animationSpeed,
      }).then(() => {
        // Call custom event to indicate collapse
        this.element.dispatchEvent(new CustomEvent(this.Event.collapsed));
      });
    });
  }

  /**
   * Expand menu selection, and close all siblings
   * @param  {Object} tree     The child tree/menu
   * @param  {Object} parentLi The parent element that contains the tree
   */
  expand(tree, parentLi) {
    // We need to access direct siblings to support multilevel menus remaining open
    const openMenus = Utilities.findChildren('LI', this.ClassName.open, parentLi.parentNode);

    // For each currently opened menu (which should be just 1) we should close
    if (this.options.accordion) {
      Array.prototype.forEach.call(openMenus, (menu) => {
        const openTree = Utilities.findChildren('UL', this.ClassName.treeviewMenu, menu);

        // Collapse
        this.collapse(openTree, menu);
      });
    }

    // Open this menu
    parentLi.classList.add(this.ClassName.open);

    const firstTree = tree[0]; // Only the direct descendant needs to be closed
    Velocity(firstTree, 'slideDown', {
      easing: this.options.easing,
      duration: this.options.animationSpeed,
    }).then(() => {
      // Call custom event to indicate expansion
      this.element.dispatchEvent(new CustomEvent(this.Event.expanded));
    });
  }
}

/**
 * Default Options
 * @type {Object}
 */
Tree.Default = {
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
Tree.Selector = {
  data: '[data-widget="tree"]',
  activeTreeview: '.treeview.active',
};

/**
 * DOM Class Names
 * @type {Object}
 */
Tree.ClassName = {
  open: 'menu-open',
  tree: 'tree',
  treeview: 'treeview',
  treeviewMenu: 'treeview-menu',
};

/**
 * Custom Events
 * @type {Object}
 */
Tree.Event = {
  expanded: 'tree_expanded',
  collapsed: 'tree_collapsed',
};

runner.push(Tree.bind);


/* global runner */
/* global Utilities */

/* PushMenu()
 * ==========
 * Adds the push menu functionality to the sidebar.
 *
 * @Usage: new PushMenu(element, options)
 *         Add [data-widget="push-menu"] to the ul element
 *         Pass any option as data-option-name="value"
 */
class PushMenu {
  /**
   * Binds listeners onto sidebar elements
   */
  static bind() {
    Array.prototype.forEach.call(
      document.querySelectorAll(PushMenu.Selector.button),
      button => new PushMenu(button),
    );
  }

  /**
   * Binds Listeners to DOM
   * @param {Object} el   The main sidebar element
   * @param {Object} opts list of options
   */
  constructor(element, options) {
    // Add parameters to global scope
    this.Default = PushMenu.Default;
    this.ClassName = PushMenu.ClassName;
    this.Selector = PushMenu.Selector;
    this.element = element;

    // And  Window Width
    this.windowWidth = window.innerWidth;

    // Set options here
    this.options = Utilities.grabOptions(this.Default, options, this.element);

    // Get main page body element
    this.body = document.querySelector('body');

    // Add Listeners to expand/collapse sidebar on hover
    if (this.options.expandOnHover ||
        (this.body.classList.contains(this.ClassName.mini) &&
         this.body.classList.contains(this.ClassName.layoutFixed))) {
      this.expandOnHover();
      this.body.classList.add(this.ClassName.expandFeature);
    }

    // Enable hide menu when clicking on the content-wrapper on small screens
    this.body.getElementsByClassName(this.ClassName.contentWrapper)[0]
      .addEventListener(
        'click',
        () => {
          if (this.windowWidth <= options.collapseScreenSize &&
            this.body.classList.contains(this.ClassName.open)) {
            this.close();
          }
        },
      );

    // Fix for android devices
    this.body.querySelector(this.Selector.searchInput)
      .addEventListener(
        'click',
        (e) => {
          e.stopPropagation();
        },
      );


    // Bind functionality to close/open sidebar
    this.setUpListeners();
  }

  /**
   * Binds an event listener to each parent menu element
   */
  setUpListeners() {
    this.element.addEventListener('click', (event) => {
      // And contextual Window Width
      this.windowWidth = window.innerWidth;

      event.preventDefault();
      this.toggle();
    });
  }

  /**
   * Toggle sidebar open/close
   */
  toggle() {
    let isOpen = !this.body.classList.contains(this.ClassName.collapsed);

    if (this.windowWidth <= this.options.collapseScreenSize) {
      isOpen = this.body.classList.contains(this.ClassName.open);
    }

    if (!isOpen) {
      this.open();
    } else {
      this.close();
    }
  }

  /**
   * Open the sidebar
   */
  open() {
    if (this.windowWidth > this.options.collapseScreenSize) {
      this.body.classList.remove(this.ClassName.collapsed);
    } else {
      this.body.classList.add(this.ClassName.open);
    }
  }

  /**
   * Close the sidebar
   */
  close() {
    if (this.windowWidth > this.options.collapseScreenSize) {
      this.body.classList.remove(this.ClassName.expanded);
      this.body.classList.add(this.ClassName.collapsed);
    } else {
      this.body.classList.remove(this.ClassName.open);
      this.body.classList.remove(this.ClassName.collapsed);
    }
  }

  /**
   * Expand with time delay via mouseover hover
   */
  expand() {
    window.setTimeout(() => {
      this.body.classList.remove(this.ClassName.collapsed);
      this.body.classList.add(this.ClassName.expanded);
    }, this.options.expandTransitionDelay);
  }

  /**
   * Collapse with time delay via mouseout hover
   */
  collapse() {
    window.setTimeout(() => {
      this.body.classList.remove(this.ClassName.expanded);
      this.body.classList.add(this.ClassName.collapsed);
    }, this.options.expandTransitionDelay);
  }

  /**
   * Bind mouseover and mouseleave events to colapse/expand sidebar
   */
  expandOnHover() {
    Array.prototype.forEach.call(
      document.getElementsByClassName(this.ClassName.mainSidebar),
      (context) => {
        context.addEventListener('mouseover', () => {
          // Handle Expansion
          if (this.body.classList.contains(this.ClassName.mini) &&
              this.body.classList.contains(this.ClassName.collapsed) &&
              this.windowWidth > this.options.collapseScreenSize) {
            this.expand();
          }
        });

        // handle Close the sidebar
        context.addEventListener('mouseleave', () => {
          if (this.body.classList.contains(this.ClassName.expanded)) {
            this.collapse();
          }
        });
      },
    );
  }
}

/**
 * Default Options
 * @type {Object}
 */
PushMenu.Default = {
  collapseScreenSize: 767,
  expandOnHover: false,
  expandTransitionDelay: 0,
};

/**
 * Selectors for query selections
 * @type {Object}
 */
PushMenu.Selector = {
  button: '[data-toggle="push-menu"]',
  mainLogo: '.main-header .logo',
  searchInput: '.sidebar-form .form-control',
};

/**
 * DOM Class NAmes
 * @type {Object}
 */
PushMenu.ClassName = {
  collapsed: 'sidebar-collapse',
  open: 'sidebar-open',
  mainSidebar: 'main-sidebar',
  mini: 'sidebar-mini',
  contentWrapper: 'content-wrapper',
  layoutFixed: 'fixed',
  expanded: 'sidebar-expanded-on-hover',
  expandFeature: 'sidebar-mini-expand-feature',
};

runner.push(PushMenu.bind);


/* Layout()
 * ========
 * Implements AdminLTE layout.
 * Fixes the layout height in case min-height fails.
 *
 * @author Josh Walwyn <me@joshwalwyn.com>
 *
 * Adapted from Admin LTE Sidebar.js jQuery Plugin
 *
 * @usage activated automatically upon window load.
 *        Configure any options by passing data-option="value"
 *        to the body tag.
 */
/* global runner */
/* global Utilities */
const Layout = (() => {
  /**
   * Default Options
   * @type {Object}
   */
  const Default = {
    resetHeight: true,
    transitionEnabled: true,
  };

  /**
   * Selectors for query selections
   * @type {Object}
   */
  const Selector = {
    heightReset: 'body, html, .wrapper',
    wrapper: '.wrapper',
    sidebar: '.sidebar',
    logo: '.main-header .logo',
    layoutBoxed: '.layout-boxed',
    sidebarMenu: '.sidebar-menu',
    mainFooter: '.main-footer',
    mainHeader: '.main-header',
    contentWrapper: '.content-wrapper',
    controlSidebar: '.control-sidebar',
  };

  /**
   * DOM Class Names
   * @type {Object}
   */
  const ClassName = {
    holdTransition: 'hold-transition',
    fixed: 'fixed',
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
   * Bind layout methods to resizing
   */
  let bindedResize = false;

  /**
   *  Fix content height so it fills the page
   */
  const fix = () => {
    // Get all elements
    const elFooter = document.querySelector(Selector.mainFooter);
    const elSidebar = document.querySelector(Selector.sidebar);
    const elHeader = document.querySelector(Selector.mainHeader);
    const elWrapper = document.querySelector(Selector.contentWrapper);

    // We need a wrapper, otherwise lets just bail now
    if (!elWrapper) {
      return;
    }

    // Remove overflow from .wrapper if layout-boxed exists
    const boxedWrapper = document.querySelector(`${Selector.layoutBoxed} > ${Selector.wrapper}`);
    if (boxedWrapper) {
      boxedWrapper.style.overflow = 'hidden';
    }

    // Get values for height, or set defaults
    const footerHeight = (elFooter) ? elFooter.offsetHeight : 0;
    const sidebarHeight = (elSidebar) ? elSidebar.offsetHeight : 0;
    const windowHeight = window.innerHeight;
    const neg = (elHeader) ? elHeader.offsetHeight + footerHeight : footerHeight;

    let postSetHeight;

    // Set the min-height of the content and sidebar based on
    // the height of the document.
    if (document.querySelector('body').classList.contains(ClassName.fixed)) {
      elWrapper.style.minHeight = `${windowHeight - footerHeight}px`;
    } else {
      // Set height of page
      if (windowHeight >= sidebarHeight) {
        postSetHeight = windowHeight - neg;
        elWrapper.style.minHeight = `${postSetHeight}px`;
      } else {
        postSetHeight = sidebarHeight;
        elWrapper.style.minHeight = `${postSetHeight}px`;
      }

      // Fix for the control sidebar height
      const controlSidebar = document.querySelector(Selector.controlSidebar);
      if (controlSidebar) {
        if (controlSidebar.clientHeight > postSetHeight) {
          elWrapper.style.minHeight = `${controlSidebar.clientHeight}px`;
        }
      }
    }
  };

  /**
   * Fix Sidebar for scrolling on fixed layout
   */
  const fixSidebar = () => {
    const elHeader = document.querySelector(Selector.mainHeader);
    const elSidebar = document.querySelector(Selector.sidebar);

    if (!elSidebar) return;

    // Make sure the body tag has the .fixed class otherwise return
    if (!element.classList.contains(ClassName.fixed)) {
      return;
    }

    // Fix for scrolling here
    const headerHeight = (elHeader) ? elHeader.offsetHeight : 0;
    const windowHeight = window.innerHeight;

    elSidebar.style.height = `${windowHeight - headerHeight}px`;
    elSidebar.style.overflowY = 'scroll';
  };

  /**
   * Proxy for calling both fix methods
   */
  const fixLayout = () => {
    fix();
    fixSidebar();
  };

  /**
   * Actives layout methods
   */
  const activate = () => {
    fixLayout();

    if (options.transitionEnabled) {
      element.classList.remove(ClassName.holdTransition);
    }

    // Reset main wrapper elements
    if (options.resetHeight) {
      const elements = document.querySelectorAll(Selector.heightReset);

      Array.prototype.forEach.call(elements, (el) => {
        const elC = el;
        elC.style.height = 'auto';
        elC.style.minHeight = '100%';
      });
    }

    // Resize when window is resized
    if (!bindedResize) {
      window.addEventListener('resize', fixLayout);

      const elLogo = document.querySelector(Selector.logo);
      const elSidebar = document.querySelector(ClassName.sidebar);

      if (elLogo) elLogo.addEventListener('transitionend', fixLayout);
      if (elSidebar) elSidebar.addEventListener('transitionend', fixLayout);

      bindedResize = true;
    }

    // If sidebar menu has expanded options, ensure layout is recalculated
    document.querySelector(Selector.sidebarMenu).addEventListener('tree_expanded', fixLayout);
    document.querySelector(Selector.sidebarMenu).addEventListener('tree_collapsed', fixLayout);
  };

  /**
   * Constructor
   */
  const Constructor = () => {
    // get body element from DOM
    element = document.querySelector('body');

    // Set options here
    options = Utilities.grabOptions(Default, null, element);

    activate();
  };

  return {
    /**
     * Constructor. Binds listeners onto sidebar elements
     */
    bind: () => Constructor(),

    /**
     * Public method proxies
     */
    fixSidebar: () => fixSidebar(),
    active: () => activate(),
  };
})();

runner.push(Layout.bind);


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


/* global runner */
/* global Utilities */
const TodoList = (() => {
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

runner.push(TodoList.bind);