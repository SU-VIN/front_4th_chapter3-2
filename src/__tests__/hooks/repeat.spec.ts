import { renderHook } from '@testing-library/react';

import { useRecurringEvents } from '../../hooks/useRecurringEvents.ts';
import { Event } from '../../types.ts';

const events: Event[] = [
  {
    id: '1',
    title: '반복 이벤트',
    date: '2025-02-12',
    startTime: '18:00',
    endTime: '19:00',
    description: '기존 팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'weekly', interval: 1, endDate: '2025-03-5' },
    notificationTime: 10,
  },
  {
    id: '2',
    title: '기존 이벤트',
    date: '2025-02-15',
    startTime: '18:00',
    endTime: '19:00',
    description: '기존 팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
];

describe('useRecurringEvents Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-02-10T17:50:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('반복 일정 유무에 따라 isRecurring값이 적용 되야 한다.', () => {
    const { result } = renderHook(() => useRecurringEvents(events));

    expect(result.current[0].isRecurring).toBe(true);
    expect(result.current[1].isRecurring).toBe(false);
  });

  it('이벤트가 없는 경우 빈 배열을 반환해야 한다', () => {
    const { result } = renderHook(() => useRecurringEvents([]));

    expect(result.current).toEqual([]);
  });
});
