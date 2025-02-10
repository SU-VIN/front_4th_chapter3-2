import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

describe('getUpcomingEvents', () => {
  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    const now = new Date('2024-07-01T13:00');
    const events: Event[] = [
      {
        date: '2024-07-01',
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
          endDate: '2024-07-02',
        },
        notificationTime: 60,
      },
    ];
    const notifiedEvents: string[] = [];

    expect(getUpcomingEvents(events, now, notifiedEvents)).toEqual([events[0]]);
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    const now = new Date('2024-07-01T13:00');
    const events: Event[] = [
      {
        date: '2024-07-01',
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
          endDate: '2024-07-02',
        },
        notificationTime: 60,
      },
    ];
    const notifiedEvents: string[] = ['1'];

    expect(getUpcomingEvents(events, now, notifiedEvents)).toEqual([]);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    const now = new Date('2024-07-01T13:00');
    const events: Event[] = [
      {
        date: '2024-07-01',
        title: 'event1',
        id: '1',
        startTime: '19:00',
        endTime: '23:00',
        description: 'event1',
        location: '',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2024-07-02',
        },
        notificationTime: 120,
      },
    ];
    const notifiedEvents: string[] = [];

    expect(getUpcomingEvents(events, now, notifiedEvents)).toEqual([]);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    const now = new Date('2024-07-01T15:00');
    const events: Event[] = [
      {
        date: '2024-07-01',
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
          endDate: '2024-07-02',
        },
        notificationTime: 60,
      },
    ];
    const notifiedEvents: string[] = [];

    expect(getUpcomingEvents(events, now, notifiedEvents)).toEqual([]);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    const event: Event = {
      date: '2024-07-01',
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
        endDate: '2024-07-02',
      },
      notificationTime: 60,
    };

    expect(createNotificationMessage(event)).toBe('60분 후 event1 일정이 시작됩니다.');
  });
});
