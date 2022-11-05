import { settings, select, classNames } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';
import Home from './components/Home.js';
import Slider from './components/Slider.js';


const app = {
  initPages: function() {
    const thisApp = this;
    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id; 
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

        // get id from href attribute
        const id = clickedElement.getAttribute('href').replace('#', '');
        // run activatePage method with that id
        thisApp.activatePage(id);
        // change URL hash
        window.location.hash = '#/' + id;
      });
    }

  },

  activatePage: function(pageId) {
    const thisApp = this;
    // add class active to matched subpage, and remove class active from non-matched subpage
    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
    // add class active to matched subpage link, and remove class active from non-matched subpage link
    for (let link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.nav.active, 
        link.getAttribute('href') == '#' + pageId
      );
    }
  },

  initMenu: function(){
    const thisApp = this;
    
    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initData: function() {
    const thisApp = this;

    thisApp.data = {};

    const url = settings.db.url + '/' + settings.db.products;
    const urlSlider = settings.db.url + '/' + settings.db.slider;

    fetch(url) 
      .then(function(rawResponse) {
        return rawResponse.json();
      })
      .then(function(parsedResponse) {
        // save parsedResponse as thisApp.data.products
        thisApp.data.products = parsedResponse;  
        // execute initMenu method
        thisApp.initMenu();  

      });
      /*  
      fetch(urlSlider) 
      .then(function(rawResponse) {
        return rawResponse.json();
      })
      .then(function(parsedResponse) {
        // save parsedResponse as thisApp.data.products
        thisApp.data.opinions = parsedResponse;  
        // execute initMenu method
        thisApp.initHome(thisApp.data.opinions);
      });  
      console.log('obiekt data', this.data); // ok
      */
  },

  initCart: function() {
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event) {
      
      app.cart.add(event.detail.product.prepareCartProduct());
    });
  },

  initBooking: function() {
    // get container of booking widget
    const bookingWidget = document.querySelector(select.containerOf.booking);
    // add a new instance with a parameter equal to container of booking widget
    new Booking(bookingWidget);
  },

  initHome: function() {
    const thisApp = this;

    const homeContainer = document.querySelector(select.containerOf.home);
    new Home(homeContainer);

    new Slider();
  },

  init: function() {
    const thisApp = this;
    thisApp.initPages();
    thisApp.initData();
    thisApp.initHome();
    thisApp.initCart();
    thisApp.initBooking();
  },
};

app.init();