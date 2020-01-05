import { select, settings } from '../settings.js';
import { utils } from '../utils.js';
import BaseWidget from './BaseWidget.js';
// import DatePicker from './DatePicker.js';
// import { booked } from './Booking.js';

class HourPicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, settings.hours.open);
    const thisWidget = this;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(
      select.widgets.hourPicker.input
    );
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(
      select.widgets.hourPicker.output
    );
    thisWidget.initPlugin();
    thisWidget.value = thisWidget.dom.input.value;

    // thisWidget.getDate();
  }
  initPlugin() {
    const thisWidget = this;
    rangeSlider.create(thisWidget.dom.input);
    thisWidget.dom.input.addEventListener('input', function() {
      thisWidget.value = thisWidget.dom.input.value;
    });
  }

  parseValue(value) {
    // console.log('value', value);
    // console.log('value II', utils.numberToHour(value));
    return utils.numberToHour(value);
  }
  isValid() {
    return true;
  }
  renderValue() {
    const thisWidget = this;
    thisWidget.dom.output.innerHTML = thisWidget.value;
    // console.log('thisWidget', thisWidget);
  }
}

export default HourPicker;
