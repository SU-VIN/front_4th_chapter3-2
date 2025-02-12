import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import {
  setupMockHandlerCreation,
  setupMockHandlerDeletion,
  setupMockHandlerUpdating,
} from '../__mocks__/handlersUtils';
import App from '../App';
import { Event, EventForm } from '../types';

const renderApp = () => {
  render(
    <ChakraProvider>
      <App />
    </ChakraProvider>
  );
};

const setupDateWithTime = (dateString: string, timeString: string) => {
  const date = new Date(`${dateString}T${timeString}`);
  vi.setSystemTime(date);
};

const events: Event[] = [
  {
    id: '1',
    title: '기존 회의',
    date: '2025-02-05',
    startTime: '09:00',
    endTime: '10:00',
    description: '기존 팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
];

describe('일정 CRUD 및 기본 기능', () => {
  const newEvent: EventForm = {
    title: '이벤트 추가 테스트',
    date: '2025-02-05',
    startTime: '15:00',
    endTime: '16:00',
    description: '기존 팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'daily', interval: 1, endDate: '2025-02-07' },
    notificationTime: 10,
  };

  beforeEach(() => {
    setupDateWithTime('2025-02-03', '09:00');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.', async () => {
    setupMockHandlerCreation([...events]);

    renderApp();
    const user = userEvent.setup();

    const titleInput = screen.getByLabelText('제목');
    const dateInput = screen.getByLabelText('날짜');
    const startTimeInput = screen.getByLabelText('시작 시간');
    const endTimeInput = screen.getByLabelText('종료 시간');
    const descriptionInput = screen.getByLabelText('설명');
    const locationInput = screen.getByLabelText('위치');
    const categorySelect = screen.getByLabelText('카테고리');
    const notificationTimeSelect = screen.getByLabelText('알림 설정');

    const addButton = screen.getByRole('button', { name: '일정 추가' });

    await user.type(titleInput, newEvent.title);
    await user.type(dateInput, newEvent.date);
    await user.type(startTimeInput, newEvent.startTime);
    await user.type(endTimeInput, newEvent.endTime);
    await user.type(descriptionInput, newEvent.description);
    await user.type(locationInput, newEvent.location);
    await user.selectOptions(categorySelect, newEvent.category);
    await user.selectOptions(notificationTimeSelect, newEvent.notificationTime.toString());

    await user.click(addButton);

    const eventList = screen.getByTestId('event-list');

    expect(await within(eventList).findByText(newEvent.title)).toBeInTheDocument();
  });

  it('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영된다', async () => {
    setupMockHandlerUpdating([...events]);

    renderApp();
    const updatedEvent: EventForm = {
      title: '기존 회의',
      date: '2025-02-05',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };

    const user = userEvent.setup();

    const editIconButton = await screen.findByLabelText('Edit event');
    await user.click(editIconButton);

    const editButton = screen.getByRole('button', { name: '일정 수정' });

    const titleInput = screen.getByLabelText('제목');
    const dateInput = screen.getByLabelText('날짜');
    const startTimeInput = screen.getByLabelText('시작 시간');
    const endTimeInput = screen.getByLabelText('종료 시간');
    const descriptionInput = screen.getByLabelText('설명');
    const locationInput = screen.getByLabelText('위치');
    const categorySelect = screen.getByLabelText('카테고리');
    const notificationTimeSelect = screen.getByLabelText('알림 설정');
    const repeatCheckbox = screen.getByLabelText('반복 일정');

    await user.clear(titleInput);
    await user.type(titleInput, updatedEvent.title);
    await user.clear(dateInput);
    await user.type(dateInput, updatedEvent.date);
    await user.clear(startTimeInput);
    await user.type(startTimeInput, updatedEvent.startTime);
    await user.clear(endTimeInput);
    await user.type(endTimeInput, updatedEvent.endTime);
    await user.clear(descriptionInput);
    await user.type(descriptionInput, updatedEvent.description);
    await user.clear(locationInput);
    await user.type(locationInput, updatedEvent.location);
    await user.selectOptions(categorySelect, updatedEvent.category);
    await user.selectOptions(notificationTimeSelect, updatedEvent.notificationTime.toString());
    await user.click(repeatCheckbox);

    await user.click(editButton);

    const eventList = screen.getByTestId('event-list');

    expect(await within(eventList).findByText(updatedEvent.title)).toBeInTheDocument();
  });

  it('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
    setupMockHandlerDeletion([...events]);

    renderApp();

    const user = userEvent.setup();

    const deleteIconButton = await screen.findByLabelText('Delete event');
    await user.click(deleteIconButton);

    const eventList = screen.getByTestId('event-list');

    expect(within(eventList).queryByText(events[0].title)).not.toBeInTheDocument(); // 없는걸 확인할땐, queryByText~!~!~
  });
});

describe('일정 뷰', () => {
  beforeEach(() => {
    setupDateWithTime('2025-02-05', '09:00');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('주별 뷰를 선택 후 해당 주에 일정이 없으면, 일정이 표시되지 않는다.', async () => {
    renderApp();
    const user = userEvent.setup();

    const view = await screen.findByLabelText('view');
    await user.selectOptions(view, 'Week');

    const eventList = screen.getByTestId('event-list');
    expect(await within(eventList).findByText(/검색 결과가 없습니다/i)).toBeInTheDocument();
  });

  it('주별 뷰 선택 후 해당 일자에 일정이 존재한다면 해당 일정이 정확히 표시된다', async () => {
    setupMockHandlerCreation([...events]);
    renderApp();
    const user = userEvent.setup();

    const view = await screen.findByLabelText('view');
    await user.selectOptions(view, 'Week');

    const eventList = screen.getByTestId('event-list');
    expect(await within(eventList).findByText(events[0].title)).toBeInTheDocument();
  });

  it('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
    renderApp();
    const user = userEvent.setup();

    const view = await screen.findByLabelText('view');
    await user.selectOptions(view, 'Month');

    const eventList = screen.getByTestId('event-list');
    expect(await within(eventList).findByText(/검색 결과가 없습니다/i)).toBeInTheDocument();
  });

  it('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
    setupMockHandlerCreation([...events]);
    renderApp();
    const user = userEvent.setup();

    const view = await screen.findByLabelText('view');
    await user.selectOptions(view, 'Month');

    const eventList = screen.getByTestId('event-list');
    expect(await within(eventList).findByText(events[0].title)).toBeInTheDocument();
  });

  it('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {
    setupDateWithTime('2024-01-01', '09:00');
    renderApp();

    expect(await screen.findByText('신정')).toBeInTheDocument();
  });
});

describe('검색 기능', () => {
  beforeEach(() => {
    setupDateWithTime('2025-02-05', '09:00');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('검색 결과가 없으면, "검색 결과가 없습니다."가 표시되어야 한다.', async () => {
    setupMockHandlerCreation([...events]);
    renderApp();
    const user = userEvent.setup();

    const searchInput = screen.getByPlaceholderText('검색어를 입력하세요');
    await user.type(searchInput, '없어용~ㅋ');

    const eventList = screen.getByTestId('event-list');
    expect(await within(eventList).findByText(/검색 결과가 없습니다/i)).toBeInTheDocument();
  });

  it("'팀 회의'를 검색하면 해당 제목을 가진 일정이 리스트에 노출된다", async () => {
    const addEvents: Event[] = [
      {
        id: '1',
        title: '팀 회의',
        date: '2025-02-05',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ];
    setupMockHandlerCreation([...addEvents]);
    renderApp();
    const user = userEvent.setup();

    const searchInput = screen.getByPlaceholderText('검색어를 입력하세요');
    await user.type(searchInput, '팀 회의');

    const eventList = screen.getByTestId('event-list');
    expect(await within(eventList).findByText(addEvents[0].title)).toBeInTheDocument();
  });

  it('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {
    const addEvents: Event[] = [
      {
        id: '1',
        title: '팀 회의',
        date: '2025-02-05',
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
        title: '다른 회의',
        date: '2025-02-06',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ];

    setupMockHandlerCreation([...addEvents]);
    renderApp();
    const user = userEvent.setup();

    const searchInput = screen.getByPlaceholderText('검색어를 입력하세요');
    await user.type(searchInput, '팀 회의');

    const eventList = screen.getByTestId('event-list');
    expect(await within(eventList).findByText(addEvents[0].title)).toBeInTheDocument();

    await user.clear(searchInput);

    expect(await within(eventList).findByText(addEvents[1].title)).toBeInTheDocument();
  });
});

describe('일정 충돌', () => {
  beforeEach(() => {
    setupDateWithTime('2025-02-15', '09:00');
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다', async () => {
    setupMockHandlerCreation([...events]);

    renderApp();
    const user = userEvent.setup();

    const newEvent: EventForm = {
      title: '중복 이벤트 추가 테스트',
      date: '2025-02-05',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };

    const titleInput = screen.getByLabelText('제목');
    const dateInput = screen.getByLabelText('날짜');
    const startTimeInput = screen.getByLabelText('시작 시간');
    const endTimeInput = screen.getByLabelText('종료 시간');
    const descriptionInput = screen.getByLabelText('설명');
    const locationInput = screen.getByLabelText('위치');
    const categorySelect = screen.getByLabelText('카테고리');
    const notificationTimeSelect = screen.getByLabelText('알림 설정');
    const repeatCheckbox = screen.getByLabelText('반복 일정');

    const addButton = screen.getByRole('button', { name: '일정 추가' });

    await user.type(titleInput, newEvent.title);
    await user.type(dateInput, newEvent.date);
    await user.type(startTimeInput, newEvent.startTime);
    await user.type(endTimeInput, newEvent.endTime);
    await user.type(descriptionInput, newEvent.description);
    await user.type(locationInput, newEvent.location);
    await user.selectOptions(categorySelect, newEvent.category);
    await user.selectOptions(notificationTimeSelect, newEvent.notificationTime.toString());
    await user.click(repeatCheckbox);

    await user.click(addButton);

    expect(await screen.findByText(/일정 겹침 경고/i)).toBeInTheDocument();
  });

  it('기존 일정의 시간을 수정하여 충돌이 발생하면 경고가 노출된다', async () => {
    const updatedEvent: Event = {
      id: '2',
      title: '기존 회의',
      date: '2025-02-05',
      startTime: '11:00',
      endTime: '12:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };

    setupMockHandlerUpdating([...events, updatedEvent]);

    renderApp();
    const user = userEvent.setup();

    const editIconButton = await screen.findAllByLabelText('Edit event');
    await user.click(editIconButton[0]);

    const editButton = screen.getByRole('button', { name: '일정 수정' });

    const endTimeInput = screen.getByLabelText('종료 시간');

    await user.clear(endTimeInput);
    await user.type(endTimeInput, '11:30');

    await user.click(editButton);

    expect(await screen.findByText(/일정 겹침 경고/i)).toBeInTheDocument();
  });
});

it('notificationTime을 10으로 하면 지정 시간 10분 전 알람 텍스트가 노출된다', async () => {
  setupDateWithTime('2025-02-15', '09:00');
  const events: Event[] = [
    {
      id: '1',
      title: '기존 회의',
      date: '2025-02-15',
      startTime: '09:10',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ];
  setupMockHandlerCreation([...events]);

  renderApp();

  expect(await screen.findByText(/10분 후/i)).toBeInTheDocument();
});
