import { templates } from '../settings.js';
import utils from '../utils.js';

class Slider {
  constructor (element, data) {
    const thisSlider = this;
    
    thisSlider.data = data;
    console.log('this slider', this);
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
    });
    console.log('nowy element Flickity', flkty);
    console.log('jak dostac sie do komórki slidera', flkty.cells[0].element);
    console.log('init pl data', this.data);

    let slideElements = [];
    for (let slideCell of flkty.cells) {
      console.log('cells', slideCell);
      const slideElement = slideCell.element;
      console.log('to jest element slideCell', slideElement);
      slideElements.push(slideElement);
    }
    console.log('tablica z elementami carousel-cell', slideElements);

    thisSlider.slide = []; //tablica ze slajdami gotowymi do wstawienia do slidera

    for (let opinion of thisSlider.data) {
      const generatedHTML = templates.slide(opinion);
      thisSlider.slide.push(utils.createDOMFromHTML(generatedHTML));
    }  

    for (let i = 0; i < 3; i++) {
      slideElements[i].appendChild(thisSlider.slide[i]);
    }
  }
}

export default Slider;