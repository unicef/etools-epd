import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-styles/color.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/device-icons.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/element-styles/paper-material-styles.js';
import {
  dashIcon, pmpIcon, tripsIcon, famIcon, tpmIcon, fmIcon,
  apdIcon, adminIcon, externalIcon, unppIcon, pseaIcon, powerBiIcon
} from './app-selector-icons.js';

/**
 * `etools-app-selector`
 *
 * App selector menu
 *
 * @polymer
 * @customElement
 * @extends {PolymerElement}
 * @demo demo/index.html
 */
class EtoolsAppSelector extends PolymerElement {
  static get template() {
    // language=HTML
    return html`
      <custom-style>
        <style is="custom-style" include="paper-material-styles">
          :host {
            --paper-icon-button: {
              box-sizing: content-box !important;
            };
          }

          paper-icon-button.apps-button {
            @apply --layout-horizontal;
            width: 24px;
            height: 24px;
            padding: var(--app-selector-button-padding, 18px 24px 18px 24px);
            color: var(--header-secondary-text-color, rgba(255, 255, 255, 0.7));
            border-right: 1px solid var(--light-divider-color, rgba(255, 255, 255, 0.12));
            z-index: 100;
            box-sizing: content-box !important;
          }

          paper-icon-button.icon-opened {
            background: #ffffff;
            color: var(--dark-primary-text-color, rgba(0, 0, 0, 0.87));
          }

          .container {
            @apply --layout-vertical;
            position: relative;
          }

          .apps-select {
            position: absolute;
            background: var(--primary-element-background, #FFFFFF);
            top: 60px;
            z-index: 100;
            padding: 0;
          }

          .content-wrapper {
            @apply --layout-horizontal;
            padding: 5px;
            box-sizing: border-box;
            font-size: 14px;
            white-space: nowrap;
            border-bottom: 1px solid rgba(0, 0, 0, 0.12);
            border-left: 1px solid rgba(0, 0, 0, 0.12);
            width: 179px;
            height: 100%;
            align-items: center;
          }

          .content-wrapper:hover {
            background: var(--app-selector-item-hover-color, #eeeeee);
          }

          .app-title {
            font-size: 13px;
            font-weight: 500;
            padding-left: 6px;
            padding-right: 6px;
            line-height: 1.2;
            cursor: pointer;
            white-space: normal;
            display: block;
            justify-content: center;
            max-width: 116px;
          }

          .etools-apps {
            width: 360px;
          }

          svg #adminIcon path.option,
          svg #externalIcon path.option {
            fill: var(--light-theme-secondary-color, #cccccc);
          }

          .admin {
            background: #eeeeee;
            display: flex;
            align-items: center;
            padding-left: 4px;
          }

          a, a:link, a:visited, a:hover, a:active {
            color: var(--app-selector-text-color, rgba(0, 0, 0, 0.87));
            text-decoration: none;
          }

          .module-group {
            border-right: 1px solid rgba(0, 0, 0, 0.12);
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
          }

          .module-group-title {
            text-transform: capitalize;
            font-weight: 450;
            padding: 6px;
            background: #eeeeee;
            font-size: 12px;
            border-right: 1px solid var(--divider-color);
            border-left: 1px solid var(--divider-color);
            display: flex;
            color: #444444;
          }

          .datamart > iron-icon {
            --iron-icon-height: 36px;
            --iron-icon-width: 36px;
            --iron-icon-fill-color: var(--light-theme-secondary-color, #cccccc);
          }

          @media (max-width: 768px) {
            paper-icon-button.apps-button {
              padding: var(--app-selector-button-padding, 18px 12px);
            }
          }
        </style>
      </custom-style>

      <div class="container" id="etools-selector">
        <paper-icon-button on-tap="toggleMenu" class$="apps-button [[opened]]" icon="apps"></paper-icon-button>
        <iron-collapse id="selector" class="apps-select">
          <div class="paper-material" elevation="5">

            <div class="etools-apps">
              <span class="module-group-title">Programme Management</span>
              <div class="module-group">
                <a class="content-wrapper"
                  href="https://www.unpartnerportal.org/login" target="_blank">
                  ${unppIcon}
                  <div class="app-title">UN Partner Portal</div>
                  ${externalIcon}
                </a>
                <template is="dom-if" if="[[_hasPermission('pmp', user)]]">
                  <a class="content-wrapper" on-tap="goToPage" href$="[[baseSite]]/pmp/">
                    ${pmpIcon}
                    <div class="app-title">Partnership Management</div>
                  </a>
                </template>
              </div>

              <template is="dom-if" if="[[_hasAnyGroupPermissions(user, 't2f', 'tpm', 'fam', 'psea')]]">
                <span class="module-group-title">Monitoring & Assurance</span>
                <div class="module-group">
                  <template is="dom-if" if="[[_hasPermission('t2f', user)]]">
                    <a class="content-wrapper" on-tap="goToPage" href$="[[baseSite]]/t2f/">
                      ${tripsIcon}
                      <div class="app-title">Trip Management</div>
                    </a>
                  </template>

                  <template is="dom-if" if="[[_hasPermission('tpm', user)]]">
                    <a class="content-wrapper" on-tap="goToPage" href$="[[baseSite]]/tpm/">
                      ${tpmIcon}
                      <div class="app-title">Third Party Monitoring</div>
                    </a>
                  </template>

                  <template is="dom-if" if="[[_hasPermission('fam', user)]]">
                    <a class="content-wrapper" on-tap="goToPage" href$="[[baseSite]]/ap/">
                      ${famIcon}
                      <div class="app-title">Financial Assurance</div>
                    </a>
                  </template>

                  <template is="dom-if" if="[[_hasPermission('psea', user)]]">
                    <a class="content-wrapper" on-tap="goToPage" href$="[[baseSite]]/psea/">
                      ${pseaIcon}
                      <div class="app-title">PSEA Assurance</div>
                    </a>
                  </template>

                  <template is="dom-if" if="[[_hasPermission('fm', user)]]">
                    <a class="content-wrapper" on-tap="goToPage" href$="[[baseSite]]/fm/">
                      ${fmIcon}
                      <div class="app-title">Field Monitoring</div>
                    </a>
                  </template>
                </div>
              </template>

              <span class="module-group-title">Dashboards & Analytics</span>
              <div class="module-group">
                <template is="dom-if" if="[[_hasPermission('apd', user)]]">
                  <a class="content-wrapper" on-tap="goToPage" href$="[[baseSite]]/apd/">
                    ${apdIcon}
                    <div class="app-title">Action Points</div>
                  </a>
                </template>

                <template is="dom-if" if="[[_hasPermission('dash', user)]]">
                  <a class="content-wrapper" on-tap="goToPage" href$="[[baseSite]]/dash/">
                    ${dashIcon}
                    <div class="app-title">Dashboards</div>
                  </a>
                </template>

                <a class="content-wrapper" target="_blank"
                   href="https://app.powerbi.com/groups/me/apps/2c83563f-d6fc-4ade-9c10-bbca57ed1ece/reports/5e60ab16-cce5-4c21-8620-de0c4c6415de/ReportSectionfe8562e6ef8c4eddcb52">
                  ${powerBiIcon}
                  <span class="app-title">Implementation Intelligence (I<sup>2</sup>)</span>
                  ${externalIcon}
                </a>

                <a class="datamart content-wrapper"
                    href="https://datamart.unicef.io" target="_blank">
                  <iron-icon icon="device:storage"></iron-icon>
                  <div class="app-title">Datamart</div>
                  ${externalIcon}
                </a>
              </div>
            </div>

            <template is="dom-if" if="[[isAdmin]]">
              <a class="admin"
                  on-tap="goToPage"
                  href$="[[baseSite]]/admin/">
                  ${adminIcon}
                <span class="app-title">ADMIN</span>
              </a>
            </template>

          </div>
        </iron-collapse>
      </div>
    `;
  }

  static get is() {
    return 'etools-app-selector';
  }

  static get properties() {
    return {

      baseSite: {
        type: String,
        value: window.location.origin
      },

      isAdmin: {
        type: Boolean,
        value: false
      },

      /**
       * Class name toggle variable.
       * Used for styling when dropdown open/closed
       */
      opened: {
        type: String,
        value: ''
      },
      user: {
        type: Object,
        observer: 'checkIsAdmin',
        value: {}
      },
      appPermissionsByGroup: {
        type: Object,
        value: {
          dash: ['UNICEF User'],
          pmp: ['UNICEF User'],
          t2f: ['UNICEF User'],
          tpm: ['UNICEF User', 'Third Party Monitor'],
          fam: ['UNICEF User', 'Auditor'],
          apd: ['UNICEF User'],
          psea: ['all'],
          fm: ['UNICEF User', 'Third Party Monitor']
        }
      }
    };
  }

  ready() {
    super.ready();
    if (this.showAp) {
      this._addApPanel();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._onCaptureClick = this._onCaptureClick.bind(this);
    document.addEventListener('click', this._onCaptureClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._onCaptureClick);
  }

  /**
   * Toggles the menu opened and closed
   *
   */
  toggleMenu() {
    this.$.selector.toggle();
    if (this.opened) {
      this.opened = '';
    } else {
      this.opened = 'icon-opened';
    }
  }

  /**
   * Navigate window to path if ctrl/command are not pressed
   */
  manageClickEvent(e, path) {
    if (!e.detail.sourceEvent.ctrlKey && !e.detail.sourceEvent.metaKey) {
      window.location.href = path;
    }
  }

  /**
   * Change location to target app url found in menuOptions array items.
   * Url prop of item should just be app name
   *
   * Example:
   *
   *  `app.url="admin" will change location to 'http://myBaseUrlAndPort/admin/' `
   *
   */

  goToPage(e) {
    let path = e.target.closest('a').getAttribute('href');
    this.manageClickEvent(e, path);
  }

  /**
   * Determine if click is outside of menu, close if true
   *
   */
  _onCaptureClick(e) {
    if (!this._isInPath(e.composedPath(), 'id', 'etools-selector')) {
      if (this.$.selector.opened) {
        this.toggleMenu();
      }
    }
  }

  _isInPath(path, prop, value) {
    path = path || [];
    for (var i = 0; i < path.length; i++) {
      if (path[i][prop] === value) {
        return true;
      }
    }
    return false;
  }

  _hasPermission(appName, user) {
    // checks if user object is populated
    if (!this.user || (Object.entries(user).length === 0 && user.constructor === Object)) {return false;}
    // removes PSEA if user is a TPM
    if (appName === 'psea' && user.groups.some(group => group.name === 'Third Party Monitor')) {return false;}
    let allowedGroups = this.appPermissionsByGroup[appName];
    if (allowedGroups.indexOf('all') > -1) {return true;}
    return user.groups.some(group => allowedGroups.indexOf(group.name) > -1);
  }

  checkIsAdmin() {
    if (!this.user || (Object.entries(this.user).length === 0 && this.user.constructor === Object)) {return false;}
    let isAdmin = this.user.is_superuser === 'True' ||
      this.user.groups.find(group => group.name === 'Country Office Administrator');
    this.set('isAdmin', isAdmin);
  }

  _hasAnyGroupPermissions(user, ...moduleArray) {
    return moduleArray.find(mod => this._hasPermission(mod, user));
  }
}

customElements.define(EtoolsAppSelector.is, EtoolsAppSelector);
