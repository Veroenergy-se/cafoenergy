// Legal page copy (EN + SV). Drafted from Swedish consumer law and how the site
// works today (orders by email, payment details sent afterwards, no analytics).
// Have it reviewed before relying on it. {company}, {email} and {threshold} are
// filled in by LegalPage.

export type LegalSection = { h: string; p?: string[]; list?: string[] }
export type LegalDoc = { title: string; updated: string; intro: string[]; sections: LegalSection[] }
export type LegalKey = 'terms' | 'shipping' | 'cookies' | 'privacy'

const en: Record<LegalKey, LegalDoc> = {
  terms: {
    title: 'Terms of purchase',
    updated: 'Last updated 11 October 2026',
    intro: [
      'These terms apply when you buy MOAR products on moarbar.se. The seller is {company}. You can reach us at {email}.',
    ],
    sections: [
      {
        h: '1. Ordering',
        p: [
          'You order through the checkout on moarbar.se. You need to be 18 or older, or have a guardian’s permission.',
          'After you place an order we email you a confirmation with payment details. The purchase agreement is formed when we send that confirmation. We currently deliver in Sweden only.',
        ],
      },
      {
        h: '2. Prices and payment',
        p: [
          'Prices are in Swedish kronor (SEK). Shipping is free on orders over {threshold}; for smaller orders the shipping cost is shown before you pay.',
          'We email you payment details after you order, and we ship once payment has been received.',
        ],
      },
      {
        h: '3. Delivery',
        p: [
          'We ship within 2–3 business days of receiving payment, and orders in Sweden usually arrive within 2–4 business days after that. If your delivery is delayed we will tell you. If it is more than 30 days late you may cancel the order and get your money back.',
        ],
      },
      {
        h: '4. Subscriptions',
        p: [
          'A monthly subscription is delivered on the same date each month. You can change the quantity, skip a month or cancel at no cost by emailing us before the next delivery.',
        ],
      },
      {
        h: '5. Right of withdrawal (ångerrätt)',
        p: [
          'Under the Swedish Distance Contracts Act (lag om distansavtal och avtal utanför affärslokaler) you may withdraw from your purchase within 14 days of receiving the goods. Tell us by email, or use the standard withdrawal form from Konsumentverket.',
          'The right of withdrawal does not apply to sealed goods that have been unsealed after delivery and cannot be returned for health or hygiene reasons. This means opened bars cannot be returned; unopened bars and boxes can.',
          'You pay the cost of sending the goods back. We refund the purchase price, including the original standard shipping cost, within 14 days of your notice, using the same payment method. We may wait to refund until we have received the goods back.',
        ],
      },
      {
        h: '6. Faulty goods and complaints (reklamation)',
        p: [
          'Under the Consumer Sales Act (konsumentköplagen) you can complain about faulty goods for three years from delivery. Tell us within a reasonable time after you notice the fault; two months is always considered reasonable.',
          'Email us your order number and, if possible, a photo. We will replace the goods or refund you, and we pay the return cost for faulty goods.',
        ],
      },
      {
        h: '7. Product information',
        p: [
          'Contains caffeine (90 mg per bar). Not recommended for children or pregnant women. Contains milk and soy; may contain peanuts and nuts. With sweetener (maltitol); excessive consumption may produce laxative effects. Store in a dry place at up to +25°C.',
        ],
      },
      {
        h: '8. Personal data',
        p: ['We handle your personal data as described in our privacy policy.'],
      },
      {
        h: '9. Disputes',
        p: [
          'Contact us first and we will do our best to sort it out. If we cannot agree, you can turn to the National Board for Consumer Disputes (Allmänna reklamationsnämnden, ARN), arn.se. Swedish law applies to these terms.',
        ],
      },
      {
        h: '10. Changes',
        p: ['We may update these terms. The version published on moarbar.se when you placed your order applies to that order.'],
      },
    ],
  },
  shipping: {
    title: 'Shipping & returns',
    updated: 'Last updated 11 October 2026',
    intro: ['The short version of how delivery and returns work. Our terms of purchase have the full details.'],
    sections: [
      { h: 'Where we deliver', p: ['We currently deliver within Sweden. Other countries will follow after launch.'] },
      {
        h: 'Delivery time',
        p: ['We ship within 2–3 business days of receiving payment. Orders usually arrive within 2–4 business days after that.'],
      },
      { h: 'Shipping cost', p: ['Free on orders over {threshold}. For smaller orders the cost is shown before you pay.'] },
      {
        h: 'Changed your mind?',
        p: ['You have 14 days from delivery to return unopened bars and boxes. Opened bars cannot be returned for hygiene reasons.'],
        list: [
          'Email {email} with your order number and what you want to return.',
          'We reply with the return address.',
          'Send the unopened goods back. You pay the return shipping.',
          'We refund you within 14 days of your notice, once the goods are back with us.',
        ],
      },
      {
        h: 'Damaged or wrong order?',
        p: ['Email {email} with your order number and a photo. We will send a replacement or refund you, and we cover the cost.'],
      },
    ],
  },
  cookies: {
    title: 'Cookie policy',
    updated: 'Last updated 11 October 2026',
    intro: [
      'We do not use advertising or analytics cookies. The site stores a few small things in your browser so it works the way you expect. They stay on your device and are not shared with us.',
    ],
    sections: [
      {
        h: 'What we store in your browser',
        list: [
          'cafo-lang: your language choice (English or Swedish).',
          'cafo-cart: the products in your cart.',
          'cafo-cookie-consent: the choice you made in the cookie banner.',
          'cafo-waitlist-popup: whether you closed or answered the waitlist pop-up, so we do not show it again too soon.',
        ],
      },
      {
        h: 'Third parties',
        list: [
          'Loops: if you join the waitlist, your email address is sent to Loops, the service we use for our mailing list.',
        ],
      },
      {
        h: 'Your choices',
        p: [
          'You can change your choice at any time with the cookie button in the bottom-left corner, and you can clear the stored data in your browser settings. If we ever add analytics, we will ask for your consent first.',
        ],
      },
    ],
  },
  privacy: {
    title: 'Privacy policy',
    updated: 'Last updated 11 October 2026',
    intro: ['{company} is responsible for the personal data described here. Contact us at {email} with any questions.'],
    sections: [
      {
        h: 'What we collect and why',
        list: [
          'Waitlist: your email address, so we can tell you when MOAR launches and send occasional news. Legal basis: your consent. You can unsubscribe at any time.',
          'Orders: your name, address, email and order details, so we can deliver, take payment and handle returns. Legal basis: our agreement with you. We keep order records for seven years, as Swedish accounting law requires.',
          'Contact: what you write to us, so we can reply. Legal basis: our legitimate interest in answering you. We keep it as long as needed to handle your question.',
        ],
      },
      {
        h: 'What we do not do',
        p: ['We do not use analytics or advertising trackers, and we never sell your data.'],
      },
      {
        h: 'Who we share it with',
        list: [
          'Loops, the service that stores our waitlist and sends our emails. Data may be processed outside the EU, with the safeguards the GDPR requires.',
          'Our email provider and the carrier that delivers your order.',
        ],
      },
      {
        h: 'Your rights',
        p: [
          'You have the right to access, correct or delete your data, to restrict or object to how we use it, to get a copy of it, and to withdraw your consent. Email {email}. You can also complain to the Swedish Authority for Privacy Protection (IMY), imy.se.',
        ],
      },
    ],
  },
}

const sv: Record<LegalKey, LegalDoc> = {
  terms: {
    title: 'Köpvillkor',
    updated: 'Senast uppdaterad 11 oktober 2026',
    intro: ['Dessa villkor gäller när du köper MOAR-produkter på moarbar.se. Säljare är {company}. Du når oss på {email}.'],
    sections: [
      {
        h: '1. Beställning',
        p: [
          'Du beställer via kassan på moarbar.se. Du behöver vara minst 18 år eller ha målsmans tillstånd.',
          'När du har beställt mejlar vi en bekräftelse med betalningsuppgifter. Köpeavtalet ingås när vi skickar bekräftelsen. Vi levererar för närvarande endast inom Sverige.',
        ],
      },
      {
        h: '2. Priser och betalning',
        p: [
          'Priserna anges i svenska kronor (SEK). Frakten är fri vid köp över {threshold}; för mindre beställningar visas fraktkostnaden innan du betalar.',
          'Vi mejlar betalningsuppgifter efter din beställning och skickar varorna när betalningen har kommit in.',
        ],
      },
      {
        h: '3. Leverans',
        p: [
          'Vi skickar inom 2–3 arbetsdagar efter mottagen betalning, och beställningar inom Sverige kommer normalt fram inom 2–4 arbetsdagar därefter. Om leveransen blir försenad hör vi av oss. Är den mer än 30 dagar försenad får du häva köpet och få pengarna tillbaka.',
        ],
      },
      {
        h: '4. Prenumeration',
        p: [
          'En månadsprenumeration levereras samma datum varje månad. Du kan ändra antal, hoppa över en månad eller avsluta utan kostnad genom att mejla oss före nästa leverans.',
        ],
      },
      {
        h: '5. Ångerrätt',
        p: [
          'Enligt lagen om distansavtal och avtal utanför affärslokaler har du rätt att ångra ditt köp inom 14 dagar från att du tagit emot varorna. Meddela oss via mejl eller använd Konsumentverkets standardblankett för ånger.',
          'Ångerrätten gäller inte förseglade varor som har brutits efter leverans och som av hälso- eller hygienskäl inte kan returneras. Öppnade barer kan alltså inte returneras; oöppnade barer och lådor kan det.',
          'Du står för kostnaden för returfrakten. Vi betalar tillbaka köpesumman, inklusive den ursprungliga standardfrakten, inom 14 dagar från ditt meddelande och med samma betalsätt. Vi får vänta med återbetalningen tills vi har fått tillbaka varorna.',
        ],
      },
      {
        h: '6. Reklamation',
        p: [
          'Enligt konsumentköplagen har du rätt att reklamera felaktiga varor i tre år från leveransen. Meddela oss inom skälig tid efter att du upptäckt felet; två månader räknas alltid som skälig tid.',
          'Mejla ditt ordernummer och gärna en bild. Vi skickar en ersättningsvara eller betalar tillbaka, och vi står för returkostnaden vid fel.',
        ],
      },
      {
        h: '7. Produktinformation',
        p: [
          'Innehåller koffein (90 mg per bar). Rekommenderas inte för barn eller gravida. Innehåller mjölk och soja; kan innehålla jordnötter och nötter. Med sötningsmedel (maltitol); överdriven konsumtion kan ha laxerande effekt. Förvaras torrt i högst +25°C.',
        ],
      },
      { h: '8. Personuppgifter', p: ['Vi hanterar dina personuppgifter enligt vår integritetspolicy.'] },
      {
        h: '9. Tvister',
        p: [
          'Kontakta oss först så gör vi vårt bästa för att lösa det. Om vi inte kommer överens kan du vända dig till Allmänna reklamationsnämnden (ARN), arn.se. Svensk lag gäller för dessa villkor.',
        ],
      },
      {
        h: '10. Ändringar',
        p: ['Vi kan uppdatera villkoren. Den version som fanns på moarbar.se när du beställde gäller för din beställning.'],
      },
    ],
  },
  shipping: {
    title: 'Frakt & returer',
    updated: 'Senast uppdaterad 11 oktober 2026',
    intro: ['Kortversionen av hur leverans och returer fungerar. Hela villkoren finns i våra köpvillkor.'],
    sections: [
      { h: 'Var vi levererar', p: ['Vi levererar för närvarande inom Sverige. Fler länder kommer efter lanseringen.'] },
      { h: 'Leveranstid', p: ['Vi skickar inom 2–3 arbetsdagar efter mottagen betalning. Beställningen kommer normalt fram inom 2–4 arbetsdagar därefter.'] },
      { h: 'Fraktkostnad', p: ['Fri frakt vid köp över {threshold}. För mindre beställningar visas kostnaden innan du betalar.'] },
      {
        h: 'Ångrat dig?',
        p: ['Du har 14 dagar från leverans på dig att returnera oöppnade barer och lådor. Öppnade barer kan inte returneras av hygienskäl.'],
        list: [
          'Mejla {email} med ordernummer och vad du vill returnera.',
          'Vi svarar med returadressen.',
          'Skicka tillbaka de oöppnade varorna. Du står för returfrakten.',
          'Vi betalar tillbaka inom 14 dagar från ditt meddelande, när varorna är tillbaka hos oss.',
        ],
      },
      {
        h: 'Skadad eller fel vara?',
        p: ['Mejla {email} med ordernummer och en bild. Vi skickar en ny vara eller betalar tillbaka, och vi står för kostnaden.'],
      },
    ],
  },
  cookies: {
    title: 'Cookiepolicy',
    updated: 'Senast uppdaterad 11 oktober 2026',
    intro: [
      'Vi använder inga cookies för annonser eller statistik. Sajten sparar några små saker i din webbläsare så att den fungerar som du förväntar dig. De stannar på din enhet och delas inte med oss.',
    ],
    sections: [
      {
        h: 'Det här sparas i din webbläsare',
        list: [
          'cafo-lang: ditt språkval (engelska eller svenska).',
          'cafo-cart: produkterna i din varukorg.',
          'cafo-cookie-consent: ditt val i cookiebannern.',
          'cafo-waitlist-popup: om du har stängt eller svarat på väntelistans pop-up, så att vi inte visar den igen för tidigt.',
        ],
      },
      {
        h: 'Tredje parter',
        list: [
          'Loops: om du går med i väntelistan skickas din e-postadress till Loops, tjänsten vi använder för vårt nyhetsbrev.',
        ],
      },
      {
        h: 'Dina val',
        p: [
          'Du kan ändra ditt val när som helst med cookieknappen nere till vänster, och du kan rensa sparad data i webbläsarens inställningar. Om vi någon gång lägger till statistikverktyg frågar vi om ditt samtycke först.',
        ],
      },
    ],
  },
  privacy: {
    title: 'Integritetspolicy',
    updated: 'Senast uppdaterad 11 oktober 2026',
    intro: ['{company} är personuppgiftsansvarig för de uppgifter som beskrivs här. Kontakta oss på {email} om du har frågor.'],
    sections: [
      {
        h: 'Vad vi samlar in och varför',
        list: [
          'Väntelistan: din e-postadress, så att vi kan berätta när MOAR lanseras och skicka nyheter ibland. Rättslig grund: ditt samtycke. Du kan avregistrera dig när som helst.',
          'Beställningar: namn, adress, e-post och orderuppgifter, så att vi kan leverera, ta betalt och hantera returer. Rättslig grund: vårt avtal med dig. Vi sparar orderunderlag i sju år enligt bokföringslagen.',
          'Kontakt: det du skriver till oss, så att vi kan svara. Rättslig grund: vårt berättigade intresse av att svara dig. Vi sparar det så länge det behövs för att hantera ditt ärende.',
        ],
      },
      { h: 'Det här gör vi inte', p: ['Vi använder inga statistik- eller annonsspårare och säljer aldrig dina uppgifter.'] },
      {
        h: 'Vilka vi delar med',
        list: [
          'Loops, tjänsten som lagrar vår väntelista och skickar våra mejl. Uppgifter kan behandlas utanför EU, med de skyddsåtgärder som GDPR kräver.',
          'Vår e-postleverantör och transportören som levererar din beställning.',
        ],
      },
      {
        h: 'Dina rättigheter',
        p: [
          'Du har rätt att få tillgång till, rätta eller radera dina uppgifter, att begränsa eller invända mot hur vi använder dem, att få en kopia av dem och att återkalla ditt samtycke. Mejla {email}. Du kan också klaga hos Integritetsskyddsmyndigheten (IMY), imy.se.',
        ],
      },
    ],
  },
}

export const legal = { en, sv }
