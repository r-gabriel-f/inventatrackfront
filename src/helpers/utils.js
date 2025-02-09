import moment from 'moment';
export function applyFormat(date, format = 'YYYY-MM-DD') {
    if (date) return moment(date).format(format);
    return moment().format(format);
  }