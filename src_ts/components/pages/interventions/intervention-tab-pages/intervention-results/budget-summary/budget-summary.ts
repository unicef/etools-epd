import {LitElement, customElement, html, property} from 'lit-element';
import {sharedStyles} from '../../common/styles/shared-styles-lit';
import '../../../../../../redux/actions/interventions';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import {elevationStyles} from '../../common/styles/elevation-styles';
import {BudgetSummary} from './budgetSummary.models';
import {selectBudgetSummary} from './budgetSummary.selectors';
import {connect} from 'pwa-helpers/connect-mixin';
import {getStore} from '../../utils/redux-store-access';

/**
 * @customElement
 */
@customElement('budget-summary')
export class BudgetSummaryEl extends connect(getStore())(LitElement) {
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
      <section class="elevation page-content" elevation="1">
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
              <label class="input-label" ?empty="${!this.budgetSummary.currency}">
                ${this.budgetSummary.currency}
              </label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="input-label" ?empty="${!this.budgetSummary.hq_rate}">
                ${this.budgetSummary.hq_rate} %
              </label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="input-label" ?empty="${!this.budgetSummary.prgm_effectiveness}">
                ${this.budgetSummary.prgm_effectiveness} %
              </label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="input-label" ?empty="${!this.budgetSummary.total_cso}">
                ${this.budgetSummary.total_cso}
              </label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="input-label" ?empty="${!this.budgetSummary.total_unicef}">
                ${this.budgetSummary.total_unicef}
              </label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="input-label" ?empty="${!this.budgetSummary.total_supply}">
                ${this.budgetSummary.total_supply}
              </label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="input-label" ?empty="${!this.budgetSummary.partner_contrib}">
                ${this.budgetSummary.partner_contrib}
              </label>
            </span>
          </div>
          <div class="col col-1">
            <span>
              <label class="input-label" ?empty="${!this.budgetSummary.total_cash}">
                ${this.budgetSummary.total_cash}
              </label>
            </span>
          </div>
          <div class="col col-2">
            <span>
              <label class="input-label" ?empty="${!this.budgetSummary.total_amt}">
                ${this.budgetSummary.total_amt}
              </label>
            </span>
          </div>
        </div>
      </section>
    `;
  }

  @property({type: Object})
  budgetSummary!: BudgetSummary;

  connectedCallback() {
    super.connectedCallback();
  }

  public stateChanged(state: any) {
    if (state.interventions.current) {
      this.budgetSummary = selectBudgetSummary(state);
    }
  }
}
