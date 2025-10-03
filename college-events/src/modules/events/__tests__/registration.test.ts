import { registerForEvent } from '../registration';

test('registerForEvent throws when not signed in', async () => {
  await expect(registerForEvent('e1')).rejects.toThrow('Not signed in');
});
