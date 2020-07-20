import {LitElement, html, customElement, property} from 'lit-element';
import {connect} from 'pwa-helpers/connect-mixin';
import {getStore} from '../../utils/redux-store-access';
import ComponentBaseMixin from '../../common/mixins/component-base-mixin';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import {buttonsStyles} from '../../common/styles/button-styles';
import {sharedStyles} from '../../common/styles/shared-styles-lit';
import {Permission} from '../../common/models/intervention.types';
import {TechnicalDetails, TechnicalDetailsPermissions} from './technicalGuidance.models';
import {cloneDeep} from '../../../../../utils/utils';
import {selectTechnicalDetails, selectTechnicalDetailsPermissions} from './technicalGuidance.selectors';
import {patchIntervention} from '../../common/actions';
import {validateRequiredFields} from '../../utils/validation-helper';

/**
 * @customElement
 */
@customElement('technical-guidance')
export class TechnicalGuidance extends connect(getStore())(ComponentBaseMixin(LitElement)) {
  static get styles() {
    return [gridLayoutStylesLit, buttonsStyles];
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
      </style>

      <etools-content-panel show-expand-btn panel-title="Technical Guidance, Capacity Development, Miscellaneous">
        <etools-loading loading-text="Loading..." .active="${this.showLoading}"></etools-loading>

        <div slot="panel-btns">
          ${this.renderEditBtn(this.editMode, this.canEditAtLeastOneField)}
        </div>

        <div class="row-padding-v">
          <paper-input
            id="technicalGuidance"
            label="Technical Guidance"
            always-float-label
            placeholder="—"
            .value="${this.technicalDetails.technical_guidance}"
            ?readonly="${this.isReadonly(this.editMode, this.permissions.edit.technical_guidance)}"
            ?required="${this.permissions.required.technical_guidance}"
          >
          </paper-input>
        </div>

        <div class="row-padding-v">
          <paper-textarea
            id="capacityDevelopment"
            label="Capacity Development"
            type="text"
            always-float-label
            placeholder="—"
            .value="${this.technicalDetails.capacity_development}"
            ?readonly="${this.isReadonly(this.editMode, this.permissions.edit.capacity_development)}"
            ?required="${this.permissions.required.capacity_development}"
          >
          </paper-textarea>
        </div>

        <div class="row-padding-v">
          <paper-textarea
            id="otherPartnersInvolved"
            label="Other Partners Involved"
            type="text"
            always-float-label
            placeholder="—"
            .value="${this.technicalDetails.other_partners_involved}"
            ?readonly="${this.isReadonly(this.editMode, this.permissions.edit.other_partners_involved)}"
            ?required="${this.permissions.required.other_partners_involved}"
          >
          </paper-textarea>
        </div>

        <div class="row-padding-v">
          <paper-textarea
            id="otherInformation"
            label="Other Information"
            type="text"
            always-float-label
            placeholder="—"
            .value="${this.technicalDetails.other_info}"
            ?readonly="${this.isReadonly(this.editMode, this.permissions.edit.other_info)}"
            ?required="${this.permissions.required.other_info}"
          >
          </paper-textarea>
        </div>

        ${this.renderActions(this.editMode, this.canEditAtLeastOneField)}
      </etools-content-panel>
    `;
  }

  @property({type: Object})
  technicalDetails!: TechnicalDetails;

  @property({type: Object})
  permissions!: Permission<TechnicalDetailsPermissions>;

  @property({type: Boolean})
  showLoading = false;

  @property({type: Object})
  originalTechnicalDetails = {};

  connectedCallback() {
    super.connectedCallback();
  }

  stateChanged(state: any) {
    if (!state.interventions.current) {
      return;
    }
    this.technicalDetails = selectTechnicalDetails(state);
    this.permissions = selectTechnicalDetailsPermissions(state);
    this.set_canEditAtLeastOneField(this.permissions.edit);
    this.originalTechnicalDetails = cloneDeep(this.technicalDetails);
  }

  cancel() {
    Object.assign(this.technicalDetails, this.originalTechnicalDetails);
    this.technicalDetails = cloneDeep(this.originalTechnicalDetails);
    this.editMode = false;
  }

  validate() {
    return validateRequiredFields(this);
  }

  save() {
    if (!this.validate()) {
      return;
    }
    getStore()
      .dispatch(patchIntervention(this.technicalDetails))
      .then(() => {
        this.editMode = false;
      });
  }
}
