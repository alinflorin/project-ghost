import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enUs from './locales/en-US';
import roRo from './locales/ro-RO';

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			'en-US': {
				translation: enUs,
			},
			'ro-RO': {
				translation: roRo,
			},
		},
		fallbackLng: 'ro-RO',
		load: 'currentOnly',
		interpolation: {
			escapeValue: false,
		},
		react: {
			useSuspense: false,
		},
	});

export default i18n;
