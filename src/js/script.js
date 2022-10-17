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
  console.log(classNames); // zostawiłam specjalnie żeby tuskrunner nie wyświetlał mi błędu, że stała nie została użyta 
  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };
  console.log(settings); // tak jak powyżej
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
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      console.log('thisProduct.imageWrapper:', thisProduct.imageWrapper);
    }

    initAccordion() {
      const thisProduct = this;

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
    
      // convert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('zawartość formData', formData);
      // set price to default price
      let price = thisProduct.data.price;
    
      // for every category (param)...
      for(let paramId in thisProduct.data.params) {
        // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
        const param = thisProduct.data.params[paramId];
        console.log('to jest param', param);
    
        // for every option in this category
        for(let optionId in param.options) {
          // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
          const option = param.options[optionId];
          
          // is there in formData property that name is equal to paramID AND is it contain name of selected option AND option is NOT default => price UP. 
          if(formData[paramId] && formData[paramId].includes(optionId) && !(option.default) == true) {
            price += option.price;
          // is there in formData property that name is equal to paramID AND it is NOT contain name of selected option AND option is default => price DOWN. 
          } else if(formData[paramId] && !(formData[paramId].includes(optionId)) && option.default == true) { 
            price -= option.price;
          }

          // images
          const image = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
          console.log('zawartość image', image);

           if(formData[paramId] && formData[paramId].includes(optionId) && image == true) {
             console.log('opcja zaznaczona');
             console.log('img ma klasę active');
             image.classList.add(classNames.menuProduct.imageVisible);
             // is there in formData property that name is equal to paramID AND it is NOT contain name of selected option AND option is default => price DOWN. 
           } else if(formData[paramId] && !(formData[paramId].includes(optionId)) && image == true) { 
             console.log('opcja nie zaznaczona');
             console.log('img nie ma klasy active jesli posiada jakąkolwiek inną klasę');
             image.classList.remove(classNames.menuProduct.imageVisible);
           } 
          

            // selected option 
          
          
        } 
      }     
      // update calculated price in the HTML
      thisProduct.priceElem.innerHTML = price;
    }
  }   
  app.init();
}
