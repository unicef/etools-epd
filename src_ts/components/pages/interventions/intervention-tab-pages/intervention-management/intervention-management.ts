import {LitElement, customElement, html} from 'lit-element';
import './amendments/pd-amendments';
import './intervention-review-and-sign/intervention-review-and-sign';
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
      <intervention-review-and-sign></intervention-review-and-sign>
    `;
  }
}
