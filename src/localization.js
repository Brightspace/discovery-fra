import ar from './lang/ar.js'
import dadk from './lang/da-dk.js'
import de from './lang/de.js'
import en from './lang/en.js'
import es from './lang/es.js'
import fr from './lang/fr.js'
import ja from './lang/ja.js'
import ko from './lang/ko.js'
import nl from './lang/nl.js'
import pt from './lang/pt.js'
import sv from './lang/sv.js'
import tr from './lang/tr.js'
import zh from './lang/zh.js'
import zhtw from './lang/zh-tw.js'

export async function getLocalizeResources(langs) {
	const resources = {
		'ar': ar,
		'da-dk': dadk,
		'de': de,
		'en': en,
		'es': es,
		'fr': fr,
		'ja': ja,
		'ko': ko,
		'nl': nl,
		'pt': pt,
		'sv': sv,
		'tr': tr,
		'zh': zh,
		'zh-tw': zhtw,
	};

	//Load the first matching language from the passed langs. Default to english if none are found.
	const supportedLanguage = langs.concat('en').find(lang => resources[lang]);
	const translationData = resources[supportedLanguage];

	return {
		language: supportedLanguage,
		resources: translationData
	};
}
