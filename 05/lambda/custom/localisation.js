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
            DAYS_LEFT_MSG: '{{name}} Queda {{count}} día ',
            DAYS_LEFT_MSG_plural: '{{name}} Quedan {{count}} días ',
            WILL_TURN_MSG: 'para que cumplas {{count}} año. ',
            WILL_TURN_MSG_plural: 'para que cumplas {{count}} años. ',
            GREET_MSG: POSITIVE_SOUND + GREETING_SPEECHCON + ' {{name}} ',
            NOW_TURN_MSG: 'Hoy cumples {{count}} año! ',
            NOW_TURN_MSG_plural: 'Hoy cumples {{count}} años! ',
            MISSING_MSG: DOUBT_SPEECHCON + '. Parece que aun no me has dicho tu fecha de cumpleaños. Prueba decir, registra mi cumpleaños. o dime directamente una fecha. ',
            HELP_MSG: 'Puedo recordar tu cumpleaños si me dices una fecha. O decirte cuanto falta para que cumplas. ',
            SHORT_HELP_MSG: 'Dime que otra cosa quieres hacer o solo dí, ayuda, si no estas seguro, o, para, si quieres salir. ',
            GOODBYE_MSG: ['Hasta luego {{name}}! ', 'Adios {{name}}! ', 'Hasta pronto {{name}}! ', 'Nos vemos {{name}}! '],
            REFLECTOR_MSG: 'Acabas de activar {{intent}}',
            FALLBACK_MSG: 'Lo siento, no se nada sobre eso. Por favor inténtalo otra vez. ',
            ERROR_MSG: 'Lo siento, ha habido un problema. Por favor inténtalo otra vez. ',
            NO_TIMEZONE_MSG: 'No he podido determinar tu zona horaria. Verifica la configuración de tu dispositivo e inténtalo otra vez.'
        }
    }
}
