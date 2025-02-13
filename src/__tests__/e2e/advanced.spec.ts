/* eslint-disable no-unused-vars */
import { exec } from 'child_process';
import { promisify } from 'util';

import { test, expect } from '@playwright/test';
import waitOn from 'wait-on';

const waitOnPromise = promisify(waitOn);

let serverProcess;
let clientProcess;

test.describe('e2e', () => {
  test.beforeAll(async () => {
    // 먼저 서버를 실행하도록 함
    serverProcess = exec('npx nodemon server.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Server error: ${error.message}`);
      }
      if (stderr) {
        console.error(`Server stderr: ${stderr}`);
      }
      console.log(`Server stdout: ${stdout}`);
    });

    // 그 다음 클라이언트를 실행하도록 함
    clientProcess = exec('pnpm dev', (error, stdout, stderr) => {
      if (error) {
        console.error(`Client error: ${error.message}`);
      }
      if (stderr) {
        console.error(`Client stderr: ${stderr}`);
      }
      console.log(`Client stdout: ${stdout}`);
    });

    // 클라이언트가 준비될 때까지 대기
    await waitOnPromise({
      resources: ['http://localhost:5173'],
      timeout: 10000,
    });
  });

  test('test', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('textbox', { name: '제목' }).click();
    await page.getByRole('textbox', { name: '제목' }).fill('반복 일정 테스트');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-02-05');
    await page.getByRole('textbox', { name: '시작 시간' }).click();
    await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowLeft');
    await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowUp');
    await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowRight');
    await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowUp');
    await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowRight');
    await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowUp');
    await page.getByRole('textbox', { name: '종료 시간' }).click();
    await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
    await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowRight');
    await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
    await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
    await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowRight');
    await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
    await page.getByRole('textbox', { name: '설명' }).click();
    await page.getByRole('textbox', { name: '설명' }).fill('ㅇㅇ');
    await page.getByRole('textbox', { name: '위치' }).click();
    await page.getByRole('textbox', { name: '위치' }).fill('ㅇㅇ');
    await page.getByLabel('카테고리').selectOption('업무');
    await page.locator('span').first().click();
    await page.getByLabel('반복 유형').selectOption('weekly');
    await page.getByLabel('반복 종료일 유형').selectOption('number');
    await page.getByRole('spinbutton', { name: '반복 횟수' }).click();
    await page.getByRole('spinbutton', { name: '반복 횟수' }).press('ArrowUp');
    await page.getByRole('spinbutton', { name: '반복 횟수' }).press('ArrowUp');
    await page.getByRole('spinbutton', { name: '반복 횟수' }).press('ArrowUp');
    await page.getByRole('spinbutton', { name: '반복 횟수' }).press('ArrowUp');
    await page.getByRole('spinbutton', { name: '반복 횟수' }).press('ArrowDown');
    await page.getByTestId('event-submit-button').click();
    await page.getByRole('cell', { name: '5 🔁 반복 일정 테스트' }).click();
    await page.getByRole('cell', { name: '12 🔁 반복 일정 테스트' }).click();
    await page.getByRole('cell', { name: '19 🔁 반복 일정 테스트' }).click();
    await page.getByRole('cell', { name: '26 🔁 반복 일정 테스트' }).click();
  });
});
