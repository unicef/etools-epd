import {PolymerElement, html} from '@polymer/polymer/polymer-element';

/**
 * @customElement
 * @polymer
 */
class InterventionDetails extends PolymerElement {
  static get template() {
    // language=HTML
    return html`
      <style>
        /* CSS rules for your element */
      </style>

      Page One Details tab content
    `;
  }
}

window.customElements.define('intervention-details', InterventionDetails);
