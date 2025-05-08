const { hashPassword, comparePassword } = require('./passwordUtils');

describe('Password Utilities', () => {
  describe('hashPassword', () => {
    it('should return a string hash for a given password', async () => {
      const password = 'mySecurePassword123';
      const hashedPassword = await hashPassword(password);
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword).not.toBe(password); // Hash should not be the same as the password
    });

    it('should produce different hashes for the same password (due to salt)', async () => {
      const password = 'anotherPassword';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      expect(hash1).not.toBe(hash2); // Bcrypt hashes with different salts will be different
    });
  });

  describe('comparePassword', () => {
    let password;
    let hashedPassword;

    beforeAll(async () => {
      password = 'testPassword@123';
      hashedPassword = await hashPassword(password);
    });

    it('should return true for a correct password and hash', async () => {
      const isMatch = await comparePassword(password, hashedPassword);
      expect(isMatch).toBe(true);
    });

    it('should return false for an incorrect password and a correct hash', async () => {
      const isMatch = await comparePassword('wrongPassword', hashedPassword);
      expect(isMatch).toBe(false);
    });

    it('should return false for a correct password and an incorrect/random hash', async () => {
      const isMatch = await comparePassword(password, 'someRandomNonBcryptHashValue');
      // bcrypt.compare handles non-bcrypt hashes gracefully, typically returning false
      expect(isMatch).toBe(false); 
    });

    it('should return false if candidate password is empty', async () => {
        const isMatch = await comparePassword('', hashedPassword);
        expect(isMatch).toBe(false);
    });
  });
});
