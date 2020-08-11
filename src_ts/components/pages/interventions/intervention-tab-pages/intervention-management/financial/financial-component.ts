import {LitElement, html, property, customElement} from 'lit-element';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-radio-group';
import '@polymer/paper-checkbox';
import '@unicef-polymer/etools-loading/etools-loading';
import '@polymer/paper-input/paper-textarea';
import '@polymer/paper-slider/paper-slider.js';
import '@unicef-polymer/etools-content-panel/etools-content-panel';
import {buttonsStyles} from '../../common/styles/button-styles';
import {sharedStyles} from '../../common/styles/shared-styles-lit';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import cloneDeep from 'lodash-es/cloneDeep';
import ComponentBaseMixin from '../../common/mixins/component-base-mixin';
import {Permission} from '../../common/models/intervention.types';
import {validateRequiredFields} from '../../utils/validation-helper';
import {getStore} from '../../utils/redux-store-access';
import {connect} from 'pwa-helpers/connect-mixin';
import './financialComponent.models';
import './financialComponent.selectors';
import {FinancialComponentData, FinancialComponentPermissions} from './financialComponent.selectors';
import {selectFinancialComponentPermissions, selectFinancialComponent} from './financialComponent.models';

/**
 * @customElement
 */
@customElement('financial-component')
export class FinancialComponent extends connect(getStore())(ComponentBaseMixin(LitElement)) {
  static get styles() {
    return [gridLayoutStylesLit, buttonsStyles];
  }
  render() {
    // language=HTML
    return html`
      <style>
        ${sharedStyles} :host {
          display: block;
          margin-bottom: 24px;
        }
        .pl-none {
          padding-left: 0px !important;
        }
        paper-radio-button:first-child {
          padding-left: 0px !important;
        }
      </style>

      <etools-content-panel show-expand-btn panel-title="Financial">
        <etools-loading loading-text="Loading..." .active="${this.showLoading}"></etools-loading>

        <div slot="panel-btns">
          <paper-icon-button
            ?hidden="${this.hideEditIcon(this.editMode, this.canEditFinancialComponent)}"
            @tap="${this.allowEdit}"
            icon="create"
          >
          </paper-icon-button>
        </div>

        <div class="layout-horizontal row-padding-v">
          <div class="w100">
            <label class="paper-label">Cash Transfer modality(ies)</label>
          </div>
        </div>
        <div class="layout-horizontal row-padding-v">
          <div class="col col-3">
            <paper-checkbox
              ?checked="${this.checkCashTransferModality('Direct Cash Transfer')}"
              ?disabled="${!this.canEditCashTransfer}"
            >
              Direct Cash Transfer
            </paper-checkbox>
          </div>
          <div class="col col-3">
            <paper-checkbox
              ?checked="${this.checkCashTransferModality('Direct Payment')}"
              ?disabled="${!this.canEditCashTransfer}"
            >
              Direct Payment
            </paper-checkbox>
          </div>
          <div class="col col-3">
            <paper-checkbox
              ?checked="${this.checkCashTransferModality('Reimbrsement')}"
              ?disabled="${!this.canEditCashTransfer}"
            >
              Reimbrsement
            </paper-checkbox>
          </div>
        </div>
        <div class="layout-horizontal row-padding-v">
          <div class="w100">
            <label class="paper-label">Headquarters contribution (automatic 7% for INGO)</label>
          </div>
        </div>
        <div class="layout-horizontal row-padding-v">
          <div class="col col-3">
            <paper-slider
              .value="${this.prop}"
              max="7"
              step="0.1"
              ?disabled="${!this._canEditHQ}"
              @value-changed="${(e: CustomEvent) => this.updateSlider(e)}"
            ></paper-slider>
            ${this.prop}
          </div>
        </div>

        <div class="layout-horizontal row-padding-v">
          <div class="w100">
            <label class="paper-label">Document currency</label>
          </div>
        </div>
        <div class="layout-horizontal row-padding-v">
          <div class="col col-3">
            ${this.currency}
          </div>
        </div>
        <div
          class="layout-horizontal right-align row-padding-v"
          ?hidden="${this.hideActionButtons(this.editMode, this.canEditFinancialComponent)}"
        >
          <paper-button class="default" @tap="${this.cancel}">
            Cancel
          </paper-button>
          <paper-button class="primary" @tap="${this.saveFinancialChanges}">
            Save
          </paper-button>
        </div>
      </etools-content-panel>
    `;
  }

  @property({type: Boolean})
  canEditFinancialComponent!: boolean;

  @property({type: Boolean})
  canEditHQOriginal!: boolean;

  @property({type: Boolean})
  canEditCashTransferOriginal!: boolean;

  @property({type: Object})
  originalData!: FinancialComponentData;

  @property({type: Object})
  data!: FinancialComponentData;

  @property({type: String})
  currency!: string;

  @property({type: Object})
  permissions!: Permission<FinancialComponentPermissions>;

  @property({type: Boolean})
  showLoading = false;

  @property({type: Boolean})
  _canEditCashTransfer!: boolean;

  set canEditCashTransfer(val) {
    this._canEditCashTransfer = val;
  }

  get canEditCashTransfer() {
    return this._canEditCashTransfer;
  }

  @property({type: Boolean})
  _canEditHQ!: boolean;

  set canEditHQ(val) {
    this._canEditHQ = val;
  }

  get canEditHQ() {
    return this._canEditHQ;
  }

  @property({type: String})
  _prop!: string;

  set prop(val) {
    this._prop = val;
  }

  get prop() {
    return this._prop;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  stateChanged(state: any) {
    if (!state.interventions.current) {
      return;
    }
    if (state.interventions.current) {
      console.log('staet changed');
      this.data = selectFinancialComponent(state);
      this.permissions = selectFinancialComponentPermissions(state);
      this.currency = state.interventions.current.planned_budget.currency;
      this.setCanEditFinancialData(this.permissions.edit);
      this.originalData = cloneDeep(this.data);
      if (this.data.hq_support_cost) {
        this._prop = this.data.hq_support_cost;
      } else {
        this._prop = '0';
        this.data.hq_support_cost = '0';
      }
      this.originalData = cloneDeep(this.data);
    }
  }

  setCanEditFinancialData(editPermissions: FinancialComponentPermissions) {
    this.canEditFinancialComponent = editPermissions.cash_transfer_modalities || editPermissions.hq_support_cost;
    this.canEditHQOriginal = editPermissions.hq_support_cost;
    this.canEditCashTransferOriginal = editPermissions.cash_transfer_modalities;
  }

  validate() {
    return validateRequiredFields(this);
  }

  saveFinancialChanges() {
    if (!this.validate()) {
      return;
    }
    // this.showLoading = true;
    this.editMode = false;
  }

  // @lajos: this will have to be reviewd
  checkCashTransferModality(value: string) {
    if (!value) {
      return;
    }
    if (this.data!.cash_tranfer_modalities.indexOf(value) > -1) {
      return true;
    }
    return false;
  }

  allowEdit() {
    this.editMode = true;
    this.canEditHQ = this.canEditHQOriginal;
    this.canEditCashTransfer = this.canEditCashTransferOriginal;
  }

  cancel() {
    this.editMode = false;
    this.data = cloneDeep(this.originalData);
    this._prop = this.data.hq_support_cost;
    this.canEditCashTransfer = false;
    this.canEditHQ = false;
  }

  updateSlider(e: CustomEvent) {
    if (!e.detail) {
      return;
    }
    this._prop = e.detail.value;
  }
}
