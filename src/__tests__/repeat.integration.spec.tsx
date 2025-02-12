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
    date: '2025-02-10',
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
    title: '반복 이벤트 추가 테스트',
    date: '2025-02-12',
    startTime: '15:00',
    endTime: '16:00',
    description: '기존 팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'weekly', interval: 1, endDate: '2025-02-26' },
    notificationTime: 10,
  };

  beforeEach(() => {
    setupDateWithTime('2025-02-03', '09:00');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('반복 일정을 등록하면 반복 일정만큼 n개의 일정이 자동 추가 된다.', async () => {
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
    const repeatCheckbox = screen.getByLabelText('반복 일정');
    await user.click(repeatCheckbox);

    const repeatTypeSelect = screen.getByLabelText('반복 유형');
    const repeatIntervalInput = screen.getByLabelText('반복 간격');
    const repeatEndDateInput = screen.getByLabelText('반복 종료일');

    const addButton = screen.getByRole('button', { name: '일정 추가' });

    await user.type(titleInput, newEvent.title);
    await user.type(dateInput, newEvent.date);
    await user.type(startTimeInput, newEvent.startTime);
    await user.type(endTimeInput, newEvent.endTime);
    await user.type(descriptionInput, newEvent.description);
    await user.type(locationInput, newEvent.location);
    await user.selectOptions(categorySelect, newEvent.category);
    await user.selectOptions(notificationTimeSelect, newEvent.notificationTime.toString());

    await userEvent.selectOptions(repeatTypeSelect, newEvent.repeat.type);
    await userEvent.clear(repeatIntervalInput);
    await userEvent.type(repeatIntervalInput, newEvent.repeat.interval.toString());
    await userEvent.type(repeatEndDateInput, newEvent.repeat.endDate!);

    await user.click(addButton);

    const eventList = screen.getByTestId('event-list');

    const eventElements = await within(eventList).findAllByText(newEvent.title);
    expect(eventElements.length).toBe(3);
  });

  it('반복 일정을 수정하면 단일 일정으로 수정되어야한다.', async () => {
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
    const repeatCheckbox = screen.getByLabelText('반복 일정');
    await user.click(repeatCheckbox);

    const repeatTypeSelect = screen.getByLabelText('반복 유형');
    const repeatIntervalInput = screen.getByLabelText('반복 간격');
    const repeatEndDateInput = screen.getByLabelText('반복 종료일');

    const addButton = screen.getByRole('button', { name: '일정 추가' });

    await user.type(titleInput, newEvent.title);
    await user.type(dateInput, newEvent.date);
    await user.type(startTimeInput, newEvent.startTime);
    await user.type(endTimeInput, newEvent.endTime);
    await user.type(descriptionInput, newEvent.description);
    await user.type(locationInput, newEvent.location);
    await user.selectOptions(categorySelect, newEvent.category);
    await user.selectOptions(notificationTimeSelect, newEvent.notificationTime.toString());

    await userEvent.selectOptions(repeatTypeSelect, newEvent.repeat.type);
    await userEvent.clear(repeatIntervalInput);
    await userEvent.type(repeatIntervalInput, newEvent.repeat.interval.toString());
    await userEvent.type(repeatEndDateInput, newEvent.repeat.endDate!);

    await user.click(addButton);

    const eventList = screen.getByTestId('event-list');

    const eventElements = await within(eventList).findAllByText(newEvent.title);
    expect(eventElements.length).toBe(3);

    setupMockHandlerUpdating([...events]);

    const editIconButton = await screen.findAllByLabelText('Edit event');
    await user.click(editIconButton[0]);

    const editButton = screen.getByRole('button', { name: '일정 수정' });

    await user.clear(titleInput);
    await user.type(titleInput, '수정된 일정');

    await user.click(editButton);

    const updatedEventList = screen.getByTestId('event-list');

    const updatedEventElements = await within(updatedEventList).findAllByText('수정된 일정');
    expect(updatedEventElements.length).toBe(1);
    expect(within(updatedEventList).queryByText('🔁')).not.toBeInTheDocument();
  });

  it('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
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
    const repeatCheckbox = screen.getByLabelText('반복 일정');
    await user.click(repeatCheckbox);

    const repeatTypeSelect = screen.getByLabelText('반복 유형');
    const repeatIntervalInput = screen.getByLabelText('반복 간격');
    const repeatEndDateInput = screen.getByLabelText('반복 종료일');

    const addButton = screen.getByRole('button', { name: '일정 추가' });

    await user.type(titleInput, newEvent.title);
    await user.type(dateInput, newEvent.date);
    await user.type(startTimeInput, newEvent.startTime);
    await user.type(endTimeInput, newEvent.endTime);
    await user.type(descriptionInput, newEvent.description);
    await user.type(locationInput, newEvent.location);
    await user.selectOptions(categorySelect, newEvent.category);
    await user.selectOptions(notificationTimeSelect, newEvent.notificationTime.toString());

    await userEvent.selectOptions(repeatTypeSelect, newEvent.repeat.type);
    await userEvent.clear(repeatIntervalInput);
    await userEvent.type(repeatIntervalInput, newEvent.repeat.interval.toString());
    await userEvent.type(repeatEndDateInput, newEvent.repeat.endDate!);

    await user.click(addButton);

    const eventList = screen.getByTestId('event-list');

    const eventElements = await within(eventList).findAllByText(newEvent.title);
    expect(eventElements.length).toBe(3);

    setupMockHandlerDeletion([...events]);

    const deleteIconButton = await screen.findAllByLabelText('Delete event');
    await user.click(deleteIconButton[0]);

    expect(within(eventList).queryByText(events[0].title)).not.toBeInTheDocument(); // 없는걸 확인할땐, queryByText~!~!~
  });
});
