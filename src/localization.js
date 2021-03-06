import ar from './lang/ar.js';
import cy from './lang/cy.js';
import da from './lang/da.js';
import de from './lang/de.js';
import en from './lang/en.js';
import es from './lang/es.js';
import eses from './lang/es-es.js';
import fr from './lang/fr.js';
import frfr from './lang/fr-fr.js';
import fron from './lang/fr-on.js';
import ja from './lang/ja.js';
import ko from './lang/ko.js';
import nl from './lang/nl.js';
import pt from './lang/pt.js';
import sv from './lang/sv.js';
import tr from './lang/tr.js';
import zhcn from './lang/zh-cn.js';
import zhtw from './lang/zh-tw.js';

export async function getLocalizeResources(langs) {
	const resources = {
		'ar': ar,
		'cy': cy,
		'da': da,
		'de': de,
		'en': en,
		'es': es,
		'es-es': eses,
		'fr': fr,
		'fr-fr': frfr,
		'fr-on': fron,
		'ja': ja,
		'ko': ko,
		'nl': nl,
		'pt': pt,
		'sv': sv,
		'tr': tr,
		'zh-tw': zhtw,
		'zh-cn': zhcn,
	};

	//Load the first matching language from the passed langs. Default to english if none are found.
	const supportedLanguage = langs.concat('en').find(lang => resources[lang]);
	const translationData = resources[supportedLanguage];

	return {
		language: supportedLanguage,
		resources: translationData
	};
}
