import {LitElement, customElement, html} from 'lit-element';
import './budget-summary/budget-summary';
import './supply-agreement/supply-agreement';
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
      <supply-agreements></supply-agreements>
      <results-structure></results-structure>
    `;
  }
}
