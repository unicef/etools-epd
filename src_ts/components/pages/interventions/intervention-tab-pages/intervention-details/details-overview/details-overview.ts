import {LitElement, customElement, html, property} from 'lit-element';
import '@unicef-polymer/etools-content-panel/etools-content-panel';
import {sharedStyles} from '../../common/styles/shared-styles-lit';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';

/**
 * @customElement
 */
@customElement('details-overview')
export class DetailsOverview extends LitElement {
  render() {
    // language=HTML
    return html`
      <style>
        ${sharedStyles} ${gridLayoutStylesLit}
        :host {
          display: block;
          margin-bottom: 24px;
        }
        .row-h {
          padding-top: 5px;
          padding-bottom: 5px;
        }
      </style>

      <etools-content-panel class="content-section" no-header>
        <div class="row-h flex-c">
          <div class="col col-3">
            <span>
              <label class="paper-label">Document Type</label>
            </span>
          </div>
          <div class="col col-3">
            <span>
              <label class="paper-label">CFEI Number</label>
            </span>
          </div>
          <div class="col col-2">
            <span>
              <label class="paper-label">Humanitarian</label>
            </span>
          </div>
          <div class="col col-2">
           <span>
              <label class="paper-label">Contingency</label>
            </span>
          </div>
        </div>
        <div class="row-h flex-c">
          <div class="col col-3">
            <span>
              <label class="input-label">${this.intervention.document_type}</label>
            </span>
          </div>
          <div class="col col-3">
            <span>
              <label class="input-label">${this.intervention.cfei_number}</label>
            </span>
          </div>
          <div class="col col-2">
            <span>
              <label class="input-label">${this._getText(this.intervention.contingency_pd)}</label>
            </span>
          </div>
          <div class="col col-2">
            <span>
              <label class="input-label">${this._getText(this.intervention.humanitarian)}</label>
            </span>
          </div>
        </div>
      </etools-content-panel>
    `;
  }

  @property({type: Object})
  intervention = {document_type: String, cfei_number: String, contingency_pd: Boolean, humanitarian: Boolean};

  connectedCallback() {
    // TODO: remove dummy data
    super.connectedCallback();
    this.intervention = {
      document_type: 'Simpified Programme Documment',
      cfei_number: '123456789',
      contingency_pd: true,
      humanitarian: false
    };
  }

  private _getText(value: boolean): string {
    if (value) {
      return 'Yes';
    } else {
      return 'No';
    }
  }
}
