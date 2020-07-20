import {LitElement, customElement, html} from 'lit-element';
import './budget-summary/budget-summary';
import './effective-and-efficient-programme-management/effective-and-efficient-programme-management';

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
      <effective-and-efficient-programme-management></effective-and-efficient-programme-management>
    `;
  }
}
