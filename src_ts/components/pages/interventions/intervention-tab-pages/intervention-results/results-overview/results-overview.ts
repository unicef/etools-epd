import {LitElement, customElement, html, property} from 'lit-element';
import '@unicef-polymer/etools-content-panel/etools-content-panel';
import {sharedStyles} from '../../common/styles/shared-styles-lit';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';

/**
 * @customElement
 */
@customElement('results-overview')
export class ResultsOverview extends LitElement {
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
        .paper-label {
          font-size: 12px;
          color: var(--secondary-text-color);
          padding-top: 8px;
        }
        .input-label {
          min-height: 24px;
          padding-top: 4px;
          min-width: 0;
        }
        .input-label[empty]::after {
          content: "—";
          color: var(--secondary-text-color);
        }
      </style>
      <etools-content-panel class="content-section" no-header>
        <div class="row-h flex-c">
          <div class="col col-1">
            <span>
              <label class="paper-label">Budget Currency</label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="paper-label">Budget HQ Rate</label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="paper-label">% Prgm Effectiveness</label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="paper-label">Total CSO Contrib</label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="paper-label">Total Unicef Contrib</label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="paper-label">Total Supply</label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="paper-label">% Partner Contrib</label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="paper-label">Total Cash Amt</label>
            </span>
          </div>
          <div class="col col-2">
            <span>
              <label class="paper-label">Total Amt (Cash + Supply)</label>
            </span>
          </div>
        </div>
        <div class="row-h flex-c">
          <div class="col col-1">
            <span>
              <label class="input-label" ?empty="${!this.results.currency}">${this.results.currency}</label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="input-label" ?empty="${!this.results.hq_rate}">${this.results.hq_rate} %</label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="input-label" ?empty="${!this.results.prgm_effectiveness}">
                ${this.results.prgm_effectiveness} %
              </label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="input-label" ?empty="${!this.results.total_cso}">${this.results.total_cso}</label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="input-label" ?empty="${!this.results.total_unicef}">${this.results.total_unicef}</label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="input-label" ?empty="${!this.results.total_supply}">${this.results.total_supply}</label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="input-label" ?empty="${!this.results.partner_contrib}">
                ${this.results.partner_contrib}
              </label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="input-label" ?empty="${!this.results.total_cash}">${this.results.total_cash}</label>
            </span>
          </div>
          <div class="col col-2">
            <span>
              <label class="input-label" ?empty="${!this.results.total_amt}">
                ${this.results.total_amt}
              </label>
            </span>
          </div>
        </div>
      </etools-content-panel>
    `;
  }

  @property({type: Object})
  results = {
    currency: String,
    hq_rate: Number,
    prgm_effectiveness: Number,
    total_cso: Number,
    total_unicef: Number,
    total_supply: Number,
    partner_contrib: Number,
    total_cash: Number,
    total_amt: Number
  };

  connectedCallback() {
    // TODO: remove dummy data
    super.connectedCallback();
    this.results = {
      currency: 'USD',
      hq_rate: '10',
      prgm_effectiveness: '12',
      total_cso: '100'
    };
  }
}
