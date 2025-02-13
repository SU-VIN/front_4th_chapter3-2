/* eslint-disable no-unused-vars */
import { test, expect } from '@playwright/test';

test.describe('e2e 시나리오 테스트', () => {
  test('일정에 대한 CRUD 및 반복 종료일 옵션 테스트', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('textbox', { name: '제목' }).click();
    await page.getByRole('textbox', { name: '제목' }).fill('반복 일정 테스트');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-02-05');
    await page.getByRole('textbox', { name: '시작 시간' }).click();
    await page.getByRole('textbox', { name: '시작 시간' }).fill('09:00');
    await page.getByRole('textbox', { name: '종료 시간' }).click();
    await page.getByRole('textbox', { name: '종료 시간' }).fill('19:00');
    await page.getByRole('textbox', { name: '설명' }).click();
    await page.getByRole('textbox', { name: '설명' }).fill('ㅇㅇ');
    await page.getByRole('textbox', { name: '위치' }).click();
    await page.getByRole('textbox', { name: '위치' }).fill('ㅇㅇ');
    await page.getByLabel('카테고리').selectOption('업무');
    await page.locator('span').first().click();
    await page.getByLabel('반복 유형').selectOption('weekly');
    await page.getByLabel('반복 종료일 유형').selectOption('number');
    await page.getByRole('spinbutton', { name: '반복 횟수' }).click();
    await page.getByRole('spinbutton', { name: '반복 횟수' }).fill('4');
    await page.getByTestId('event-submit-button').click();

    expect(await page.getByRole('cell', { name: '5 🔁 반복 일정 테스트' }).click());
    expect(await page.getByRole('cell', { name: '12 🔁 반복 일정 테스트' }).click());
    expect(await page.getByRole('cell', { name: '19 🔁 반복 일정 테스트' }).click());
    expect(await page.getByRole('cell', { name: '26 🔁 반복 일정 테스트' }).click());

    await page.getByRole('button', { name: 'Edit event' }).first().click();
    await page.getByRole('textbox', { name: '제목' }).click();
    await page.getByRole('textbox', { name: '제목' }).fill('반복 일정 테스트 단일로 수정');
    await page.getByTestId('event-submit-button').click();
    expect(await page.getByRole('cell', { name: '반복 일정 테스트 단일로 수정' }).click());

    await page.getByRole('button', { name: 'Delete event' }).first().click();
    await page.getByRole('button', { name: 'Delete event' }).first().click();
    await page.getByRole('button', { name: 'Delete event' }).first().click();
    await page.getByRole('button', { name: 'Delete event' }).first().click();

    expect(await page.getByText('검색 결과가 없습니다').click());
  });
});
