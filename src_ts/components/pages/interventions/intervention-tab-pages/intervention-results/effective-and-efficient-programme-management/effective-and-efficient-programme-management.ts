import {LitElement, html, property, customElement} from 'lit-element';
import '@unicef-polymer/etools-content-panel';
import '@unicef-polymer/etools-data-table';
import '@unicef-polymer/etools-currency-amount-input';
import {connect} from 'pwa-helpers/connect-mixin';
import {getStore} from '../../utils/redux-store-access';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import {buttonsStyles} from '../../common/styles/button-styles';
import {sharedStyles} from '../../common/styles/shared-styles-lit';
import {elevationStyles} from '../../common/styles/elevation-styles';
import {pageIsNotCurrentlyActive} from '../../utils/common-methods';
import get from 'lodash-es/get';
import {isJsonStrMatch} from '../../utils/utils';
import {
  selectProgrammeManagement,
  selectProgrammeManagementPermissions
} from './effectiveAndEfficientProgrammeManagement.selectors';
import ComponentBaseMixin from '../../common/mixins/component-base-mixin';
import {Permission} from '../../common/models/intervention.types';
import {ProgrammeManagementPermissions} from './effectiveAndEfficientProgrammeManagement.models';

/**
 * @customElement
 */
@customElement('effective-and-efficient-programme-management')
export class EffectiveAndEfficientProgrammeManagement extends connect(getStore())(ComponentBaseMixin(LitElement)) {
  static get styles() {
    return [gridLayoutStylesLit, buttonsStyles, elevationStyles];
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

        /* TODO: fix data table styles*/
        *[slot='row-data'] {
          margin-top: 12px;
          margin-bottom: 12px;
        }
        *[slot='row-data'],
        *[slot='row-data-details'] {
            @apply --layout-horizontal;
            @apply --layout-flex;
          }

        *[slot='row-data'] .col-data {
          display: inline-flex;
          line-height: 24px;
          align-items: center;
        }

        *[slot='row-data'] .truncate {
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: auto;
          margin-bottom: auto;
        }

        etools-data-table-column,
        *[slot='row-data'] .col-data {
          box-sizing: border-box;
          padding-right: 16px;
        }
        etools-data-table-column:last-child,
        *[slot='row-data'] .col-data:last-child {
          padding-right: 0;
        }
        .row-details-content {
          font-size: 12px;
        }
        .row-details-content .rdc-title {
          display: inline-block;
          width: 100%;
          color: var(--list-secondary-text-color, #757575);
          font-weight: bold;
          margin-bottom: 10px;
        }

        .row-details-content .rdc-title.inline {
          width: auto;
          margin: 0 8px 0 0;
        }

        /* Mobile view CSS */
        etools-data-table-row[medium-resolution-layout] *[slot='row-data'],
        etools-data-table-row[medium-resolution-layout] *[slot='row-data-details'] {
          @apply --layout;
          @apply --layout-wrap;
          @apply --layout-flex;
          box-sizing: border-box;
        }

        etools-data-table-row[medium-resolution-layout] *[slot='row-data'] .col-data {
          @apply --layout;
          @apply --layout-start;
          flex: 1 0 calc(50% - 16px);
          max-width: calc(50% - 16px);
          padding: 8px;
          box-sizing: border-box;
        }

        etools-data-table-row[medium-resolution-layout] *[slot='row-data'] .truncate {
          @apply --layout;
          @apply --layout-flex;
          white-space: unset;
          overflow: unset;
          text-overflow: unset;
        }

        etools-data-table-row[low-resolution-layout] *[slot='row-data'],
        etools-data-table-row[low-resolution-layout] *[slot='row-data-details'] {
          display: block;
          max-width: 100%;
          box-sizing: border-box;
        }

        etools-data-table-row[low-resolution-layout] *[slot='row-data'] .col-data,
        etools-data-table-row[low-resolution-layout] *[slot='row-data-details'] > * {
          display: inline-block;
          width: 100%;
          max-width: 100%;
          padding: 8px 0;
          box-sizing: border-box;
        }

        etools-data-table-row[medium-resolution-layout] *[slot='row-data'] .col-data:before,
        etools-data-table-row[low-resolution-layout] *[slot='row-data'] .col-data:before {
          content: attr(data-col-header-label) ': ';
          color: var(--list-secondary-text-color, #757575);
          font-weight: bold;
          margin-right: 8px;
          vertical-align: top;
          min-height: 24px;
        }
      </style>

      <etools-content-panel panel-title="Effective and efficient programme management">
        <etools-loading loading-text="Loading..." .active="${this.showLoading}"></etools-loading>

        <div slot="panel-btns">
          Total
        </div>

        <etools-data-table-header id="listHeader" no-title no-collapse>
          <etools-data-table-column class="col-5" field="item">
            Item (all prices in PD Currency)
          </etools-data-table-column>
          <etools-data-table-column class="col-2 right-align" field="unicef_cash">
            Unicef Cash
          </etools-data-table-column>
          <etools-data-table-column class="col-2 right-align" field="partner_contribution">
            Partner Contribution
          </etools-data-table-column>
          <etools-data-table-column class="col-2 right-align" field="total">
            Total
          </etools-data-table-column>

          <etools-data-table-column class="col-1 right-align" field="actions">
            <paper-icon-button icon="add-box"> </paper-icon-button>
          </etools-data-table-column>
        </etools-data-table-header>

        ${this.renderActivityRow(this.activities)}
      </etools-content-panel>
    `;
  }

  @property({type: Boolean})
  showLoading = false;

  @property({type: Object})
  activities = [
    {
      title: 'Standard activity',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In iaculis metus et neque viverra ',
      unicef_cash: 3685,
      partner_contribution: 54789
    },
    {
      title: 'Standard activity',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In iaculis metus et neque viverra ',
      unicef_cash: 125,
      partner_contribution: 751
    },
    {
      title: 'Standard activity',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In iaculis metus et neque viverra ',
      unicef_cash: 652,
      partner_contribution: 441
    }
  ];

  @property({type: Number})
  total_amount!: number;

  @property({type: Object})
  permissions!: Permission<ProgrammeManagementPermissions>;

  connectedCallback() {
    super.connectedCallback();
  }

  stateChanged(state: any) {
    if (!state.interventions.current) {
      return;
    }
    if (pageIsNotCurrentlyActive(get(state, 'app.routeDetails'), 'interventions', 'details')) {
      return;
    }

    const newActivities = selectProgrammeManagement(state);
    if (!isJsonStrMatch(this.originalData, newActivities)) {
      this.activities = newActivities;
      this.originalData = newActivities;
    }
    this.sePermissions(state);
  }

  private sePermissions(state: any) {
    const newPermissions = selectProgrammeManagementPermissions(state);
    if (!isJsonStrMatch(this.permissions, newPermissions)) {
      this.permissions = newPermissions;
      this.set_canEditAtLeastOneField(this.permissions.edit);
    }
  }

  renderActivityRow(activities) {
    if (activities) {
      return activities.map((activity) => {
        return html`
          <etools-data-table-row>
            <div slot="row-data">
              <span class="col-data col-5">
                ${activity.title}
              </span>

              <span class="col-data col-2 right-align">
                <etools-currency-amount-input
                  id="unicefCash"
                  .value="${activity.unicef_cash}"
                  readonly>
                </etools-currency-amount-input>
              </span>

              <span class="col-data col-2 right-align">
                <etools-currency-amount-input
                  id="partnerContribution"
                  .value="${activity.partner_contribution}"
                  readonly
                >
                </etools-currency-amount-input>
              </span>

              <span class="col-data col-2 right-align">
                <etools-currency-amount-input
                  id="totalSum"
                  .value="${activity.unicef_cash + activity.partner_contribution}"
                  readonly
                >
                </etools-currency-amount-input>
              </span>
            </div>
            <div slot="row-data-details">
              <div class="row-details-content col-12">
                <span class="rdc-title">Description</span>
                <span>${activity.description}</span>
              </div>
            </div>
          </etools-data-table-row>
        `;
      });
    }
  }
}
