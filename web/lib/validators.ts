// Input validation utilities

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export class Validator {
  static validateEmail(email: string): ValidationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, error: 'Invalid email format' };
    }
    if (email.length > 254) {
      return { valid: false, error: 'Email too long' };
    }
    return { valid: true };
  }

  static validatePassword(password: string): ValidationResult {
    if (password.length < 8) {
      return { valid: false, error: 'Password must be at least 8 characters' };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, error: 'Password must contain uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, error: 'Password must contain lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, error: 'Password must contain number' };
    }
    return { valid: true };
  }

  static validateUserName(name: string): ValidationResult {
    if (!name || name.trim().length === 0) {
      return { valid: false, error: 'Name is required' };
    }
    if (name.length < 2) {
      return { valid: false, error: 'Name must be at least 2 characters' };
    }
    if (name.length > 100) {
      return { valid: false, error: 'Name too long' };
    }
    return { valid: true };
  }

  static validateBudget(budget: number): ValidationResult {
    if (!budget || budget <= 0) {
      return { valid: false, error: 'Budget must be greater than 0' };
    }
    if (budget > 1000000) {
      return { valid: false, error: 'Budget exceeds maximum limit' };
    }
    return { valid: true };
  }

  static validateBidAmount(bidAmount: number, maxBidPrice: number): ValidationResult {
    if (!bidAmount || bidAmount <= 0) {
      return { valid: false, error: 'Bid amount must be greater than 0' };
    }
    if (bidAmount > maxBidPrice) {
      return {
        valid: false,
        error: `Bid cannot exceed $${maxBidPrice.toLocaleString()} (80% of budget)`,
      };
    }
    return { valid: true };
  }

  static validateProposedDays(days: number): ValidationResult {
    if (!days || days <= 0) {
      return { valid: false, error: 'Days must be greater than 0' };
    }
    if (days > 365) {
      return { valid: false, error: 'Proposed days cannot exceed 365' };
    }
    return { valid: true };
  }

  static validateCoverLetter(letter: string): ValidationResult {
    if (!letter || letter.trim().length === 0) {
      return { valid: false, error: 'Cover letter is required' };
    }
    if (letter.length < 20) {
      return { valid: false, error: 'Cover letter must be at least 20 characters' };
    }
    if (letter.length > 5000) {
      return { valid: false, error: 'Cover letter exceeds maximum length' };
    }
    return { valid: true };
  }

  static validateDescription(description: string): ValidationResult {
    if (!description || description.trim().length === 0) {
      return { valid: false, error: 'Description is required' };
    }
    if (description.length < 20) {
      return { valid: false, error: 'Description must be at least 20 characters' };
    }
    if (description.length > 5000) {
      return { valid: false, error: 'Description exceeds maximum length' };
    }
    return { valid: true };
  }

  static validateTitle(title: string): ValidationResult {
    if (!title || title.trim().length === 0) {
      return { valid: false, error: 'Title is required' };
    }
    if (title.length < 5) {
      return { valid: false, error: 'Title must be at least 5 characters' };
    }
    if (title.length > 200) {
      return { valid: false, error: 'Title exceeds maximum length' };
    }
    return { valid: true };
  }

  static validateSkills(skills: string[]): ValidationResult {
    if (!skills || skills.length === 0) {
      return { valid: false, error: 'At least one skill is required' };
    }
    if (skills.length > 20) {
      return { valid: false, error: 'Maximum 20 skills allowed' };
    }
    for (const skill of skills) {
      if (skill.length < 2 || skill.length > 50) {
        return { valid: false, error: 'Invalid skill format' };
      }
    }
    return { valid: true };
  }

  static validateRole(role: string): ValidationResult {
    const validRoles = ['ADMIN', 'CLIENT', 'FREELANCER', 'AGENCY'];
    if (!validRoles.includes(role.toUpperCase())) {
      return { valid: false, error: 'Invalid role' };
    }
    return { valid: true };
  }

  static validateUrl(url: string): ValidationResult {
    try {
      new URL(url);
      return { valid: true };
    } catch {
      return { valid: false, error: 'Invalid URL' };
    }
  }

  static sanitizeString(str: string): string {
    return str
      .trim()
      .replace(/[<>]/g, '') // Remove angle brackets
      .substring(0, 5000); // Limit length
  }

  static sanitizeEmail(email: string): string {
    return this.sanitizeString(email).toLowerCase();
  }
}

export function validateRequest(data: any, schema: { [key: string]: (val: any) => ValidationResult }): ValidationResult {
  for (const [field, validator] of Object.entries(schema)) {
    const result = validator(data[field]);
    if (!result.valid) {
      return { valid: false, error: `${field}: ${result.error}` };
    }
  }
  return { valid: true };
}
