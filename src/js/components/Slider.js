import { templates } from '../settings.js';
import utils from '../utils.js';

class Slider {
  constructor (box, options, data) {
    const thisSlider = this;
    
    thisSlider.container = box;
    thisSlider.sliderOptions = options;
    thisSlider.data = data;
    console.log('this slider', this);
    thisSlider.render(box);
    thisSlider.initPlugin();
  }

  render() {
    const thisSlider = this;

    thisSlider.dom = {};
    thisSlider.dom.sliderBox = thisSlider.container;
    console.log('to jest box - kontener', this.box);
    console.log('box karuzeli', this.dom.sliderBox);
  }

  initPlugin() {
    const thisSlider = this;

    const elem = document.querySelector('.main-carousel');
    console.log('kontener karuzeli', elem);
    const flkty = new Flickity( elem, {
      cellAlign: 'left',
      autoPlay: 3000,
    });

    //generate divs
    
      // for (let opinion of thisSlider.data) {
      //   console.log('to jest opinia', opinion);
      //   const generatedHTML = templates.slider(opinion);
      //   console.log('html slajdu', generatedHTML);
      //   thisSlider.slide = utils.createDOMFromHTML(generatedHTML);
      //   console.log('jeden slide', this.slide);
      //   thisSlider.container.appendChild(thisSlider.slide);
      // }
  }
}

export default Slider;