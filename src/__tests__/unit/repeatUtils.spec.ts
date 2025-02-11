import { Event } from '../../types';
import {
  deleteSingleEvent,
  generateRecurringEvents,
  modifySingleEvent,
} from '../../utils/repeatUtils';

describe('반복 일정(유형, 간격) 유틸 함수 테스트', () => {
  const baseEvent: Event = {
    id: '1',
    title: '테스트 일정',
    date: '2024-01-01',
    startTime: '09:00',
    endTime: '10:00',
    description: '반복 일정 테스트',
    location: '온라인',
    category: '미팅',
    repeat: { type: 'daily', interval: 1, endDate: '2024-03-01' },
    notificationTime: 10,
  };

  it('매일 반복 일정이 생성되는지 확인', () => {
    expect(events).toHaveLength(61); // 원본 포함 61개
    expect(events[0].date).toBe('2024-01-01'); // 시작 날짜
    expect(events[1].date).toBe('2024-01-02'); // 1일 뒤
    expect(events[60].date).toBe('2024-03-01'); // 마지막 일정
  });

  it('매일 반복이 2일 간격으로 생성되는지 확인', () => {
    const dailyEvent: Event = {
      ...baseEvent,
      repeat: { type: 'daily', interval: 2, endDate: '2024-01-10' },
    };

    const events = generateRecurringEvents(dailyEvent);
    expect(events).toHaveLength(5); // 2일 간격으로 5번 생성
    expect(events[0].date).toBe('2024-01-01'); // 시작 날짜
    expect(events[1].date).toBe('2024-01-03'); // 2일 뒤
    expect(events[4].date).toBe('2024-01-09'); // 마지막 일정
  });

  it('매주 반복 일정이 5주 동안 생성되는지 확인', () => {
    const weeklyEvent: Event = {
      ...baseEvent,
      repeat: { type: 'weekly', interval: 1, endDate: '2024-02-05' },
    };

    const events = generateRecurringEvents(weeklyEvent);
    expect(events).toHaveLength(6); // 5주 + 원본
    expect(events[0].date).toBe('2024-01-01'); // 시작 날짜
    expect(events[1].date).toBe('2024-01-08'); // 1주 뒤
    expect(events[5].date).toBe('2024-02-05'); // 마지막 일정
  });

  it('매주 반복이 2주 간격으로 생성되는지 확인', () => {
    const weeklyEvent: Event = {
      ...baseEvent,
      repeat: { type: 'weekly', interval: 2, endDate: '2024-02-05' },
    };

    const events = generateRecurringEvents(weeklyEvent);
    expect(events).toHaveLength(3);
    expect(events[0].date).toBe('2024-01-01'); // 시작 날짜
    expect(events[1].date).toBe('2024-01-15'); // 2주 뒤
    expect(events[2].date).toBe('2024-01-29'); // 마지막 일정
  });

  it('매월 반복 일정이 3개월 동안 생성되는지 확인', () => {
    const monthlyEvent: Event = {
      ...baseEvent,
      date: '2024-01-12',
      repeat: { type: 'monthly', interval: 1, endDate: '2024-04-12' },
    };

    const events = generateRecurringEvents(monthlyEvent);
    expect(events).toHaveLength(4); // 3개월 + 원본
    expect(events[0].date).toBe('2024-01-12'); // 시작 날짜
    expect(events[1].date).toBe('2024-02-12'); // 1개월 뒤
    expect(events[3].date).toBe('2024-04-12'); // 마지막 일정
  });

  it('매월 반복이 2개월 간격으로 생성되는지 확인', () => {
    const monthlyEvent: Event = {
      ...baseEvent,
      date: '2024-01-12',
      repeat: { type: 'monthly', interval: 2, endDate: '2024-05-12' },
    };

    const events = generateRecurringEvents(monthlyEvent);
    expect(events).toHaveLength(3);
    expect(events[0].date).toBe('2024-01-12'); // 시작 날짜
    expect(events[1].date).toBe('2024-03-12'); // 2개월 뒤
    expect(events[2].date).toBe('2024-05-12'); // 마지막 일정
  });

  it('31일 매 달 반복일때 31이 없는 달에는 반복 없음', () => {
    const newEvent: Event = {
      ...baseEvent,
      date: '2024-01-31',
      repeat: { type: 'monthly', interval: 1, endDate: '2024-05-31' },
    };

    const events = generateRecurringEvents(newEvent);

    expect(events[1].date).toBe('2024-03-31'); // 3월은 31일까지 있음
    expect(events[2].date).toBe('2024-05-31'); // 4월은 30일까지 있음
  });

  it('30일 매 달 반복일때 30이 없는 달에는 반복 없음', () => {
    const newEvent: Event = {
      ...baseEvent,
      date: '2024-11-30',
      repeat: { type: 'monthly', interval: 1, endDate: '2025-04-30' },
    };

    const events = generateRecurringEvents(newEvent);
    expect(events[1].date).toBe('2024-12-30'); // 12월은 31일까지 있음
    expect(events[2].date).toBe('2025-01-30'); // 1월은 31일까지 있음
    expect(events[3].date).toBe('2025-03-30'); // 3월은 31일까지 있음
    expect(events[4].date).toBe('2025-04-30'); // 4월은 30일까지 있음
  });

  it('매년 반복 일정이 5년 동안 생성되는지 확인', () => {
    const yearlyEvent: Event = {
      ...baseEvent,
      date: '2024-01-12',
      repeat: { type: 'yearly', interval: 1, endDate: '2028-02-12' },
    };

    const events = generateRecurringEvents(yearlyEvent);
    expect(events).toHaveLength(5); // 5년 + 원본
    expect(events[0].date).toBe('2024-01-12'); // 시작 날짜
    expect(events[1].date).toBe('2025-01-12'); // 1년 뒤
    expect(events[4].date).toBe('2028-01-12'); // 마지막 일정
  });

  it('매년 반복이 2년 간격으로 생성되는지 확인', () => {
    const yearlyEvent: Event = {
      ...baseEvent,
      date: '2024-01-12',
      repeat: { type: 'yearly', interval: 2, endDate: '2028-02-12' },
    };

    const events = generateRecurringEvents(yearlyEvent);
    expect(events).toHaveLength(3);
    expect(events[0].date).toBe('2024-01-12'); // 시작 날짜
    expect(events[1].date).toBe('2026-01-12'); // 2년 뒤
    expect(events[2].date).toBe('2028-01-12'); // 마지막 일정
  });

  it('윤년 2월 29일이 비윤년에서는 2월 28일로 변경되는지 확인', () => {
    const leapYearEvent: Event = {
      ...baseEvent,
      date: '2024-02-29',
      repeat: { type: 'yearly', interval: 1, endDate: '2028-02-29' },
    };

    const events = generateRecurringEvents(leapYearEvent);
    expect(events[1].date).toBe('2025-02-28'); // 2025년은 비윤년이므로 2월 28일
    expect(events[4].date).toBe('2028-02-29'); // 2028년은 윤년이므로 2월 29일 유지
  });
});

describe('반복 일정 수정 및 삭제 테스트', () => {
  const baseEvent: Event[] = [
    {
      id: '1',
      title: '테스트 일정',
      date: '2024-01-01',
      startTime: '09:00',
      endTime: '10:00',
      description: '반복 일정 테스트',
      location: '온라인',
      category: '미팅',
      repeat: { type: 'daily', interval: 1, endDate: '2024-01-03' },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '테스트 일정',
      date: '2024-01-02',
      startTime: '09:00',
      endTime: '10:00',
      description: '반복 일정 테스트',
      location: '온라인',
      category: '미팅',
      repeat: { type: 'daily', interval: 1, endDate: '2024-01-03' },
      notificationTime: 10,
    },
    {
      id: '3',
      title: '테스트 일정',
      date: '2024-01-03',
      startTime: '09:00',
      endTime: '10:00',
      description: '반복 일정 테스트',
      location: '온라인',
      category: '미팅',
      repeat: { type: 'daily', interval: 1, endDate: '2024-01-03' },
      notificationTime: 10,
    },
  ];

  it('특정 반복 일정만 개별 일정으로 수정되는지 확인', () => {
    const updatedEvents = modifySingleEvent(baseEvent[2].id, baseEvent);

    expect(updatedEvents[2].repeat.type).toBe('none'); // 수정된 일정은 개별 일정
    expect(updatedEvents.length).toBe(baseEvent.length); // 이벤트 개수는 동일
  });

  it('특정 반복 일정만 삭제되는지 확인', () => {
    const updatedEvents = deleteSingleEvent(baseEvent[2].id, baseEvent);

    expect(updatedEvents.length).toBe(baseEvent.length - 1); // 하나만 삭제됨
    expect(updatedEvents.find((e) => e.id === baseEvent[2].id)).toBeUndefined(); // 삭제된 ID는 존재하지 않음
  });
});
