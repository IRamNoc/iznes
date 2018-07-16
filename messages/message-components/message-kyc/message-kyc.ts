export const kycMessages = {
    kycInvestorYes: {
        en: {
            greeting: 'Hello {{amFirstName}},',
            line1: '{{investorCompanyName}} answered "Yes" to the question:',
            line2: '"Did you already fill up your KYC documents with {{amCompanyName}}?"',
            line3: 'Please click on the following link to "Approve", "Reject" or "Ask more information" in regards to {{investorCompanyName}}\'s KYC documents.',
            buttonLabel: 'Go to the page "Approve / Reject / Ask for more information"',
            thanks: 'Thank you,',
            signature: 'The IZNES team.',
        },
        fr: {
            greeting: 'Bonjour {{amFirstName}},',
            line1: '{{investorCompanyName}} a répondu "Oui" à la question :',
            line2: '"Avez-vous déjà rempli vos documents KYC avec {{amCompanyName}} ?"',
            line3: 'Veuillez cliquer sur le lien suivant pour "Approuver", "Refuser" ou "Demander plus d\'information" en ce qui concerne les documents KYC de {{investorCompanyName}}.',
            buttonLabel: 'Accéder à la page "Valider / Rejeter / Demander plus d\'informations"',
            thanks: 'Merci,',
            signature: 'L\'équipe IZNES.',
        }
    },
    kycInvestorNo: {
        en: {
            greeting: 'Hello {{amFirstName}},',
            line1: '{{investorCompanyName}} answered "No" to the question:',
            line2: '"Did you already fill up your KYC documents with {{amCompanyName}}?"',
            line3: 'Here are {{investorCompanyName}}\'s contact details in order to help them complete their KYC documents:',
            email: 'Email address: {{investorEmail}}',
            phoneNumber: 'Phone number: {{investorPhoneNumber}}',
            line4: 'Please click on the following link to "Approve", "Reject" or "Ask more information" once {{investorCompanyName}}\'s KYC documents are fully completed.',
            buttonLabel: 'Go to the page "Approve / Reject / Ask for more information"',
            thanks: 'Thank you,',
            signature: 'The IZNES team.',
        },
        fr: {
            greeting: 'Bonjour {{amFirstName}},',
            line1: '{{investorCompanyName}} a répondu "Non" à la question :',
            line2: '"Avez-vous déjà rempli vos documents KYC avec{{amCompanyName}} ?"',
            line3: 'Ci-dessous les coordonnées de {{investorCompanyName}} afin de les aider à compléter leurs documents KYC :',
            email: 'Adresse e-mail : {{investorEmail}}',
            phoneNumber: 'Numéro de téléphone : {{investorPhoneNumber}}',
            line4: 'Veuillez cliquer sur le lien suivant pour "Approuver", "Refuser" ou "Demander plus d\'information" une fois que les documents KYC de {{investorCompanyName}} sont entièrement complétés.',
            buttonLabel: 'Accéder à la page "Valider/ Rejeter / Demander plus d\'informations"',
            thanks: 'Merci,',
            signature: 'L\'équipe IZNES.',
        }
    },
    kycUserFinished: {
        en : {
            greeting : 'Hello',
            line1 : '{{investorCompanyName}} has just finished his KYC filling process.',
            line2 : 'Your are now able to check it out and manage it in accessing the "on-boarding management" submodule or by clicking on the link below.',
            buttonLabel : 'Manage the request',
            thanks : 'Thank you,',
            signature: 'The IZNES team.'
        },
        fr : {
            greeting : 'Bonjour',
            line1 : '{{investorCompanyName}} vient de finir de remplir sa procédure de KYC.',
            line2 : 'Vous êtes désormais en mesure de la vérifier et de la gérer en accédant au sous module "gestion des clients" ou en cliquant sur le lien ci-dessous.',
            buttonLabel : 'Gérer la demande',
            thanks : 'Merci,',
            signature: 'L\'équipe IZNES.',
        }
    }
};
