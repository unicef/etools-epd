import {LitElement, customElement, html, property} from 'lit-element';
import '@polymer/paper-menu-button/paper-menu-button';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-icon-button/paper-icon-button';
import '@unicef-polymer/etools-currency-amount-input/etools-currency-amount-input';
import '@polymer/paper-input/paper-textarea';
import {translate, get as getTranslation} from 'lit-translate';
import ComponentBaseMixin from '../../../common/mixins/component-base-mixin';
import {buttonsStyles} from '../../../common/styles/button-styles';
import {elevationStyles} from '../../../common/styles/elevation-styles';
import {gridLayoutStylesLit} from '../../../common/styles/grid-layout-styles-lit';
import {fireEvent} from '../../../common/utils/fire-custom-event';
import {Eface, EfaceItem} from '../types';
import {displayCurrencyAmount} from '@unicef-polymer/etools-currency-amount-input/mixins/etools-currency-module';
import {connectStore} from '../../../common/mixins/connect-store-mixin';
import {RootState} from '../../../../../redux/store';
import {ExpectedResult, Intervention, InterventionActivity, ResultLinkLowerResult} from '@unicef-polymer/etools-types';
import {currentPage, currentSubpage} from '../../../interventions/intervention-tab-pages/common/selectors';
import {cloneDeep} from '../../../common/utils/utils';
import {EtoolsCurrencyAmountInput} from '@unicef-polymer/etools-currency-amount-input/etools-currency-amount-input';
import './eface-additional-details';
import {EfaceFormTypes, EfaceItemTypes_Short} from '../../../common/utils/constants';
import {efaceEndpoints} from '../../../common/utils/eface-endpoints';
import {getStore} from '../../../common/utils/redux-store-access';
import {formatServerErrorAsText} from '@unicef-polymer/etools-ajax/ajax-error-parser';
import {setEfaceForm} from '../../../../../redux/actions/eface-forms';
import {openDialog} from '../../../common/utils/dialog';
import {getEndpoint} from '../../../common/utils/endpoint-helper';
import {sendRequest} from '@unicef-polymer/etools-ajax';
import {PaperInputElement} from '@polymer/paper-input/paper-input';
import {pick} from 'lodash-es';
import {ReadonlyStyles} from '../../../common/styles/readonly-styles';
import {labelAndvalueStylesLit} from '../../../common/styles/label-and-value-styles-lit';
import {repeat} from 'lit-html/directives/repeat';

/**
 * @customElement
 */
@customElement('eface-details')
export class EfaceDetails extends connectStore(ComponentBaseMixin(LitElement)) {
  static get styles() {
    return [elevationStyles, buttonsStyles, gridLayoutStylesLit, labelAndvalueStylesLit];
  }
  render() {
    if (!this.data) {
      return html`<style>
        ${ReadonlyStyles} paper-textarea {
          outline: none;
          --paper-input-container-input: {
            display: block;
          }
        }
      </style>`;
    }
    // language=HTML
    return html`
      <style>
        :host {
          display: block;
          box-sizing: border-box;
          --paper-input-container-underline: {
            color: var(--primary-color);
          }
        }
        paper-textarea {
          outline: none;
          --paper-input-container-input: {
            display: block;
          }
        }
        section {
          background-color: var(--primary-background-color);
          margin: 24px;
        }

        ${ReadonlyStyles} paper-textarea {
          width: 100%;
        }
        .row,
        .header-row,
        .item-row {
          display: grid;
          grid-template-columns: 25% 10% 35% calc(30% - 20px) auto;
          column-gap: 5px;
        }

        .item-row[readonly]:not([last-item]) > div.item {
          border-bottom: 1px solid var(--light-divider-color);
        }

        .item {
          display: flex;
          align-items: center;
        }

        .header-row > div {
          border-bottom: 1px solid var(--dark-divider-color);
          font-weight: 500;
          color: var(--secondary-text-color);
        }

        .row.totals {
          background-color: lightyellow;
        }
        .row.totals > div {
          font-weight: 500;
          border-top: 1px solid var(--dark-divider-color);
        }

        .currency {
          grid-column-start: 1;
          grid-column-end: 3;
        }
        .border {
          border: 1px solid var(--dark-divider-color);
        }
        .bold {
          font-weight: bold;
        }
        .reporting-container {
          display: flex;
        }
        .requests-container {
          display: flex;
        }

        .reporting-container > div,
        .requests-container > div {
          text-align: right;
          padding-right: 2px;
          display: flex;
          align-items: center;
          overflow: hidden;
          justify-content: flex-end;
          min-height: 55px;
          height: 100%;
          flex: 1;
        }

        .reporting-container > div.h,
        .requests-container > div.h {
          flex-direction: column;
          justify-content: space-between;
        }

        .reporting-container > div:nth-child(3),
        .reporting-container > div:nth-child(4) {
          background-color: lightyellow;
        }

        .requests-container > div:nth-child(2),
        .requests-container > div:nth-child(3) {
          background-color: lightyellow;
        }

        .center {
          text-align: center;
        }

        .h > div {
          text-align: center;
        }
        .h {
          box-sizing: border-box;
          padding-top: 8px;
        }
        #add-line-btn {
          color: var(--primary-color);
          margin-inline-start: -10px;
        }

        paper-menu-button {
          padding: 0;
          padding-bottom: 8px;
        }
        section.form-info {
          display: flex;
        }

        paper-icon-button#del {
          padding: 0;
          color: #c59b76;
          width: 18px;
          height: 18px;
        }
        .periods {
          max-width: 80px;
        }
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 47px;
          padding: 0 24px;
          border-bottom: 1px groove var(--dark-divider-color);
        }
        .section-header > h2 {
          font-size: 18px;
        }
        .section-content {
          padding: 18px 24px;
        }
        .no-items {
          padding: 12px;
        }
      </style>
      <section class="elevation" elevation="1">
        <div class="section-header">
          <h2>Header</h2>
        </div>
        <div class="layout-horizontal section-content">
          <div class="flex-1">
            <div class="paper-label">For Programme Document:</div>
            <div class="input-label">${this.intervention?.title}</div>
          </div>
          <div class="flex-1">
            <div class="paper-label">Form Type</div>
            <div class="input-label">${EfaceFormTypes.get(this.originalData?.request_type)?.label}</div>
          </div>
        </div>
      </section>
      <section class="elevation" elevation="1">
        <div class="section-header">
          <h2>Invoice Lines & Periods</h2>
          ${this.renderEditBtn(this.editMode, true)}
        </div>
        <div class="section-content">
          <div class="row center">
            <div class="currency"><b>Currency</b>: ${this.intervention?.planned_budget.currency}</div>
            <div class="border center bold">REPORTING</div>
            <div class="border center bold">REQUESTS / AUTHORIZATIONS</div>
            <div></div>
          </div>
          <div class="header-row">
            <div class="h">Activity description from AWP with Duration</div>
            <div class="h">Coding for UNDP, UNFPA and WFP</div>
            <div class="reporting-container">
              <div class="h">
                <div>Authorized Amount</div>
                <div>
                  <paper-input
                    id="auth-amt-date-start"
                    class="periods"
                    pattern="\\d{1,2}/\\d{4}"
                    no-label-float
                    placeholder="mm/yyyy"
                    required
                    ?readonly="${this.isReadonly(this.editMode, this.canEditInvoiceLines)}"
                    .value="${this.data?.authorized_amount_date_start}"
                    error-message="Invalid Format"
                    @blur="${(ev: CustomEvent) => this.validateMonthYearFormat(ev)}"
                    @value-changed="${(e: CustomEvent) => {
                      if (e.detail.value?.length >= 6) {
                        this.validateMonthYearElement(e.currentTarget);
                      }
                      this.updateEfaceField('authorized_amount_date_start', e.detail.value);
                    }}"
                  ></paper-input>
                  —
                  <paper-input
                    id="auth-amt-date-end"
                    class="periods"
                    pattern="\\d{1,2}/\\d{4}"
                    no-label-float
                    placeholder="mm/yyyy"
                    required
                    ?readonly="${this.isReadonly(this.editMode, this.canEditInvoiceLines)}"
                    .value="${this.data?.authorized_amount_date_end}"
                    error-message="Invalid Format"
                    @blur="${(ev: CustomEvent) => this.validateMonthYearFormat(ev)}"
                    @value-changed="${({detail}: CustomEvent) =>
                      this.updateEfaceField('authorized_amount_date_end', detail.value)}"
                  ></paper-input>
                </div>
                <div class="center">A</div>
              </div>
              <div class="h">
                <div>Actual Project Expenditure</div>
                <div class="center">B</div>
              </div>
              <div class="h">
                <div>Expenditures Accepted by Agency</div>
                <div class="center">C</div>
              </div>
              <div class="h">
                <div>Balance</div>
                <div class="center">D = A - C</div>
              </div>
            </div>
            <div class="requests-container">
              <div class="h">
                <div>New Request Periods & Amount</div>
                <div>
                  <paper-input
                    id="req-date-start"
                    class="periods"
                    pattern="\\d{1,2}/\\d{4}"
                    no-label-float
                    placeholder="mm/yyyy"
                    required
                    ?readonly="${this.isReadonly(this.editMode, this.canEditInvoiceLines)}"
                    .value="${this.data?.requested_amount_date_start}"
                    error-message="Invalid Format"
                    @blur="${(ev: CustomEvent) => this.validateMonthYearFormat(ev)}"
                    @value-changed="${({detail}: CustomEvent) =>
                      this.updateEfaceField('requested_amount_date_start', detail.value)}"
                  ></paper-input>
                  —
                  <paper-input
                    id="req-date-end"
                    class="periods"
                    pattern="\\d{1,2}/\\d{4}"
                    no-label-float
                    placeholder="mm/yyyy"
                    required
                    ?readonly="${this.isReadonly(this.editMode, this.canEditInvoiceLines)}"
                    .value="${this.data?.requested_amount_date_end}"
                    error-message="Invalid Format"
                    @blur="${(ev: CustomEvent) => this.validateMonthYearFormat(ev)}"
                    @value-changed="${({detail}: CustomEvent) =>
                      this.updateEfaceField('requested_amount_date_end', detail.value)}"
                  ></paper-input>
                </div>
                <div class="center">E</div>
              </div>

              <div class="h">
                <div>Authorized Amount</div>
                <div>F</div>
              </div>
              <div class="h">
                <div>Outstanding Authorized Amount</div>
                <div>G = D + F</div>
              </div>
            </div>
            <div></div>
          </div>
          ${repeat(
            this.data?.activities,
            (act) => act.id,
            (item: EfaceItem, index: number) => html`<div
              class="item-row"
              ?readonly="${this.isReadonly(this.editMode, this.canEditInvoiceLines)}"
              ?last-item="${index == this.data?.activities?.length - 1}"
            >
              <div class="item layout-horizontal align-items-center">${this.getInvoiceItemDescription(item)}</div>
              <div class="item">
                <etools-dropdown
                  id="coding"
                  .selected="${item.coding}"
                  .options="${this.codingOptions}"
                  option-label="label"
                  option-value="value"
                  ?readonly="${this.isReadonly(this.editMode, this.canEditInvoiceLines)}"
                  @etools-selected-item-changed="${({detail}: CustomEvent) => {
                    if (!detail.selectedItem) {
                      return;
                    }
                    this.updateItem(item, 'coding', detail.selectedItem.value);
                  }}"
                  trigger-value-change-event
                  allow-outside-scroll
                  no-label-float
                  .autoWidth="${true}"
                ></etools-dropdown>
              </div>
              <div class="item reporting-container right">
                <div>
                  <etools-currency-amount-input
                    id="reporting-a"
                    .value="${item.reporting_authorized_amount || 0}"
                    no-label-float
                    required
                    auto-validate
                    error-message="Invalid"
                    ?readonly="${this.isReadonly(this.editMode, this.canEditInvoiceLines)}"
                    @blur="${() => {
                      this.calculateTotalAuthorizedAmount();
                    }}"
                    @value-changed="${({detail}: CustomEvent) =>
                      this.updateItem(item, 'reporting_authorized_amount', detail.value)}"
                  ></etools-currency-amount-input>
                </div>
                <div>
                  <etools-currency-amount-input
                    id="reporting-b"
                    .value="${item.reporting_actual_project_expenditure || 0}"
                    no-label-float
                    required
                    auto-validate
                    ?readonly="${this.isReadonly(this.editMode, this.canEditInvoiceLines)}"
                    error-message="Invalid"
                    @blur="${() => {
                      this.calculateTotalActualExpenditure();
                    }}"
                    @value-changed="${({detail}: CustomEvent) =>
                      this.updateItem(item, 'reporting_actual_project_expenditure', detail.value)}"
                  ></etools-currency-amount-input>
                </div>
                <div>${displayCurrencyAmount(item.reporting_expenditures_accepted_by_agency!, '-')}</div>
                <div>${displayCurrencyAmount(item.reporting_balance!, '-')}</div>
              </div>
              <div class="item requests-container">
                <div>
                  <etools-currency-amount-input
                    id="requests-e"
                    .value="${item.requested_amount || 0}"
                    no-label-float
                    required
                    auto-validate
                    ?readonly="${this.isReadonly(this.editMode, this.canEditInvoiceLines)}"
                    error-message="Invalid"
                    @blur="${() => {
                      this.calculateTotalRequestedAmount();
                    }}"
                    @value-changed="${({detail}: CustomEvent) =>
                      this.updateItem(item, 'requested_amount', detail.value)}"
                  ></etools-currency-amount-input>
                </div>
                <div>${displayCurrencyAmount(item.requested_authorized_amount!, '-')}</div>
                <div>${displayCurrencyAmount(item.requested_outstanding_authorized_amount!, '-')}</div>
              </div>
              <div class="layout-horizontal align-items-center">
                <paper-icon-button
                  id="del"
                  ?hidden="${this.isReadonly(this.editMode, this.canEditInvoiceLines)}"
                  icon="delete"
                  title="Delete"
                  @tap="${() => this.deleteInvoiceLine(index)}"
                >
                </paper-icon-button>
              </div>
            </div>`
          )}
          ${!this.data?.activities.length
            ? html`${!this.editMode
                ? html`<div class="no-items">
                    No Items added yet.
                    ${this.canEditInvoiceLines ? ' Click the edit icon on the top-right to add.' : ''}
                  </div>`
                : ''}`
            : ''}

          <div class="row" ?hidden="${this.isReadonly(this.editMode, this.canEditInvoiceLines)}">
            <div class="item layout-horizontal align-items-center">
              <paper-menu-button id="add" close-on-activate>
                <paper-icon-button
                  id="add-line-btn"
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
            <div class="item reporting-container">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div class="item requests-container">
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div></div>
          </div>

          <div class="row totals">
            <div style="padding: 6px;display:flex;align-items:center;">Total</div>
            <div></div>
            <div class="reporting-container">
              <div>${displayCurrencyAmount(this.data?.reporting_authorized_amount, '0')}</div>
              <div>${displayCurrencyAmount(this.data?.reporting_actual_project_expenditure, '0')}</div>
              <div>${displayCurrencyAmount(this.data?.reporting_expenditures_accepted_by_agency, '0')}</div>
              <div>${displayCurrencyAmount(this.data?.reporting_balance, '0')}</div>
            </div>
            <div class="requests-container">
              <div>${displayCurrencyAmount(this.data?.requested_amount, '0')}</div>
              <div>${displayCurrencyAmount(this.data?.requested_authorized_amount, '0')}</div>
              <div>${displayCurrencyAmount(this.data?.requested_outstanding_authorized_amount, '0')}</div>
            </div>
          </div>

          <div style="padding-top: 26px;">${this.renderActions(this.editMode, true)}</div>
        </div>
      </section>

      <eface-additional-details></eface-additional-details>
    `;
  }

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

  @property({type: Array})
  codingOptions = [{value: 1, label: 'To be provided..'}];

  @property({type: Boolean})
  canEditInvoiceLines = false;

  @property({type: Object})
  intervention!: Intervention;

  @property({type: Object})
  originalData: Eface | null = null;

  @property({type: Object})
  data: Eface | null = null;

  @property({type: Boolean})
  autoValidate = false;

  connectedCallback() {
    super.connectedCallback();
    // Disable loading message for tab load, triggered by parent element on stamp or by tap event on tabs
    fireEvent(this, 'global-loading', {
      active: false,
      loadingSource: 'eface-page'
    });

    this.eepms = [
      {value: 'in_country', label: getTranslation('DESCRIPTION_1')},
      {value: 'operational', label: getTranslation('DESCRIPTION_2')},
      {value: 'planning', label: getTranslation('DESCRIPTION_3')}
    ];
  }

  stateChanged(state: RootState) {
    if (currentPage(state) !== 'eface' || currentSubpage(state) !== 'details') {
      if (this.data) {
        this.editMode = false;
        this.data = {activities: []};
        this.originalData = {};
        this.requestUpdate();
      }
      return;
    }
    if (!state.eface.current) {
      return;
    }
    this.data = state.eface.current;
    this.originalData = cloneDeep(this.data);
    this.intervention = this.data.intervention;
    this.pdOutputActivities = this.getPdOutputActivities(this.data.intervention);
    this.canEditInvoiceLines = this.data.permissions.edit.activities;
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
    this.data.activities = [
      ...this.data.activities,
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
    this.requestUpdate();
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
          ?readonly="${this.isReadonly(this.editMode, this.canEditInvoiceLines)}"
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
          ?readonly="${this.isReadonly(this.editMode, this.canEditInvoiceLines)}"
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
          .autoValidate="${this.autoValidate}"
          @focus="${() => (this.autoValidate = true)}"
          ?readonly="${this.isReadonly(this.editMode, this.canEditInvoiceLines)}"
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
    this.requestUpdate();
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
    this.requestUpdate();
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
    this.requestUpdate();
  }

  updateItem(item: any, key: string, value: any): void {
    if (value == undefined) {
      return;
    }
    if (item[key] === value) {
      return;
    }
    item[key] = value;
    this.requestUpdate();
  }

  updateEfaceField(key: string, value: any): void {
    this.updateItem(this.data, key, value);
  }

  validateLineAmounts() {
    const fields = this.getFieldsByIds(['reporting-a', 'reporting-b', 'requests-e']);
    const validations = {required: true, greaterThan0: true};
    fields.forEach((f) => {
      f.errorMessage = 'Required';
      if (!f.validate()) {
        validations.required = false;
      } else {
        // if (Number(f.value) <= 0) {
        //   validations.greaterThan0 = true; // TODO
        //   f.errorMessage = 'Invalid';
        //   f.invalid = false; // TODO
        // }
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
      [].push.apply(fields, elems as any);
    });
    return fields;
  }

  validatePeriods() {
    const fields = this.shadowRoot?.querySelectorAll<PaperInputElement>('paper-input.periods');
    const validations = {dates: true};
    fields?.forEach((f) => {
      if (!f.value) {
        f.errorMessage = 'Required';
      } else {
        f.errorMessage = 'Invalid Format';
      }
      if (!f.validate()) {
        validations.dates = false;
      }
    });
    return validations;
  }

  validate() {
    const validations = [this.validateLineAmounts(), this.validateDescriptions(), this.validatePeriods()];
    if (validations.some((v) => v.required === false) || validations.some((v) => v.dates === false)) {
      fireEvent(this, 'toast', {
        text: getTranslation('PLS_FILL_IN_ALL_REQUIRED_FIELDS')
      });
      return false;
    }
    // if (validations.some((v) => !v.greaterThan0)) {
    //   fireEvent(this, 'toast', {
    //     text: getTranslation('MAKE_SURE_AMOUNTS_GREATER_THAN_0')
    //   });
    //   return false;
    // }
    return true;
  }

  saveData() {
    if (!this.validate()) {
      return Promise.resolve(false);
    }
    return sendRequest({
      endpoint: getEndpoint(efaceEndpoints.efaceForm, {id: this.originalData.id}),
      method: 'PATCH',
      body: {activities: this.cleanUpInviceLines(), ...this.getPeriods()}
    })
      .then((response: any) => {
        getStore().dispatch(setEfaceForm(response));
        this.editMode = false;
      })
      .catch((error) => {
        fireEvent(this, 'toast', {text: formatServerErrorAsText(error), showCloseBtn: true});
      });
  }

  getPeriods() {
    return pick(this.data, [
      'authorized_amount_date_start',
      'authorized_amount_date_end',
      'requested_amount_date_start',
      'requested_amount_date_end'
    ]);
  }

  private cleanUpInviceLines() {
    let linesForSave = cloneDeep(this.data.activities);
    linesForSave = linesForSave.map((l) => {
      delete l.reporting_balance;
      delete l.reporting_expenditures_accepted_by_agency;
      delete l.requested_authorized_amount;
      delete l.requested_outstanding_authorized_amount;
      return l;
    });
    return linesForSave;
  }

  calculateTotalAuthorizedAmount() {
    this.data.reporting_authorized_amount =
      this.data?.activities && this.data.activities.length
        ? this.data?.activities
            .map((i: EfaceItem) => i.reporting_authorized_amount!)
            .reduce((a, b) => Number(a) + Number(b))
        : 0;
    this.requestUpdate();
  }

  calculateTotalActualExpenditure() {
    this.data.reporting_actual_project_expenditure =
      this.data?.activities && this.data.activities.length
        ? this.data?.activities
            .map((i: EfaceItem) => i.reporting_actual_project_expenditure!)
            .reduce((a, b) => Number(a) + Number(b))
        : 0;
    this.requestUpdate();
  }

  calculateTotalRequestedAmount() {
    this.data.requested_amount =
      this.data?.activities && this.data.activities.length
        ? this.data?.activities.map((i: EfaceItem) => i.requested_amount).reduce((a, b) => Number(a) + Number(b))
        : 0;
    this.requestUpdate();
  }

  calculateTotals() {
    this.calculateTotalAuthorizedAmount();
    this.calculateTotalActualExpenditure();
    this.calculateTotalRequestedAmount();
  }

  async deleteInvoiceLine(index: number) {
    const confirmed = await openDialog({
      dialog: 'are-you-sure',
      dialogData: {
        content: 'Are you sure you want to delete this line?',
        confirmBtnText: (translate('GENERAL.YES') as unknown) as string
      }
    }).then(({confirmed}) => {
      return confirmed;
    });

    if (confirmed) {
      this.data?.activities.splice(index, 1);
      this.calculateTotals();
      this.requestUpdate();
    }
  }

  validateMonthYearFormat(e: CustomEvent) {
    const elem = e.currentTarget as PaperInputElement;
    this.validateMonthYearElement(elem);
  }

  validateMonthYearElement(elem: PaperInputElement) {
    if (!elem.value) {
      elem.errorMessage = 'Required';
    } else {
      elem.errorMessage = 'Invalid Format';
    }

    elem.validate();
  }
}
