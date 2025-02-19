import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import {
  setupMockHandlerCreation,
  setupMockHandlerDeletion,
  setupMockHandlerUpdating,
} from '../../__mocks__/handlersUtils.ts';
import { events } from '../../__mocks__/response/events.json' assert { type: 'json' };
import { useEventOperations } from '../../hooks/useEventOperations.ts';
import { server } from '../../setupTests.ts';
import { Event, EventForm } from '../../types.ts';

const initialEvents = events as Event[];

const toast = vi.fn();
vi.mock('@chakra-ui/react', () => ({ useToast: () => toast }));

it('저장되어있는 초기 이벤트 데이터를 적절하게 불러온다', async () => {
  const { result } = renderHook(() => useEventOperations(false));

  await waitFor(() => {
    expect(result.current.events).toEqual(initialEvents);
  });
});

it('정의된 이벤트 정보를 기준으로 적절하게 저장이 된다', async () => {
  setupMockHandlerCreation(initialEvents); // mock handler 덮어씌우기

  const newEvent: EventForm = {
    title: '이벤트 추가 테스트',
    date: '2024-10-15',
    startTime: '09:00',
    endTime: '10:00',
    description: '기존 팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  };

  const { result } = renderHook(() => useEventOperations(false));

  await waitFor(() => {
    expect(result.current.events).toEqual(initialEvents);
  });

  act(() => {
    result.current.saveEvent(newEvent);
  });

  await waitFor(() => {
    expect(result.current.events.some((e) => e.title === newEvent.title)).toBeTruthy();
  });
});

it("새로 정의된 'title', 'endTime' 기준으로 적절하게 일정이 업데이트 된다", async () => {
  const initEvents: Event[] = [
    {
      id: '1',
      title: '기존 회의1',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '기존 회의2',
      date: '2024-10-16',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ];
  setupMockHandlerUpdating(initEvents);

  const updatedEvent: Event = {
    id: '1',
    title: '기존 회의1 수정 테스트~',
    date: '2024-10-15',
    startTime: '09:00',
    endTime: '11:00',
    description: '기존 팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  };

  const { result } = renderHook(() => useEventOperations(true));

  await waitFor(() => {
    expect(result.current.events).toEqual(initEvents);
  });

  act(() => {
    result.current.saveEvent(updatedEvent);
  });

  await waitFor(() => {
    expect(result.current.events.find((e) => e.id === '1')).toEqual({
      ...events.find((e) => e.id === '1'),
      ...updatedEvent,
    });
  });
});

it('존재하는 이벤트 삭제 시 에러없이 아이템이 삭제된다.', async () => {
  const initEvents: Event[] = [
    {
      id: '1',
      title: '기존 회의1',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '기존 회의2',
      date: '2024-10-16',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ];
  setupMockHandlerDeletion(initEvents);

  const { result } = renderHook(() => useEventOperations(false));

  await waitFor(() => {
    expect(result.current.events).toEqual(initEvents);
  });

  act(() => {
    result.current.deleteEvent('2');
  });

  await waitFor(() => {
    expect(result.current.events).not.toContainEqual(initEvents[1]);
  });
});

it("이벤트 로딩 실패 시 '이벤트 로딩 실패'라는 텍스트와 함께 에러 토스트가 표시되어야 한다", async () => {
  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events }, { status: 500 });
    })
  );

  renderHook(() => useEventOperations(false));

  await waitFor(() => {
    expect(toast).toBeCalledWith({
      title: '이벤트 로딩 실패',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  });
});

it("존재하지 않는 이벤트 수정 시 '일정 저장 실패'라는 토스트가 노출되며 에러 처리가 되어야 한다", async () => {
  const initEvents: Event[] = [
    {
      id: '1',
      title: '기존 회의1',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '기존 회의2',
      date: '2024-10-16',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ];
  setupMockHandlerUpdating(initEvents);

  const updatedEvent: Event = {
    id: '3',
    title: '없는 이벤트 수정 테스트~',
    date: '2024-10-15',
    startTime: '09:00',
    endTime: '11:00',
    description: '기존 팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  };

  const { result } = renderHook(() => useEventOperations(true));

  await waitFor(() => {
    expect(result.current.events).toEqual(initEvents);
  });

  act(() => {
    result.current.saveEvent(updatedEvent);
  });

  await waitFor(() => {
    expect(toast).toBeCalledWith({
      title: '일정 저장 실패',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  });
});

it("네트워크 오류 시 '일정 삭제 실패'라는 텍스트가 노출되며 이벤트 삭제가 실패해야 한다", async () => {
  server.use(
    http.delete('/api/events/:id', () => {
      return HttpResponse.error();
    })
  );

  const { result } = renderHook(() => useEventOperations(false));

  await result.current.deleteEvent('1');

  await waitFor(() => {
    expect(toast).toBeCalledWith({
      title: '일정 삭제 실패',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  });
});
