import {LitElement, html, property} from 'lit-element';
import {connect} from '../utils/store-subscribe-mixin';
import './partner-details/partner-details';
import './geographical-coverage/geographical-coverage';

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
      <geographical-coverage></geographical-coverage>
    `;
  }
}

window.customElements.define('intervention-details', InterventionDetails);
