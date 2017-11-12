import { IntlProvider, addLocaleData } from 'react-intl';

// languages
import en from 'react-intl/locale-data/en';
import de from 'react-intl/locale-data/de';
import es from 'react-intl/locale-data/es';

addLocaleData([...en, ...es, ...de]);

// load language messages
const usersLocale = navigator.language.split('-')[0] || navigator.language;

// load language object
const translationsForUsersLocale =
  require(`./lang/${usersLocale}`) || require('./lang/en');

// only for non react files
const formatMessage = ({ id }) => translationsForUsersLocale[id] || id;

export { usersLocale, translationsForUsersLocale, IntlProvider, formatMessage };
