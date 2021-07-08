import {LitElement, customElement, html} from 'lit-element';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {elevationStyles} from '../../../common/styles/elevation-styles';
import {sharedStyles} from '../../../common/styles/shared-styles-lit';

/**
 * @customElement
 */
@customElement('eface-details')
export class EfaceDetails extends LitElement {
  static get styles() {
    return [elevationStyles, sharedStyles, pageLayoutStyles];
  }
  render() {
    // language=HTML
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <section class="elevation page-content" elevation="1">eFace Details</section>
    `;
  }
  connectedCallback() {
    super.connectedCallback();
    // Disable loading message for tab load, triggered by parent element on stamp or by tap event on tabs
    // fireEvent(this, 'global-loading', {
    //   active: false,
    //   loadingSource: 'interv-page'
    // });
  }
}
