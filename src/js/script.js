/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product',
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
        input: 'input.amount',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    cart: {
      wrapperActive: 'active',
    },
  };
  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    },
    cart: {
      defaultDeliveryFee: 20,
    },
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
  };


  class AmountWidget {
    constructor(element) {
      const thisWidget = this;

      thisWidget.getElements(element);
      // będzie on oczekiwać na jeden element – referencję do diva z inputem i buttonami
      thisWidget.initActions();
      thisWidget.setValue(settings.amountWidget.defaultValue);
    }

    getElements(element) {
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = element.querySelector(select.widgets.amount.linkIncrease);
    }

    setValue(value) {
      const thisWidget = this;

      const newValue = parseInt(value);

      // TODO -  add validation
      if (thisWidget.value !== newValue && !(isNaN(newValue)) && newValue >= settings.amountWidget.defaultMin - settings.amountWidget.defaultValue && newValue <= settings.amountWidget.defaultMax + settings.amountWidget.defaultValue) {
        thisWidget.value = newValue;
      }

      thisWidget.input.value = thisWidget.value;

      thisWidget.announce();

    }

    initActions() {
      const thisWidget = this;

      thisWidget.input.addEventListener('change', function() {
        thisWidget.setValue(thisWidget.input.value);
      });
      thisWidget.linkDecrease.addEventListener('click', function(event) {
        event.preventDefault();
        thisWidget.setValue(thisWidget.value - 1);
      });
      thisWidget.linkIncrease.addEventListener('click', function(event) {
        event.preventDefault();
        thisWidget.setValue(thisWidget.value + 1);
      });

    }

    announce() {
      const thisWidget = this;

      const event = new Event('updated');
      thisWidget.element.dispatchEvent(event);
    }
  }

  class Cart {
    constructor(element) {
      const thisCart = this;

      thisCart.products = [];

      thisCart.getElements(element);
      thisCart.initActions();
    }

    getElements(element) {
      const thisCart = this;

      thisCart.dom = {};

      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = element.querySelector(select.cart.toggleTrigger);
    }

    initActions() {
      const thisCart = this;

      thisCart.dom.toggleTrigger.addEventListener('click', function() {
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });
    }

    add(menuProduct) {
      const thisCart = this;

      const generatedHTML = templates.cartProduct(menuProduct);
      thisCart.element = utils.createDOMFromHTML(generatedHTML);
      const cartContainer = document.querySelector(select.containerOf.cart);
      cartContainer.appendChild(thisCart.element);

      console.log('adding product', menuProduct);
    }
  }

  const app = {
    
    initMenu: function(){
      const thisApp = this;
      
      for (let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    initData: function() {
      const thisApp = this;

      thisApp.data = dataSource;
    },

    initCart: function() {
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
    },

    init: function() {
      const thisApp = this;

      thisApp.initData();
      thisApp.initMenu();
      thisApp.initCart();
    },
  };

  class Product {
    constructor(id, data) {
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
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

    getElements() {
      const thisProduct = this;
      
      thisProduct.dom = {};
    
      thisProduct.dom.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.dom.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.dom.formInputs = thisProduct.dom.form.querySelectorAll(select.all.formInputs);
      thisProduct.dom.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.dom.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.dom.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.dom.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }

    initAccordion() {
      const thisProduct = this;

      /* START: add event listener to clickable trigger on event click */
      thisProduct.dom.accordionTrigger.addEventListener('click', function(event) {
        /* prevent default action for event */
        event.defaultPrevented;

        /* find active product (product that has active class) */
        const activeProduct = document.querySelector(select.all.menuProductsActive);

        /* if there is active product and it's not thisProduct.element, remove class active from it */
        if (activeProduct && activeProduct !== thisProduct) {
          activeProduct.classList.remove('active');
        } else {
          /* toggle active class on thisProduct.element */
          thisProduct.element.classList.toggle('active'); 
        }
      });
    }

    initOrderForm() {
      const thisProduct = this;
      
      thisProduct.dom.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
      
      for (let input of thisProduct.dom.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }
      
      thisProduct.dom.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });
    }

    initAmountWidget() {
      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget(thisProduct.dom.amountWidgetElem);

      thisProduct.dom.amountWidgetElem.addEventListener('updated', function() {
        thisProduct.processOrder();
      });
    }

    processOrder() {
      const thisProduct = this;
    
      // convert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
      const formData = utils.serializeFormToObject(thisProduct.dom.form);
      // set price to default price
      let price = thisProduct.data.price;
    
      // for every category (param)...
      for (let paramId in thisProduct.data.params) {
        // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
        const param = thisProduct.data.params[paramId];
    
        // for every option in this category
        for (let optionId in param.options) {
          // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
          const option = param.options[optionId];
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);

          // is there in formData property that name is equal to paramID AND is it contain name of selected option AND option is NOT default => price UP. 
          if (optionSelected && !(option.default) === true) {
            price += option.price;
          // is there in formData property that name is equal to paramID AND it is NOT contain name of selected option AND option is default => price DOWN. 
          } else if (!optionSelected && option.default) { 
            price -= option.price;
          }
          thisProduct.priceSingle = price;

          // images
          const image = thisProduct.dom.imageWrapper.querySelector('.' + paramId + '-' + optionId);

          if (optionSelected && image !== null) {
            image.classList.add(classNames.menuProduct.imageVisible);
            // is there in formData property that name is equal to paramID AND it is NOT contain name of selected option AND option is default => price DOWN. 
          } else if (!optionSelected && image !== null) { 
            image.classList.remove(classNames.menuProduct.imageVisible);
          } 
        } 
      } 
      

      // multiply price by amount
      price *= thisProduct.amountWidget.value;
      // update calculated price in the HTML
      thisProduct.dom.priceElem.innerHTML = price;
      
    }

    prepareCartProductParams() {
      const thisProduct = this;
      
      const formData = utils.serializeFormToObject(thisProduct.dom.form);
      const cartProductParams = {};
      
      for (let paramId in thisProduct.data.params) {
        const param = thisProduct.data.params[paramId];

        cartProductParams[paramId] = {
          label: param.label,
          options: {}
        };

        for (let optionId in param.options) {
          const option = param.options[optionId];
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
          if (optionSelected) {
            cartProductParams[paramId].options[optionId] = option.label;
          } 
        }
      }
      return cartProductParams;
    }

    prepareCartProduct() {
      const thisProduct = this;
      const productSummary = {};
      productSummary.id = thisProduct.id;
      productSummary.name = thisProduct.data.name;
      productSummary.amount = thisProduct.amountWidget.value;
      productSummary.priceSingle = thisProduct.priceSingle;
      productSummary.price = parseInt(thisProduct.dom.priceElem.innerHTML) ;
      productSummary.params = thisProduct.prepareCartProductParams();
      
      return productSummary;
    }

    addToCart() {
      const thisProduct = this;
      app.cart.add(thisProduct.prepareCartProduct());
    }

  }   
  app.init();
}
