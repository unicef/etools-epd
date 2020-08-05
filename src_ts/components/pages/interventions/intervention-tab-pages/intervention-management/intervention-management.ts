import {LitElement, customElement, html} from 'lit-element';
import './amendments/pd-amendments';
import './fund-reservations/fund-reservations';

/**
 * @customElement
 */
@customElement('intervention-management')
export class InterventionManagement extends LitElement {
  render() {
    // language=HTML
    return html`
      <style></style>
      <pd-amendments></pd-amendments>
      <fund-reservations></fund-reservations>
    `;
  }
}
