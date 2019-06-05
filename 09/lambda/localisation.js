// positive sound for birthday greeting from Alexa Sound Library
// https://developer.amazon.com/docs/custom-skills/ask-soundlibrary.html
const POSITIVE_SOUND = `<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_positive_response_02'/>`;
// congratulations greeting (speechcon)
// https://developer.amazon.com/docs/custom-skills/speechcon-reference-interjections-spanish.html
const GREETING_SPEECHCON = `<say-as interpret-as="interjection">felicidades</say-as>`;
const DOUBT_SPEECHCON = `<say-as interpret-as="interjection">hmm</say-as>`;

module.exports = {
    es: {
        translation: {
            WELCOME_MSG: 'Te doy la bienvenida {{name}}! ',
            REGISTER_MSG: '{{name}} Tu fecha de cumpleaños es el {{day}} de {{month}} de {{year}}. ',
            DAYS_LEFT_MSG: '{{name}} Falta {{count}} día ',
            DAYS_LEFT_MSG_plural: '{{name}} Faltan {{count}} días ',
            WILL_TURN_MSG: 'para que cumplas {{count}} año. ',
            WILL_TURN_MSG_plural: 'para que cumplas {{count}} años. ',
            GREET_MSG: POSITIVE_SOUND + GREETING_SPEECHCON + ' {{name}} ',
            NOW_TURN_MSG: 'Hoy cumples {{count}} año! ',
            NOW_TURN_MSG_plural: 'Hoy cumples {{count}} años! ',
            MISSING_MSG: DOUBT_SPEECHCON + '. Parece que aun no me has dicho tu fecha de cumpleaños. ',
            HELP_MSG: 'Puedo recordar tu cumpleaños si me dices una fecha. Y decirte cuanto falta para que cumplas. También puedo crear un recordatorio para cuando cumplas o decirte quién cumple años hoy. ',
            SHORT_HELP_MSG: 'Dime que otra cosa quieres hacer. ',
            GOODBYE_MSG: ['Hasta luego {{name}}! ', 'Adios {{name}}! ', 'Hasta pronto {{name}}! ', 'Nos vemos {{name}}! '],
            REFLECTOR_MSG: 'Acabas de activar {{intent}}',
            FALLBACK_MSG: 'Lo siento, no se nada sobre eso. Por favor inténtalo otra vez. ',
            ERROR_MSG: 'Lo siento, ha habido un problema. Por favor inténtalo otra vez. ',
            NO_TIMEZONE_MSG: 'No he podido determinar tu zona horaria. Verifica la configuración de tu dispositivo e inténtalo otra vez.',
            REMINDER_CREATED_MSG: 'El recordatorio se ha creado con éxito. ',
            REMINDER_ERROR_MSG: 'Ha habido un error al crear el recordatorio. ',
            UNSUPPORTED_DEVICE_MSG: 'Este dispositivo no soporta la operación que estás intentando realizar. ',
            CANCEL_MSG: 'Vale. Lo cancelamos. ',
            MISSING_PERMISSION_MSG: 'Parece que no has autorizado el envío de recordatorios. Te he enviado una tarjeta a la app Alexa para que lo habilites. ',
            API_ERROR_MSG: 'Lo siento, ha habido un problema de acceso a la API externa. Por favor inténtalo otra vez. ',
            PROGRESSIVE_MSG: 'Déjame ver quién cumple hoy. ',
            CONJUNCTION_MSG: ' y ',
            CELEBRITY_BIRTHDAYS_MSG: 'En esta fecha cumplen años: ',
            ALSO_TODAY_MSG: 'También hoy cumplen: ',
            LAUNCH_HEADER_MSG: 'Feliz Cumpleaños',
            LAUNCH_TEXT_FILLED_MSG: '{{day}}/{{month}}/{{year}}',
            LAUNCH_TEXT_EMPTY_MSG: '¿Cuándo cumples?',
            LAUNCH_HINT_MSG: ['cuanto falta para mi cumpleaños?', 'quién cumple años hoy?', 'crea un recordatorio para mi cumpleaños', 'registra mi fecha de cumpleaños'],
            LIST_HEADER_MSG: 'Cumpleaños de Hoy',
            LIST_HINT_MSG: 'quién cumple años hoy?',
            LIST_YO_ABBREV_MSG: '{{count}} año',
            LIST_YO_ABBREV_MSG_plural: '{{count}} años',
            LIST_PERSON_DETAIL_MSG: `{{person.humanLabel.value}} nació hace {{person.date_of_birth.value}} en <lang xml:lang="en-US">{{person.place_of_birthLabel.value}}</lang>. `
        }
    }
}
