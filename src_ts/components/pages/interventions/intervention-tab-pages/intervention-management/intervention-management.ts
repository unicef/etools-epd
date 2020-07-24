import {LitElement, customElement, html} from 'lit-element';
import './programmatic-visits/programmatic-visits';

/**
 * @customElement
 */
@customElement('intervention-management')
export class InterventionManagement extends LitElement {
  render() {
    // language=HTML
    return html`
      <style></style>

      <programmatic-visits></programmatic-visits>
    `;
  }
}
