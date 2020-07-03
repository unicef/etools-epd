import {LitElement, html, property} from 'lit-element';
import {connect} from '../utils/store-subscribe-mixin';
import './partner-details/partner-details';
import './pd-unicef-details/pd-unicef-details';

/**
 * @customElement
 */
export class InterventionDetails extends connect(LitElement) {
  render() {
    // language=HTML
    return html`
      <style>
        /* CSS rules for your element */
      </style>

      <partner-details></partner-details>
      <pd-unicef-details></pd-unicef-details>
    `;
  }
}

window.customElements.define('intervention-details', InterventionDetails);
