describe('Pairing Flow', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show pairing screen on first launch', async () => {
    await expect(element(by.id('pairing-screen'))).toBeVisible();
  });

  it('should have server URL input field', async () => {
    await expect(element(by.id('server-url-input'))).toBeVisible();
  });

  it('should have pairing code input field', async () => {
    await expect(element(by.id('pairing-code-input'))).toBeVisible();
  });

  it('should have pair button', async () => {
    await expect(element(by.id('pair-button'))).toBeVisible();
  });

  it('should show error for invalid server URL', async () => {
    await element(by.id('server-url-input')).typeText('invalid-url');
    await element(by.id('pairing-code-input')).typeText('12345678');
    await element(by.id('pair-button')).tap();
    await expect(element(by.text('Invalid server URL'))).toBeVisible();
  });
});
