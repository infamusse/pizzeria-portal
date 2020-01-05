import { settings, select, classNames } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';

export const app = {
  initPages: function() {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    thisApp.initPages = document.querySelector('.start__subpages');
    thisApp.logo = document.querySelector('.logo a');

    // console.log('thisApp.initPages', thisApp.initPages);

    let idFromHash = window.location.hash.replace('#/', '');
    let pageMatchingHash = thisApp.pages[0].id;

    thisApp.logo.addEventListener('click', function() {
      const clickedElement = this;
      event.preventDefault();
      const id = clickedElement.getAttribute('href').replace('#', '');
      pageMatchingHash = id;
      thisApp.activatePage(id);
      window.location.hash = '#/' + id;
      thisApp.activateLanding();
    });

    for (let page of thisApp.initPages.children) {
      // console.log('page', page);
      page.addEventListener('click', function() {
        const clickedElement = this;
        event.preventDefault();
        // console.log('clickedElement', clickedElement);
        const id = clickedElement.getAttribute('href').replace('#', '');
        pageMatchingHash = id;
        thisApp.activatePage(id);
        window.location.hash = '#/' + id;
        thisApp.activateLanding();
      });
    }

    for (let page of thisApp.pages) {
      if (page.id == idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }
    thisApp.activatePage(pageMatchingHash);

    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function(event) {
        const clickedElement = this;
        event.preventDefault();
        const id = clickedElement.getAttribute('href').replace('#', '');
        console.log('id', id);
        thisApp.activatePage(id);

        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function(pageId) {
    const thisApp = this;

    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }

    for (let link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.pages.active,
        link.getAttribute('href') == '#' + pageId
      );
    }
  },

  activateLanding: function() {
    const thisApp = this;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    // thisApp.cart.classList.toggle('none');

    for (let link of thisApp.navLinks) {
      if (window.location.hash != '#/start') {
        link.classList.remove('none');
      } else {
        link.classList.add('none');
      }
    }
  },

  initMenu: function() {
    const thisApp = this;
    console.log('thisAppData', thisApp.data);
    for (let productData in thisApp.data.products) {
      new Product(
        thisApp.data.products[productData].id,
        thisApp.data.products[productData]
      );
    }
  },

  initData: function() {
    const thisApp = this;
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;
    fetch(url)
      .then(function(rawResponse) {
        return rawResponse.json();
      })
      .then(function(parsedResponse) {
        thisApp.data.products = parsedResponse;
        app.initMenu();
      });
  },

  initBooking: function() {
    const thisApp = this;
    const bookingSubpage = document.querySelector(select.containerOf.booking);
    thisApp.booking = new Booking(bookingSubpage);
  },
  init: function() {
    const thisApp = this;
    // console.log('*** App starting ***');
    // console.log('thisApp:', thisApp);
    // console.log('classNames:', classNames);
    // console.log('settings:', settings);
    // console.log('templates:', templates);
    thisApp.initPages();
    thisApp.initData();
    thisApp.initBooking();
    window.onload = thisApp.activateLanding();
  },

  initCart: function() {
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    console.log('cartElem', cartElem);
    thisApp.cart = new Cart(cartElem);
    thisApp.productList = document.querySelector(select.containerOf.menu);
    console.log('thisApp.cart', thisApp.cart);
    thisApp.productList.addEventListener('add-to-cart', function(event) {
      event.preventDefault();
      console.log('app.cart', app.cart, event.detail.product);
      app.cart.add(event.detail.product);
    });
  },
};

app.init();
app.initCart();

// app.activateLanding();
