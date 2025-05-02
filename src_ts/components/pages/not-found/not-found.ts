import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

// These are the shared styles needed by this element.
import {elevationStyles} from '../../styles/lit-styles/elevation-styles';
import {pageLayoutStyles} from '../../styles/page-layout-styles';
import {SharedStylesLit} from '../../styles/shared-styles-lit';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {Environment} from '@unicef-polymer/etools-utils/dist/singleton/environment';

/**
 * @customElement
 * @LitElement
 */
@customElement('not-found')
export class PageNotFound extends LitElement {
  static get styles() {
    return [elevationStyles, pageLayoutStyles];
  }

  render() {
    return html`
      ${SharedStylesLit}
      <section class="page-content elevation" elevation="1">
        <h2>Oops! You hit a 404</h2>
        <p>
          The page you're looking for doesn't seem to exist. Head back <a href="${this.rootPath}">home</a> and try
          again?
        </p>
      </section>
    `;
  }

  @property({type: String})
  rootPath: string = Environment.basePath;

  _active = false;
  @property({type: Boolean})
  get active() {
    return this._active;
  }

  set active(newVal) {
    this._active = newVal;
    if (this._active) {
      fireEvent(this, 'global-loading', {
        active: false,
        loadingSource: 'interv-page'
      });
    }
  }

  connectedCallback() {
    super.connectedCallback();
    // Disable loading message for tab load, triggered by parent element on stamp or by tap event on tabs
    fireEvent(this, 'global-loading', {
      active: false,
      loadingSource: 'interv-page'
    });
  }
}
