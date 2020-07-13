import {LitElement, html} from 'lit-element';
import './partner-details/partner-details';
import './document-details/document-details';
import {gridLayoutStylesLit} from '../../../../styles/grid-layout-styles-lit';
import './unicef-details/unicef-details';

/**
 * @customElement
 */
export class InterventionDetails extends LitElement {
  render() {
    // language=HTML
    return html`
      ${gridLayoutStylesLit}
      <style></style>

      <partner-details></partner-details>
      <unicef-details></unicef-details>
      <document-details></document-details>
    `;
  }
}

window.customElements.define('intervention-details', InterventionDetails);
