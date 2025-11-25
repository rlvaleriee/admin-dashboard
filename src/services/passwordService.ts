/**
 * VALIDACIÓN DE CONTRASEÑAS SEGURAS
 *
 * Requisitos de seguridad:
 * - Mínimo 8 caracteres
 * - Al menos una letra mayúscula
 * - Al menos una letra minúscula
 * - Al menos un número
 * - Al menos un carácter especial
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface PasswordStrengthResult {
  strength: 'weak' | 'medium' | 'strong';
  score: number;
}

export interface PasswordRequirements {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

/**
 * Valida que la contraseña cumpla con todos los requisitos de seguridad
 * @param password - Contraseña a validar
 * @returns { isValid: boolean, errors: string[] }
 */
export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];

  if (!password) {
    return { isValid: false, errors: ['La contraseña es requerida'] };
  }

  // Mínimo 8 caracteres
  if (password.length < 8) {
    errors.push('Debe tener al menos 8 caracteres');
  }

  // Al menos una letra mayúscula
  if (!/[A-Z]/.test(password)) {
    errors.push('Debe incluir al menos una letra mayúscula');
  }

  // Al menos una letra minúscula
  if (!/[a-z]/.test(password)) {
    errors.push('Debe incluir al menos una letra minúscula');
  }

  // Al menos un número
  if (!/[0-9]/.test(password)) {
    errors.push('Debe incluir al menos un número');
  }

  // Al menos un carácter especial
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Debe incluir al menos un carácter especial (!@#$%^&*...)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Obtiene el nivel de fortaleza de una contraseña
 * @param password - Contraseña a evaluar
 * @returns { strength: 'weak' | 'medium' | 'strong', score: number }
 */
export const getPasswordStrength = (password: string): PasswordStrengthResult => {
  if (!password) {
    return { strength: 'weak', score: 0 };
  }

  let score = 0;

  // Longitud
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Complejidad
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score += 1;

  // Determinar fortaleza
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 5) strength = 'medium';
  if (score >= 7) strength = 'strong';

  return { strength, score };
};

/**
 * Verifica requisitos individuales de la contraseña
 * @param password - Contraseña a verificar
 * @returns Estado de cada requisito
 */
export const checkPasswordRequirements = (password: string): PasswordRequirements => {
  return {
    hasMinLength: password ? password.length >= 8 : false,
    hasUpperCase: /[A-Z]/.test(password || ''),
    hasLowerCase: /[a-z]/.test(password || ''),
    hasNumber: /[0-9]/.test(password || ''),
    hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password || ''),
  };
};
