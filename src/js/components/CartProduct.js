import {select} from '../settings.js';
import AmountWidget from './AmountWidget.js';

class CartProduct {
  constructor(menuProduct, element) {
    const thisCartProduct = this;

    thisCartProduct.id = menuProduct.id;
    thisCartProduct.name = menuProduct.name;
    thisCartProduct.amount = menuProduct.amount;
    thisCartProduct.price = menuProduct.price;
    thisCartProduct.priceSingle = menuProduct.priceSingle;
    thisCartProduct.params = menuProduct.params;

    thisCartProduct.getElements(element);
    thisCartProduct.initAmountWidget();
    thisCartProduct.initActions();
  }

  getElements(element) {
    const thisCartProduct = this;
    thisCartProduct.dom = {};

    thisCartProduct.dom.wrapper = element;
    thisCartProduct.dom.amount = element.querySelector(select.cartProduct.amountWidget);
    thisCartProduct.dom.price = element.querySelector(select.cartProduct.price);
    thisCartProduct.dom.edit = element.querySelector(select.cartProduct.edit);
    thisCartProduct.dom.remove = element.querySelector(select.cartProduct.remove);
  }

  initAmountWidget() {
    const thisCartProduct = this;

    thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amount);
    thisCartProduct.dom.amount.addEventListener('updated', function() {
      const productAmount = thisCartProduct.amountWidget.value;
      let productPrice = thisCartProduct.priceSingle;
      productPrice *= productAmount;
      thisCartProduct.dom.price.innerHTML = productPrice;
      thisCartProduct.price = productPrice;
      thisCartProduct.amount = productAmount;
    });
  }

  remove() {
    const thisCartProduct = this;

    const event = new CustomEvent('remove', {
      bubbles: true,
      detail: {
        CartProduct: thisCartProduct,
      },
    });
    thisCartProduct.dom.wrapper.dispatchEvent(event);
  }

  initActions() {
    const thisCartProduct = this;

    thisCartProduct.dom.edit.addEventListener('click', function() {
      event.preventDefault();
    });
    thisCartProduct.dom.remove.addEventListener('click', function() {
      event.preventDefault();
      thisCartProduct.remove();
    });
  }

  getData() {
    const thisCartProduct = this;

    const orderData = {};

    orderData.id = thisCartProduct.id;
    orderData.amount = thisCartProduct.amount;  
    orderData.price = thisCartProduct.price;
    orderData.priceSingle = thisCartProduct.priceSingle;
    orderData.name = thisCartProduct.name;
    orderData.params = thisCartProduct.params;

    return orderData;
  }
}

export default CartProduct;