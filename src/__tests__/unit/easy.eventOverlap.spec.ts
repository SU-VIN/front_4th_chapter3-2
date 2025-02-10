import { Event } from '../../types';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';

describe('parseDateTime', () => {
  it('2024-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    expect(parseDateTime('2024-07-01', '14:30')).toEqual(new Date('2024-07-01T14:30'));
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    expect(parseDateTime('2024-017-021', '14:30')).toEqual(new Date('Invalid Date'));
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    expect(parseDateTime('2024-07-01', '14:3')).toEqual(new Date('Invalid Date'));
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    expect(parseDateTime('', '14:30')).toEqual(new Date('Invalid Date'));
  });
});

describe('convertEventToDateRange', () => {
  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    const event: Event = {
      date: '2025-02-01',
      title: 'event1',
      id: '1',
      startTime: '14:00',
      endTime: '23:00',
      description: 'event1',
      location: '',
      category: 'test',
      repeat: {
        type: 'none',
        interval: 0,
        endDate: '2025-02-02',
      },
      notificationTime: 0,
    };

    expect(convertEventToDateRange(event)).toEqual({
      start: parseDateTime(event.date, event.startTime),
      end: parseDateTime(event.date, event.endTime),
    });
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const event: Event = {
      date: '2025-02-0',
      title: 'event1',
      id: '1',
      startTime: '14:00',
      endTime: '23:00',
      description: 'event1',
      location: '',
      category: 'test',
      repeat: {
        type: 'none',
        interval: 0,
        endDate: '2025-02-02',
      },
      notificationTime: 0,
    };

    expect(convertEventToDateRange(event)).toEqual({
      start: new Date('Invalid Date'),
      end: new Date('Invalid Date'),
    });
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const event: Event = {
      date: '2025-02-01',
      title: 'event1',
      id: '1',
      startTime: '14:2',
      endTime: '23:2',
      description: 'event1',
      location: '',
      category: 'test',
      repeat: {
        type: 'none',
        interval: 0,
        endDate: '2025-02-02',
      },
      notificationTime: 0,
    };

    expect(convertEventToDateRange(event)).toEqual({
      start: new Date('Invalid Date'),
      end: new Date('Invalid Date'),
    });
  });
});

describe('isOverlapping', () => {
  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {
    const event1: Event = {
      date: '2025-02-01',
      title: 'event1',
      id: '1',
      startTime: '14:00',
      endTime: '23:00',
      description: 'event1',
      location: '',
      category: 'test',
      repeat: {
        type: 'none',
        interval: 0,
        endDate: '2025-02-02',
      },
      notificationTime: 0,
    };

    const event2: Event = {
      date: '2025-02-01',
      title: 'event2',
      id: '2',
      startTime: '16:00',
      endTime: '18:00',
      description: 'event2',
      location: '',
      category: 'test',
      repeat: {
        type: 'none',
        interval: 0,
        endDate: '2025-02-02',
      },
      notificationTime: 0,
    };

    expect(isOverlapping(event1, event2)).toBe(true);
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
    const event1: Event = {
      date: '2025-02-01',
      title: 'event1',
      id: '1',
      startTime: '14:00',
      endTime: '16:00',
      description: 'event1',
      location: '',
      category: 'test',
      repeat: {
        type: 'none',
        interval: 0,
        endDate: '2025-02-02',
      },
      notificationTime: 0,
    };

    const event2: Event = {
      date: '2025-02-01',
      title: 'event2',
      id: '2',
      startTime: '16:00',
      endTime: '18:00',
      description: 'event2',
      location: '',
      category: 'test',
      repeat: {
        type: 'none',
        interval: 0,
        endDate: '2025-02-02',
      },
      notificationTime: 0,
    };

    expect(isOverlapping(event1, event2)).toBe(false);
  });
});

describe('findOverlappingEvents', () => {
  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    const event: Event = {
      date: '2025-02-01',
      title: 'event1',
      id: '1',
      startTime: '14:00',
      endTime: '23:00',
      description: 'event1',
      location: '',
      category: 'test',
      repeat: {
        type: 'none',
        interval: 0,
        endDate: '2025-02-02',
      },
      notificationTime: 0,
    };

    const events: Event[] = [
      {
        date: '2025-02-01',
        title: 'event1',
        id: '1',
        startTime: '14:00',
        endTime: '23:00',
        description: 'event1',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2025-02-02',
        },
        notificationTime: 0,
      },
      {
        date: '2025-02-01',
        title: 'event2',
        id: '2',
        startTime: '16:00',
        endTime: '18:00',
        description: 'event2',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2025-02-02',
        },
        notificationTime: 0,
      },
      {
        date: '2025-02-01',
        title: 'event3',
        id: '3',
        startTime: '15:00',
        endTime: '17:00',
        description: 'event3',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2025-02-02',
        },
        notificationTime: 0,
      },
    ];

    expect(findOverlappingEvents(event, events)).toEqual([events[1], events[2]]);
  });

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    const event: Event = {
      date: '2025-02-01',
      title: 'event1',
      id: '1',
      startTime: '14:00',
      endTime: '16:00',
      description: 'event1',
      location: '',
      category: 'test',
      repeat: {
        type: 'none',
        interval: 0,
        endDate: '2025-02-02',
      },
      notificationTime: 0,
    };

    const events: Event[] = [
      {
        date: '2025-02-01',
        title: 'event2',
        id: '2',
        startTime: '16:00',
        endTime: '18:00',
        description: 'event2',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2025-02-02',
        },
        notificationTime: 0,
      },
      {
        date: '2025-02-01',
        title: 'event3',
        id: '3',
        startTime: '18:00',
        endTime: '20:00',
        description: 'event3',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2025-02-02',
        },
        notificationTime: 0,
      },
    ];

    expect(findOverlappingEvents(event, events)).toEqual([]);
  });
});
