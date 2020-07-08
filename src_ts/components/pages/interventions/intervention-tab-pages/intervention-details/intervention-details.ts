import {LitElement, html} from 'lit-element';
import {connect} from '../utils/store-subscribe-mixin';
import './partner-details/partner-details';
import './document-details/document-details';
import './details-overview/details-overview';
import {gridLayoutStylesLit} from '../common/styles/grid-layout-styles-lit';
import './unicef-details/unicef-details';

/**
 * @customElement
 */
export class InterventionDetails extends connect(LitElement) {
  static get styles() {
    return [gridLayoutStylesLit];
  }
  public render() {
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
