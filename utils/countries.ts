// Sve evropske države za forme oglasa (ture/kamioni)
export const EUROPEAN_COUNTRIES = [
  // Balkan / Ex-YU
  { code: 'RS', name: 'Srbija' },
  { code: 'HR', name: 'Hrvatska' },
  { code: 'BA', name: 'Bosna i Hercegovina' },
  { code: 'ME', name: 'Crna Gora' },
  { code: 'MK', name: 'Severna Makedonija' },
  { code: 'SI', name: 'Slovenija' },
  { code: 'AL', name: 'Albanija' },
  { code: 'XK', name: 'Kosovo' },
  // Ostala Evropa
  { code: 'DE', name: 'Nemačka' },
  { code: 'AT', name: 'Austrija' },
  { code: 'CH', name: 'Švajcarska' },
  { code: 'IT', name: 'Italija' },
  { code: 'FR', name: 'Francuska' },
  { code: 'ES', name: 'Španija' },
  { code: 'PT', name: 'Portugalija' },
  { code: 'NL', name: 'Holandija' },
  { code: 'BE', name: 'Belgija' },
  { code: 'LU', name: 'Luksemburg' },
  { code: 'GB', name: 'Velika Britanija' },
  { code: 'IE', name: 'Irska' },
  { code: 'PL', name: 'Poljska' },
  { code: 'CZ', name: 'Češka' },
  { code: 'SK', name: 'Slovačka' },
  { code: 'HU', name: 'Mađarska' },
  { code: 'RO', name: 'Rumunija' },
  { code: 'BG', name: 'Bugarska' },
  { code: 'GR', name: 'Grčka' },
  { code: 'TR', name: 'Turska' },
  { code: 'UA', name: 'Ukrajina' },
  { code: 'MD', name: 'Moldavija' },
  { code: 'BY', name: 'Belorusija' },
  { code: 'RU', name: 'Rusija' },
  { code: 'DK', name: 'Danska' },
  { code: 'SE', name: 'Švedska' },
  { code: 'NO', name: 'Norveška' },
  { code: 'FI', name: 'Finska' },
  { code: 'EE', name: 'Estonija' },
  { code: 'LV', name: 'Letonija' },
  { code: 'LT', name: 'Litvanija' },
];

// Balkanske zemlje sa pozivnim brojevima
export const BALKAN_COUNTRIES = [
  { code: 'RS', name: 'Srbija', phoneCode: '+381' },
  { code: 'HR', name: 'Hrvatska', phoneCode: '+385' },
  { code: 'BA', name: 'Bosna i Hercegovina', phoneCode: '+387' },
  { code: 'ME', name: 'Crna Gora', phoneCode: '+382' },
  { code: 'MK', name: 'Severna Makedonija', phoneCode: '+389' },
  { code: 'SI', name: 'Slovenija', phoneCode: '+386' },
  { code: 'AL', name: 'Albanija', phoneCode: '+355' },
  { code: 'BG', name: 'Bugarska', phoneCode: '+359' },
  { code: 'RO', name: 'Rumunija', phoneCode: '+40' },
  { code: 'HU', name: 'Mađarska', phoneCode: '+36' },
  { code: 'GR', name: 'Grčka', phoneCode: '+30' },
  { code: 'TR', name: 'Turska', phoneCode: '+90' },
];

export const getPhoneCodeByCountry = (countryName: string): string => {
  const country = BALKAN_COUNTRIES.find(c => c.name === countryName);
  return country?.phoneCode || '+381';
};

// Map country Serbian name → ISO code for flag lookup
const _nameToCode: Record<string, string> = {};
EUROPEAN_COUNTRIES.forEach(c => { _nameToCode[c.name] = c.code; });

export const getFlagEmoji = (countryName: string): string => {
  const code = _nameToCode[countryName];
  if (!code || code.length !== 2) return '';
  return [...code.toUpperCase()]
    .map(ch => String.fromCodePoint(0x1F1E6 + ch.charCodeAt(0) - 65))
    .join('');
};