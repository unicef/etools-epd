import {LitElement, html} from 'lit-element';
import './partner-details/partner-details';
import './document-details/document-details';
import './details-overview/details-overview';
import './unicef-details/unicef-details';

/**
 * @customElement
 */
export class InterventionDetails extends LitElement {
  render() {
    // language=HTML
    return html`
      <style></style>
      <details-overview></details-overview>
      <partner-details></partner-details>
      <unicef-details></unicef-details>
      <document-details></document-details>
    `;
  }
}

window.customElements.define('intervention-details', InterventionDetails);
