import { templates } from '../settings.js';
import utils from '../utils.js';

class Slider {
  constructor (element, data) {
    const thisSlider = this;
    
    thisSlider.data = data;
    thisSlider.render(element);
    thisSlider.initPlugin(element);
  }

  render(element) {
    const thisSlider = this;

    thisSlider.dom = {};
    thisSlider.dom.slideContainer = element;
  }

  initPlugin() {
    const thisSlider = this;

    const elem = document.querySelector('.main-carousel');
    const flkty = new Flickity( elem, {
      cellAlign: 'left',
      autoPlay: 3000,
      wrapAround: true,
    });

    let slideElements = [];
    for (let slideCell of flkty.cells) {
      const slideElement = slideCell.element;
      slideElements.push(slideElement);
    }

    thisSlider.slide = []; //tablica ze slajdami gotowymi do wstawienia do slidera

    for (let opinion of thisSlider.data) {
      const generatedHTML = templates.slide(opinion);
      thisSlider.slide.push(utils.createDOMFromHTML(generatedHTML));
    }  

    for (let i = 0; i < thisSlider.slide.length; i++) {
      slideElements[i].appendChild(thisSlider.slide[i]);
    }
  }
}

export default Slider;