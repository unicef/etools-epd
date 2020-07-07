import {LitElement, customElement, html} from 'lit-element';
import './results-overview/results-overview';
/**
 * @customElement
 */
@customElement('intervention-results')
export class InterventionResults extends LitElement {
  render() {
    // language=HTML
    return html`
      <style></style>

      <results-overview></results-overview>
    `;
  }
}
