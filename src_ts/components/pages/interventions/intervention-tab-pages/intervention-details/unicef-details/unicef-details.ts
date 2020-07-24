import {LitElement, html, property, customElement} from 'lit-element';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-icon-button/paper-icon-button';
import '@unicef-polymer/etools-dropdown/etools-dropdown-multi';
import '@unicef-polymer/etools-dropdown/etools-dropdown';
import '@unicef-polymer/etools-loading/etools-loading';
import '@polymer/paper-input/paper-input';
import '@unicef-polymer/etools-content-panel/etools-content-panel';
import {buttonsStyles} from '../../common/styles/button-styles';
import {sharedStyles} from '../../common/styles/shared-styles-lit';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import cloneDeep from 'lodash-es/cloneDeep';
import get from 'lodash-es/get';
import {AnyObject} from '../../../../../../types/globals';
import ComponentBaseMixin from '../../common/mixins/component-base-mixin';
import {selectPdUnicefDetails, selectPdUnicefDetailsPermissions} from './pdUnicefDetails.selectors';
import {PdUnicefDetails, PdUnicefDetailsPermissions} from './pdUnicefDetails.models';
import {Permission} from '../../common/models/intervention.types';
import {validateRequiredFields} from '../../utils/validation-helper';
import {connect} from 'pwa-helpers/connect-mixin';
import {getStore} from '../../utils/redux-store-access';
// import {handleItemsNoLongerAssignedToCurrentCountry} from '../../utils/common-methods';

/**
 * @customElement
 */
@customElement('unicef-details')
export class UnicefDetailsElement extends connect(getStore())(ComponentBaseMixin(LitElement)) {
  static get styles() {
    return [gridLayoutStylesLit, buttonsStyles];
  }
  render() {
    // language=HTML
    if (!this.pdUnicefDetails) {
      return html` ${sharedStyles}
        <etools-loading loading-text="Loading..." active></etools-loading>`;
    }
    return html`
    ${sharedStyles}
      <style>
        :host {
          display: block;
          margin-bottom: 24px;
        }
      </style>

      <etools-content-panel show-expand-btn panel-title="Unicef Details">
        <etools-loading loading-text="Loading..." .active="${this.showLoading}"></etools-loading>

        <div slot="panel-btns">
          <paper-icon-button
            ?hidden="${this.hideEditIcon(this.editMode, this.canEditPdUnicefDetails)}"
            @tap="${this.allowEdit}"
            icon="create">
          </paper-icon-button>
        </div>

        <div class="row-padding-v">
          <div class="col col-4">
            <paper-input
              label="Document Type"
              .value="${this.pdUnicefDetails.document_type}"
              class="row-padding-v"
              readonly>
            </paper-input>
          </div>
        </div>
        <div class="layout-horizontal row-padding-v">
          <div class="col col-4">
            <etools-dropdown-multi
              id="officeInput"
              label="Unicef Office"
              class="row-padding-v"
              .options="${this.office_list}"
              option-label="name"
              option-value="id"
              .selectedValues="${this.pdUnicefDetails.offices}"
              ?readonly="${this.isReadonly(this.editMode, this.permissions.edit.unicef_office)}"
              ?required="${this.permissions.required.unicef_office}"
              trigger-value-change-event>
            </etools-dropdown-multi>
          </div>
          <div class="col col-4">
            <etools-dropdown-multi
              id="sectionInput"
              label="Unicef Sections"
              class="row-padding-v"
              .options="${this.section_list}"
              option-label="name"
              option-value="id"
              .selectedValues="${this.pdUnicefDetails.sections}"
              ?readonly="${this.isReadonly(this.editMode, this.permissions.edit.sections)}"
              ?required="${this.permissions.required.sections}"
              trigger-value-change-event>
            </etools-dropdown-multi>
          </div>
          <div class="col col-4">
            <etools-dropdown-multi
              label="Clusters"
              class="row-padding-v"
              .options="${this.cluster_list}"
              option-label="name"
              option-value="id"
              .selectedValues="${this.pdUnicefDetails.cluster_names}"
              readonly
              trigger-value-change-event>
          </div>
        </div>
        <div class="layout-horizontal row-padding-v">
          <div class="col col-4">
            <etools-dropdown-multi
              id="focalPointInput"
              label="Unicef Focal Points"
              class="row-padding-v"
              .options="${this.focal_point_list}"
              option-label="name"
              option-value="id"
              .selectedValues="${this.pdUnicefDetails.unicef_focal_points}"
              ?readonly="${this.isReadonly(this.editMode, this.permissions.edit.focal_points)}"
              ?required="${this.permissions.required.focal_points}"
              trigger-value-change-event>
            </etools-dropdown-multi>
          </div>
          <div class="col col-4">
            <etools-dropdown
              id="budgetOwnerInput"
              label="Unicef Budget Owner"
              .options="${this.budget_owner_list}"
              class="row-padding-v"
              option-label="name"
              option-value="id"
              .selected="${this.pdUnicefDetails.unicef_budget_owner}"
              ?readonly="${this.isReadonly(this.editMode, this.permissions.edit.budget_owner)}"
              ?required="${this.permissions.required.budget_owner}"
              trigger-value-change-event>
            </etools-dropdown>
          </div>
        </div>

        <div class="layout-horizontal right-align row-padding-v"
          ?hidden="${this.hideActionButtons(this.editMode, this.canEditPdUnicefDetails)}">
          <paper-button class="default" @tap="${this.cancelPdDetails}">
            Cancel
          </paper-button>
          <paper-button class="primary" @tap="${this.savePdDetails}">
            Save
          </paper-button>
        </div>
      </etools-content-panel>
    `;
  }

  @property({type: Boolean})
  canEditPdUnicefDetails!: boolean;

  @property({type: Object})
  originalPdUnicefDetails!: PdUnicefDetails;

  @property({type: Object})
  pdUnicefDetails!: PdUnicefDetails;

  @property({type: Object})
  permissions!: Permission<PdUnicefDetailsPermissions>;

  @property({type: Boolean})
  isUnicefUser = false;

  @property({type: Boolean})
  showLoading = false;

  @property({type: Array})
  focal_point_list!: AnyObject[];

  @property({type: Array})
  office_list!: AnyObject[];

  @property({type: Array})
  section_list!: AnyObject[];

  @property({type: Array})
  cluster_list!: AnyObject[];

  @property({type: Array})
  budget_owner_list!: AnyObject[];

  connectedCallback() {
    super.connectedCallback();
  }

  stateChanged(state: any) {
    if (state.user && state.user.data) {
      this.isUnicefUser = state.user.data.is_unicef_user;
    }
    if (state.interventions.current) {
      this.pdUnicefDetails = selectPdUnicefDetails(state);
      this.permissions = selectPdUnicefDetailsPermissions(state);
      this.setCanEditPdUnicefDetails(this.permissions.edit);
      this.originalPdUnicefDetails = cloneDeep(this.pdUnicefDetails);
    }
    this.populateDropdownOptions(state);
  }

  populateDropdownOptions(state: any) {
    // @@dci need to refactor this when things got clear
    if (!this.isUnicefUser) {
      if (this.pdUnicefDetails) {
        // if user is not Unicef user, this is opened in read-only mode and we just display already saved
        this.focal_point_list = [...this.pdUnicefDetails.unicef_focal_points];
        this.section_list = [...this.pdUnicefDetails.sections];
        this.cluster_list = [...this.pdUnicefDetails.cluster_names];
        this.office_list = [...this.pdUnicefDetails.offices];
        this.budget_owner_list = [...this.pdUnicefDetails.unicef_budget_owner];
      }
    } else if (state.commonData) {
      if (get(state, 'commonData.unicefUsers.length')) {
        this.focal_point_list = [...state.commonData!.unicefUsers];
      }
      if (get(state, 'commonData.sections.length')) {
        this.section_list = [...state.commonData!.sections];
      }
      if (get(state, 'commonData.clusters.length')) {
        this.cluster_list = [...state.commonData!.clusters];
      }
      if (get(state, 'commonData.offices.length')) {
        this.office_list = [...state.commonData!.offices];
      }
      if (get(state, 'commonData.budget_owner.length')) {
        this.budget_owner_list = [...state.commonData!.budget_owner_list];
        // TO DO
        // check if already saved records exists on loaded data, if not they will be added
        // (they might be missing if changed country)
        // handleItemsNoLongerAssignedToCurrentCountry(
        //   this.focal_point_list,
        //   this.pdUnicefDetails.details.unicef_focal_points
        // );
        // this.focal_point_list = [...this.focal_point_list];
      }
    }
  }

  setCanEditPdUnicefDetails(editPermissions: PdUnicefDetailsPermissions) {
    this.canEditPdUnicefDetails =
      editPermissions.budget_owner ||
      editPermissions.focal_points ||
      editPermissions.sections ||
      editPermissions.unicef_office;
  }

  cancelPdDetails() {
    this.pdUnicefDetails = cloneDeep(this.originalPdUnicefDetails);
    this.editMode = false;
  }

  validate() {
    return validateRequiredFields(this);
  }

  savePdDetails() {
    if (!this.validate()) {
      return;
    }
    // this.showLoading = true;

    this.editMode = false;
  }
}
