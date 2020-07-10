import {LitElement, html, customElement, property} from 'lit-element';
import {connect} from '../../utils/store-subscribe-mixin';
import PermissionsMixin from '../../common/mixins/permissions-mixins';
import FrNumbersConsistencyMixin from '../../common/mixins/fr-numbers-consistency-mixin';
import '@unicef-polymer/etools-date-time/datepicker-lite';
import '@unicef-polymer/etools-info-tooltip/etools-info-tooltip';
import '@unicef-polymer/etools-content-panel/etools-content-panel';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import {sharedStyles} from '../../common/styles/shared-styles-lit';
import {Intervention, Permission} from '../../common/models/intervention-types';
import {ProgrammeDocDates, ProgrammeDocumentDatesPermissions} from './programmeDocumentDates.models';
import cloneDeep from 'lodash-es/cloneDeep';
import {
  selectProgrammeDocumentDates,
  selectProgrammeDocumentDatesPermissions
} from './programmeDocumentDates.selectors';
import get from 'lodash-es/get';
import {validateRequiredFields} from '../../utils/validation-helper';

/**
 * @customElement
 */
@customElement('programme-document-dates')
export class ProgrammeDocumentDates extends PermissionsMixin(FrNumbersConsistencyMixin(connect(LitElement))) {
  static get styles() {
    return [gridLayoutStylesLit];
  }

  render() {
    // language=HTML
    return html`
      ${sharedStyles}
      <style></style>

      <etools-content-panel show-expand-btn panel-title="Programme Document Dates">
        <etools-loading loading-text="Loading..." .active="${this.showLoading}"></etools-loading>

        <div slot="panel-btns">
          <paper-icon-button
            ?hidden="${this.hideEditIcon(this.editMode, this.canEditProgrammeDocumentDates)}"
            @tap="${this.allowEdit}"
            icon="create"
          >
          </paper-icon-button>
        </div>
        <div class="layout-horizontal row-padding-v">
          <div class="col col-3">
            <!-- Start date -->
            <etools-info-tooltip
              class="fr-nr-warn"
              icon-first
              custom-icon
              form-field-align
              ?hide-tooltip="${!this.frsConsistencyWarningIsActive(this._frsStartConsistencyWarning)}"
            >
              <datepicker-lite
                slot="field"
                id="intStart"
                label="Start date"
                .value="${this.programmeDocumentDates.start}"
                ?readonly="${!this.permissions.edit.start}"
                ?required="${!this.permissions.required.start}"
                error-message="Please select start date"
                auto-validate
                selected-date-display-format="D MMM YYYY"
              >
              </datepicker-lite>
              <iron-icon icon="pmp-custom-icons:not-equal" slot="custom-icon"></iron-icon>
              <span slot="message">${this._frsStartConsistencyWarning}</span>
            </etools-info-tooltip>
          </div>

          <div class="col col-3">
            <etools-info-tooltip
              class="fr-nr-warn"
              custom-icon
              icon-first
              form-field-align
              ?hide-tooltip="${!this.frsConsistencyWarningIsActive(this._frsEndConsistencyWarning)}"
            >
              <datepicker-lite
                slot="field"
                id="intEnd"
                label="End date"
                .value="${this.programmeDocumentDates.end}"
                ?readonly="${!this.permissions.edit.end}"
                ?required="${this.permissions.required.end}"
                error-message="Please select end date"
                auto-validate
                selected-date-display-format="D MMM YYYY"
              >
              </datepicker-lite>
              <iron-icon icon="pmp-custom-icons:not-equal" slot="custom-icon"></iron-icon>
              <span slot="message">${this._frsEndConsistencyWarning}</span>
            </etools-info-tooltip>
          </div>
        </div>

        <div class="layout-horizontal right-align row-padding-v"
          ?hidden="${this.hideActionButtons(this.editMode, this.canEditProgrammeDocumentDates)}"
        >
          <paper-button class="default" @tap="${this.cancelProgrammeDateEdit}">
            Cancel
          </paper-button>
          <paper-button class="primary" @tap="${this.saveProgrammeDateEdit}">
            Save
          </paper-button>
        </div>
      </etools-content-panel>
    `;
  }

  @property({type: Boolean})
  showLoading = false;

  @property({type: Boolean})
  editMode = true;

  @property({type: Object})
  intervention!: Intervention;

  @property({type: Object})
  originalProgrammeDocumentDates!: ProgrammeDocDates;

  @property({type: Object})
  programmeDocumentDates!: ProgrammeDocDates;

  @property({type: String})
  _frsStartConsistencyWarning = '';

  @property({type: String})
  _frsEndConsistencyWarning = '';

  @property({type: Object})
  permissions!: Permission<ProgrammeDocumentDatesPermissions>;

  @property({type: Boolean})
  canEditProgrammeDocumentDates!: boolean;

  connectedCallback() {
    super.connectedCallback();
  }

  stateChanged(state: any) {
    if (state.interventions.current) {
      this.programmeDocumentDates = selectProgrammeDocumentDates(state);
      this.permissions = selectProgrammeDocumentDatesPermissions(state);
      this.setCanEditProgrammeDocumentDates(this.permissions.edit);
      this.originalProgrammeDocumentDates = cloneDeep(this.programmeDocumentDates);
    }
    this.populate(state);
  }

  populate(state: any) {
    if (get(state, 'interventions.current.start')) {
      this.programmeDocumentDates.start = state.interventions.current.start;
    }
    if (get(state, 'interventions.current.start')) {
      this.programmeDocumentDates.end = state.interventions.current.end;
    }
  }

  setCanEditProgrammeDocumentDates(editPermissions: ProgrammeDocumentDatesPermissions) {
    this.canEditProgrammeDocumentDates = editPermissions.start || editPermissions.end;
  }

  validate() {
    return validateRequiredFields(this);
  }

  cancelProgrammeDateEdit() {
    this.programmeDocumentDates = cloneDeep(this.originalProgrammeDocumentDates);
    this.editMode = false;
  }

  saveProgrammeDateEdit() {
    if (!this.validate()) {
      return;
    }

    this.editMode = false;
  }
}
