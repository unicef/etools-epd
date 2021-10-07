/**
@license
Copyright (c) 2019 The eTools Project Authors. All rights reserved.
*/

import {setPassiveTouchGestures} from '@polymer/polymer/lib/utils/settings.js';
import {connect} from 'pwa-helpers/connect-mixin.js';
import {installMediaQueryWatcher} from 'pwa-helpers/media-query.js';
import {installRouter} from 'pwa-helpers/router.js';

// This element is connected to the Redux store.
import {store, RootState} from '../../redux/store';

// These are the actions needed by this element.
import {
  navigate,
  // updateOffline,
  updateDrawerState
} from '../../redux/actions/app';

// These are the elements needed by this element.
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import {createDynamicDialog} from '@unicef-polymer/etools-dialog/dynamic-dialog';

import {AppDrawerLayoutElement} from '@polymer/app-layout/app-drawer-layout/app-drawer-layout';
import {AppHeaderLayoutElement} from '@polymer/app-layout/app-header-layout/app-header-layout';
import {AppDrawerElement} from '@polymer/app-layout/app-drawer/app-drawer';
import LoadingMixin from '@unicef-polymer/etools-loading/etools-loading-mixin';
import {customElement, html, LitElement, property, query} from 'lit-element';

import {AppShellStyles} from './app-shell-styles';

import './menu/app-menu.js';
import './header/page-header.js';
import './footer/page-footer.js';

import './app-theme.js';
import {ToastNotificationHelper} from '../common/toast-notifications/toast-notification-helper';
import user from '../../redux/reducers/user';
import commonData, {CommonDataState} from '../../redux/reducers/common-data';
import {getCurrentUser} from '../user/user-actions';
import {EtoolsRouter} from '../../routing/routes';
import {
  getPartners,
  getLocations,
  getSites,
  getSections,
  getDisaggregations,
  getOffices,
  getUnicefUsers,
  getStaticData,
  getDropdownsData,
  SET_ALL_STATIC_DATA,
  getCountryProgrammes
} from '../../redux/actions/common-data';
import {getAgreements, SET_AGREEMENTS} from '../../redux/actions/agreements';
import isEmpty from 'lodash-es/isEmpty';
import get from 'lodash-es/get';
import '../env-flags/environment-flags';
import {registerTranslateConfig, use} from 'lit-translate';
import {EtoolsUser, RouteDetails} from '@unicef-polymer/etools-types';
import {setStore} from '@unicef-polymer/etools-modules-common/dist/utils/redux-store-access';
import {SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY} from '../../config/config';
import {fireEvent} from '../utils/fire-custom-event';
declare const dayjs: any;
declare const dayjs_plugin_utc: any;
declare const dayjs_plugin_isSameOrBefore: any;
declare const dayjs_plugin_isBetween: any;

dayjs.extend(dayjs_plugin_utc);
dayjs.extend(dayjs_plugin_isSameOrBefore);
dayjs.extend(dayjs_plugin_isBetween);

function fetchLangFiles(lang: string) {
  return Promise.allSettled([
    fetch(`assets/i18n/${lang}.json`).then((res: any) => res.json()),
    fetch(`src/components/pages/interventions/intervention-tab-pages/assets/i18n/${lang}.json`).then((res: any) =>
      res.json()
    )
  ]).then((response: any) => {
    return Object.assign(response[0].value, response[1].value);
  });
}
registerTranslateConfig({loader: (lang: string) => fetchLangFiles(lang)});

// set store for intervention-tab-pages
setStore(store as any);

store.addReducers({
  user,
  commonData
});

/**
 * @customElement
 * @LitElement
 */
@customElement('app-shell')
// @ts-ignore TODO
export class AppShell extends connect(store)(LoadingMixin(LitElement)) {
  static get styles() {
    return [AppShellStyles];
  }

  public render() {
    // main template
    // language=HTML
    return html`
      <environment-flags></environment-flags>

      <app-drawer-layout
        id="layout"
        responsive-width="850px"
        fullbleed
        ?narrow="${this.narrow}"
        ?small-menu="${this.smallMenu}"
      >
        <!-- Drawer content -->
        <app-drawer
          id="drawer"
          slot="drawer"
          transition-duration="350"
          @app-drawer-transitioned="${this.onDrawerToggle}"
          ?opened="${this.drawerOpened}"
          ?swipe-open="${this.narrow}"
          ?small-menu="${this.smallMenu}"
        >
          <!-- App main menu(left sidebar) -->
          <app-menu
            selected-option="${this.mainPage}"
            @toggle-small-menu="${(e: CustomEvent) => this.toggleMenu(e)}"
            ?small-menu="${this.smallMenu}"
          ></app-menu>
        </app-drawer>

        <!-- Main content -->
        <app-header-layout id="appHeadLayout" fullbleed has-scrolling-region>
          <app-header slot="header" fixed shadow>
            <page-header id="pageheader" title="eTools"></page-header>
          </app-header>

          <!-- Main content -->
          <main role="main" class="main-content">
            <intervention-list
              class="page"
              ?active="${this.isActivePage(this.mainPage, 'interventions', this.subPage, 'list')}"
              ?hidden="${!this.isActivePage(this.mainPage, 'interventions', this.subPage, 'list')}"
            ></intervention-list>
            <intervention-tabs
              class="page"
              ?active="${this.isActivePage(
                this.mainPage,
                'interventions',
                this.subPage,
                'overview|metadata|strategy|workplan|timing|review|attachments|info'
              )}"
              ?hidden="${!this.isActivePage(
                this.mainPage,
                'interventions',
                this.subPage,
                'overview|metadata|strategy|workplan|timing|review|attachments|info'
              )}"
            >
            </intervention-tabs>
            <page-not-found
              class="page"
              ?active="${this.isActivePage(this.mainPage, 'page-not-found')}"
            ></page-not-found>
          </main>

          <page-footer></page-footer>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }

  @property({type: Boolean})
  public narrow = true;

  @property({type: Boolean})
  public drawerOpened = false;

  @property({type: Object})
  public routeDetails!: RouteDetails;

  @property({type: String})
  public mainPage = ''; // routeName

  @property({type: String})
  public subPage: string | null = null; // subRouteName

  @property({type: Boolean})
  public smallMenu = false;

  @property({type: String})
  selectedLanguage!: string;

  @query('#layout') private drawerLayout!: AppDrawerLayoutElement;
  @query('#drawer') private drawer!: AppDrawerElement;
  @query('#appHeadLayout') private appHeaderLayout!: AppHeaderLayoutElement;

  private appToastsNotificationsHelper!: ToastNotificationHelper;

  constructor() {
    super();
    // Gesture events like tap and track generated from touch will not be
    // preventable, allowing for better scrolling performance.
    setPassiveTouchGestures(true);
    // init toasts notifications queue
    this.appToastsNotificationsHelper = new ToastNotificationHelper();
    this.appToastsNotificationsHelper.addToastNotificationListeners();

    const menuTypeStoredVal: string | null = localStorage.getItem(SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY);
    if (!menuTypeStoredVal) {
      this.smallMenu = false;
    } else {
      this.smallMenu = !!parseInt(menuTypeStoredVal, 10);
    }
  }

  async connectedCallback() {
    super.connectedCallback();

    this.checkAppVersion();
    installRouter((location) => store.dispatch(navigate(decodeURIComponent(location.pathname + location.search))));
    this.addEventListener('scroll-up', () => {
      if (this.appHeaderLayout) {
        this.appHeaderLayout.$.contentContainer.scrollTop = 0;
      }
    });
    installMediaQueryWatcher(`(min-width: 460px)`, () => store.dispatch(updateDrawerState(false)));

    getCurrentUser().then((user: EtoolsUser) => {
      if (user) {
        // @ts-ignore
        Promise.allSettled([
          getPartners(),
          getLocations(),
          getSections(),
          getDisaggregations(),
          getOffices(),
          getUnicefUsers(),
          getStaticData(),
          getDropdownsData(),
          getAgreements(),
          getCountryProgrammes(user.is_unicef_user),
          getSites()
        ]).then((response: any[]) => {
          store.dispatch({
            type: SET_ALL_STATIC_DATA,
            staticData: this.formatResponse(response)
          });
          store.dispatch({
            type: SET_AGREEMENTS,
            list: this.getValue(response[8])
          });
        });
      }
    });

    setTimeout(() => {
      window.EtoolsEsmmFitIntoEl = this.appHeaderLayout!.shadowRoot!.querySelector('#contentContainer');
      this.etoolsLoadingContainer = window.EtoolsEsmmFitIntoEl;
    }, 100);
  }

  checkAppVersion() {
    fetch('version.json')
      .then((res) => res.json())
      .then((version) => {
        if (version.revision != document.getElementById('buildRevNo')!.innerText) {
          console.log('version.json', version.revision);
          console.log('buildRevNo ', document.getElementById('buildRevNo')!.innerText);
          this._showConfirmNewVersionDialog();
        }
      });
  }

  private _showConfirmNewVersionDialog() {
    const msg = document.createElement('span');
    msg.innerText = 'A new version of the app is available. Refresh page?';
    const conf: any = {
      size: 'md',
      closeCallback: this._onConfirmNewVersion.bind(this),
      content: msg
    };
    const confirmNewVersionDialog = createDynamicDialog(conf);
    confirmNewVersionDialog.opened = true;
  }

  private _onConfirmNewVersion(e: CustomEvent) {
    if (e.detail.confirmed) {
      if (navigator.serviceWorker) {
        caches.keys().then((cacheNames) => {
          cacheNames.forEach((cacheName) => {
            caches.delete(cacheName);
          });
          location.reload();
        });
      }
    }
  }

  private formatResponse(response: any[]) {
    const data: Partial<CommonDataState> = {};
    data.partners = this.getValue(response[0]);
    data.locations = this.getValue(response[1]);
    data.sections = this.getValue(response[2]);
    data.disaggregations = this.getValue(response[3]);
    data.offices = this.getValue(response[4]);
    data.unicefUsersData = this.getValue(response[5]);
    data.providedBy = this.getValue(response[7]).supply_item_provided_by || [];
    data.cpOutputs = this.getValue(response[7]).cp_outputs || [];
    data.fileTypes = this.getValue(response[7]).file_types || [];
    const staticData = this.getValue(response[6], {});
    data.countryProgrammes = this.getValue(response[9]);
    data.sites = this.getValue(response[10]);
    data.locationTypes = isEmpty(staticData.location_types) ? [] : staticData.location_types;
    data.documentTypes = isEmpty(staticData.intervention_doc_type) ? [] : staticData.intervention_doc_type;
    data.genderEquityRatings = staticData.gender_equity_sustainability_ratings || [];
    data.interventionAmendmentTypes = isEmpty(staticData.intervention_amendment_types)
      ? []
      : staticData.intervention_amendment_types;
    data.interventionStatuses = staticData.intervention_status || [];
    data.currencies = isEmpty(staticData.currencies) ? [] : staticData.currencies;
    data.riskTypes = staticData.risk_types || [];
    data.cashTransferModalities = staticData.cash_transfer_modalities || [];
    return data;
  }

  getValue(response: {status: string; value?: any; reason?: any}, defaultValue: any = []) {
    return response.status === 'fulfilled' ? response.value : defaultValue;
  }

  public disconnectedCallback() {
    super.disconnectedCallback();
    // remove toasts notifications listeners
    this.appToastsNotificationsHelper.removeToastNotificationListeners();
  }

  public stateChanged(state: RootState) {
    this.routeDetails = state.app!.routeDetails;
    this.mainPage = state.app!.routeDetails!.routeName;
    this.subPage = state.app!.routeDetails!.subRouteName;
    this.drawerOpened = state.app!.drawerOpened;
    if (get(state, 'app.toastNotification.active')) {
      fireEvent(this, 'toast', {
        text: state.app!.toastNotification.message,
        showCloseBtn: state.app!.toastNotification.showCloseBtn
      });
    }
    if (state.activeLanguage && state.activeLanguage.activeLanguage !== this.selectedLanguage) {
      this.selectedLanguage = state.activeLanguage!.activeLanguage;
      this.loadLocalization();
    }
  }

  async loadLocalization() {
    await use(this.selectedLanguage);
  }

  // TODO: just for testing...
  public getState() {
    console.log(store.getState());
  }

  // Testing router (from console)
  public getRouter() {
    return EtoolsRouter;
  }

  public onDrawerToggle() {
    if (this.drawerOpened !== this.drawer.opened) {
      store.dispatch(updateDrawerState(this.drawer.opened));
    }
  }

  public toggleMenu(e: CustomEvent) {
    this.smallMenu = e.detail.value;
    this._updateDrawerStyles();
    this._notifyLayoutResize();
  }

  private _updateDrawerStyles(): void {
    this.drawerLayout.updateStyles();
    this.drawer.updateStyles();
  }

  private _notifyLayoutResize(): void {
    this.drawerLayout.notifyResize();
    this.appHeaderLayout.notifyResize();
  }

  protected isActiveMainPage(currentPageName: string, expectedPageName: string): boolean {
    return currentPageName === expectedPageName;
  }

  protected isActiveSubPage(currentSubPageName: string, expectedSubPageNames: string): boolean {
    const subPages: string[] = expectedSubPageNames.split('|');
    return subPages.indexOf(currentSubPageName) > -1;
  }

  protected isActivePage(
    pageName: string,
    expectedPageName: string,
    currentSubPageName?: string | null,
    expectedSubPageNames?: string
  ): boolean {
    if (!this.isActiveMainPage(pageName, expectedPageName)) {
      return false;
    }
    if (currentSubPageName && expectedSubPageNames) {
      return this.isActiveSubPage(currentSubPageName, expectedSubPageNames);
    }
    return true;
  }
}
