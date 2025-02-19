/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { useEventStore } from './../hooks/useEventForm.ts';
import { EndDateType, RepeatType } from './../types';
import { categories, notificationOptions } from '../constants/datas.ts';
import { getEndDate } from '../utils/endDateUtils.ts';
import { getTimeErrorMessage } from './../utils/timeValidation';

interface AddEventFormProps {
  addOrUpdateEvent: () => void;
}

function AddEventForm(props: AddEventFormProps) {
  const { addOrUpdateEvent } = props;

  const {
    title,
    date,
    startTime,
    endTime,
    description,
    location,
    category,
    isRepeating,
    repeatType,
    repeatInterval,
    repeatEndDate,
    notificationTime,
    startTimeError,
    endTimeError,
    editingEvent,
    setTitle,
    setDate,
    setDescription,
    setLocation,
    setCategory,
    setIsRepeating,
    setRepeatType,
    setRepeatInterval,
    setRepeatEndDate,
    setNotificationTime,
    setStartTime,
    setEndTime,
  } = useEventStore();

  const [endDateType, setEndDateType] = useState<EndDateType>('date');
  const [repeatCount, setRepeatCount] = useState<number>(1);

  useEffect(() => {
    if (repeatType === 'none') {
      setRepeatType('daily');
    }
  }, [repeatType, setRepeatType]);

  useEffect(() => {
    setEndDateHandler(endDateType);
  }, [endDateType, repeatCount]);

  const setEndDateHandler = (type: EndDateType) => {
    setEndDateType(type);

    if (type === 'none') {
      setRepeatEndDate('2025-06-30');
    } else if (type === 'number') {
      const endDate = getEndDate(date, repeatType, repeatInterval, repeatCount);
      setRepeatEndDate(endDate);
    }
  };

  return (
    <VStack w="400px" spacing={5} align="stretch">
      <Heading>{editingEvent ? '일정 수정' : '일정 추가'}</Heading>

      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </FormControl>

      <FormControl>
        <FormLabel>날짜</FormLabel>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </FormControl>

      <HStack width="100%">
        <FormControl>
          <FormLabel>시작 시간</FormLabel>
          <Tooltip label={startTimeError} isOpen={!!startTimeError} placement="top">
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              onBlur={() => getTimeErrorMessage(startTime, endTime)}
              isInvalid={!!startTimeError}
            />
          </Tooltip>
        </FormControl>
        <FormControl>
          <FormLabel>종료 시간</FormLabel>
          <Tooltip label={endTimeError} isOpen={!!endTimeError} placement="top">
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              onBlur={() => getTimeErrorMessage(startTime, endTime)}
              isInvalid={!!endTimeError}
            />
          </Tooltip>
        </FormControl>
      </HStack>

      <FormControl>
        <FormLabel>설명</FormLabel>
        <Input value={description} onChange={(e) => setDescription(e.target.value)} />
      </FormControl>

      <FormControl>
        <FormLabel>위치</FormLabel>
        <Input value={location} onChange={(e) => setLocation(e.target.value)} />
      </FormControl>

      <FormControl>
        <FormLabel>카테고리</FormLabel>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">카테고리 선택</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>반복 설정</FormLabel>
        <Checkbox isChecked={isRepeating} onChange={(e) => setIsRepeating(e.target.checked)}>
          반복 일정
        </Checkbox>
      </FormControl>

      <FormControl>
        <FormLabel>알림 설정</FormLabel>
        <Select
          value={notificationTime}
          onChange={(e) => setNotificationTime(Number(e.target.value))}
        >
          {notificationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormControl>

      {isRepeating && (
        <VStack width="100%">
          <FormControl>
            <FormLabel>반복 유형</FormLabel>
            <Select
              value={repeatType}
              onChange={(e) => setRepeatType(e.target.value as RepeatType)}
            >
              <option value="daily">매일</option>
              <option value="weekly">매주</option>
              <option value="monthly">매월</option>
              <option value="yearly">매년</option>
            </Select>
          </FormControl>
          {!editingEvent && (
            <>
              <FormControl>
                <FormLabel>반복 종료일 유형</FormLabel>
                <Select
                  value={endDateType}
                  onChange={(e) => setEndDateHandler(e.target.value as EndDateType)}
                >
                  <option value="date">특정 날짜</option>
                  <option value="number">반복 횟수</option>
                  <option value="none">종료 없음 (최대 2025-06-30까지)</option>
                </Select>
              </FormControl>
              {endDateType === 'number' && (
                <FormControl>
                  <FormLabel>반복 횟수</FormLabel>
                  <Input
                    type="number"
                    value={repeatCount}
                    onChange={(e) => setRepeatCount(Number(e.target.value))}
                    min={1}
                  />
                </FormControl>
              )}
            </>
          )}

          <HStack width="100%">
            <FormControl>
              <FormLabel>반복 간격</FormLabel>
              <Input
                type="number"
                value={repeatInterval}
                onChange={(e) => setRepeatInterval(Number(e.target.value))}
                min={1}
              />
            </FormControl>
            <FormControl>
              <FormLabel>반복 종료일</FormLabel>
              <Input
                type="date"
                value={repeatEndDate}
                onChange={(e) => setRepeatEndDate(e.target.value)}
                disabled={endDateType !== 'date'}
              />
            </FormControl>
          </HStack>
        </VStack>
      )}

      <Button data-testid="event-submit-button" onClick={addOrUpdateEvent} colorScheme="blue">
        {editingEvent ? '일정 수정' : '일정 추가'}
      </Button>
    </VStack>
  );
}

export default AddEventForm;
