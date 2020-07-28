import {LitElement, customElement, html} from 'lit-element';
import './amendments/pd-amendments';
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
    `;
  }
}
