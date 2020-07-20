import {LitElement, customElement, html} from 'lit-element';
import './budget-summary/budget-summary';
import './results-structure/results-structure';
/**
 * @customElement
 */
@customElement('intervention-results')
export class InterventionResults extends LitElement {
  render() {
    // language=HTML
    return html`
      <style></style>

      <budget-summary></budget-summary>

      <results-structure></results-structure>
    `;
  }
}
