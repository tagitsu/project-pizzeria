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
    thisApp.serviceLinks = document.querySelectorAll(select.services.links);
    const idFromHash = window.location.hash.replace('#/', '');
    
    let links = [];
    for (let link of thisApp.navLinks) {
      links.push(link);
    }
    for (let link of thisApp.serviceLinks) {
      links.push(link);
    }

    let pageMatchingHash = thisApp.pages[0].id; 
    for (let page of thisApp.pages) {
      if (page.id == idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);

    for (let link of links) {
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

    const urlProd = settings.db.url + '/' + settings.db.products;

    fetch(urlProd) 
      .then(function(rawResponse) {
        return rawResponse.json();
      })
      .then(function(parsedResponse) {
        // save parsedResponse as thisApp.data.products
        thisApp.data.products = parsedResponse;  
        // execute initMenu method
        thisApp.initMenu();  
      });

    const urlSlide = settings.db.url + '/' + settings.db.slider;

    fetch(urlSlide) 
      .then(function(rawResponse) {
        return rawResponse.json();
      })
      .then(function(parsedResponse) {
        // save parsedResponse as thisApp.data.products
        thisApp.data.opinions = parsedResponse;  
        // execute initHome method
        thisApp.initHome(thisApp.data.opinions);
      });
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

  initHome: function(sliderData, galleryData) {
    const thisApp = this;
    const homeContainer = document.querySelector(select.containerOf.home);
    new Home(homeContainer, galleryData);
    thisApp.initPages();
    const sliderContainer = document.querySelector(select.containerOf.slider);
    new Slider(sliderContainer, sliderData);
  },

  init: function() {
    const thisApp = this;
    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
  },
};

app.init();