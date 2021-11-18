import moment from 'moment';


const MinMaxTimeValidator = {
  key: 'validate.timeMinMax',
  message(component) {
    const minTime = moment(component.component.minTime || '00:00:00', 'HH:mm:ss').format('HH:mm');
    const maxTime = moment(component.component.maxTime || '23:59:59', 'HH:mm:ss').format('HH:mm');

    return component.t('invalid_time', {
      minTime: minTime,
      maxTime: maxTime
    });
  },
  check(component, setting, value) {
    if (!value) return true;

    const minTime = component.component.minTime ? moment(component.component.minTime, 'HH:mm:ss') : null;
    const maxTime = component.component.maxTime ? moment(component.component.maxTime, 'HH:mm:ss') : null;
    const parsedValue =  moment(value, 'HH:mm:ss');

    if (minTime && parsedValue < minTime) return false;
    if (maxTime && parsedValue >= maxTime) return false;
    return true;
  }
};

export default MinMaxTimeValidator;
