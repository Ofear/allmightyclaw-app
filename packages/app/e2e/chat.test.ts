describe('Chat Conversation', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show chat screen after pairing', async () => {
    await expect(element(by.id('chat-screen'))).toBeVisible();
  });

  it('should have message input field', async () => {
    await expect(element(by.id('message-input'))).toBeVisible();
  });

  it('should have send button', async () => {
    await expect(element(by.id('send-button'))).toBeVisible();
  });

  it('should send a message', async () => {
    await element(by.id('message-input')).typeText('Hello');
    await element(by.id('send-button')).tap();
    await expect(element(by.text('Hello'))).toBeVisible();
  });

  it('should show streaming response', async () => {
    await element(by.id('message-input')).typeText('Test message');
    await element(by.id('send-button')).tap();
    await waitFor(element(by.id('loading-indicator'))).toBeVisible();
  });

  it('should have chat history', async () => {
    await expect(element(by.id('chat-history'))).toBeVisible();
  });
});
