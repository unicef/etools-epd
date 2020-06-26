export const SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY = 'etoolsAppSmallMenuIsActive';

export const ROOT_PATH = '/' + getBasePath().replace(window.location.origin, '').slice(1, -1) + '/';

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
