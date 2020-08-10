import {LitElement, customElement, html} from 'lit-element';
import './amendments/pd-amendments';
import './fund-reservations/fund-reservations';
import './risks/risks';

/**
 * @customElement
 */
@customElement('intervention-management')
export class InterventionManagement extends LitElement {
  render() {
    // language=HTML
    return html`
      <style></style>
      <risks-element></risks-element>
      <pd-amendments></pd-amendments>
      <fund-reservations></fund-reservations>
    `;
  }
}
