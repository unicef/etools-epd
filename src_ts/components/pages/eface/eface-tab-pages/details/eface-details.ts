import {LitElement, customElement, html, property} from 'lit-element';
import '@polymer/paper-menu-button/paper-menu-button';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-icon-button/paper-icon-button';
import '@unicef-polymer/etools-currency-amount-input/etools-currency-amount-input';
import '@polymer/paper-input/paper-textarea';
import {translate, get as getTranslation} from 'lit-translate';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import ComponentBaseMixin from '../../../common/mixins/component-base-mixin';
import {buttonsStyles} from '../../../common/styles/button-styles';
import {elevationStyles} from '../../../common/styles/elevation-styles';
import {gridLayoutStylesLit} from '../../../common/styles/grid-layout-styles-lit';
import {sharedStyles} from '../../../common/styles/shared-styles-lit';
import {fireEvent} from '../../../common/utils/fire-custom-event';
import {Eface, EfaceItem} from '../types';
import {displayCurrencyAmount} from '@unicef-polymer/etools-currency-amount-input/mixins/etools-currency-module';
import {connectStore} from '../../../common/mixins/connect-store-mixin';
import {RootState} from '../../../../../redux/store';
import {ExpectedResult, Intervention, InterventionActivity, ResultLinkLowerResult} from '@unicef-polymer/etools-types';
import {currentPage, currentSubpage} from '../../../interventions/intervention-tab-pages/common/selectors';
import {cloneDeep} from '../../../common/utils/utils';
import {EtoolsCurrencyAmountInput} from '@unicef-polymer/etools-currency-amount-input/etools-currency-amount-input';
import {getEndpoint} from '../../../../../endpoints/endpoints';
import {sendRequest} from '@unicef-polymer/etools-ajax';
import {interventionEndpoints} from '../../../common/utils/intervention-endpoints';
import {EfaceItemTypes_Short} from '../../../common/utils/constants';
import {efaceEndpoints} from '../../../common/utils/eface-endpoints';
import {getStore} from '../../../common/utils/redux-store-access';
import {formatServerErrorAsText} from '@unicef-polymer/etools-ajax/ajax-error-parser';
import {setEfaceForm} from '../../../../../redux/actions/eface-forms';

/**
 * @customElement
 */
@customElement('eface-details')
export class EfaceDetails extends connectStore(LitElement) {
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
        paper-textarea {
          width: 100%;
        }
        .row {
          display: grid;
          grid-template-columns: minmax(25%, 25%) 10% 35% 30%;
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
          overflow: hidden;
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
          min-height: 60px;
        }

        .month-year {
          display: block;
          width: 115px;
          max-width: 100%;
        }
        #add-invoice-line {
          color: var(--primary-color);
          padding-inline-start: 0;
        }

        paper-menu-button {
          padding: 0;
          padding-bottom: 8px;
        }
      </style>
      <section class="elevation page-content" elevation="1">
        <div class="paper-label">For Programme Document:</div>
        <div class="input-label">${this.intervention?.title}</div>
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
              <div>Expenditures accepted by agency</div>
              <div class="center">C</div>
            </div>
            <div class="space-between h">
              <div>Balance</div>
              <div class="center">D = A - C</div>
            </div>
          </div>
          <div class="requests-grid">
            <div class="space-between h">
              <div>New Request Periods & Amount</div>
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
        ${this.invoiceLines?.map(
          (item: EfaceItem) => html`<div class="row">
            <div class="item layout-horizontal align-items-center">${this.getInvoiceItemDescription(item)}</div>
            <div class="item"></div>
            <div class="item reporting-grid">
              <div>
                <etools-currency-amount-input
                  id="reporting-a"
                  .value="${item.reporting_authorized_amount || 0}"
                  no-label-float
                  required
                  auto-validate
                  errror-message="Invalid"
                  ?readonly="${this.readonly}"
                  @value-changed="${({detail}: CustomEvent) =>
                    this.updateField(item, 'reporting_authorized_amount', detail.value)}"
                ></etools-currency-amount-input>
              </div>
              <div>
                <etools-currency-amount-input
                  id="reporting-b"
                  .value="${item.reporting_actual_project_expenditure || 0}"
                  no-label-float
                  required
                  auto-validate
                  errror-message="Invalid"
                  ?readonly="${this.readonly}"
                  @value-changed="${({detail}: CustomEvent) =>
                    this.updateField(item, 'reporting_actual_project_expenditure', detail.value)}"
                ></etools-currency-amount-input>
              </div>
              <div>${displayCurrencyAmount(item.reporting_expenditures_accepted_by_agency, '-')}</div>
              <div>${displayCurrencyAmount(item.reporting_balance, '-')}</div>
            </div>
            <div class="item requests-grid">
              <div>
                <etools-currency-amount-input
                  id="requests-e"
                  .value="${item.requested_amount || 0}"
                  no-label-float
                  required
                  auto-validate
                  ?readonly="${this.readonly}"
                  errror-message="Invalid"
                  @value-changed="${({detail}: CustomEvent) =>
                    this.updateField(item, 'requested_amount', detail.value)}"
                ></etools-currency-amount-input>
              </div>
              <div>${displayCurrencyAmount(item.requested_authorized_amount, '-')}</div>
              <div>${displayCurrencyAmount(item.requested_outstanding_authorized_amount, '-')}</div>
            </div>
          </div>`
        )}

        <div class="row">
          <div class="item layout-horizontal align-items-center">
            <paper-menu-button id="add" close-on-activate>
              <paper-icon-button
                id="add-invoice-line"
                slot="dropdown-trigger"
                icon="add-box"
                title=${translate('GENERAL.ADD')}
              >
              </paper-icon-button
              ><label class="paper-label" slot="dropdown-trigger">Add New Invoice Line</label>
              <paper-listbox slot="dropdown-content">
                ${this.invoiceItemTypes.map(
                  (item) => html` <paper-item @tap="${() => this.addNewLine(item.value)}">${item.label}</paper-item>`
                )}
              </paper-listbox>
            </paper-menu-button>
          </div>
          <div class="item"></div>
          <div class="item reporting-grid">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div class="item requests-grid">
            <div></div>
            <div></div>
            <div></div>
          </div>
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
  invoiceLines: any[] = [
    {
      pd_activity: 5,
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
    },
    {
      pd_activity: '',
      eepm_kind: 'operational',
      description: '',
      reporting_authorized_amount: '0',
      reporting_actual_project_expenditure: '0',
      reporting_expenditures_accepted_by_agency: '0',
      reporting_balance: '0',
      requested_amount: '0',
      requested_authorized_amount: '0',
      requested_outstanding_authorized_amount: '0',
      kind: EfaceItemTypes_Short.eepm
    },
    {
      pd_activity: '',
      eepm_kind: '',
      description: 'custom text',
      reporting_authorized_amount: '0',
      reporting_actual_project_expenditure: '0',
      reporting_expenditures_accepted_by_agency: '0',
      reporting_balance: '0',
      requested_amount: '0',
      requested_authorized_amount: '0',
      requested_outstanding_authorized_amount: '0',
      kind: EfaceItemTypes_Short.custom
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

  @property({type: Object})
  intervention!: Intervention;

  @property({type: Object})
  originalEface!: Eface;

  connectedCallback() {
    super.connectedCallback();
    // Disable loading message for tab load, triggered by parent element on stamp or by tap event on tabs
    fireEvent(this, 'global-loading', {
      active: false,
      loadingSource: 'interv-page'
    });

    this.eepms = [
      {value: 'in_country', label: getTranslation('DESCRIPTION_1')},
      {value: 'operational', label: getTranslation('DESCRIPTION_2')},
      {value: 'planning', label: getTranslation('DESCRIPTION_3')}
    ];
  }

  stateChanged(state: RootState) {
    if (currentPage(state) !== 'eface' || currentSubpage(state) !== 'details') {
      return;
    }
    if (!state.eface.current) {
      return;
    }
    const eface: Eface = state.eface.current;
    this.originalEface = cloneDeep(eface);
    this.intervention = eface.intervention;
    // this.invoiceItems = eface.activities;
    this.pdOutputActivities = this.getPdOutputActivities(eface.intervention);
  }

  getPdOutputActivities(intervention: Intervention) {
    // get activities array
    const pdOutputs: ResultLinkLowerResult[] = intervention.result_links
      .map(({ll_results}: ExpectedResult) => ll_results)
      .flat();
    const activities: InterventionActivity[] = pdOutputs
      .map(({activities}: ResultLinkLowerResult) => activities)
      .flat();

    return activities;
  }

  addNewLine(type: string) {
    this.invoiceLines = [
      ...this.invoiceLines,
      {
        pd_activity: '',
        eepm_kind: '',
        description: '',
        reporting_authorized_amount: null,
        reporting_actual_project_expenditure: null,
        reporting_expenditures_accepted_by_agency: null,
        reporting_balance: null,
        requested_amount: null,
        requested_authorized_amount: null,
        requested_outstanding_authorized_amount: null,
        kind: type
      }
    ];
  }

  getInvoiceItemDescription(item: EfaceItem) {
    switch (item.kind) {
      case EfaceItemTypes_Short.activity:
        return html` <etools-dropdown
          id="activity"
          .selected="${item.pd_activity}"
          .options="${this.pdOutputActivities}"
          option-label="name"
          option-value="id"
          required
          auto-validate
          @etools-selected-item-changed="${({detail}: CustomEvent) => {
            if (!detail.selectedItem) {
              return;
            }
            this.selectedActivityChanged(detail.selectedItem, item);
          }}"
          trigger-value-change-event
          allow-outside-scroll
          no-label-float
          .autoWidth="${true}"
        ></etools-dropdown>`;
      case EfaceItemTypes_Short.eepm:
        return html`<etools-dropdown
          id="eepm"
          .selected="${item.eepm_kind}"
          .options="${this.eepms}"
          required
          auto-validate
          option-label="label"
          option-value="value"
          @etools-selected-item-changed="${({detail}: CustomEvent) =>
            this.selectedEEPMChanged(detail.selectedItem, item)}"
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
          auto-validate
          no-label-float
          placeholder="—"
          @value-changed="${({detail}: CustomEvent) => this.selectedCustomTextChanged(detail.value, item)}"
          max-rows="3"
          error-message="This field is required"
        ></paper-textarea>`;

      default:
        return '';
    }
  }

  selectedActivityChanged(selectedItem: any, item: EfaceItem) {
    if (!selectedItem) {
      return;
    }

    if (selectedItem.id == item.pd_activity) {
      return;
    }

    item.pd_activity = selectedItem.id;
    item.kind = EfaceItemTypes_Short.activity;
    item.eepm_kind = '';
    item.description = '';
  }

  selectedEEPMChanged(selectedItem: any, item: EfaceItem) {
    if (!selectedItem) {
      return;
    }

    if (selectedItem.value == item.eepm_kind) {
      return;
    }

    item.eepm_kind = selectedItem.value;
    item.kind = EfaceItemTypes_Short.eepm;
    item.pd_activity = null;
    item.description = '';
  }

  selectedCustomTextChanged(value: string, item: EfaceItem) {
    if (!value) {
      return;
    }

    if (value == item.description) {
      return;
    }

    item.description = value;
    item.kind = EfaceItemTypes_Short.custom;
    item.pd_activity = null;
    item.eepm_kind = '';
  }

  updateField(item: EfaceItem, key: string, value: any): void {
    if (item[key] === value) {
      return;
    }
    item[key] = value;
    this.requestUpdate();
  }

  cancel() {}

  validateLineAmounts() {
    const fields = this.getFieldsByIds(['reporting-a', 'reporting-b', 'requests-e']);
    const validations = {required: true, greaterThan0: true};
    fields.forEach((f) => {
      if (!f.validate()) {
        validations.required = false;
      } else {
        if (Number(f.value) <= 0) {
          validations.greaterThan0 = false;
          f.errorMessage = 'Invalid';
          f.invalid = false; // TODO
        }
      }
    });
    return validations;
  }

  validateDescriptions() {
    const fields = this.getFieldsByIds(['activity', 'eepm', 'custom']);
    const validations = {required: true};
    fields.forEach((f) => {
      if (!f.validate()) {
        validations.required = false;
      }
    });
    return validations;
  }

  private getFieldsByIds(fieldIds: string[]) {
    const fields: EtoolsCurrencyAmountInput[] = [];
    fieldIds.forEach((f: string) => {
      const elems = this.shadowRoot?.querySelectorAll('#' + f);
      [].push.apply(fields, elems);
    });
    return fields;
  }

  validate() {
    const validations = {...this.validateLineAmounts(), ...this.validateDescriptions()};
    if (!validations.required || !validations.greaterThan0) {
      fireEvent(this, 'toast', {
        text: !validations.required
          ? getTranslation('PLS_FILL_IN_ALL_REQUIRED_FIELDS')
          : getTranslation('MAKE_SURE_AMOUNTS_GREATER_THAN_0')
      });
      return false;
    }
    return true;
  }

  save() {
    if (!this.validate()) {
      return;
    }

    fireEvent(this, 'global-loading', {
      active: true,
      loadingSource: this.localName
    });
    sendRequest({
      endpoint: getEndpoint(efaceEndpoints.efaceForm, {id: this.originalEface.id}),
      method: 'PATCH',
      body: {activities: this.invoiceLines}
    })
      .then((response: any) => getStore().dispatch(setEfaceForm(response)))
      .catch((error) => {
        fireEvent(this, 'toast', {text: formatServerErrorAsText(error)});
      });
  }

  renderActions(editMode: boolean, canEditAnyFields: boolean) {
    return this.hideActionButtons(editMode, canEditAnyFields)
      ? html``
      : html`
          <div class="layout-horizontal right-align row-padding-v">
            <paper-button class="default" @click="${this.cancel}">${translate('GENERAL.CANCEL')}</paper-button>
            <paper-button class="primary" @click="${this.save}"> ${translate('GENERAL.SAVE')} </paper-button>
          </div>
        `;
  }

  hideActionButtons(editMode: boolean, canEdit: boolean) {
    if (!canEdit) {
      return true;
    }

    return !editMode;
  }
}
