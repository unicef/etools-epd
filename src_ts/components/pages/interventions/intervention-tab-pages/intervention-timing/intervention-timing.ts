import {LitElement, customElement, html} from 'lit-element';
import './intervention-dates/intervention-dates';

/**
 * @customElement
 */
@customElement('intervention-timing')
export class InterventionTiming extends LitElement {
  render() {
    // language=HTML
    return html`
      <style></style>

      <intervention-dates></intervention-dates>
    `;
  }
}
