import { act, renderHook } from '@testing-library/react';

import { useSearch } from '../../hooks/useSearch.ts';
import { Event } from '../../types.ts';

describe('useSearch', () => {
  let events: Event[];

  beforeEach(() => {
    events = [
      {
        date: '2025-02-01',
        title: 'event1회의',
        id: '1',
        startTime: '14:00',
        endTime: '23:00',
        description: 'event1',
        location: 'seoul',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2025-02-02',
        },
        notificationTime: 60,
      },
      {
        date: '2025-02-01',
        title: 'event2회의',
        id: '2',
        startTime: '16:00',
        endTime: '18:00',
        description: 'event2',
        location: 'busan',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2025-02-02',
        },
        notificationTime: 60,
      },
      {
        date: '2025-02-01',
        title: 'event3점심',
        id: '3',
        startTime: '15:00',
        endTime: '17:00',
        description: 'event3',
        location: 'jeju',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2025-02-02',
        },
        notificationTime: 60,
      },
      {
        date: '2025-02-12',
        title: 'event4점심',
        id: '4',
        startTime: '15:00',
        endTime: '17:00',
        description: 'event4',
        location: 'jeju',
        category: 'test',
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '2025-02-13',
        },
        notificationTime: 60,
      },
    ];
  });

  it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
    const { result } = renderHook(() => useSearch(events, new Date('2025-02-01'), 'month'));

    expect(result.current.filteredEvents).toEqual(events);
  });

  it('검색어에 맞는 이벤트만 필터링해야 한다', () => {
    const { result } = renderHook(() => useSearch(events, new Date('2025-02-01'), 'week'));

    act(() => {
      result.current.setSearchTerm('event1');
    });

    expect(result.current.filteredEvents).toEqual([events[0]]);
  });

  it('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
    const { result } = renderHook(() => useSearch(events, new Date('2025-02-01'), 'week'));

    act(() => {
      result.current.setSearchTerm('seoul');
    });

    expect(result.current.filteredEvents).toEqual([events[0]]);
  });

  it('현재 뷰(주간/월간)에 해당하는 이벤트만 반환해야 한다', () => {
    const { result } = renderHook(() => useSearch(events, new Date('2025-02-01'), 'week'));

    expect(result.current.filteredEvents).toEqual(events.slice(0, 3));
  });

  it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
    const { result } = renderHook(() => useSearch(events, new Date('2025-02-01'), 'month'));

    act(() => {
      result.current.setSearchTerm('회의');
    });

    expect(result.current.filteredEvents).toEqual(events.slice(0, 2));

    act(() => {
      result.current.setSearchTerm('점심');
    });

    expect(result.current.filteredEvents).toEqual(events.slice(2, 4));
  });
});
