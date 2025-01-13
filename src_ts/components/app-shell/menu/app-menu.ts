import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';

import {navMenuStyles} from './styles/nav-menu-styles';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY} from '../../../config/config';
import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {Environment} from '@unicef-polymer/etools-utils/dist/singleton/environment';

/**
 * main menu
 * @LitElement
 * @customElement
 */
@customElement('app-menu')
export class AppMenu extends LitElement {
  static get styles() {
    return [navMenuStyles];
  }

  public render() {
    // main template
    // language=HTML
    return html`
      <div class="menu-header">
        <span id="app-name"> ePD </span>

        <sl-tooltip for="menu-header-top-icon" placement="right" content="ePD">
          <span class="ripple-wrapper main">
            <etools-icon
              id="menu-header-top-icon"
              name="assignment-ind"
              @click="${() => this._toggleSmallMenu()}"
            ></etools-icon>
          </span>
        </sl-tooltip>

        <span class="chev-right">
          <etools-icon id="expand-menu" name="chevron-right" @click="${() => this._toggleSmallMenu()}"></etools-icon>
        </span>

        <span class="ripple-wrapper">
          <etools-icon id="minimize-menu" name="chevron-left" @click="${() => this._toggleSmallMenu()}"></etools-icon>
        </span>
      </div>

      <div class="nav-menu">
        <div class="menu-selector" role="navigation">
          <a
            class="nav-menu-item ${this.getItemClass(this.selectedOption, 'interventions')}"
            href="${this.rootPath + 'interventions'}"
          >
            <sl-tooltip for="page1-icon" placement="right" content="${translate('PDS_SPDS')}">
              <etools-icon id="page1-icon" name="accessibility"></etools-icon>
            </sl-tooltip>
            <div class="name">${translate('PDS_SPDS')}</div>
          </a>
        </div>

        <div class="nav-menu-item section-title">
          <span>${translate('COMMUNITY_CHANNELS')}</span>
        </div>

        <a
          class="nav-menu-item lighter-item"
          href="https://unpartnerportalcso.zendesk.com/hc/en-us/sections/12663538797975-Electronic-Programme-Document-ePD-"
          target="_blank"
        >
          <sl-tooltip for="knoledge-icon" placement="right" content="${translate('KNOWLEDGE_BASE')}">
            <etools-icon id="knoledge-icon" name="maps:local-library"></etools-icon>
          </sl-tooltip>
          <div class="name">${translate('KNOWLEDGE_BASE')}</div>
        </a>
      </div>
    `;
  }

  @property({type: String, attribute: 'selected-option'})
  public selectedOption = '';

  @property({type: String})
  rootPath: string = Environment.basePath;

  @property({type: Boolean, attribute: 'small-menu'})
  public smallMenu = false;

  public _toggleSmallMenu(): void {
    this.smallMenu = !this.smallMenu;
    const localStorageVal: number = this.smallMenu ? 1 : 0;
    localStorage.setItem(SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY, String(localStorageVal));
    fireEvent(this, 'toggle-small-menu', {value: this.smallMenu});
  }

  getItemClass(selectedValue: string, itemValue: string) {
    return selectedValue === itemValue ? 'selected' : '';
  }
}
