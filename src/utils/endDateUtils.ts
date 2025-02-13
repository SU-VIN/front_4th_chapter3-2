import { RepeatType } from '../types';
import { getDaysInMonth } from './dateUtils';

export function getEndDate(
  date: string,
  repeatType: RepeatType,
  repeatInterval: number,
  repeatCount: number
): string {
  if (repeatType === 'none' || repeatCount <= 1) return date;

  let endDate = new Date(date);

  for (let i = 1; i < repeatCount; i++) {
    if (repeatType === 'daily') {
      endDate.setDate(endDate.getDate() + repeatInterval);
    } else if (repeatType === 'weekly') {
      endDate.setDate(endDate.getDate() + repeatInterval * 7);
    } else if (repeatType === 'monthly') {
      const originalDay = endDate.getDate();
      endDate.setMonth(endDate.getMonth() + repeatInterval);
      const lastDayOfMonth = getDaysInMonth(endDate.getFullYear(), endDate.getMonth() + 1);
      endDate.setDate(originalDay > lastDayOfMonth ? lastDayOfMonth : originalDay);
    } else if (repeatType === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + repeatInterval);
    }
  }

  return endDate.toISOString().split('T')[0];
}
