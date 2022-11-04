import utils from "../utils.js";
import { select, templates } from "../settings.js";

class Home {
  constructor() {
    const thisHome = this;

    thisHome.renderHome();
  }

  renderHome() {
    const thisHome = this;

    const generatedHTML = templates.homePage();
    thisHome.home = utils.createDOMFromHTML(generatedHTML);
    console.log('to jest html home', this.home);
    const homeContainer = document.querySelector(select.containerOf.home);
    homeContainer.appendChild(thisHome.home);
  }

}

export default Home;