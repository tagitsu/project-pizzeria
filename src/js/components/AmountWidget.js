class AmountWidget {
  constructor(element) {
    const thisWidget = this;

    thisWidget.getElements(element);
    thisWidget.initActions();
    thisWidget.setValue(thisWidget.input.value || settings.amountWidget.defaultValue);
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
    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.element.dispatchEvent(event);

  }
}
