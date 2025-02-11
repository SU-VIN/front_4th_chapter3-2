import { Event } from '../../types';
// import {
//   generateRecurringEvents,
//   modifySingleEvent,
//   deleteSingleEvent,
// } from '../utils/repeatUtils';

describe('반복 일정 유틸 함수 테스트', () => {
  const baseEvent: Event = {
    id: '1',
    title: '테스트 일정',
    date: '2024-01-01',
    startTime: '09:00',
    endTime: '10:00',
    description: '반복 일정 테스트',
    location: '온라인',
    category: '미팅',
    repeat: { type: 'weekly', interval: 1, endDate: '2024-02-05' }, // 5주 동안 반복
    notificationTime: 10,
  };

  it('매주 반복 일정이 5주 동안 생성되는지 확인', () => {
    const events = generateRecurringEvents(baseEvent);
    expect(events).toHaveLength(6); // 원본 포함 6개
    expect(events[0].date).toBe('2024-01-01'); // 시작 날짜
    expect(events[1].date).toBe('2024-01-08'); // 1주 뒤
    expect(events[5].date).toBe('2024-02-05'); // 마지막 일정
  });

  it('윤년 2월 29일이 비윤년에서는 2월 28일로 변경되는지 확인', () => {
    const leapYearEvent = {
      ...baseEvent,
      date: '2024-02-29',
      repeat: { type: 'yearly', interval: 1, endDate: '2028-02-29' },
    };

    const events = generateRecurringEvents(leapYearEvent);
    expect(events[1].date).toBe('2025-02-28'); // 2025년은 비윤년이므로 2월 28일
    expect(events[4].date).toBe('2028-02-29'); // 2028년은 윤년이므로 2월 29일 유지
  });

  it('2월이 아닐 때 마지막 날에 달마다 반복되는지 확인', () => {
    const newEvent = {
      ...baseEvent,
      date: '2024-03-31',
      repeat: { type: 'monthly', interval: 1, endDate: '2024-05-31' },
    };

    const events = generateRecurringEvents(newEvent);
    expect(events[1].date).toBe('2024-04-30'); // 4월은 30일까지 있음
    expect(events[2].date).toBe('2024-05-31'); // 5월은 31일까지 있음
  });

  it('특정 반복 일정만 개별 일정으로 수정되는지 확인', () => {
    const events = generateRecurringEvents(baseEvent);
    const updatedEvents = modifySingleEvent(events[2].id, events);

    expect(updatedEvents[2].repeat.type).toBe('none'); // 수정된 일정은 개별 일정
    expect(updatedEvents.length).toBe(events.length); // 이벤트 개수는 동일
  });

  it('특정 반복 일정만 삭제되는지 확인', () => {
    const events = generateRecurringEvents(baseEvent);
    const updatedEvents = deleteSingleEvent(events[3].id, events);

    expect(updatedEvents.length).toBe(events.length - 1); // 하나만 삭제됨
    expect(updatedEvents.find((e) => e.id === events[3].id)).toBeUndefined(); // 삭제된 ID는 존재하지 않음
  });
});
