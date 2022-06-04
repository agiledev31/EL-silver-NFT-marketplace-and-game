const  availableLangs = ['ko', 'en']

const  messages = {
    en: {
        // values
        'values': `Api's are working`,
        // Error messages
        'emailRequiredField': "'email' is a required field.",
        'emailIsEmail': "This is not a valid email address.",
        'passwordRequiredField': "'password' is a required field.",
        
        // Success messages
        'loginSuccessful': "You've successfully logged in.",
        'emailSent': "Your password recovery email was sent.",
   
    },
    ko: {
        // values
        'values': `API가 작동 중입니다.`,
        // Mensajes de error
        'emailRequiredField': "'email' es un campo requerido.",
        'emailIsEmail': "Este no es un email válido.",
        'passwordRequiredField': "'password' es un campo requerido.",
        
        // Mensajes de éxito
        'loginSuccessful': "Has iniciado sesión exitosamente.",
        'emailSent': "Tu correo de recuperación de contraseña ha sido enviado.",
         
    }
}

module.exports = {availableLangs, messages};
