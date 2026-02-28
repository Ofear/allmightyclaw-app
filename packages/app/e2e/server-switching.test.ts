describe('Server Switching', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have server picker in dashboard', async () => {
    await expect(element(by.id('server-picker'))).toBeVisible();
  });

  it('should show server list', async () => {
    await element(by.id('server-picker')).tap();
    await expect(element(by.id('server-list'))).toBeVisible();
  });

  it('should switch to different server', async () => {
    await element(by.id('server-picker')).tap();
    await element(by.id('server-item-1')).tap();
    await expect(element(by.text('Server 1'))).toBeVisible();
  });

  it('should show active server indicator', async () => {
    await expect(element(by.id('active-server'))).toBeVisible();
  });
});
