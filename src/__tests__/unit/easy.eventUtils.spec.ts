import { Event } from '../../types';
import { getFilteredEvents } from '../../utils/eventUtils';

describe('getFilteredEvents', () => {
  it("검색어 '이벤트 2'에 맞는 이벤트만 반환한다", () => {
    const events: Event[] = [
      {
        date: '2024-07-01',
        title: '이벤트 1',
        id: '1',
        startTime: '14:00',
        endTime: '23:00',
        description: '이벤트 1',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2024-07-02',
        },
        notificationTime: 0,
      },
      {
        date: '2024-07-01',
        title: '이벤트 2',
        id: '2',
        startTime: '14:00',
        endTime: '23:00',
        description: '이벤트 2',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2024-07-02',
        },
        notificationTime: 0,
      },
    ];

    expect(getFilteredEvents(events, '이벤트 2', new Date('2024-07-01'), 'week')).toEqual([
      {
        date: '2024-07-01',
        title: '이벤트 2',
        id: '2',
        startTime: '14:00',
        endTime: '23:00',
        description: '이벤트 2',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2024-07-02',
        },
        notificationTime: 0,
      },
    ]);
  });

  it('주간 뷰에서 2024-07-01 주의 이벤트만 반환한다', () => {
    const events: Event[] = [
      {
        date: '2024-07-01',
        title: '이벤트 1',
        id: '1',
        startTime: '14:00',
        endTime: '23:00',
        description: '이벤트 1',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2024-07-02',
        },
        notificationTime: 0,
      },
      {
        date: '2024-07-08',
        title: '이벤트 2',
        id: '2',
        startTime: '14:00',
        endTime: '23:00',
        description: '이벤트 2',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2024-07-08',
        },
        notificationTime: 0,
      },
    ];

    expect(getFilteredEvents(events, '', new Date('2024-07-01'), 'week')).toEqual([
      {
        date: '2024-07-01',
        title: '이벤트 1',
        id: '1',
        startTime: '14:00',
        endTime: '23:00',
        description: '이벤트 1',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2024-07-02',
        },
        notificationTime: 0,
      },
    ]);
  });

  it('월간 뷰에서 2024년 7월의 모든 이벤트를 반환한다', () => {
    const events: Event[] = [
      {
        date: '2024-07-01',
        title: '이벤트 1',
        id: '1',
        startTime: '14:00',
        endTime: '23:00',
        description: '이벤트 1',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2024-07-02',
        },
        notificationTime: 0,
      },
      {
        date: '2024-07-08',
        title: '이벤트 2',
        id: '2',
        startTime: '14:00',
        endTime: '23:00',
        description: '이벤트 2',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2024-07-08',
        },
        notificationTime: 0,
      },
      {
        date: '2024-08-08',
        title: '이벤트 3',
        id: '3',
        startTime: '14:00',
        endTime: '23:00',
        description: '이벤트 3',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2024-08-08',
        },
        notificationTime: 0,
      },
    ];

    expect(getFilteredEvents(events, '', new Date('2024-07-01'), 'month')).toEqual([
      {
        date: '2024-07-01',
        title: '이벤트 1',
        id: '1',
        startTime: '14:00',
        endTime: '23:00',
        description: '이벤트 1',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2024-07-02',
        },
        notificationTime: 0,
      },
      {
        date: '2024-07-08',
        title: '이벤트 2',
        id: '2',
        startTime: '14:00',
        endTime: '23:00',
        description: '이벤트 2',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2024-07-08',
        },
        notificationTime: 0,
      },
    ]);
  });

  it("검색어 '이벤트'와 주간 뷰 필터링을 동시에 적용한다", () => {
    const events: Event[] = [
      {
        date: '2024-07-01',
        title: '이벤트 1',
        id: '1',
        startTime: '14:00',
        endTime: '23:00',
        description: '이벤트 1',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2024-07-02',
        },
        notificationTime: 0,
      },
      {
        date: '2024-07-08',
        title: '이벤트 2',
        id: '2',
        startTime: '14:00',
        endTime: '23:00',
        description: '이벤트 2',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2024-07-08',
        },
        notificationTime: 0,
      },
      {
        date: '2024-08-08',
        title: '이벤트 3',
        id: '3',
        startTime: '14:00',
        endTime: '23:00',
        description: '이벤트 3',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2024-08-08',
        },
        notificationTime: 0,
      },
    ];

    expect(getFilteredEvents(events, '이벤트', new Date('2024-07-01'), 'week')).toEqual([
      {
        date: '2024-07-01',
        title: '이벤트 1',
        id: '1',
        startTime: '14:00',
        endTime: '23:00',
        description: '이벤트 1',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2024-07-02',
        },
        notificationTime: 0,
      },
    ]);
  });

  it('검색어가 없을 때 모든 이벤트를 반환한다', () => {
    const events: Event[] = [
      {
        date: '2024-07-01',
        title: '이벤트 1',
        id: '1',
        startTime: '14:00',
        endTime: '23:00',
        description: '이벤트 1',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2024-07-02',
        },
        notificationTime: 0,
      },
      {
        date: '2024-07-02',
        title: '이벤트 2',
        id: '2',
        startTime: '14:00',
        endTime: '23:00',
        description: '이벤트 2',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2024-07-02',
        },
        notificationTime: 0,
      },
      {
        date: '2024-07-03',
        title: '이벤트 3',
        id: '3',
        startTime: '14:00',
        endTime: '23:00',
        description: '이벤트 3',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2024-07-03',
        },
        notificationTime: 0,
      },
    ];

    expect(getFilteredEvents(events, '', new Date('2024-07-01'), 'week')).toEqual(events);
  });

  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    const events: Event[] = [
      {
        date: '2024-07-01',
        title: 'event 1',
        id: '1',
        startTime: '14:00',
        endTime: '23:00',
        description: 'event 1',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2024-07-02',
        },
        notificationTime: 0,
      },
      {
        date: '2024-07-02',
        title: 'Event 2',
        id: '2',
        startTime: '14:00',
        endTime: '23:00',
        description: 'Event 2',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2024-07-02',
        },
        notificationTime: 0,
      },
      {
        date: '2024-07-03',
        title: 'EVENT 3',
        id: '3',
        startTime: '14:00',
        endTime: '23:00',
        description: 'EVENT 3',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2024-07-03',
        },
        notificationTime: 0,
      },
    ];

    expect(getFilteredEvents(events, 'event', new Date('2024-07-01'), 'week')).toEqual(events);
  });

  it('월의 경계에 있는 이벤트를 올바르게 필터링한다', () => {
    const events: Event[] = [
      {
        date: '2024-08-31',
        title: '이벤트 1',
        id: '1',
        startTime: '14:00',
        endTime: '23:00',
        description: '이벤트 1',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2024-08-31',
        },
        notificationTime: 0,
      },
      {
        date: '2024-09-01',
        title: '이벤트 2',
        id: '2',
        startTime: '14:00',
        endTime: '23:00',
        description: '이벤트 2',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2024-09-01',
        },
        notificationTime: 0,
      },
    ];

    expect(getFilteredEvents(events, '', new Date('2024-08-31'), 'week')).toEqual([
      {
        date: '2024-08-31',
        title: '이벤트 1',
        id: '1',
        startTime: '14:00',
        endTime: '23:00',
        description: '이벤트 1',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2024-08-31',
        },
        notificationTime: 0,
      },
    ]);
  });

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    expect(getFilteredEvents([], '', new Date('2024-07-01'), 'week')).toEqual([]);
  });
});
