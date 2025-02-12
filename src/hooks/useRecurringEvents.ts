import { useMemo } from 'react';

import { Event } from '../types';

export function useRecurringEvents(events: Event[]): Event[] {
  return useMemo(() => {
    return events.map((event) => ({
      ...event,
      isRecurring: event.repeat.type !== 'none',
    }));
  }, [events]);
}
