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
            <paper-checkbox ?checked="${this.data.headquarters_contribution_direct_cash}" ?disabled="${!this.editMode}">
              Direct Cash Transfer
            </paper-checkbox>
          </div>
          <div class="col col-3">
            <paper-checkbox
              ?checked="${this.data.headquarters_contribution_direct_payment}"
              ?disabled="${!this.editMode}"
            >
              Direct Payment
            </paper-checkbox>
          </div>
          <div class="col col-3">
            <paper-checkbox
              ?checked="${this.data.headquarters_contribution_reimbursement}"
              ?disabled="${!this.editMode}"
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
            <paper-slider value="${this.prop}" max="7" step="0.1" ?disabled="${!this.editMode}"></paper-slider>
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
            ${this.data?.document_type}
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

  @property({type: Object})
  originalData!: FinancialComponentData;

  @property({type: Object})
  financialData!: FinancialComponentData | undefined;

  @property({type: Object})
  permissions!: Permission<FinancialComponentPermissions>;

  @property({type: Boolean})
  showLoading = false;

  @property({type: Number})
  _prop!: number;

  set prop(val) {
    this._prop = Math.floor(val);
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
      this.data = selectFinancialComponent(state);
      this.permissions = selectFinancialComponentPermissions(state);
      this.setCanEditFinancialData(this.permissions.edit);
      this.originalData = cloneDeep(this.data);
      this._prop = 0;
    }
  }

  setCanEditFinancialData(editPermissions: FinancialComponentPermissions) {
    this.canEditFinancialComponent =
      editPermissions.cash_transfer_modalities || editPermissions.headquarters_contribution;
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
}
