import {LitElement, customElement, html, property} from 'lit-element';
import '@polymer/paper-button/paper-button';
import {translate} from 'lit-translate';
import {fireEvent} from '../../common/utils/fire-custom-event';
import './details/eface-details';
import '../../../common/layout/page-content-header/page-content-header';
import '../../common/layout/status/etools-status';
import '../eface-actions/eface-actions';
import {pageContentHeaderSlottedStyles} from '../../common/layout/page-content-header/page-content-header-slotted-styles';

/**
 * @customElement
 */
@customElement('eface-tabs')
export class EfaceTabs extends LitElement {
  static get styles() {
    return [pageContentHeaderSlottedStyles];
  }
  render() {
    // language=HTML
    return html`
      <style></style>
      <etools-status-lit
        .statuses="${this.eface?.status_list || [
          ['draft', 'Draft'],
          ['accepted', 'Accepted'],
          ['submitted', 'Submitted']
        ]}"
        .activeStatus="${this.eface?.status || 'draft'}"
      ></etools-status-lit>
      <page-content-header with-tabs-visible>
        <span slot="page-title">Funding Authorization and Certificate of Expenditure</span>

        <div slot="title-row-actions" class="content-header-actions">
          <paper-button @click="${this.export}" id="export">
            <iron-icon icon="file-download" class="export-icon"></iron-icon>
            ${translate('EXPORT')}
          </paper-button>
          <eface-actions
            .actions="${this.eface?.available_actions || ['Go on Vacation', 'Take a break']}"
          ></eface-actions>
        </div>

        <div slot="tabs"></div>
      </page-content-header>
      <eface-details></eface-details>
    `;
  }

  @property({type: Object})
  eface: any = {};

  connectedCallback() {
    super.connectedCallback();
    // Disable loading message for tab load, triggered by parent element on stamp or by tap event on tabs
    fireEvent(this, 'global-loading', {
      active: false,
      loadingSource: 'interv-page'
    });
  }

  export() {
    console.log('NOT IMPLEMENTED');
  }
}
