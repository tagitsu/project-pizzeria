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
  console.log(classNames);
  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };
  console.log(settings);
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
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.processOrder();
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

    getElements(){
      const thisProduct = this;
    
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    }

    initAccordion() {
      const thisProduct = this;
      /* find the clickable trigger (the element that should react to clicking) */
     

      /* START: add event listener to clickable trigger on event click */
      thisProduct.accordionTrigger.addEventListener('click', function(event) {
        /* prevent default action for event */
        event.defaultPrevented;

        /* find active product (product that has active class) */
        const activeProduct = document.querySelector(select.all.menuProductsActive);

        /* if there is active product and it's not thisProduct.element, remove class active from it */
        if(activeProduct && activeProduct !== thisProduct) {
          activeProduct.classList.remove('active');
        } else {
          /* toggle active class on thisProduct.element */
          thisProduct.element.classList.toggle('active'); 
        }
      });
    }

    initOrderForm() {
      const thisProduct = this;
      
      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
      
      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }
      
      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
    }

    processOrder() {
      const thisProduct = this;
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('to jest zmienna formData', formData);
    }
  }   
  app.init();
}  

//Przechodzimy po wszystkich opcjach produktu (thisProduct.data.params) i sprawdzamy każdą z nich. 
//Mamy bezpośrednią informację o domyślności (właściwość default) czy cenie (właściwość price). 
//Formularz wykorzystujemy tylko po to, aby ustalić, czy dana opcja była zaznaczona. 
//Tak, aby ustalić, co mamy zrobić z ceną. Zwiększyć ją? Zmniejszyć? A może nie ruszać?
//Chcesz wiedzieć, czy wybrano olives? Wystarczy sprawdzić, czy ten obiekt zawiera w toppings element olives.
// if(obj.toppings.includes('olives')) { console.log('Wybrano!'); }