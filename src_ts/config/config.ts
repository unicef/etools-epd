export const SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY = 'etoolsAppSmallMenuIsActive';

declare global {
  interface Window {
    EtoolsEsmmFitIntoEl: any;
    applyFocusVisiblePolyfill: any;
    ajaxErrorParserTranslateFunction: any;
    dayjs: any;
    EtoolsLanguage: string;
  }
}
