import {LitElement, customElement, html, property} from 'lit-element';
import '@unicef-polymer/etools-content-panel/etools-content-panel';
import {sharedStyles} from '../../common/styles/shared-styles-lit';
import '../../../../../../redux/actions/interventions';
import {connect} from '../../utils/store-subscribe-mixin';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import {elevationStyles} from '../../common/styles/elevation-styles';
import {PdInterventionOverview} from './pdInterventionOverview.models';
import {selectPdInterventionOverview} from './pdInterventionOverview.selectors';

/**
 * @customElement
 */
@customElement('details-overview')
export class DetailsOverview extends connect(LitElement) {
  static get styles() {
    return [gridLayoutStylesLit, elevationStyles];
  }
  render() {
    // language=HTML
    return html`
      ${sharedStyles}
      <style>
        :host {
          display: block;
          margin-bottom: 24px;
        }
        .row-h {
          padding-top: 5px;
          padding-bottom: 5px;
        }
      </style>
      <section class="elevation page-content filters" elevation="1">
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
              <label class="input-label" ?empty="${!this.interventionOverview.document_type}">
                ${this.interventionOverview.document_type}
              </label>
            </span>
          </div>
          <div class="col col-3">
            <span>
              <label class="input-label" ?empty="${!this.interventionOverview.cfei_number}">
                ${this.interventionOverview.cfei_number}
              </label>
            </span>
          </div>
          <div class="col col-2">
            <span>
              <label class="input-label" ?empty="${!this.interventionOverview.contingency_pd}">
                ${this._getText(this.interventionOverview.contingency_pd)}
              </label>
            </span>
          </div>
          <div class="col col-2">
            <span>
              <label class="input-label" ?empty="${!this.interventionOverview.humanitarian}">
                ${this._getText(this.interventionOverview.humanitarian)}
              </label>
            </span>
          </div>
        </div>
      </section>
    `;
  }

  @property({type: Object})
  interventionOverview!: PdInterventionOverview;

  connectedCallback() {
    super.connectedCallback();
  }

  public stateChanged(state: any) {
    if (state.interventions.current) {
      this.interventionOverview = selectPdInterventionOverview(state);
    }
  }

  private _getText(value: boolean): string {
    if (value === undefined) {
      return '';
    }
    if (value) {
      return 'Yes';
    } else {
      return 'No';
    }
  }
}
