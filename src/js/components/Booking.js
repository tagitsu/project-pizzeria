import { templates } from "../settings.js";

class Booking {

  constructor(element) { // element to kontener widgetu do rezerwacji
    const thisBooking = this;
    thisBooking.render(element);
    thisBooking.initWidgets();
  }

  render(element) {
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element; // kontener widgetu do rezrwacji
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
  }
}

export default Booking;