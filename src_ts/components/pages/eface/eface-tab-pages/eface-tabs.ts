import {LitElement, customElement, html} from 'lit-element';
import './details/eface-details';

/**
 * @customElement
 */
@customElement('eface-tabs')
export class EfaceTabs extends LitElement {
  render() {
    // language=HTML
    return html`
      <style></style>

      <eface-details></eface-details>
    `;
  }
  connectedCallback() {
    super.connectedCallback();
    // Disable loading message for tab load, triggered by parent element on stamp or by tap event on tabs
    // fireEvent(this, 'global-loading', {
    //   active: false,
    //   loadingSource: 'interv-page'
    // });
  }
}
