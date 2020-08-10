import {LitElement, html, property, customElement} from 'lit-element';
import '@polymer/paper-input/paper-textarea';
import '@unicef-polymer/etools-content-panel/etools-content-panel';
import '@unicef-polymer/etools-dropdown';
import {connect} from 'pwa-helpers/connect-mixin';
import {getStore} from '../../utils/redux-store-access';
import ComponentBaseMixin from '../../common/mixins/component-base-mixin';
import {buttonsStyles} from '../../common/styles/button-styles';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import {sharedStyles} from '../../common/styles/shared-styles-lit';
import {Risk, RiskPermissions} from './risk.models';
import {Permission} from '../../common/models/intervention.types';
import cloneDeep from 'lodash-es/cloneDeep';
import {pageIsNotCurrentlyActive} from '../../utils/common-methods';
import get from 'lodash-es/get';
import {selectRiskPermissions, selectRisks} from './risk.selectors';
import {validateRequiredFields} from '../../utils/validation-helper';
import {patchIntervention} from '../../common/actions';

/**
 * @customElement
 */
@customElement('risks-element')
export class RisksElement extends connect(getStore())(ComponentBaseMixin(LitElement)) {
  static get styles() {
    return [buttonsStyles, gridLayoutStylesLit];
  }

  render() {
    if (!this.data) {
      return html`<style>
          ${sharedStyles}
        </style>
        <etools-loading loading-text="Loading..." active></etools-loading>`;
    }
    // language=HTML
    return html`
      <style>
        ${sharedStyles} :host {
          display: block;
          margin-bottom: 24px;
        }
        #mitigationMeasures {
          width: 100%;
        }
      </style>

      <etools-content-panel show-expand-btn panel-title="Risks">
        <etools-loading loading-text="Loading..." .active="${this.showLoading}"></etools-loading>

        <div slot="panel-btns">
          ${this.renderEditBtn(this.editMode, this.canEditAtLeastOneField)}
        </div>

        <div class="row-padding-v layout-horizontal">
          <div class="col col-2">
            <etools-dropdown
              id="type"
              label="Type"
              .options="${this.riskTypes}"
              .selected="${this.data.risk_type}"
              option-value="id"
              option-label="risk_type"
              trigger-value-change-event
              @etools-selected-item-changed="${this.selectedRiskTypeChanged}"
              ?readonly="${this.isReadonly(this.editMode, this.permissions.edit.risk_type)}"
              ?required="${this.permissions.required.risk_type}"
            >
            </etools-dropdown>
          </div>
          <div class="col col-8">
            <paper-textarea
              id="mitigationMeasures"
              label="Proposed mitigation measures"
              always-float-label
              type="text"
              placeholder="—"
              .value="${this.originalData.mitigation_measures}"
              @value-changed="${({detail}: CustomEvent) => this.valueChanged(detail, 'mitigation_measures')}"
              ?readonly="${this.isReadonly(this.editMode, this.permissions.edit.mitigation_measures)}"
              ?required="${this.permissions.required.mitigation_measures}"
            >
            </paper-textarea>
          </div>
        </div>
        ${this.renderActions(this.editMode, this.canEditAtLeastOneField)}
      </etools-content-panel>
    `;
  }

  private riskTypes = [
    {id: '0', risk_type: 'Social & Environmental'},
    {id: '1', risk_type: 'Financial'},
    {id: '2', risk_type: 'Operational'},
    {id: '3', risk_type: 'Organizational'},
    {id: '4', risk_type: 'Political'},
    {id: '5', risk_type: 'Strategic'},
    {id: '6', risk_type: 'Safety & security'}
  ];

  @property({type: Boolean})
  showLoading = false;

  @property({type: Object})
  data!: Risk;

  @property({type: Object})
  originalData!: Risk;

  @property({type: Object})
  permissions!: Permission<RiskPermissions>;

  connectedCallback() {
    super.connectedCallback();
  }

  stateChanged(state: any) {
    if (!state.interventions.current) {
      return;
    }
    if (pageIsNotCurrentlyActive(get(state, 'app.routeDetails'), 'interventions', 'management')) {
      return;
    }
    this.data = selectRisks(state);
    this.originalData = cloneDeep(this.data);
    this.permissions = selectRiskPermissions(state);
    this.set_canEditAtLeastOneField(this.permissions.edit);
  }

  selectedRiskTypeChanged(e: CustomEvent) {
    if (e.detail.selectedItem) {
      this.data.risk_type = e.detail.selectedItem;
    }
    this.data.mitigation_measures = '';
  }

  validate() {
    return validateRequiredFields(this);
  }

  save() {
    if (!this.validate()) {
      return;
    }
    getStore()
      .dispatch(patchIntervention(this.data))
      .then(() => {
        this.editMode = false;
        this.data = {};
      });
  }
}
