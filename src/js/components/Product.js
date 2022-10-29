import {templates, select, classNames} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';

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
      event.preventDefault();

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
    thisProduct.priceSingle = price;

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
        // Zadanie 7.6 - poprawione
        if (optionSelected && !(option.default) === true) {
          price += option.price;
        // is there in formData property that name is equal to paramID AND it is NOT contain name of selected option AND option is default => price DOWN. 
        } else if (!optionSelected && option.default) { 
          price -= option.price;
        } 

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
    //app.cart.add(thisProduct.prepareCartProduct());

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });

    thisProduct.element.dispatchEvent(event);
  }

}   

export default Product;