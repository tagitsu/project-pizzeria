import utils from '../utils.js';
import { settings, templates, select } from '../settings.js';

class Home {
  constructor(element) {
    const thisHome = this;
    thisHome.renderHome(element);
    thisHome.getElements(element);
    thisHome.initAction();
    
  }

  getElements(element) {
    const thisHome = this;
    thisHome.dom = {};

    thisHome.dom.container = element;
    thisHome.dom.serviceOrder = element.querySelector(select.services.order);
    thisHome.dom.serviceBook = element.querySelector(select.services.book);
  }


  renderHome(element) {
    const thisHome = this;

    const generatedHTML = templates.homePage(settings.restaurant);
    thisHome.home = utils.createDOMFromHTML(generatedHTML);
    element.appendChild(thisHome.home);
  }

  initAction() {
    const thisHome = this;

    console.log(this.dom.serviceOrder);
  }

}

export default Home;