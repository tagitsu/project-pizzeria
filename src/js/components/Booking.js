import { templates, select, settings, classNames } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';
import Table from './Table.js';

class Booking {

  constructor(element) { 
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();
  }

  getData() {
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.bookingDate.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.bookingDate.maxDate);
    const params = {
      booking: [startDateParam, endDateParam],
      eventsCurrent: [settings.db.notRepeatParam, startDateParam, endDateParam],
      eventsRepeat: [settings.db.repeatParam, endDateParam],
    };

    //console.log('getData params', params);
    //console.log('booking', this);

    const urls = {
      bookings: settings.db.url + '/' + settings.db.bookings + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.events + '?' + params.eventsCurrent.join('&'),
      eventsRepeat: settings.db.url + '/' + settings.db.events + '?' + params.eventsRepeat.join('&'),
    };
    //console.log('urls', urls);

    Promise.all([
      fetch(urls.bookings),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponses) {
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];

        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]) {
        // console.log(bookings);
        // console.log(eventsCurrent);
        // console.log(eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;
    thisBooking.booked = {};

    for (let item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    for (let item of bookings) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    const minDate = thisBooking.bookingDate.minDate;
    const maxDate = thisBooking.bookingDate.maxDate;

    for (let item of eventsRepeat) {
      if (item.repeat == 'daily') {
        for (let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)) {
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }

    //console.log('booked', thisBooking.booked);
    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {
      //console.log('loop', hourBlock);
      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }
  
      thisBooking.booked[date][hourBlock].push(table);
    }

    
  }

  updateDOM() {
    const thisBooking = this;

    thisBooking.date = thisBooking.bookingDate.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.bookingHour.value);

    let allAvailable = false;

    if (
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ) {
      allAvailable = true;
    }
    
    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }

      if (
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }


  render(element) {
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element; 
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    thisBooking.dom.peopleAmount = element.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = element.querySelector(select.booking.hoursAmount);
    thisBooking.dom.bookingDate = element.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.bookingHour = element.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables = element.querySelectorAll(select.booking.tables);
    thisBooking.dom.bookingMap = element.querySelector(select.booking.map);
    thisBooking.dom.form = thisBooking.dom.wrapper.querySelector(select.booking.form)
    thisBooking.dom.submitBtn =  thisBooking.dom.form.querySelector(select.booking.formSubmit);
    thisBooking.dom.address =  thisBooking.dom.form.querySelector(select.booking.address);
    thisBooking.dom.phone =  thisBooking.dom.form.querySelector(select.booking.phone);
    thisBooking.dom.startersBox = thisBooking.dom.form.querySelector(select.booking.startersBox);
    thisBooking.dom.starters = thisBooking.dom.form.querySelectorAll(select.booking.starters);
  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.amountPeople = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.dom.peopleAmount.addEventListener('updated', function() {

    });

    thisBooking.amountHours = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.dom.hoursAmount.addEventListener('updated', function() {

    });

    thisBooking.bookingDate = new DatePicker(thisBooking.dom.bookingDate);
    thisBooking.dom.bookingDate.addEventListener('update', function() {
    });

    thisBooking.bookingHour = new HourPicker(thisBooking.dom.bookingHour);
    thisBooking.dom.bookingHour.addEventListener('update', function() {

    });

    thisBooking.dom.wrapper.addEventListener('updated', (event) => {
      event.preventDefault();
      const activeElement = event.target;

      if (activeElement) {
        for (let table of thisBooking.dom.tables) {
          if (table.classList.contains('loading')) {
            table.classList.remove(classNames.booking.loading);
          } else if (table.classList.contains(classNames.booking.tableBooked)) {
            const tableIdAttribute = table.getAttribute(settings.booking.tableIdAttribute);
            table.innerText = 'table-' + tableIdAttribute;
          }
        }
      }

      thisBooking.updateDOM();
    });

    thisBooking.dom.bookingMap.addEventListener('click', (event) => {
      event.preventDefault();
      const clickedElement = event.target;

      if (
        clickedElement.classList.contains('table')
        &&
        !clickedElement.classList.contains(classNames.booking.tableBooked)
        ) {
        //console.log('kliknięty został wolny stolik');
        const tableId = clickedElement.getAttribute(['data-table']);
        thisBooking.table = parseInt(tableId);
        //console.log('id stolika', tableId);
        new Table(tableId, thisBooking.date, thisBooking.hour, thisBooking.amountHours.correctValue, thisBooking.amountPeople.correctValue);
      } else if(
          clickedElement.classList.contains('table')
          &&
          clickedElement.classList.contains(classNames.booking.tableBooked)
          ) {
          //console.log('ten stolik jest juz zajęty');
          clickedElement.innerText = 'RESERVED';
          } else {
        //console.log('ten jest zarezerwowany lub to zupełnie nie jest stolik');
      }

      // [NOT WORKING] remove class 'loading' after secon click
      if (clickedElement.classList.contains(classNames.booking.loading)) {
        clickedElement.addEventListener('click', () => {
          console.log('drugi raz klikam na zielony stolik');
          clickedElement.classList.remove(classNames.booking.loading);
        });
      }
    });

    thisBooking.dom.submitBtn.addEventListener('click', (event) => {
      event.preventDefault();
      console.log('rezerwujesz stolik');
      thisBooking.sendBooking();
    });

    thisBooking.starters = [];
    thisBooking.dom.startersBox.addEventListener('change', (event) => {
      const thisBooking = this;
      const checkbox = event.target;
      console.log('checkbox', checkbox);
      
      if (checkbox.checked) {
        thisBooking.starters.push(checkbox.value);
      } else {
        const starterIndex = thisBooking.starters.indexOf(checkbox.value);
        thisBooking.starters.splice(starterIndex, 1);
      }
      console.log('tablica starterów po kliknieciu', this.starters);
    });

  }

  

  sendBooking() {
    const thisBooking = this;
    console.log('send booking method this', this);
    const url = settings.db.url + '/' + settings.db.bookings;
    console.log('adres do wysłania rezerwacji', url);
    const payload = {};

    payload.date =  thisBooking.bookingDate.correctValue;
    payload.hour =  thisBooking.bookingHour.correctValue;
    payload.table = thisBooking.table; // liczba
    payload.duration =  thisBooking.amountHours.correctValue; // liczba
    payload.ppl = thisBooking.amountPeople.correctValue; //liczba
    payload.starters = [];
    for (let starter of payload.starters) {

    }
    payload.phone = thisBooking.dom.phone.value;
    payload.address = thisBooking.dom.address.value;
    
    console.log('treść rezerwacji wysyłana na serwer', payload);
    const options = {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    };


    //fetch(url, options);
  }


}

export default Booking;