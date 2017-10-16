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
   * Default Options
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
   */
  const collapse = () => {
    setTimeout(() => {
      body.classList.remove(ClassName.expanded);
      body.classList.add(ClassName.collapsed);
    }, options.expandTransitionDelay);
  };

  /**
   * Bind mouseover and mouseleave events to colapse/expand sidebar
   */
  const expandOnHover = () => {
    Array.prototype.forEach.call(
      document.getElementsByClassName(ClassName.mainSidebar),
      (context) => {
        context.addEventListener('mouseover', () => {
          // Handle Expansion
          if (body.classList.contains(ClassName.mini) &&
              body.classList.contains(ClassName.collapsed) &&
              windowWidth > options.collapseScreenSize) {
            expand();
          }
        });

        // handle Close the sidebar
        context.addEventListener('mouseleave', () => {
          if (body.classList.contains(ClassName.expanded)) {
            collapse();
          }
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
   * @param {Object} el   The main sidebar element
   * @param {Object} opts list of options
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

    /**
     * Public method proxies
     */
    expandOnHover: () => expandOnHover(),
  };
})();

runner.push(PushMenu.bind);
