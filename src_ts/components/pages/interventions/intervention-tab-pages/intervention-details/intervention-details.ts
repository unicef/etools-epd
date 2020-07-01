import {LitElement, html, property} from 'lit-element';
import {connect} from '../common/store-subscribe-mixin';
import './partner-details/partner-details';
import {AnyObject} from '../common/types';

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

      <partner-details .store="${this.store}"></partner-details>
    `;
  }
}

window.customElements.define('intervention-details', InterventionDetails);
