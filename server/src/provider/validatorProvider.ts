export interface IValidatorProvider {
  validateEmail(email: string): boolean;
  validatePassword(password: string): boolean;
}

export class ValidatorProvider implements IValidatorProvider {
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): boolean {
    // Minimum 8 characters, at least one letter and one number
    return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
  }
}
