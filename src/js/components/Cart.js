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
    thisCart.dom.deliveryFee = element.querySelector(select.cart.deliveryFee);
    thisCart.dom.subtotalPrice = element.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalNumber = element.querySelector(select.cart.totalNumber);
    thisCart.dom.totalPrice = element.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.productList = element.querySelector(select.cart.productList);
    thisCart.dom.form = element.querySelector(select.cart.form);
    thisCart.dom.address = thisCart.dom.form.querySelector(select.cart.address);
    thisCart.dom.phone = thisCart.dom.form.querySelector(select.cart.phone);
  }

  initActions() {
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function() {
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', function() {
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function() {
      thisCart.remove(event.detail.CartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function() {
      event.preventDefault();
      thisCart.sendOrder();
    });

  }

  add(menuProduct) {
    const thisCart = this;
    const generatedHTML = templates.cartProduct(menuProduct);
  
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    thisCart.dom.productList.appendChild(generatedDOM);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM)); // podane są prawidłowe dane a w tablicy błąd, szukam w konstruktorze 

    thisCart.update();
  }

  update() {
    const thisCart = this;
    let deliveryFee = settings.cart.defaultDeliveryFee;
    let totalNumber = 0;
    let subtotalPrice = 0;
    for(let product of thisCart.products) {
      totalNumber = totalNumber + product.amount;
      subtotalPrice = subtotalPrice + product.price;
    }

    thisCart.totalPrice = 0;
    if (subtotalPrice > 0) {
      thisCart.totalPrice = subtotalPrice + deliveryFee;
      thisCart.dom.deliveryFee.innerHTML = deliveryFee;
      for (let sum of thisCart.dom.totalPrice) {
        sum.innerHTML = thisCart.totalPrice;
      }
    } else if (subtotalPrice === 0) {
      thisCart.totalPrice = subtotalPrice + 0;
      thisCart.dom.deliveryFee.innerHTML = 0;
      for (let sum of thisCart.dom.totalPrice) {
        sum.innerHTML = thisCart.totalPrice;
      }
    }
    
    thisCart.dom.totalNumber.innerHTML = totalNumber;
    thisCart.dom.subtotalPrice.innerHTML = subtotalPrice;
    
  }

  remove(product) {
    const thisCart = this;

    product.dom.wrapper.remove();

    const removedProductIndex = thisCart.products.indexOf(product);
    thisCart.products.splice(removedProductIndex, 1);

    thisCart.update();
  }

  // [IN PROGRESS] create object with cart data to send to server
  sendOrder() {
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.orders;

    const payload = {};

    payload.address = thisCart.dom.address.value;
    payload.phone = thisCart.dom.phone.value;
    payload.totalPrice = thisCart.dom.totalPrice[0].innerText;
    payload.subtotalPrice = thisCart.dom.subtotalPrice.innerText;
    payload.totalNumber = thisCart.dom.totalNumber.innerText;
    payload.deliveryFee = thisCart.dom.deliveryFee.innerText;
    payload.products = [];
    for(let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }
    console.log('obiekt z danymi zamówienia payload', payload);

    const options = {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    };

    fetch(url, options);
  }
}

export default Cart;