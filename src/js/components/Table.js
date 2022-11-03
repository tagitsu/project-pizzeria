import { classNames, select } from '../settings.js';
import Booking from "./Booking.js";

class Table {
  constructor(id, date, hour, duration, guests) {
    const thisTable = this;
    thisTable.id = id;
    thisTable.date = date;
    thisTable.hour = hour;
    thisTable.duration = duration;
    thisTable.guests = guests;

    thisTable.getElements();
    thisTable.bookTable();
  }

  getElements() {
    const thisTable = this;
  
    thisTable.dom = {};

    thisTable.dom.wrapper = document.querySelector(select.containerOf.booking);
    thisTable.dom.tables = thisTable.dom.wrapper.querySelectorAll(select.booking.tables);
  }

  bookTable() {
    const thisTable = this;

    for (let table of thisTable.dom.tables) {
      console.log('to jest stolik', table);
      if (table.getAttribute(['data-table']) === thisTable.id) {
        console.log('to jest kliknięty stolik');
        table.classList.add(classNames.booking.loading);
      } else {
        console.log('ten stolik nie został kliknięty');
        table.classList.remove(classNames.booking.loading);
      }
    }
  }
}

export default Table;