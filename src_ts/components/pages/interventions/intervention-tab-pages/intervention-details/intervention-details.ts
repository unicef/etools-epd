import {LitElement, html, property} from 'lit-element';
import {connect} from '../utils/store-subscribe-mixin';
import './partner-details/partner-details';
import './document-details/document-details';
import {gridLayoutStylesLit} from '../../../../styles/grid-layout-styles-lit';

/**
 * @customElement
 */
export class InterventionDetails extends connect(LitElement) {
  render() {
    // language=HTML
    return html`
      ${gridLayoutStylesLit}
      <style>
        /* CSS rules for your element */
      </style>

      <div class="row-v">
        <partner-details></partner-details>
      </div>
      <div class="row-v">
        <document-details></document-details>
      </div>
    `;
  }
}

window.customElements.define('intervention-details', InterventionDetails);
