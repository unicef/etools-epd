import {LitElement, customElement, html, property} from 'lit-element';
import '@polymer/paper-menu-button/paper-menu-button';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-icon-button/paper-icon-button';
import '@unicef-polymer/etools-currency-amount-input/etools-currency-amount-input';
import {translate} from 'lit-translate';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import ComponentBaseMixin from '../../../common/mixins/component-base-mixin';
import {buttonsStyles} from '../../../common/styles/button-styles';
import {elevationStyles} from '../../../common/styles/elevation-styles';
import {gridLayoutStylesLit} from '../../../common/styles/grid-layout-styles-lit';
import {sharedStyles} from '../../../common/styles/shared-styles-lit';
import {fireEvent} from '../../../common/utils/fire-custom-event';
import {EfaceItemTypes_Short} from '../../../interventions/intervention-tab-pages/common/constants';
import {EfaceItem} from '../types';
import {displayCurrencyAmount} from '@unicef-polymer/etools-currency-amount-input/mixins/etools-currency-module';

/**
 * @customElement
 */
@customElement('eface-details')
export class EfaceDetails extends ComponentBaseMixin(LitElement) {
  static get styles() {
    return [elevationStyles, sharedStyles, pageLayoutStyles, buttonsStyles, gridLayoutStylesLit];
  }
  render() {
    // language=HTML
    return html`
      <style>
        :host {
          display: block;
        }
        .row {
          display: grid;
          grid-template-columns: minmax(auto, 25%) 10% 35% 30%;
          column-gap: 5px;
        }

        .row.h > div {
          border-bottom: 1px solid var(--dark-divider-color);
          font-weight: 500;
          color: var(--secondary-text-color);
        }

        .row.totals > div {
          font-weight: 500;
          border-top: 1px solid var(--dark-divider-color);
        }

        .currency {
          grid-column-start: 1;
          grid-column-end: 3;
        }
        .double-border {
          border: 4px double var(--dark-divider-color);
        }
        .bold {
          font-weight: bold;
        }
        .reporting-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        .requests-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }

        .reporting-grid > div,
        .requests-grid > div {
          text-align: right;
          padding-right: 2px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }

        .reporting-grid > div:nth-child(3),
        .reporting-grid > div:nth-child(4) {
          background-color: lightyellow;
        }

        .requests-grid > div:nth-child(2),
        .requests-grid > div:nth-child(3) {
          background-color: lightyellow;
        }

        .center {
          text-align: center;
        }
        .space-between {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .h > div {
          text-align: center;
        }
        .item {
          border-bottom: 1px solid var(--dark-divider-color);
        }
        .month-year {
          display: block;
          width: 115px;
          max-width: 100%;
        }
      </style>
      <section class="elevation page-content" elevation="1">
        <div class="paper-label">For Programme Document:</div>
        <div class="input-label">My PD title that will be readonly once the eface Form is Saved</div>
      </section>
      <section class="elevation page-content" elevation="1">
        <div class="row center" style="margin-bottom: 4px;">
          <div class="currency">Currency: US</div>
          <div class="double-border center bold">REPORTING</div>
          <div class="double-border center bold">REQUESTS / AUTHORIZATIONS</div>
        </div>
        <div class="row h">
          <div>Activity description from AWP with Duration</div>
          <div>Coding for UNDP, UNFPA and WFP</div>
          <div class="reporting-grid">
            <div class="space-between h">
              <div>Authorized Amount</div>
              <div>
                <input type="month" class="month-year" value="2021-02" />
                -
                <input type="month" class="month-year" value="2021-08" />
              </div>
              <div class="center">A</div>
            </div>
            <div class="space-between h">
              <div>Actual Project Expenditure</div>
              <div class="center">B</div>
            </div>
            <div class="space-between h">
              <div>Expenditures accepted by</div>
              <div class="center">C</div>
            </div>
            <div class="space-between h">
              <div>Balance</div>
              <div class="center">D = A - C</div>
            </div>
          </div>
          <div class="requests-grid">
            <div class="space-between h">
              <div>New Request Perios & Amount</div>
              <div>Oct -Jan 2021</div>
              <div class="center">E</div>
            </div>

            <div class="space-between h">
              <div>Authorized Amount</div>
              <div>F</div>
            </div>
            <div class="space-between h">
              <div>Outstanding Authorized Amount</div>
              <div>G = D + F</div>
            </div>
          </div>
        </div>
        ${this.invoiceItems?.map(
          (item: EfaceItem) => html`<div class="row">
            <div class="item">${this.getInvoiceItemDescription(item)}</div>
            <div class="item"></div>
            <div class="item reporting-grid">
              <div>
                <etools-currency-amount-input
                  .value="${item.reporting_authorized_amount || 0}"
                  no-label-float
                  ?readonly="${this.readonly}"
                ></etools-currency-amount-input>
              </div>
              <div>
                <etools-currency-amount-input
                  .value="${item.reporting_actual_project_expenditure || 0}"
                  no-label-float
                  ?readonly="${this.readonly}"
                ></etools-currency-amount-input>
              </div>
              <div>${displayCurrencyAmount(item.reporting_expenditures_accepted_by_agency, '-')}</div>
              <div>${displayCurrencyAmount(item.reporting_balance, '-')}</div>
            </div>
            <div class="item requests-grid">
              <div>
                <etools-currency-amount-input
                  .value="${item.requested_amount || 0}"
                  no-label-float
                  ?readonly="${this.readonly}"
                ></etools-currency-amount-input>
              </div>
              <div>${displayCurrencyAmount(item.requested_authorized_amount, '-')}</div>
              <div>${displayCurrencyAmount(item.requested_outstanding_authorized_amount, '-')}</div>
            </div>
          </div>`
        )}

        <div class="add-row">
          <paper-menu-button id="add" close-on-activate>
            <paper-icon-button slot="dropdown-trigger" icon="add-box" title=${translate('GENERAL.ADD')}>
            </paper-icon-button>
            <paper-listbox slot="dropdown-content">
              ${this.invoiceItemTypes.map(
                (item) => html` <paper-item @tap="${() => this.addNewLine(item.value)}">${item.label}</paper-item>`
              )}
            </paper-listbox>
          </paper-menu-button>
        </div>

        <div class="row totals">
          <div style="padding: 6px;">Total</div>
          <div></div>
          <div class="reporting-grid">
            <div>10.00</div>
            <div>10.00</div>
            <div>10.00</div>
            <div>10.00</div>
          </div>
          <div class="requests-grid">
            <div>22.30</div>
            <div>10.00</div>
            <div>10.00</div>
          </div>
        </div>

        <div style="padding-top: 26px;">${this.renderActions(true, true)}</div>
      </section>
    `;
  }

  @property({type: Boolean})
  readonly = false;

  @property({type: Array})
  invoiceItems: any[] = [
    {
      pd_activity: '1',
      eepm_kind: '',
      description: '',
      reporting_authorized_amount: '0',
      reporting_actual_project_expenditure: '0',
      reporting_expenditures_accepted_by_agency: '0',
      reporting_balance: '0',
      requested_amount: '0',
      requested_authorized_amount: '0',
      requested_outstanding_authorized_amount: '0',
      kind: EfaceItemTypes_Short.activity
    }
  ];

  @property({type: Array})
  pdOutputActivities!: any[];

  @property({type: Array})
  eepms!: any[];

  @property({type: Array})
  invoiceItemTypes = [
    {value: 'activity', label: 'PD Output Activity'},
    {value: 'eepm', label: 'Effective and Efficient Programme Management'},
    {value: 'custom', label: 'Custom'}
  ];

  connectedCallback() {
    super.connectedCallback();
    // Disable loading message for tab load, triggered by parent element on stamp or by tap event on tabs
    fireEvent(this, 'global-loading', {
      active: false,
      loadingSource: 'interv-page'
    });
  }

  addNewLine(type: string) {
    this.invoiceItems = [
      ...this.invoiceItems,
      {
        pd_activity: '',
        eepm_kind: '',
        description: '',
        reporting_authorized_amount: 0,
        reporting_actual_project_expenditure: 0,
        reporting_expenditures_accepted_by_agency: 0,
        reporting_balance: 0,
        requested_amount: 0,
        requested_authorized_amount: 0,
        requested_outstanding_authorized_amount: 0,
        kind: type
      }
    ];
  }

  getInvoiceItemDescription(item: EfaceItem) {
    switch (item.kind) {
      case EfaceItemTypes_Short.activity:
        return html` <etools-dropdown
          .selected="${item.pd_activity}"
          .options="${this.pdOutputActivities}"
          option-label="name"
          option-value="value"
          @etools-selected-item-changed="${({detail}: CustomEvent) =>
            this.selectedItemChanged(detail.selectedItem, 'pd_activity')}"
          trigger-value-change-event
          allow-outside-scroll
          no-label-float
          .autoWidth="${true}"
        ></etools-dropdown>`;
      case EfaceItemTypes_Short.eepm:
        return html`<etools-dropdown
          .selected="${item.eepm_kind}"
          .options="${this.eepms}"
          option-label="name"
          option-value="value"
          @etools-selected-item-changed="${({detail}: CustomEvent) =>
            this.selectedItemChanged(detail.selectedItem, 'eepm_kind')}"
          trigger-value-change-event
          allow-outside-scroll
          no-label-float
          .autoWidth="${true}"
        ></etools-dropdown>`;
      case EfaceItemTypes_Short.custom:
        return html` <paper-textarea
          id="custom"
          .value="${item.description}"
          required
          no-label-float
          placeholder="—"
          @value-changed="${({detail}: CustomEvent) => (item.description = detail.value)}"
          max-rows="3"
        ></paper-textarea>`;

      default:
        return '';
    }
  }

  cancel() {}
  save() {}
}
