import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {

  static noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;

    if (!value) return null;

    // Verifica si hay espacios en cualquier posición
    const hasWhitespace = /\s/.test(value);

    return hasWhitespace ? { whitespace: true } : null;
  }

  static firstLetterUppercase(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null; // Permitir valores vacíos (lo maneja Validators.required)
    
    const isValid = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑ\s]*$/.test(control.value);
    return isValid ? null : { firstLetterUppercase: true };
  }


  static passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) return null;

    const validationErrors: ValidationErrors = {};

    // 1. Primera letra mayúscula
    if (!/^[A-Z]/.test(value)) {
      validationErrors['uppercaseStart'] = true;
    }

    // 2. Al menos un número
    if (!/\d/.test(value)) {
      validationErrors['requiresNumber'] = true;
    }

    // 3. Al menos un carácter especial (puedes modificar estos símbolos)
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value)) {
      validationErrors['requiresSpecialChar'] = true;
    }

    // 4. Mínimo 8 caracteres (ya cubierto por Validators.minLength(8))

    return Object.keys(validationErrors).length > 0 ? validationErrors : null;
  }

  
}
