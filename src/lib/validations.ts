import { z } from "zod";

/**
 * Validación para nombres de usuario/jugador
 * Permite: letras, números, guiones, guiones bajos, puntos y espacios
 * Longitud: 3-20 caracteres
 */
export const usernameSchema = z
  .string()
  .trim()
  .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
  .max(20, { message: "El nombre no puede exceder 20 caracteres" })
  .regex(
    /^[a-zA-Z0-9_\-.\s]+$/,
    { message: "Solo se permiten letras, números, espacios y los caracteres: _ - ." }
  );

/**
 * Validación para email
 */
export const emailSchema = z
  .string()
  .trim()
  .email({ message: "Email inválido" })
  .max(255, { message: "El email es demasiado largo" });

/**
 * Validación para contraseña
 */
export const passwordSchema = z
  .string()
  .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
  .max(100, { message: "La contraseña es demasiado larga" });

/**
 * Validar un nombre de usuario/jugador
 * @returns objeto con isValid y error message si aplica
 */
export const validateUsername = (username: string): { isValid: boolean; error?: string } => {
  const result = usernameSchema.safeParse(username);
  
  if (result.success) {
    return { isValid: true };
  }
  
  return {
    isValid: false,
    error: result.error.errors[0]?.message || "Nombre de usuario inválido"
  };
};

/**
 * Validar un email
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const result = emailSchema.safeParse(email);
  
  if (result.success) {
    return { isValid: true };
  }
  
  return {
    isValid: false,
    error: result.error.errors[0]?.message || "Email inválido"
  };
};

/**
 * Validar una contraseña
 */
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  const result = passwordSchema.safeParse(password);
  
  if (result.success) {
    return { isValid: true };
  }
  
  return {
    isValid: false,
    error: result.error.errors[0]?.message || "Contraseña inválida"
  };
};
