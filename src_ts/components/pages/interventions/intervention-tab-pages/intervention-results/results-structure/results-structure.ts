import {getStore} from '../../utils/redux-store-access';
import {css, html, CSSResultArray, customElement, LitElement, property} from 'lit-element';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import {selectInterventionResultLinks} from './results-structure.selectors';
import {ResultStructureStyles} from './results-structure.styles';
import {ExpectedResult, ResultLinkLowerResult} from '../../common/models/intervention.types';
import '@unicef-polymer/etools-data-table';
import '@unicef-polymer/etools-content-panel';
import './cp-output-level';
import './pd-indicators';
import './pd-activities';
import {connect} from 'pwa-helpers/connect-mixin';

/**
 * @customElement
 */
@customElement('results-structure')
export class ResultsStructure extends connect(getStore())(LitElement) {
  static get styles(): CSSResultArray {
    // language=CSS
    return [
      gridLayoutStylesLit,
      ResultStructureStyles,
      css`
        etools-content-panel {
          --ecp-content-padding: 0;
        }
        iron-icon[icon='create'] {
          margin-left: 50px;
        }
        .view-toggle-button {
          height: 28px;
          margin-left: 40px;
          padding: 0 19px;
          font-weight: 500;
          font-size: 14px;
          border-radius: 50px;
          background-color: #d0d0d0;
          color: #fff;
          cursor: pointer;
        }
        .view-toggle-button[active] {
          background-color: #009688;
        }
      `
    ];
  }

  @property()
  resultLinks: ExpectedResult[] = [];

  @property({type: Boolean}) showCPOLevel = true;
  @property({type: Boolean}) showIndicators = true;
  @property({type: Boolean}) showActivities = true;

  render() {
    // language=HTML
    return html`
      <style>
        etools-data-table-row {
          --list-row-collapse-wrapper: {
            padding: 0 !important;
            border-bottom: 1px solid var(--main-border-color) !important;
          }
          --list-row-wrapper: {
            background-color: var(--secondary-background-color);
            min-height: 55px;
            border-bottom: 1px solid var(--main-border-color) !important;
          }
        }
      </style>

      <etools-content-panel panel-title="Results Structure">
        <div slot="panel-btns" class="layout-horizontal align-items-center">
          <div
            class="view-toggle-button layout-horizontal align-items-center"
            ?active="${this.showIndicators && !this.showActivities}"
            @click="${() => this.updateTableView(true, false)}"
          >
            Result view
          </div>
          <div
            class="view-toggle-button layout-horizontal align-items-center"
            ?active="${this.showIndicators && this.showActivities}"
            @click="${() => this.updateTableView(true, true)}"
          >
            Combined view
          </div>
          <div
            class="view-toggle-button layout-horizontal align-items-center"
            ?active="${!this.showIndicators && this.showActivities}"
            @click="${() => this.updateTableView(false, true)}"
          >
            Budget view
          </div>
        </div>
        ${this.resultLinks.map(
          (result: ExpectedResult) => html`
            <cp-output-level ?show-cpo-level="${this.showCPOLevel}" .resultLink="${result}">
              ${result.ll_results.map(
                (pdOutput: ResultLinkLowerResult) => html`
                  <etools-data-table-row>
                    <div slot="row-data" class="layout-horizontal align-items-center">
                      <div class="flex-1 flex-fix">
                        <div class="heading">Program Document output</div>
                        <div class="data bold-data">${pdOutput.name}</div>
                      </div>

                      <div class="flex-none">
                        <div class="heading">Total Cache budget</div>
                        <div class="data">TTT 1231.144</div>
                      </div>

                      <iron-icon icon="create" class="flex-none" ?hidden="${result.cp_output}"></iron-icon>
                    </div>

                    <div slot="row-data-details">
                      <pd-indicators
                        ?hidden="${!this.showIndicators}"
                        .indicators="${pdOutput.applied_indicators}"
                      ></pd-indicators>
                      <pd-activities ?hidden="${!this.showActivities}"></pd-activities>
                    </div>
                  </etools-data-table-row>
                `
              )}
            </cp-output-level>
          `
        )}

        <!--  If CP Output level is shown - 'Add PD' button will be present inside cp-output-level component  -->
        ${!this.showCPOLevel
          ? html`
              <div ?hidden="${this.showCPOLevel}" class="add-pd row-h align-items-center">
                <iron-icon icon="add-box"></iron-icon>Add PD Output
              </div>
            `
          : ''}
      </etools-content-panel>
    `;
  }

  stateChanged(state: any) {
    this.resultLinks = selectInterventionResultLinks(state);
  }

  updateTableView(indicators: boolean, activities: boolean): void {
    this.showIndicators = indicators;
    this.showActivities = activities;
  }
}
