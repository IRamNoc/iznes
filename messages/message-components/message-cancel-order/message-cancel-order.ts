export const orderMessages = {
    amCancelOrder: {
        en: {
            greeting: 'Hello,',
            line1: 'Your {{orderType}} order {{orderRef}} placed on {{orderDate}} has been cancelled by {{amCompanyName}}.',
            line2: 'Please find below the message filled in by the asset manager to this cancellation:',
            line3: '{{cancelMessage}}',
            thanks: 'Thank you,',
            signature: 'The IZNES Team.',
        },
        fr: {
            greeting: 'Bonjour,',
            line1: 'Votre ordre de {{orderType}} avec la référence {{orderRef}} passé le {{orderDate}} a été annulé par {{amCompanyName}}.',
            line2: 'Veuillez trouver ci-dessous le message renseigné par l\'asset manager pour cette annulation :',
            line3: '{{cancelMessage}}',
            thanks: 'Merci,',
            signature: 'L\'équipe IZNES.',
        },
    },
};
