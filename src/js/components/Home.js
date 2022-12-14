import utils from '../utils.js';
import { settings, templates, select } from '../settings.js';

class Home {
  constructor(element) {
    const thisHome = this;
    thisHome.data = {};
    thisHome.renderHome(element);
    thisHome.getData();
    thisHome.getElements(element);
    
  }

  getElements(element) {
    const thisHome = this;
    thisHome.dom = {};

    thisHome.dom.container = element;
    thisHome.dom.services = element.querySelector(select.containerOf.services);
    thisHome.dom.serviceLinks = thisHome.dom.services.querySelectorAll('a');
    thisHome.dom.serviceOrder = element.querySelector(select.services.order);
    thisHome.dom.serviceBook = element.querySelector(select.services.book);
    thisHome.dom.photoBoxes = element.querySelectorAll(select.containerOf.photo);
  }

  getData() {
    const thisHome = this;
    const urlGallery = settings.db.url + '/' + settings.db.gallery;

    fetch(urlGallery)
      .then(function(rawResponse) {
        return rawResponse.json();
      })
      .then(function(parsedResponse) {
        thisHome.data.gallery = parsedResponse;
        thisHome.renderGallery(thisHome.data.gallery);
      });
  }

  renderHome(element) {
    const thisHome = this;

    const generatedHTML = templates.homePage(settings.restaurant);
    thisHome.home = utils.createDOMFromHTML(generatedHTML);
    element.appendChild(thisHome.home);
  }

  renderGallery(data) {
    const thisHome = this;

    thisHome.photos = [];

    for (let i = 0; i < data.images.length; i++) {
      const generatedHTML = `<img src="${data.images[i]}" alt="${data.alts[i]}">`;
      const photo = utils.createDOMFromHTML(generatedHTML);
      thisHome.photos.push(photo);
    }

    for (let i = 0; i < thisHome.photos.length; i++) {
      thisHome.dom.photoBoxes[i].appendChild(thisHome.photos[i]);
    }
  }
}

export default Home;