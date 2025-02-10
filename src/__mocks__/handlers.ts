import { http, HttpResponse, HttpHandler } from 'msw';

import { Event } from '../types';
import { events } from './response/events.json' assert { type: 'json' };

// ! HARD
// ! 각 응답에 대한 MSW 핸들러를 작성해주세요. GET 요청은 이미 작성되어 있는 events json을 활용해주세요.

export const handlers: HttpHandler[] = [
  http.get('/api/events', () => {
    return HttpResponse.json({ events });
  }),

  http.post('/api/events', async ({ request }) => {
    let newEvent = (await request.json()) as Event;
    newEvent = { ...newEvent, id: String(events.length + 1) };

    return HttpResponse.json(newEvent, { status: 201 });
  }),

  http.put('/api/events/:id', async ({ params, request }) => {
    const { id } = params;
    let updateEvent = (await request.json()) as Event;
    const targetEvent = events.findIndex((event) => event.id === id);

    if (targetEvent !== -1) {
      events[targetEvent] = { ...events[targetEvent], ...updateEvent };
      return HttpResponse.json(events[targetEvent]);
    }

    return new HttpResponse(null, { status: 404 });
  }),

  http.delete('/api/events/:id', ({ params }) => {
    const { id } = params;
    const targetEvent = events.findIndex((event) => event.id === id);

    if (targetEvent !== -1) {
      events.splice(targetEvent, 1);
      return new HttpResponse(null, { status: 204 });
    }

    return new HttpResponse(null, { status: 404 });
  }),
];
