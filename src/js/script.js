/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  const app = {
    
    initMenu: function(){
      const thisApp = this;
      
      for(let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    initData: function() {
      const thisApp = this;

      thisApp.data = dataSource;
    },

    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
    },
  };

  // Naszą pierwszą klasą (schematem) będzie Product. 
  // Każdy produkt w menu naszej pizzerii będzie instancją tej klasy. 
  // Będzie ona odpowiedzialna za:

  // dodanie produktu do menu na stronie, wykorzystując szablon Handlebars,
  // uruchomienie akordeonu, czyli funkcjonalności pokazywanie i ukrywanie opcji produktu,
  // obliczanie ceny produktu z wybranymi opcjami.

  class Product {
    constructor(id, data){
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.initAccordion();

      console.log('new product:', thisProduct);
    }
    
    renderInMenu() {
      const thisProduct = this;
      // wygenerować kod HTML pojedynczego produktu,
      const generatedHTML = templates.menuProduct(thisProduct.data);
      // stworzyć element DOM na podstawie tego kodu produktu,
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      // znaleźć na stronie kontener menu,
      const menuContainer = document.querySelector(select.containerOf.menu);
      // wstawić stworzony element DOM do znalezionego kontenera menu.
      menuContainer.appendChild(thisProduct.element);
    }

    initAccordion() {
      const thisProduct = this;
      /* find the clickable trigger (the element that should react to clicking) */
      const clickableTriggers = document.querySelectorAll(select.menuProduct.clickable);
      console.log('to sa znalezione triggery:', clickableTriggers);
      for(let clickableTrigger of clickableTriggers) {
        /* START: add event listener to clickable trigger on event click */
        clickableTrigger.addEventListener('click', function(event) {
          /* prevent default action for event */
          event.defaultPrevented;
          /* find active product (product that has active class) */
          const activeProducts = document.querySelectorAll(select.all.menuProductsActive);
          console.log('to sa znalezione aktywne produkty:', activeProducts);
          /* if there is active product and it's not thisProduct.element, remove class active from it */
          //for(let activeProduct in activeProducts) {
          for(let activeProduct in activeProducts) {
            if(thisProduct !== activeProduct) {
              
            } 
          }
          /* toggle active class on thisProduct.element */
          thisProduct.element.classList.toggle('active'); 
        });
      }
      
       
    }
  }

  app.init();
}