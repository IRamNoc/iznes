const fs = require('fs');

const rl = require('readline').createInterface({
   input: process.stdin,
   output: process.stdout,
});

function sha256(ascii) {
   function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
   }
   var mathPow = Math.pow;
   var maxWord = mathPow(2, 32);
   var lengthProperty = 'length';
   var i, j;
   var result = '';
   var words = [];
   var asciiBitLength = ascii[lengthProperty] * 8;
   var hash = sha256.h = sha256.h || [];
   var k = sha256.k = sha256.k || [];
   var primeCounter = k[lengthProperty];
   var isComposite = {};
   for (var candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
         for (i = 0; i < 313; i += candidate) {
            isComposite[i] = candidate;
         }
         hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
         k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
   }
   ascii += '\x80';
   while (ascii[lengthProperty] % 64 - 56)
      ascii += '\x00';
   for (i = 0; i < ascii[lengthProperty]; i++) {
      j = ascii.charCodeAt(i);
      if (j >> 8)
         return;
      words[i >> 2] |= j << ((3 - i) % 4) * 8;
   }
   words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
   words[words[lengthProperty]] = (asciiBitLength);
   for (j = 0; j < words[lengthProperty];) {
      var w = words.slice(j, j += 16);
      var oldHash = hash;
      hash = hash.slice(0, 8);
      for (i = 0; i < 64; i++) {
         var i2 = i + j;
         var w15 = w[i - 15], w2 = w[i - 2];
         var a = hash[0], e = hash[4];
         var temp1 = hash[7]
            + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
            + ((e & hash[5]) ^ ((~e) & hash[6])) // ch
            + k[i]
            + (w[i] = (i < 16) ? w[i] : (
               w[i - 16]
               + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) // s0
               + w[i - 7]
               + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10)) // s1
            ) | 0
            )
         var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
            + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])); // maj
         hash = [(temp1 + temp2) | 0].concat(hash);
         hash[4] = (hash[4] + temp1) | 0
      }
      for (i = 0; i < 8; i++) {
         hash[i] = (hash[i] + oldHash[i]) | 0
      }
   }
   for (i = 0; i < 8; i++) {
      for (j = 3; j + 1; j--) {
         var b = (hash[i] >> (j * 8)) & 255;
         result += ((b < 16) ? 0 : '') + b.toString(16)
      }
   }
   return result;
}

function getTag(word) {
   const clean = 'txt_' + english.replace(/[^a-z0-9A-Z]/g, '').toLowerCase()
   if (clean.length > 34)
      return clean.substring(0, 34) + sha256(clean).substring(10, 20);
   return clean;
}

function addTranslation(tag, english, french) {
   const file = 'translations.ts';
   const begin = 'export const Translations = ';
   const raw = fs.readFileSync(file, { encoding: 'utf-8' }).replace(begin, '')
   .replace(/\;$/m,'');
   const translations = JSON.parse(raw);
   if (tag in translations.core['en-Latn'])
   {
      console.log(`\x1b[33m\n${tag} already exists ⚠️\x1b[33m`);
      return;
   }
   translations.core['en-Latn'][tag] = english;
   translations.core['fr-Latn'][tag] = french;
   fs.copyFileSync(file, file + '.bk');
   console.log(`\x1b[32m\n${file}.bk back up file created 💾\x1b[32m`);
   fs.writeFileSync(file, begin.concat(JSON.stringify(translations), ';'))
   console.log(`\x1b[32m${file} updated 🔁\x1b[32m`);
}

rl.question('English text ? ',
   input => {
      english = input;
      rl.question('French text ? ',
         input => {
            french = input;
            const tag = getTag(english);
            rl.question(
`
{
	"en-Latn":{
		"${tag}":"${english}"
	},
	"fr-Latn":{
		"${tag}":"${french}"
	}
}

Would you like to add the data to the translation.ts file ? (Y/N) `,
               input => {
                  if (input === 'Y')
                     addTranslation(tag, english, french);
                  rl.close();
               })
         })
   })

