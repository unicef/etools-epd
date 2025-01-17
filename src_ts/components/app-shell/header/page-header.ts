import '@unicef-polymer/etools-unicef/src/etools-app-layout/app-toolbar.js';
import '@unicef-polymer/etools-unicef/src/etools-profile-dropdown/etools-profile-dropdown';
import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown.js';
import '@unicef-polymer/etools-unicef/src/etools-icon-button/etools-icon-button.js';
import '@unicef-polymer/etools-modules-common/dist/components/dropdowns/languages-dropdown';
import '@unicef-polymer/etools-modules-common/dist/components/dropdowns/countries-dropdown';
import '@unicef-polymer/etools-modules-common/dist/components/dropdowns/organizations-dropdown';
import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import {DexieRefresh} from '@unicef-polymer/etools-utils/dist/singleton/dexie-refresh';
import {connect} from '@unicef-polymer/etools-utils/dist/pwa.utils';
import {RootState, store} from '../../../redux/store';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import isEmpty from 'lodash-es/isEmpty';
import {updateCurrentUser} from '../../user/user-actions';
import {translate, get as getTranslation} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {activeLanguage} from '../../../redux/reducers/active-language';
import {AnyObject, EtoolsUser} from '@unicef-polymer/etools-types';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {EtoolsRedirectPath} from '@unicef-polymer/etools-utils/dist/enums/router.enum';
import {etoolsEndpoints} from '../../../endpoints/endpoints-list';
import {appLanguages} from '../../../config/app-constants';
import {Environment} from '@unicef-polymer/etools-utils/dist/singleton/environment';
import {updateUserData} from '../../../redux/actions/user';
import {setActiveLanguage} from '../../../redux/actions/active-language';

store.addReducers({
  activeLanguage
});
/**
 * page header element
 * @LitElement
 * @customElement
 */
@customElement('page-header')
export class PageHeader extends connect(store)(LitElement) {
  @property({type: Object})
  profile!: EtoolsUser | null;

  @property({type: Object})
  profileDropdownData: any | null = null;

  @property({type: Array})
  offices: any[] = [];

  @property({type: Array})
  sections: any[] = [];

  @property({type: Array})
  users: any[] = [];

  @property({type: Array})
  profileDrOffices: any[] = [];

  @property({type: Array})
  profileDrSections: any[] = [];

  @property({type: Array})
  profileDrUsers: any[] = [];

  @property({type: Array})
  editableFields: string[] = ['office', 'section', 'job_title', 'phone_number', 'oic', 'supervisor'];

  @property({type: String})
  activeLanguage?: string;

  public render() {
    // main template
    // language=HTML
    return html`
      <app-toolbar
        @menu-button-clicked="${this.menuBtnClicked}"
        .profile=${this.profile}
        responsive-width="850.9px"
        sticky
        class="content-align"
      >
        <div slot="dropdowns">
          <languages-dropdown
            .profile="${this.profile}"
            .availableLanguages="${appLanguages}"
            .activeLanguage="${this.activeLanguage}"
            .changeLanguageEndpoint="${etoolsEndpoints.userProfile}"
            @user-language-changed="${(e: any) => {
              store.dispatch(updateUserData(e.detail.user));
              store.dispatch(setActiveLanguage(e.detail.language));
            }}"
          ></languages-dropdown>
          <countries-dropdown
            id="countries"
            .profile="${this.profile}"
            .changeCountryEndpoint="${etoolsEndpoints.changeCountry}"
            @country-changed="${() => {
              DexieRefresh.refresh();
              DexieRefresh.clearLocalStorage();

              EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.DEFAULT));
              document.location.assign(window.location.origin + Environment.basePath);
            }}"
          >
          </countries-dropdown>
          <organizations-dropdown
            .profile="${this.profile}"
            .changeOrganizationEndpoint="${etoolsEndpoints.changeOrganization}"
            @organization-changed="${() => {
              EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.DEFAULT));
              document.location.assign(window.location.origin + Environment.basePath);
            }}"
          ></organizations-dropdown>
        </div>
        <div slot="icons">
          <etools-profile-dropdown
            title=${translate('GENERAL.PROFILEANDSIGNOUT')}
            .sections="${this.profileDrSections}"
            .offices="${this.profileDrOffices}"
            .users="${this.profileDrUsers}"
            .profile="${this.profile ? {...this.profile} : {}}"
            @save-profile="${this.handleSaveProfile}"
            @sign-out="${this._signOut}"
          >
          </etools-profile-dropdown>
        </div>
      </app-toolbar>
    `;
  }

  public connectedCallback() {
    super.connectedCallback();
  }

  public stateChanged(state: RootState) {
    if (state.user?.data) {
      this.profile = state.user!.data;
    }

    if (this.activeLanguage !== state.activeLanguage?.activeLanguage) {
      this.activeLanguage = state.activeLanguage?.activeLanguage;
    }
  }

  public handleSaveProfile(e: any) {
    const modifiedFields = this._getModifiedFields(this.profile, e.detail.profile);
    if (isEmpty(modifiedFields)) {
      // empty profile means no changes found
      this.showSaveNotification();
      return;
    }
    this.profileSaveLoadingMsgDisplay();
    updateCurrentUser(modifiedFields)
      .then(() => {
        this.showSaveNotification();
      })
      .catch(() => {
        this.showSaveNotification(getTranslation('PROFILE_DATA_NOT_SAVED'));
      })
      .then(() => {
        this.profileSaveLoadingMsgDisplay(false);
      });
  }

  protected profileSaveLoadingMsgDisplay(show = true) {
    fireEvent(this, 'global-loading', {
      active: show,
      loadingSource: 'profile-save'
    });
  }

  protected showSaveNotification(msg?: string) {
    fireEvent(this, 'toast', {
      text: msg ? msg : getTranslation('ALL_DATA_SAVED')
    });
  }

  protected _getModifiedFields(originalData: any, newData: any) {
    const modifiedFields: AnyObject = {};
    this.editableFields.forEach(function (field: any) {
      if (originalData[field] !== newData[field]) {
        modifiedFields[field] = newData[field];
      }
    });

    return modifiedFields;
  }

  public menuBtnClicked() {
    fireEvent(this, 'change-drawer-state');
  }

  protected _signOut() {
    // this._clearDexieDbs();
    this.clearLocalStorage();
    window.location.href = window.location.origin + '/social/unicef-logout/';
  }

  protected clearLocalStorage() {
    localStorage.clear();
  }
}
