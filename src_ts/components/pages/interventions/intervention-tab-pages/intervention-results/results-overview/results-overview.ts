import {LitElement, customElement, html, property} from 'lit-element';
import {sharedStyles} from '../../common/styles/shared-styles-lit';
import '../../../../../../redux/actions/interventions';
import {connect} from '../../utils/store-subscribe-mixin';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import {elevationStyles} from '../../common/styles/elevation-styles';
import {PdResultsOverview} from './pdResultsOverview.models';
import {selectPdResultsOverview} from './pdResultsOverview.selectors';

/**
 * @customElement
 */
@customElement('results-overview')
export class ResultsOverview extends connect(LitElement) {
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
              <label class="input-label" ?empty="${!this.resultsOverview.currency}">${this.resultsOverview.currency}</label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="input-label" ?empty="${!this.resultsOverview.hq_rate}">${this.resultsOverview.hq_rate} %</label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="input-label" ?empty="${!this.resultsOverview.prgm_effectiveness}">
                ${this.resultsOverview.prgm_effectiveness} %
              </label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="input-label" ?empty="${!this.resultsOverview.total_cso}">${this.resultsOverview.total_cso}</label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="input-label" ?empty="${!this.resultsOverview.total_unicef}">${this.resultsOverview.total_unicef}</label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="input-label" ?empty="${!this.resultsOverview.total_supply}">${this.resultsOverview.total_supply}</label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="input-label" ?empty="${!this.resultsOverview.partner_contrib}">
                ${this.resultsOverview.partner_contrib}
              </label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="input-label" ?empty="${!this.resultsOverview.total_cash}">${this.resultsOverview.total_cash}</label>
            </span>
          </div>
          <div class="col col-2">
            <span>
              <label class="input-label" ?empty="${!this.resultsOverview.total_amt}">
                ${this.resultsOverview.total_amt}
              </label>
            </span>
          </div>
        </div>
      </section>
    `;
  }

  @property({type: Object})
  resultsOverview!: PdResultsOverview;

  connectedCallback() {
    super.connectedCallback();
  }

  public stateChanged(state: any) {
    if (state.interventions.current) {
      this.resultsOverview = selectPdResultsOverview(state);
    }
  }
}
