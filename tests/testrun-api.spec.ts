import { test, expect } from '@playwright/test';

const BASE_URL = 'https://takehome-desktop.d.tekvisionflow.com/api/testrun';

test.describe('Test Run API - profile 10001', () => {

  test('should create a test run and return a valid runId', async ({ request }) => {
    
    const payload = {
      interactionInformation: {
        interactionId: "CHAT-10001",
        channel: "Chat",
        authenticationStatus: "Authenticated",
        customerAccountNumber: "10001",
        journeyName: "Billing Support",
        queueName: "Billing Tier 1",
        agentDesktopStatus: "Connected",
        startTime: "2026-03-11T10:30:00Z"
      },
      chatTranscript: [
        {
          sender: "Customer",
          timestamp: "14:31:01",
          message: "I was charged twice this month."
        },
        {
          sender: "Bot",
          timestamp: "14:31:09",
          message: "I can help with billing issues."
        },
        {
          sender: "System",
          timestamp: "14:31:50",
          message: "Handoff to Billing Tier 1"
    }
      ]
    };

    const response = await request.post(BASE_URL, {
      data: payload
    });

    expect(response.status()).toBe(201);
    expect(new Date(response.headers()['Date'])).not.toBe('Invalid Date');
    expect(response.headers()['content-type']).toContain('application/json');
    

    const body = await response.json();

    
    console.log(response);
    console.log(body);
    // Validate runId exists
    expect(body).toHaveProperty('runId');
    expect(typeof body.runId).toBe('string');
    expect(body.runId.length).toBeGreaterThan(0);

    // Validate desktopUrl exists
    expect(body).toHaveProperty('desktopUrl');
    expect(typeof body.desktopUrl).toBe('string');
    expect(body.desktopUrl.length).toBeGreaterThan(0);
    
    // Validate createdAt exists
    expect(body).toHaveProperty('createdAt');
    expect(typeof body.createdAt).toBe('string');
    expect(body.createdAt.length).toBeGreaterThan(0);
    expect(new Date(response.headers()['Date'])).not.toBe('Invalid Date');
  });
  //runId: '38bb5482-c5ec-4182-a5d3-9cf31f3ec858',
  //desktopUrl: '/desktop/38bb5482-c5ec-4182-a5d3-9cf31f3ec858',
  //createdAt: '2026-03-23T18:46:31.398946140Z'


  test('should validate chat transcript structure', async ({ request }) => {
    const response = await request.get(BASE_URL);
    const body = await response.json();

    const transcript = body.chatTranscript;

    expect(Array.isArray(transcript)).toBeTruthy();
    expect(transcript.length).toBeGreaterThan(0);

    transcript.forEach((entry: any) => {
      expect(entry).toHaveProperty('sender');
      expect(entry).toHaveProperty('timestamp');
      expect(entry).toHaveProperty('message');

      expect(['Customer', 'Bot', 'System']).toContain(entry.sender);
      expect(entry.timestamp).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      expect(entry.message.length).toBeGreaterThan(0);
    });
  });

  test('should validate business logic: handoff occurs', async ({ request }) => {
    const response = await request.get(BASE_URL);
    const body = await response.json();

    const transcript = body.chatTranscript;

    const hasHandoff = transcript.some((entry: any) =>
      entry.message.includes('Handoff')
    );

    expect(hasHandoff).toBeTruthy();
  });

  test('should ensure chronological order of chat messages', async ({ request }) => {
    const response = await request.get(BASE_URL);
    const body = await response.json();

    const transcript = body.chatTranscript;

    const times = transcript.map((entry: any) => entry.timestamp);

    const sortedTimes = [...times].sort();

    expect(times).toEqual(sortedTimes);
  });

});