import {LitElement, html, customElement, property} from 'lit-element';
import ComponentBaseMixin from '../../common/mixins/component-base-mixin';
import FrNumbersConsistencyMixin from '../../common/mixins/fr-numbers-consistency-mixin';
import '@unicef-polymer/etools-date-time/datepicker-lite';
import '@unicef-polymer/etools-info-tooltip/etools-info-tooltip';
import '@unicef-polymer/etools-content-panel/etools-content-panel';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import {sharedStyles} from '../../common/styles/shared-styles-lit';
import {Intervention, Permission} from '../../common/models/intervention.types';
import {ProgrammeDocDates, InterventionDatesPermissions} from './interventionDates.models';
import cloneDeep from 'lodash-es/cloneDeep';
import {selectInterventionDates, selectInterventionDatesPermissions} from './interventionDates.selectors';
import {validateRequiredFields} from '../../utils/validation-helper';
import {buttonsStyles} from '../../common/styles/button-styles';
import {connect} from 'pwa-helpers/connect-mixin';
import {getStore} from '../../utils/redux-store-access';

/**
 * @customElement
 */
@customElement('intervention-dates')
export class InterventionDates extends connect(getStore())(ComponentBaseMixin(FrNumbersConsistencyMixin(LitElement))) {
  static get styles() {
    return [gridLayoutStylesLit, buttonsStyles];
  }

  render() {
    // language=HTML
    return html`
      ${sharedStyles}
      <style></style>

      <etools-content-panel show-expand-btn panel-title="Programme Document Dates">
        <etools-loading loading-text="Loading..." .active="${this.showLoading}"></etools-loading>

        <div slot="panel-btns">
          ${this.renderEditBtn(this.editMode, this.canEditInterventionDates)}
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
                .value="${this.interventionDates.start}"
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
                .value="${this.interventionDates.end}"
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

        ${this.renderActions(this.editMode, this.canEditInterventionDates)}
      </etools-content-panel>
    `;
  }

  @property({type: Boolean})
  showLoading = false;

  @property({type: Object})
  intervention!: Intervention;

  @property({type: Object})
  originalInterventionDates!: ProgrammeDocDates;

  @property({type: Object})
  interventionDates!: ProgrammeDocDates;

  @property({type: String})
  _frsStartConsistencyWarning = '';

  @property({type: String})
  _frsEndConsistencyWarning = '';

  @property({type: Object})
  permissions!: Permission<InterventionDatesPermissions>;

  @property({type: Boolean})
  canEditInterventionDates!: boolean;

  connectedCallback() {
    super.connectedCallback();
  }

  stateChanged(state: any) {
    if (state.interventions.current) {
      this.interventionDates = selectInterventionDates(state);
      this.permissions = selectInterventionDatesPermissions(state);
      this.setCanEditInterventionDates(this.permissions.edit);
      this.originalInterventionDates = cloneDeep(this.interventionDates);
    }
    // this.populate(state);
  }

  // populate(state: any) {
  //   if (get(state, 'interventions.current.start')) {
  //     this.interventionDates.start = state.interventions.current.start;
  //   }
  //   if (get(state, 'interventions.current.start')) {
  //     this.interventionDates.end = state.interventions.current.end;
  //   }
  // }

  renderActions(editMode, canEditInterventionDates) {
    if (!this.hideActionButtons(editMode, canEditInterventionDates)) {
      return html`
        <div class="layout-horizontal right-align row-padding-v">
          <paper-button class="default" @tap="${this.cancelInterventionDateEdit}">
            Cancel
          </paper-button>
          <paper-button class="primary" @tap="${this.saveInterventionDateEdit}">
            Save
          </paper-button>
        </div>
      `;
    } else {
      return html``;
    }
  }

  renderEditBtn(editMode, canEditInterventionDates) {
    if (this.hideEditIcon(editMode, canEditInterventionDates)) {
      return html`
      <paper-icon-button
        @tap="${this.allowEdit}"
        icon="create"
      >
      </paper-icon-button>
    `;
    } else {
      return html``;
    }
  }

  setCanEditInterventionDates(editPermissions: InterventionDatesPermissions) {
    this.canEditInterventionDates = editPermissions.start || editPermissions.end;
  }

  validate() {
    return validateRequiredFields(this);
  }

  cancelInterventionDateEdit() {
    this.interventionDates = cloneDeep(this.originalInterventionDates);
    this.editMode = false;
  }

  saveInterventionDateEdit() {
    if (!this.validate()) {
      return;
    }

    this.editMode = false;
  }
}
