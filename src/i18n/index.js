import { IntlProvider, addLocaleData } from 'react-intl';
import electron from 'electron';

const app = electron.app ? electron.app : electron.remote.app;

// languages
import en from 'react-intl/locale-data/en';
import de from 'react-intl/locale-data/de';
import es from 'react-intl/locale-data/es';

addLocaleData([...en, ...es, ...de]);

// load language messages
const usersLocale = app.getLocale().split('-')[0] || app.getLocale();

// load language object
const translationsForUsersLocale =
  require(`./lang/${usersLocale}`) || require('./lang/en');

// only for non react files
const formatMessage = ({ id }) => translationsForUsersLocale[id] || id;

export { usersLocale, translationsForUsersLocale, IntlProvider, formatMessage };
