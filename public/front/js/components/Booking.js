import { select, templates, settings, classNames } from '../settings.js';
import { utils } from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  constructor(subpage) {
    const thisBooking = this;
    console.log('constructorElement', thisBooking);
    thisBooking.render(subpage);
    thisBooking.initWidgets();
    thisBooking.getData();
  }

  getData() {
    const thisBooking = this;

    const startDateParam =
      settings.db.dateStartParamKey +
      '=' +
      utils.dateToStr(thisBooking.datePicker.minDate);

    const endDataParam =
      settings.db.dateEndParamKey +
      '=' +
      utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking: [startDateParam, endDataParam],

      eventsCurrent: [settings.db.notRepeatParam, startDateParam, endDataParam],

      eventsRepeat: [settings.db.repeatParam, endDataParam],
    };

    // console.log('get data params', params);

    const urls = {
      booking:
        settings.db.url +
        '/' +
        settings.db.booking +
        '?' +
        params.booking.join('&'),
      eventsCurrent:
        settings.db.url +
        '/' +
        settings.db.event +
        '?' +
        params.eventsCurrent.join('&'),
      eventsRepeat:
        settings.db.url +
        '/' +
        settings.db.event +
        '?' +
        params.eventsRepeat.join('&'),
    };
    // console.log('get data urls', urls);

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponse) {
        const bookingsResponse = allResponse[0];
        const eventsCurrentResponse = allResponse[1];
        const eventsRepeatResponse = allResponse[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]) {
        console.log('bookings', bookings);
        // console.log('eventsCurrent', eventsCurrent);
        // console.log('eventsRepeat', eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;
    thisBooking.booked = {};

    for (let item of bookings) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for (let item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for (let item of eventsRepeat) {
      if (item.repeat == 'daily') {
        for (
          let loopDate = minDate;
          loopDate <= maxDate;
          loopDate = utils.addDays(loopDate, 1)
        )
          thisBooking.makeBooked(
            utils.dateToStr(loopDate),
            item.hour,
            item.duration,
            item.table
          );
      }
    }

    thisBooking.updateDom();
    thisBooking.validateHour();
  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;
    console.log('makebooked', date, hour, duration, table);
    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for (
      let hourBlock = startHour;
      hourBlock < startHour + duration;
      hourBlock += 0.5
    ) {
      // console.log('makeBooked', date, hourBlock, table);
      if (!thisBooking.booked[date][hourBlock]) {
        thisBooking.booked[date][hourBlock] = [];
        console.log('test 1', date, thisBooking.booked[date]);
      }

      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  selectTables(table) {
    const thisBooking = this;
    console.log('selectTables');
    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
    thisBooking.options = thisBooking.dom.wrapper.querySelector(
      '.booking-options'
    );
    thisBooking.duration = thisBooking.options.querySelector(
      '.hours-amount input'
    ).value;
    thisBooking.people = thisBooking.options.querySelector(
      '.people-amount input'
    ).value;

    thisBooking.selectedTable = table;

    console.log('table', table.dataset.table);
    if (typeof thisBooking.booked[table] == 'undefined') {
      table.classList.add(classNames.booking.tableBooked);
    }
  }

  sendOrder(table) {
    console.log('sendorder');
    const thisBooking = this;
    const url = settings.db.url + '/' + settings.db.booking;
    const payload = {
      date: thisBooking.date,
      hour: utils.numberToHour(thisBooking.hour),
      duration: parseInt(thisBooking.duration),
      ppl: parseInt(thisBooking.people),
      table: parseInt(table.dataset.table),
      starters: [],
      repeat: false,
    };

    for (let starter of thisBooking.dom.starters) {
      if (starter.checked === true) {
        payload.starters.push(starter.value);
      }
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function(response) {
        return response.json();
      })
      .then(function(parsedResponse) {
        console.log('parsedResponse BOOKING', parsedResponse);
      });
  }

  validateHour() {
    const thisBooking = this;
    thisBooking.todayBooking = thisBooking.booked[thisBooking.datePicker.value];
    thisBooking.rangeSlider = document.querySelector('.rangeSlider');
    console.log('thisBooking.todayBooking', thisBooking.todayBooking);
    console.log('thisBooking.datePicker.value', thisBooking.datePicker.value);

    for (let today in thisBooking.todayBooking) {
      console.log(
        'today',
        today,
        thisBooking.todayBooking[today],
        thisBooking.todayBooking[today].length
      );
    }
    thisBooking.datePicker.dom.input.addEventListener('change', function() {
      thisBooking.validateHour();
    });
  }

  updateDom() {
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable = false;

    if (
      typeof thisBooking.booked[thisBooking.date] == 'undefined' ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] ==
        'undefined'
    ) {
      allAvailable = true;
    }

    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);

      console.log('thisBooking.booked', thisBooking.booked);
      console.log('thisBooking.booked 2', thisBooking.booked[thisBooking.date]);
      console.log(
        'dsfdsfsd',
        thisBooking.booked[thisBooking.date][thisBooking.hour]
      );
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }

      if (
        !allAvailable &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].indexOf(
          tableId
        ) > -1
      ) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }

  render(page) {
    const thisBooking = this;
    thisBooking.dom = {};
    const generatedHTML = templates.bookingWidget();
    thisBooking.dom.wrapper = page;
    thisBooking.dom.wrapper.appendChild(utils.createDOMFromHTML(generatedHTML));
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(
      select.booking.peopleAmount
    );
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(
      select.booking.hoursAmount
    );
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(
      select.widgets.datePicker.wrapper
    );
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(
      select.widgets.hourPicker.wrapper
    );
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(
      select.booking.tables
    );
    thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll(
      'input[name="starter"]'
    );

    console.log('this.dom.starters', this.dom.starters);

    for (let table of thisBooking.dom.tables) {
      table.addEventListener('click', () => {
        thisBooking.selectTables(table);
      });
    }
    thisBooking.dom.bookTable = thisBooking.dom.wrapper.querySelector(
      '.order-confirmation button'
    );

    thisBooking.dom.bookTable.addEventListener('click', function(event) {
      event.preventDefault();
      thisBooking.sendOrder(thisBooking.selectedTable);
    });
  }
  initWidgets() {
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    thisBooking.dom.wrapper.addEventListener('updated', function() {
      thisBooking.updateDom();
    });
  }
}
export default Booking;
