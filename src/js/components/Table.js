import { classNames, select } from '../settings.js';

class Table {
  constructor(id, date, hour, duration, guests) {
    const thisTable = this;
    thisTable.id = id;
    thisTable.date = date;
    thisTable.hour = hour;
    thisTable.duration = duration;
    thisTable.guests = guests;
    thisTable.starters = [];

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
      if (table.getAttribute(['data-table']) === thisTable.id) {
        table.classList.add(classNames.booking.loading);
      } else {
        table.classList.remove(classNames.booking.loading);
      }
    }
  }


}

export default Table;