import {DuetDateAdapter} from '@duetds/date-picker/dist/types/components/duet-date-picker/date-adapter';

const DATE_FORMAT = /^(\d{4})\-(\d{1,2})\-(\d{1,2})$/; // YYYY-MM-DD

export const duetDateAdapter: DuetDateAdapter = {
  parse(value = '', createDate) {
    const matches = value.match(DATE_FORMAT);

    if (matches) {
      return createDate(matches[3], matches[2], matches[1]);
    }
  },
  format(date: Date) {
    return `${date.getDate()} ${date.toLocaleString('default', {month: 'short'})} ${date.getFullYear()}`;
  }
};

export const getDuetLocalization = (locale: string) => {
  // if (locale === '...') {..}
  return {
    buttonLabel: 'Choose date',
    placeholder: 'D MMM YYYY',
    selectedDateMessage: 'Selected date is',
    prevMonthLabel: 'Previous month',
    nextMonthLabel: 'Next month',
    monthSelectLabel: 'Month',
    yearSelectLabel: 'Year',
    closeLabel: 'Close window',
    keyboardInstruction: 'You can use arrow keys to navigate dates',
    calendarHeading: 'Choose a date',
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    monthNames: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };
};
