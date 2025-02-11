import { Event, EventForm } from '../types';
import { getDaysInMonth } from './dateUtils';

export function generateRecurringEvents(event: Event): EventForm[] {
  const { repeat, ...baseEvent } = event;
  if (repeat.type === 'none') return [event];

  const recurringEvents: EventForm[] = [];
  let currentDate = new Date(event.date);

  const endDate = repeat.endDate ? new Date(repeat.endDate) : null;

  while (!endDate || currentDate <= endDate) {
    recurringEvents.push({
      ...baseEvent,
      date: currentDate.toISOString().split('T')[0],
      repeat: repeat,
    });

    if (repeat.type === 'daily') {
      currentDate.setDate(currentDate.getDate() + repeat.interval);
    } else if (repeat.type === 'weekly') {
      currentDate.setDate(currentDate.getDate() + repeat.interval * 7);
    } else if (repeat.type === 'monthly') {
      const originalDay = currentDate.getDate();
      currentDate.setMonth(currentDate.getMonth() + repeat.interval);

      const lastDayOfMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth() + 1);

      if (originalDay > lastDayOfMonth) {
        currentDate.setDate(lastDayOfMonth);
      } else {
        currentDate.setDate(originalDay);
      }
    } else if (repeat.type === 'yearly') {
      const nextYear = currentDate.getFullYear() + repeat.interval;
      if (endDate && nextYear > endDate.getFullYear()) break;
      currentDate.setFullYear(nextYear);

      const isLeapYear = (nextYear % 4 === 0 && nextYear % 100 !== 0) || nextYear % 400 === 0;
      if (!isLeapYear && currentDate.getMonth() === 2 && currentDate.getDate() === 1) {
        currentDate.setDate(0);
      } else if (isLeapYear && currentDate.getMonth() === 1 && currentDate.getDate() === 28) {
        currentDate.setDate(29);
      }
    }
  }

  return recurringEvents;
}
