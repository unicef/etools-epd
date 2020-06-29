import {LitElement, html} from 'lit-element';

/**
 * @customElement
 */
export class PartnerDetails extends LitElement {
  render() {
    // language=HTML
    return html`
      <style>
        /* CSS rules for your element */
      </style>

      Partner details
    `;
  }
}

window.customElements.define('partner-details', PartnerDetails);
