import { useEventStore } from '../../hooks/useEventForm';
import { Event } from '../../types';

describe('useEventStore', () => {
  beforeEach(() => {
    useEventStore.getState().resetForm();
    useEventStore.setState({});
  });

  it('초기 상태가 올바르게 설정되어야 한다', () => {
    const state = useEventStore.getState();
    expect(state.title).toBe('');
    expect(state.date).toBe('');
    expect(state.startTime).toBe('');
    expect(state.endTime).toBe('');
    expect(state.description).toBe('');
    expect(state.location).toBe('');
    expect(state.category).toBe('');
    expect(state.isRepeating).toBe(false);
    expect(state.repeatType).toBe('none');
    expect(state.repeatInterval).toBe(1);
    expect(state.repeatEndDate).toBe('');
    expect(state.notificationTime).toBe(10);
    expect(state.startTimeError).toBeNull();
    expect(state.endTimeError).toBeNull();
    expect(state.editingEvent).toBeNull();
  });

  it('setTitle을 호출하면 title 상태가 변경되어야 한다', () => {
    useEventStore.getState().setTitle('New Event');
    expect(useEventStore.getState().title).toBe('New Event');
  });

  it('setDate을 호출하면 date 상태가 변경되어야 한다', () => {
    useEventStore.getState().setDate('2024-10-15');
    expect(useEventStore.getState().date).toBe('2024-10-15');
  });

  it('setStartTime을 호출하면 startTime 상태가 변경되어야 한다', () => {
    useEventStore.getState().setStartTime('10:00');
    expect(useEventStore.getState().startTime).toBe('10:00');
  });

  it('resetForm을 호출하면 모든 상태가 초기 상태로 변경되어야 한다', () => {
    useEventStore.getState().setTitle('Temporary Title');
    useEventStore.getState().setStartTime('09:00');
    useEventStore.getState().resetForm();

    const state = useEventStore.getState();
    expect(state.title).toBe('');
    expect(state.startTime).toBe('');
    expect(state.endTime).toBe('');
  });

  it('editEvent을 호출하면 이벤트 데이터가 스토어에 반영되어야 한다', () => {
    const event: Event = {
      id: '1',
      title: '테스트 이벤트',
      date: '2024-10-20',
      startTime: '14:00',
      endTime: '15:00',
      description: '테스트 설명',
      location: '회의실 A',
      category: '업무',
      repeat: { type: 'daily', interval: 2, endDate: '2024-12-01' },
      notificationTime: 30,
    };

    useEventStore.getState().editEvent(event);

    expect(useEventStore.getState().title).toBe(event.title);
    expect(useEventStore.getState().date).toBe(event.date);
    expect(useEventStore.getState().startTime).toBe(event.startTime);
    expect(useEventStore.getState().endTime).toBe(event.endTime);
    expect(useEventStore.getState().description).toBe(event.description);
    expect(useEventStore.getState().location).toBe(event.location);
    expect(useEventStore.getState().category).toBe(event.category);
    expect(useEventStore.getState().isRepeating).toBe(true);
    expect(useEventStore.getState().repeatType).toBe(event.repeat.type);
    expect(useEventStore.getState().repeatInterval).toBe(event.repeat.interval);
    expect(useEventStore.getState().repeatEndDate).toBe(event.repeat.endDate);
    expect(useEventStore.getState().notificationTime).toBe(event.notificationTime);
  });
});
