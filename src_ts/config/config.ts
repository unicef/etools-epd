export const SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY = 'etoolsAppSmallMenuIsActive';

declare global {
  interface Window {
    EtoolsEsmmFitIntoEl: any;
  }
}

export const ROOT_PATH = '/' + getBasePath().replace(window.location.origin, '').slice(1, -1) + '/';

const STAGING_DOMAIN = 'etools-staging.unicef.org';
const DEV_DOMAIN = 'etools-dev.unicef.org';
const DEMO_DOMAIN = 'etools-demo.unicef.org';
const TEST_DOMAIN = 'etools-test.unicef.io';
const LOCAL_DOMAIN = 'localhost:8082';

function getBasePath() {
  console.log(document.getElementsByTagName('base')[0].href);
  return document.getElementsByTagName('base')[0].href;
}

export const getDomainByEnv = () => {
  return getBasePath().slice(0, -1);
};

export const isProductionServer = () => {
  const location = window.location.host;
  return location.indexOf('demo.unicef.io') > -1;
};

export const tokenStorageKeys = {
  prp: 'etoolsPrpToken'
};

export const getTokenEndpoints = {
  prp: 'prpToken'
};

export const _checkEnvironment = () => {
  const location = window.location.href;
  if (location.indexOf(STAGING_DOMAIN) > -1) {
    return 'STAGING';
  }
  if (location.indexOf(DEMO_DOMAIN) > -1) {
    return 'DEMO';
  }
  if (location.indexOf(DEV_DOMAIN) > -1) {
    return 'DEVELOPMENT';
  }
  if (location.indexOf(TEST_DOMAIN) > -1) {
    return 'DEVELOPMENT';
  }
  if (location.indexOf(LOCAL_DOMAIN) > -1) {
    return 'LOCAL';
  }
  return null;
};

export const tokenEndpointsHost = (host: string) => {
  if (host === 'prp') {
    switch (_checkEnvironment()) {
      case 'LOCAL':
        return 'http://127.0.0.1:8081';
      case 'DEVELOPMENT':
        return 'https://dev.partnerreportingportal.org';
      case 'DEMO':
        return 'https://demo.partnerreportingportal.org';
      case 'STAGING':
        return 'https://staging.partnerreportingportal.org';
      case null:
        return 'https://www.partnerreportingportal.org';
      default:
        return 'https://dev.partnerreportingportal.org';
    }
  }
  return null;
};
