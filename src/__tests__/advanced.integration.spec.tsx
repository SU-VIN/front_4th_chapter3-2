import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import AddEventForm from '../components/AddEventForm';
import { useEventStore } from '../hooks/useEventForm.ts';

const renderApp = (addOrUpdateEvent: () => void) => {
  render(
    <ChakraProvider>
      <AddEventForm addOrUpdateEvent={addOrUpdateEvent} />
    </ChakraProvider>
  );
};

const setupDateWithTime = (dateString: string, timeString: string) => {
  const date = new Date(`${dateString}T${timeString}`);
  vi.setSystemTime(date);
};

describe('AddEventForm', () => {
  beforeEach(() => {
    useEventStore.getState().resetForm();
    useEventStore.setState({});
  });

  const mockAddOrUpdateEvent = vi.fn();

  it('폼이 정상적으로 렌더링되는지 확인', () => {
    renderApp(mockAddOrUpdateEvent);

    expect(screen.getByLabelText('제목')).toBeInTheDocument();
    expect(screen.getByLabelText('날짜')).toBeInTheDocument();
    expect(screen.getByLabelText('시작 시간')).toBeInTheDocument();
    expect(screen.getByLabelText('종료 시간')).toBeInTheDocument();
    expect(screen.getByLabelText('설명')).toBeInTheDocument();
    expect(screen.getByLabelText('위치')).toBeInTheDocument();
    expect(screen.getByLabelText('카테고리')).toBeInTheDocument();
    expect(screen.getByLabelText('알림 설정')).toBeInTheDocument();
  });

  it('입력값 변경 시 Zustand 상태가 업데이트되는지 확인', async () => {
    renderApp(mockAddOrUpdateEvent);
    const user = userEvent.setup();

    const titleInput = screen.getByLabelText('제목');
    await user.type(titleInput, '회의');

    expect(useEventStore.getState().title).toBe('회의');
  });

  it('"일정 추가" 버튼 클릭 시 addOrUpdateEvent가 호출되는지 확인', async () => {
    renderApp(mockAddOrUpdateEvent);
    const user = userEvent.setup();

    const addButton = screen.getByRole('button', { name: '일정 추가' });
    await user.click(addButton);

    expect(mockAddOrUpdateEvent).toHaveBeenCalledTimes(1);
  });

  it('반복 설정 체크박스 선택 시 반복 필드가 나타나는지 확인', async () => {
    renderApp(mockAddOrUpdateEvent);
    const user = userEvent.setup();

    const repeatCheckbox = screen.getByLabelText('반복 일정');
    await user.click(repeatCheckbox);

    expect(screen.getByLabelText('반복 유형')).toBeInTheDocument();
    expect(screen.getByLabelText('반복 간격')).toBeInTheDocument();
    expect(screen.getByLabelText('반복 종료일')).toBeInTheDocument();
  });
});
