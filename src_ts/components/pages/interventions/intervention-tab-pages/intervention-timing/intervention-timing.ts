import {LitElement, customElement, html} from 'lit-element';
import './programme-document-dates/programme-document-dates';

/**
 * @customElement
 */
@customElement('intervention-timing')
export class InterventionTiming extends LitElement {
  render() {
    // language=HTML
    return html`
      <style></style>

      <programme-document-dates></programme-document-dates>
    `;
  }
}
