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
   * Default Options list
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
   *
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
  };
})();

runner.push(Layout.bind);
