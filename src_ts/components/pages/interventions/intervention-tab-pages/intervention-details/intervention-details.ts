import {LitElement, html} from 'lit-element';
import {connect} from '../utils/store-subscribe-mixin';
import './partner-details/partner-details';
import './document-details/document-details';
import {gridLayoutStylesLit} from '../../../../styles/grid-layout-styles-lit';
import './unicef-details/unicef-details';
import './geographical-coverage/geographical-coverage';

/**
 * @customElement
 */
export class InterventionDetails extends connect(LitElement) {
  render() {
    // language=HTML
    return html`
      ${gridLayoutStylesLit}
      <style></style>

      <partner-details></partner-details>
      <unicef-details></unicef-details>
      <document-details></document-details>
      <geographical-coverage></geographical-coverage>
    `;
  }
}

window.customElements.define('intervention-details', InterventionDetails);
