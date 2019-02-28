// positive sound for birthday greeting from Alexa Sound Library
// https://developer.amazon.com/docs/custom-skills/ask-soundlibrary.html
const POSITIVE_SOUND = `<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_positive_response_02'/>`;
// congratulations greeting (speechcon)
// https://developer.amazon.com/docs/custom-skills/speechcon-reference-interjections-spanish.html
const GREETING_SPEECHCON = `<say-as interpret-as="interjection">felicidades</say-as>`;

module.exports = {
    es: {
        translation: {
            WELCOME_MSG: 'Hola %s Dime. Cuando es tu fecha de cumpleaños? ',
            REGISTER_MSG: '%s Tu fecha de cumpleaños es el %s de %s de %s. ',
            SAY_MSG: '%s Quedan %s días para que cumplas %s años. ',
            GREET_MSG: POSITIVE_SOUND + GREETING_SPEECHCON + ' %s Hoy cumples %s! ',
            MISSING_MSG: 'Parece que aun no me has dicho tu fecha de cumpleaños. Prueba decir, registra mi cumpleaños. ',
            OVERWRITE_MSG: 'Si quieres cambiar la fecha solo di, registra mi cumpleaños. ',
            HELP_MSG: 'Puedes decir, cuanto falta para mi cumpleaños? . Volver a registar la fecha diciendo, registra mi cumpleaños. También puedes crear un recordatorio diciendo, crea un recordatorio. O puedes ver quién cumple años hoy diciendo, cumpleaños de celebridades',
            GOODBYE_MSG: ['Hasta luego %s! ', 'Adios %s! ', 'Hasta pronto %s! ', 'Nos vemos %s! '],
            REFLECTOR_MSG: 'Acabas de activar %s ',
            FALLBACK_MSG: 'Lo siento, no se nada sobre eso. Por favor inténtalo otra vez. ',
            ERROR_MSG: 'Lo siento, ha habido un problema. Por favor inténtalo otra vez. ',
            NO_TIMEZONE_MSG: 'No he podido determinar tu zona horaria. Verifica la configuración de tu dispositivo e inténtalo otra vez.',
            REMINDER_CREATED_MSG: 'El recordatorio se ha creado con éxito. ',
            REMINDER_ERROR_MSG: 'Ha habido un error al crear el recordatorio. ',
            UNSUPPORTED_DEVICE_MSG: 'Este dispositivo no soporta la operación que estás intentando realizar. ',
            CANCEL_MSG: 'Vale. Lo cancelamos. ',
            MISSING_PERMISSION_MSG: 'Parece que no has autorizado el envío de recordatorios. Te he enviado una tarjeta a la app Alexa para que lo habilites. ',
            API_ERROR_MSG: 'Lo siento, ha habido un problema de acceso a API externa. Por favor inténtalo otra vez. ',
            PROGRESSIVE_MSG: 'Espera un momento mientras busco cumpleaños de celebridades. ',
            CONJUNCTION_MSG: ' y ',
            CELEBRITY_BIRTHDAYS_MSG: 'En esta fecha cumplen años: ',
            ALSO_TODAY_MSG: 'También hoy cumplen: '
        }
    }
}
