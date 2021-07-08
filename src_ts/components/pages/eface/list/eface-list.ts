import {LitElement, customElement, html} from 'lit-element';

/**
 * @customElement
 */
@customElement('eface-list')
export class EfaceList extends LitElement {
  render() {
    // language=HTML
    return html`
      <style></style>

      eFace List
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
