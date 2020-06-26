import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

/**
 * @customElement
 * @polymer
 */
class InterventionQuestionnaires extends PolymerElement {
  static get template() {
    // language=HTML
    return html`
      <style>
        /* CSS rules for your element */
      </style>

      Page One Questionnaires tab content...
    `;
  }

  static get properties() {
    return {};
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }
}

window.customElements.define('intervention-questionnaires', InterventionQuestionnaires);
