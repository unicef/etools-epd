import {LitElement, html, customElement, property} from 'lit-element';
import {connect} from 'pwa-helpers/connect-mixin';
import {getStore} from '../../utils/redux-store-access';
import PermissionsMixin from '../../common/mixins/permissions-mixins';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import {buttonsStyles} from '../../common/styles/button-styles';
import {sharedStyles} from '../../common/styles/shared-styles-lit';
import {Permission} from '../../common/models/intervention-types';
import {TechnicalDetails, TechnicalDetailsPermissions} from './technicalGuidance.models';
import {cloneDeep} from '../../../../../utils/utils';
import {selectTechnicalDetails, selectTechnicalDetailsPermissions} from './technicalGuidance.selectors';

/**
 * @customElement
 */
@customElement('technical-guidance')
export class TechnicalGuidance extends connect(getStore())(PermissionsMixin(LitElement)) {
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
          <paper-icon-button
            icon="create"
            @tap="${this.allowEdit}"
            ?hidden="${this.hideEditIcon(this.editMode, this.canEditTechnicalDetails)}"
          ></paper-icon-button>
        </div>

        <div class="row-padding-v">
          <paper-input
            id="technicalGuidance"
            label="Technical Guidance"
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
            .value="${this.technicalDetails.other_info}"
            ?readonly="${this.isReadonly(this.editMode, this.permissions.edit.other_info)}"
            ?required="${this.permissions.required.other_info}"
          >
          </paper-textarea>
        </div>

        ${this.renderActions(this.editMode, this.canEditTechnicalDetails)}
      </etools-content-panel>
    `;
  }

  @property({type: Object})
  technicalDetails!: TechnicalDetails;

  @property({type: Object})
  permissions!: Permission<TechnicalDetailsPermissions>;

  @property({type: Boolean})
  showLoading = false;

  @property({type: Boolean})
  canEditTechnicalDetails!: boolean;

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
    this.setCanEditTechnicalDetails(this.permissions.edit);
    this.originalTechnicalDetails = cloneDeep(this.technicalDetails);
  }

  setCanEditTechnicalDetails(_editPermissions: TechnicalDetailsPermissions) {
    this.canEditTechnicalDetails = true;
  }

  renderActions(editMode: boolean, canEditTechnicalDetails: boolean) {
    if (!this.hideActionButtons(editMode, canEditTechnicalDetails)) {
      return html`
        <div class="layout-horizontal right-align row-padding-v">
          <paper-button class="default" @tap="${this.cancelTechnicalDetails}">
            Cancel
          </paper-button>
          <paper-button class="primary" @tap="${this.saveTechnicalDetails}">
            Save
          </paper-button>
        </div>
      `;
    }
    return html``;
  }

  cancelTechnicalDetails() {
    Object.assign(this.technicalDetails, this.originalTechnicalDetails);
    this.technicalDetails = cloneDeep(this.originalTechnicalDetails);
    this.editMode = false;
  }

  saveTechnicalDetails() {
    this.editMode = false;
  }
}
