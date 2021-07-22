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

/**
 * @customElement
 */
@customElement('eface-details')
export class EfaceDetails extends connectStore(LitElement) {
  static get styles() {
    return [elevationStyles, pageLayoutStyles, buttonsStyles, gridLayoutStylesLit];
  }
  render() {
    if (!this.eface) {
      return;
    }
    // language=HTML
    return html`
      <style>
        :host {
          display: block;
          box-sizing: border-box;
        }
        section {
          background-color: var(--primary-background-color);
        }
        .paper-label {
          font-size: 12px;
          color: var(--secondary-text-color);
          padding-top: 6px;
        }

        .input-label {
          min-height: 24px;
          padding-top: 4px;
          padding-bottom: 6px;
          min-width: 0;
          font-size: 16px;
        }

        .input-label[empty]::after {
          content: '—';
          color: var(--secondary-text-color);
        }
        paper-textarea {
          width: 100%;
        }
        .row {
          display: grid;
          grid-template-columns: 20px 25% 10% 35% calc(30% - 20px);
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
          overflow: hidden;
          justify-content: flex-end;
          min-height: 60px;
        }

        .reporting-grid > div.h,
        .requests-grid > div.h {
          flex-direction: column;
          justify-content: space-between;
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

        .h > div {
          text-align: center;
        }
        .item-del {
          min-height: 60px;
        }

        .month-year {
          display: block;
          width: 115px;
          max-width: 100%;
        }
        #add-invoice-line {
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
          color: var(--dark-icon-color);
          width: 18px;
        }
        .periods {
          max-width: 80px;
        }
      </style>
      <section class="elevation page-content form-info" elevation="1">
        <div class="flex-1">
          <div class="paper-label">For Programme Document:</div>
          <div class="input-label">${this.intervention?.title}</div>
        </div>
        <div class="flex-1">
          <div class="paper-label">Form Type</div>
          <div class="input-label">${EfaceFormTypes.get(this.originalEface?.request_type)?.label}</div>
        </div>
      </section>
      <section class="elevation page-content" elevation="1">
        <div class="row center" style="margin-bottom: 4px;">
          <div></div>
          <div class="currency"><b>Currency</b>: US</div>
          <div></div>
          <div class="double-border center bold">REPORTING</div>
          <div class="double-border center bold">REQUESTS / AUTHORIZATIONS</div>
        </div>
        <div class="row h">
          <div></div>
          <div>Activity description from AWP with Duration</div>
          <div>Coding for UNDP, UNFPA and WFP</div>
          <div class="reporting-grid">
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
                  .value="${this.eface?.authorized_amount_date_start}"
                  error-message="Invalid Format"
                  @blur="${(ev: CustomEvent) => this.validateMonthYearFormat(ev)}"
                  @value-changed="${({detail}: CustomEvent) =>
                    this.updateEfaceField('authorized_amount_date_start', detail.value)}"
                ></paper-input>
                —
                <paper-input
                  id="auth-amt-date-end"
                  class="periods"
                  pattern="\\d{1,2}/\\d{4}"
                  no-label-float
                  placeholder="mm/yyyy"
                  required
                  .value="${this.eface?.authorized_amount_date_end}"
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
              <div>Expenditures accepted by agency</div>
              <div class="center">C</div>
            </div>
            <div class="h">
              <div>Balance</div>
              <div class="center">D = A - C</div>
            </div>
          </div>
          <div class="requests-grid">
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
                  .value="${this.eface?.requested_amount_date_start}"
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
                  .value="${this.eface?.requested_amount_date_end}"
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
        </div>
        ${this.invoiceLines?.map(
          (item: EfaceItem, index: number) => html`<div class="row">
            <div class="layout-horizontal align-items-center">
              <paper-icon-button id="del" icon="delete" title="Delete" @tap="${() => this.deleteInvoiceLine(index)}">
              </paper-icon-button>
            </div>
            <div class="item layout-horizontal align-items-center">${this.getInvoiceItemDescription(item)}</div>
            <div class="item"></div>
            <div class="item reporting-grid right">
              <div>
                <etools-currency-amount-input
                  id="reporting-a"
                  .value="${item.reporting_authorized_amount || 0}"
                  no-label-float
                  required
                  auto-validate
                  errror-message="Invalid"
                  ?readonly="${this.readonly}"
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
                  errror-message="Invalid"
                  ?readonly="${this.readonly}"
                  @blur="${() => {
                    this.calculateTotalActualExpenditure();
                  }}"
                  @value-changed="${({detail}: CustomEvent) =>
                    this.updateItem(item, 'reporting_actual_project_expenditure', detail.value)}"
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
                  @blur="${() => {
                    this.calculateTotalRequestedAmount();
                  }}"
                  @value-changed="${({detail}: CustomEvent) => this.updateItem(item, 'requested_amount', detail.value)}"
                ></etools-currency-amount-input>
              </div>
              <div>${displayCurrencyAmount(item.requested_authorized_amount, '-')}</div>
              <div>${displayCurrencyAmount(item.requested_outstanding_authorized_amount, '-')}</div>
            </div>
          </div>`
        )}

        <div class="row">
          <div></div>
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
          <div></div>
          <div style="padding: 6px;display:flex;align-items:center;">Total</div>
          <div></div>
          <div class="reporting-grid">
            <div>${displayCurrencyAmount(this.eface?.reporting_authorized_amount, '0')}</div>
            <div>${displayCurrencyAmount(this.eface?.reporting_actual_project_expenditure, '0')}</div>
            <div>${displayCurrencyAmount(this.eface?.reporting_expenditures_accepted_by_agency, '0')}</div>
            <div>${displayCurrencyAmount(this.eface?.reporting_balance, '0')}</div>
          </div>
          <div class="requests-grid">
            <div>${displayCurrencyAmount(this.eface?.requested_amount, '0')}</div>
            <div>${displayCurrencyAmount(this.eface?.requested_authorized_amount, '0')}</div>
            <div>${displayCurrencyAmount(this.eface?.requested_outstanding_authorized_amount, '0')}</div>
          </div>
        </div>

        <div style="padding-top: 26px;">${this.renderActions(true, true)}</div>
      </section>

      <eface-additional-details></eface-additional-details>
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

  @property({type: Object})
  eface!: Eface;

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
    this.eface = state.eface.current;
    this.originalEface = cloneDeep(this.eface);
    this.intervention = this.eface.intervention;
    this.invoiceLines = this.eface.activities;
    this.pdOutputActivities = this.getPdOutputActivities(this.eface.intervention);
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
    this.updateItem(this.eface, key, value);
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
          validations.greaterThan0 = true; // TODO
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

  validatePeriods() {
    const fields = this.shadowRoot?.querySelectorAll<PaperInputElement>('paper-input.periods');
    const validations = {dates: true};
    fields?.forEach((f) => {
      f.errorMessage = 'Required';
      if (!f.validate()) {
        validations.dates = false;
      }
    });
    return validations;
  }

  validate() {
    const validations = {...this.validateLineAmounts(), ...this.validateDescriptions(), ...this.validatePeriods()};
    if (!validations.required || !validations.greaterThan0 || !validations.dates) {
      fireEvent(this, 'toast', {
        text:
          !validations.required || !validations.dates
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
      body: {activities: this.cleanUpInviceLines(), ...this.getPeriods()}
    })
      .then((response: any) => getStore().dispatch(setEfaceForm(response)))
      .catch((error) => {
        fireEvent(this, 'toast', {text: formatServerErrorAsText(error), showCloseBtn: true});
      })
      .finally(() => {
        fireEvent(this, 'global-loading', {
          active: false,
          loadingSource: this.localName
        });
      });
  }

  getPeriods() {
    return pick(this.eface, [
      'authorized_amount_date_start',
      'authorized_amount_date_end',
      'requested_amount_date_start',
      'requested_amount_date_end'
    ]);
  }

  private cleanUpInviceLines() {
    let linesForSave = cloneDeep(this.invoiceLines);
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
    this.eface.reporting_authorized_amount = this.invoiceLines
      .map((i: EfaceItem) => i.reporting_authorized_amount)
      .reduce((a, b) => Number(a) + Number(b));
    this.requestUpdate();
  }

  calculateTotalActualExpenditure() {
    this.eface.reporting_actual_project_expenditure = this.invoiceLines
      .map((i: EfaceItem) => i.reporting_actual_project_expenditure)
      .reduce((a, b) => Number(a) + Number(b));
    this.requestUpdate();
  }

  calculateTotalRequestedAmount() {
    this.eface.requested_amount = this.invoiceLines
      .map((i: EfaceItem) => i.requested_amount)
      .reduce((a, b) => Number(a) + Number(b));
    this.requestUpdate();
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
      this.invoiceLines.splice(index, 1);
      this.requestUpdate();
    }
  }

  validateMonthYearFormat(e: CustomEvent) {
    const elem = e.currentTarget as PaperInputElement;
    elem.errorMessage = 'Invalid Format';
    elem.validate();
  }
}
