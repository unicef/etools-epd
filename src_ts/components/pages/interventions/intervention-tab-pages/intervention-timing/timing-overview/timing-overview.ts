import {LitElement, customElement, html, property} from 'lit-element';
import '@unicef-polymer/etools-content-panel/etools-content-panel';
import {sharedStyles} from '../../common/styles/shared-styles-lit';
import '../../../../../../redux/actions/interventions';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import {elevationStyles} from '../../common/styles/elevation-styles';
import {TimingOverviewData} from './timingOverview.models';
import {selectTimingOverview} from './timingOverview.selectors';
import {getStore} from '../../utils/redux-store-access';
import {connect} from 'pwa-helpers/connect-mixin';
import {layoutFlex} from '../../common/styles/flex-layout-styles';

/**
 * @customElement
 */
@customElement('timing-overview')
export class TimingOverview extends connect(getStore())(LitElement) {
  static get styles() {
    return [gridLayoutStylesLit, elevationStyles];
  }
  render() {
    // language=HTML
    if (!this.timingOverview) {
      return html` <style>
          ${sharedStyles}
        </style>
        <etools-loading loading-text="Loading..." active></etools-loading>`;
    }
    return html`
      <style>
        ${sharedStyles} :host {
          display: block;
          margin-bottom: 24px;
        }
        .container-width {
          width: 70%;
          ${layoutFlex}
        }
        @media (max-width: 900px) {
          .container-width {
            width: 100%;
          }
        }
      </style>
      <section class="elevation content-wrapper" elevation="1">
        <div class="container-width">
          <div class="layout-horizontal">
            <div class="flex-1">
              <span>
                <label class="paper-label">Date Created</label>
              </span>
            </div>
            <div class="flex-1">
              <span>
                <label class="paper-label">Date first sent to Partner</label>
              </span>
            </div>
            <div class="flex-1">
              <span>
                <label class="paper-label">Date first draft by Partner</label>
              </span>
            </div>
            <div class="flex-1">
              <span>
                <label class="paper-label">PRC Submission Date</label>
              </span>
            </div>
            <div class="flex-1">
              <span>
                <label class="paper-label">PRC Review Date</label>
              </span>
            </div>
            <div class="flex-1">
              <span>
                <label class="paper-label">Date Partner Signed</label>
              </span>
            </div>
            <div class="flex-1">
              <span>
                <label class="paper-label">Date Unicef Signed</label>
              </span>
            </div>
            <div class="flex-1">
              <span>
                <label class="paper-label">Date Last Amended</label>
              </span>
            </div>
          </div>
          <div class="layout-horizontal">
            <div class="flex-1">
              <span>
                <label class="input-label" ?empty="${!this.timingOverview.document_type}">
                  ${this.timingOverview.document_type}
                </label>
              </span>
            </div>
            <div class="flex-1">
              <span>
                <label class="input-label" ?empty="${!this.timingOverview.cfei_number}">
                  ${this.timingOverview.cfei_number}
                </label>
              </span>
            </div>
            <div class="flex-1">
              <span>
                <label class="input-label" ?empty="${!this.timingOverview.cfei_number}">
                  ${this.timingOverview.cfei_number}
                </label>
              </span>
            </div>
            <div class="flex-1">
              <span>
                <label class="input-label" ?empty="${!this.timingOverview.cfei_number}">
                  ${this.timingOverview.cfei_number}
                </label>
              </span>
            </div>
            <div class="flex-1">
              <span>
                <label class="input-label" ?empty="${!this.timingOverview.cfei_number}">
                  ${this.timingOverview.cfei_number}
                </label>
              </span>
            </div>
            <div class="flex-1">
              <span>
                <label class="input-label" ?empty="${!this.timingOverview.cfei_number}">
                  ${this.timingOverview.cfei_number}
                </label>
              </span>
            </div>
            <div class="flex-1">
              <span>
                <label class="input-label" ?empty="${!this.timingOverview.cfei_number}">
                  ${this.timingOverview.cfei_number}
                </label>
              </span>
            </div>
            <div class="flex-1">
              <span>
                <label class="input-label" ?empty="${!this.timingOverview.cfei_number}">
                  ${this.timingOverview.cfei_number}
                </label>
              </span>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  @property({type: Object})
  timingOverview!: TimingOverviewData;

  connectedCallback() {
    super.connectedCallback();
  }

  public stateChanged(state: any) {
    if (state.interventions.current) {
      this.timingOverview = selectTimingOverview(state);
    }
  }

  private _dateFormat(value: any): string {
    if (value === undefined) {
      return '-';
    }
    return value.format('YYYY-MM-DD');
  }
}
