import {LitElement, html} from 'lit-element';

/**
 * @customElement
 */
export class InterventionDetails extends LitElement {
  render() {
    // language=HTML
    return html`
      <style>
        /* CSS rules for your element */
      </style>

      Details tab
    `;
  }
}

window.customElements.define('intervention-details', InterventionDetails);
