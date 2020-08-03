import {customElement, LitElement, html, property} from 'lit-element';
import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/paper-checkbox/paper-checkbox';
import '@polymer/paper-input/paper-input';

import '@unicef-polymer/etools-content-panel/etools-content-panel';
import '@unicef-polymer/etools-dropdown/etools-dropdown';
import '@unicef-polymer/etools-upload/etools-upload';

import '@unicef-polymer/etools-date-time/datepicker-lite';
import DatePickerLite from '@unicef-polymer/etools-date-time/datepicker-lite';

import ComponentBaseMixin from '../../common/mixins/component-base-mixin';
import MissingDropdownOptionsMixin from '../../common/mixins/missing-dropdown-options-mixin';
import UploadMixin from '../../common/mixins/uploads-mixin';
import {fireEvent} from '../../../../../utils/fire-custom-event';
import CONSTANTS from '../../common/constants';
import {sectionContentStylesPolymer} from '../../common/styles/content-section-styles-polymer';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import {sharedStyles} from '../../common/styles/shared-styles-lit';
import {getStore} from '../../utils/redux-store-access';
import {connect} from 'pwa-helpers/connect-mixin';
import {isJsonStrMatch, copy} from '../../utils/utils';

import {Permission} from '../../common/models/intervention.types';
import {MinimalUser, AnyObject} from '../../common/models/globals.types';
import {DocumentPermission, Document} from './managementDocument.model';
import {selectDocumentPermissions} from './managementDocument.selectors';
import {getEndpoint} from '../../utils/endpoint-helper';
import {interventionEndpoints} from '../../utils/intervention-endpoints';

/**
 * @polymer
 * @customElement
 * @mixinFunction
 * @appliesMixin CommonMixin
 * @appliesMixin MissingDropdownOptionsMixin
 * @appliesMixin UploadsMixin
 */
@customElement('intervention-review-and-sign')
export class InterventionReviewAndSign extends connect(getStore())(
  ComponentBaseMixin(MissingDropdownOptionsMixin(UploadMixin(LitElement)))
) {
  static get styles() {
    return [gridLayoutStylesLit];
  }
  render() {
    return html`
      <style>
        ${sectionContentStylesPolymer}${sharedStyles}:host {
          @apply --layout-vertical;
          width: 100%;
        }

        datepicker-lite[required] {
          --paper-input-container-label-floating_-_max-width: 133%;
        }

        paper-input {
          width: 100%;
        }

        paper-checkbox {
          @apply --layout-horizontal;
          @apply --layout-center;
          min-height: 24px;
        }

        paper-checkbox[disabled] {
          cursor: not-allowed;
          --paper-checkbox-unchecked-color: black;
          --paper-checkbox-label: {
            color: var(--primary-text-color);
            opacity: 1;
          }
        }
      </style>
      <etools-content-panel class="content-section" panel-title="Signatures & Dates">
        <div class="layout-horizontal row-padding-v">
          <div class="col col-3">
            <!-- Document Submission Date -->
            <datepicker-lite
              id="submissionDateField"
              label="Document Submission Date"
              value="${this.intervention.submission_date}"
              readonly="?${!this.permissions.edit.submission_date}"
              selected-date-display-format="D MMM YYYY"
              required="?${this.permissions.required.submission_date}"
              max-date="${this.getCurrentDate()}"
              max-date-error-msg="Date can not be in the future"
              error-message="Document Submission Date is required"
              auto-validate
            >
            </datepicker-lite>
          </div>
          <div class="col col-3">
            <!-- Submitted to PRC? -->
            <paper-input-container dir="null">
              <slot name="prefix" slot="prefix"></slot>
              <div slot="input" class="paper-input-input">
                <span class="input-value">
                  <paper-checkbox
                    checked="${this.intervention.submitted_to_prc}"
                    disabled="?${this._isSubmittedToPrcCheckReadonly(
                      this.permissions.edit.prc_review_attachment,
                      this._lockSubmitToPrc
                    )}"
                  >
                    Submitted to PRC?
                  </paper-checkbox>
                </span>
                <slot></slot>
              </div>
            </paper-input-container>
          </div>
        </div>
        ${this._showSubmittedToPrcFields(this.intervention.submitted_to_prc)
          ? html` <div class="layout-horizontal row-padding-v row-second-bg">
              <div class="col col-3">
                <!-- Submission Date to PRC -->
                <datepicker-lite
                  id="submissionDatePrcField"
                  label="Submission Date to PRC"
                  value="${this.intervention.submission_date_prc}"
                  readonly="?${!this.permissions.edit.submission_date_prc}"
                  required="?${this.intervention.prc_review_attachment}"
                  selected-date-display-format="D MMM YYYY"
                  auto-validate
                >
                </datepicker-lite>
              </div>
              <div class="col col-3">
                <!-- Review Date by PRC -->
                <datepicker-lite
                  id="reviewDatePrcField"
                  label="Review Date by PRC"
                  value="${this.intervention.review_date_prc}"
                  readonly="?${!this.permissions.edit.review_date_prc}"
                  required="?${this.intervention.prc_review_attachment}"
                  selected-date-display-format="D MMM YYYY"
                  auto-validate
                >
                </datepicker-lite>
              </div>
              <div class="col col-6">
                <!-- PRC Review Document -->
                <etools-upload
                  id="reviewDocUpload"
                  label="PRC Review Document"
                  accept=".doc,.docx,.pdf,.jpg,.png"
                  file-url="${this.intervention.prc_review_attachment}"
                  upload-endpoint="${this.uploadEndpoint}"
                  @upload-finished="_prcRevDocUploadFinished"
                  readonly="?${!this.permissions.edit.prc_review_attachment}"
                  show-delete-btn="${this.showPrcReviewDeleteBtn(this.intervention.status)}"
                  @delete-file="${this._prcRevDocDelete}"
                  @upload-started="${this._onUploadStarted}"
                  @change-unsaved-file="${this._onChangeUnsavedFile}"
                >
                </etools-upload>
              </div>
            </div>`
          : html``}
        <div class="layout-horizontal row-padding-v">
          <div class="col col-6">
            <!-- Signed By Partner Authorized Officer -->
            <etools-dropdown
              id="signedByAuthorizedOfficer"
              label="Signed By Partner Authorized Officer"
              placeholder="&#8212;"
              options="${this.agreementAuthorizedOfficers}"
              selected="${this.intervention.partner_authorized_officer_signatory}"
              readonly="?${!this.permissions.edit.partner_authorized_officer_signatory}"
              required="?${this.permissions.required.partner_authorized_officer_signatory}"
              auto-validate
              error-message="Please select Partner Authorized Officer"
            >
            </etools-dropdown>
          </div>
          <div class="col col-3">
            <!-- Signed by Partner Date -->
            <datepicker-lite
              id="signedByPartnerDateField"
              label="Signed by Partner Date"
              value="${this.intervention.signed_by_partner_date}"
              readonly="${!this.permissions.edit.signed_by_partner_date}"
              required="?${this.permissions.required.signed_by_partner_date}"
              auto-validate
              error-message="Date is required"
              max-date-error-msg="Date can not be in the future"
              max-date="${this.getCurrentDate()}"
              selected-date-display-format="D MMM YYYY"
            >
            </datepicker-lite>
          </div>
        </div>
        <div class="layout-horizontal row-padding-v">
          <div class="col col-6">
            <!-- Signed by UNICEF Authorized Officer -->
            <paper-input-container>
              <label slot="label"> Signed by UNICEF Authorized Officer</label>
            </paper-input-container>
          </div>
          <div class="col col-3">
            <!-- Signed by UNICEF Date -->
            <datepicker-lite
              id="signedByUnicefDateField"
              label="Signed by UNICEF Date"
              value="${this.intervention.signed_by_unicef_date}"
              readonly="${!this.permissions.edit.signed_by_unicef_date}"
              required="?${this.permissions.required.signed_by_unicef_date}"
              auto-validate
              error-message="Date is required"
              max-date-error-msg="Date can not be in the future"
              max-date="${this.getCurrentDate()}"
              selected-date-display-format="D MMM YYYY"
            >
            </datepicker-lite>
          </div>
        </div>
        <div class="layout-horizontal row-padding-v">
          <div class="col col-6">
            <!-- Signed by UNICEF -->
            <etools-dropdown
              id="signedByUnicef"
              label="Signed by UNICEF"
              placeholder="&#8212;"
              options="${this.getCleanEsmmOptions(this.signedByUnicefUsers)}"
              option-value="id"
              option-label="name"
              selected="${this.intervention.unicef_signatory}"
              readonly="?${!this.permissions.edit.unicef_signatory}"
              auto-validate
              error-message="Please select UNICEF user"
            >
            </etools-dropdown>
          </div>
        </div>
        <div class="layout-horizontal row-padding-v">
          <div class="col col-6">
            <!-- Signed PD/SSFA -->
            <etools-upload
              id="signedIntervFile"
              label="Signed PD/SSFA"
              accept=".doc,.docx,.pdf,.jpg,.png"
              file-url="${this.intervention.signed_pd_attachment}"
              upload-endpoint="${this.uploadEndpoint}"
              @upload-finished="${this._signedPDUploadFinished}"
              show-delete-btn="${this.showSignedPDDeleteBtn(this.intervention.status)}"
              @delete-file="${this._signedPDDocDelete}"
              auto-validate
              readonly="?${!this.permissions.edit.signed_pd_attachment}"
              required="?${this.permissions.required.signed_pd_attachment}"
              error-message="Please select Signed PD/SSFA document"
              @upload-started="${this._onUploadStarted}"
              @change-unsaved-file="${this._onChangeUnsavedFile}"
            >
            </etools-upload>
          </div>
          ${this._showDaysToSignedFields(this.intervention.status)
            ? html`<div class="col col-3">
                  <paper-input
                    label="Days from Submission to Signed"
                    value="${this.intervention.days_from_submission_to_signed}"
                    placeholder="&#8212;"
                    readonly
                  >
                  </paper-input>
                </div>
                <div class="col col-3">
                  <paper-input
                    label="Days from Review to Signed"
                    value="${this.intervention.days_from_review_to_signed}"
                    placeholder="&#8212;"
                    readonly
                  >
                  </paper-input>
                </div>`
            : html``}
        </div>
      </etools-content-panel>
    `;
  }

  @property({type: Object})
  originalIntervention!: Document;

  // @lajos: this had observer a function... observer: '_interventionChanged'
  // we should discuss this...
  @property({type: Object})
  intervention!: Document;

  @property({type: Object})
  // permissions!: Permission<InterventionPermissionsFields>;
  permissions!: Permission<DocumentPermission>;

  @property({type: Array})
  signedByUnicefUsers!: MinimalUser[];

  // @property({type: Object, observer: '_agreementChanged'})
  // agreement!: Agreement;

  @property({type: Object})
  agreementAuthorizedOfficers!: AnyObject;

  @property({type: Boolean})
  _lockSubmitToPrc = true;

  @property({type: String})
  partnerDateValidatorErrorMessage!: string;

  @property({type: String})
  unicefDateValidatorErrorMessage!: string;

  @property({type: String})
  uploadEndpoint: string = getEndpoint(interventionEndpoints.attachmentsUpload).url;

  // static get observers() {
  //   return [
  //     '_interventionDocTypeChanged(intervention.document_type)',
  //     '_signedPdDocHasChanged(intervention.signed_pd_attachment)',
  //     '_updateStyles(permissions.edit.prc_review_attachment, _lockSubmitToPrc)',
  //     '_resetFieldsAndValidations(intervention.submitted_to_prc)'
  //   ];
  // }

  stateChanged(state: any) {
    if (!isJsonStrMatch(this.signedByUnicefUsers, state.commonData!.unicefUsersData)) {
      this.signedByUnicefUsers = copy(state.commonData!.unicefUsersData);
    }

    if (state.interventions.current) {
      this.intervention = state.interventions.current;
      // @lajos TO DO see how to override!
      this.permissions = selectDocumentPermissions(state);
    }
    // this will need review...currently only we shoe data..not change
    // this.uploadsStateChanged(state);
  }

  connectedCallback() {
    super.connectedCallback();
    /**
     * Disable loading message for review and sign tab elements load,
     * triggered by parent element on stamp or by tap event on tabs
     */
    fireEvent(this, 'global-loading', {
      active: false,
      loadingSource: 'interv-page'
    });
    // @lajos: review this, not sure we will use it anymore
    this.setDropdownMissingOptionsAjaxDetails(this.shadowRoot?.querySelector('#signedByUnicef'), 'unicefUsers', {
      dropdown: true
    });
    fireEvent(this, 'tab-content-attached');
  }

  // IMPORTANT: commented functions are because we currently do not modifiy the data...only display it

  // _resetFieldsAndValidations(submittedToPrc: boolean) {
  //   if (submittedToPrc) {
  //     /** wait for components to be stamped */
  //     setTimeout(() => {
  //       this._resetPrcFieldsValidations();
  //     });
  //   } else {
  //     if (this.intervention.prc_review_attachment) {
  //       getStore().dispatch({type: DECREASE_UNSAVED_UPLOADS});
  //     }
  //     this._resetPrcFields();
  //   }
  // }

  _resetPrcFieldsValidations() {
    (this.shadowRoot!.querySelector('#submissionDatePrcField')! as DatePickerLite).invalid = false;
    (this.shadowRoot!.querySelector('#reviewDatePrcField')! as DatePickerLite).invalid = false;
  }

  // _updateStyles() {
  //   // @lajos chek whatabout this function
  //   this.updateStyles();
  // }

  _isDraft(status: string) {
    return status === CONSTANTS.STATUSES.Draft.toLowerCase() || status === '';
  }

  // _interventionChanged(intervention: Intervention) {
  //   // check if submitted to PRC was already saved
  //   if (intervention && intervention.id && intervention.submitted_to_prc) {
  //     this._lockSubmitToPrc = true;
  //   } else {
  //     this._lockSubmitToPrc = false;
  //   }
  //   if (!intervention.prc_review_attachment) {
  //     // @lajos: review declaration of bellow... originally did not have null as definition
  //     this.intervention.prc_review_attachment = undefined;
  //   }
  // }

  _hideDeleteBtn(status: string, fileUrl: string) {
    return this._isDraft(status) && fileUrl;
  }

  // _agreementChanged(agreement: Agreement) {
  //   if (agreement && typeof agreement === 'object' && Object.keys(agreement).length > 0) {
  //     const authorizedOfficerData = agreement.authorized_officers!.map((officer) => {
  //       return {
  //         value: typeof officer.id === 'string' ? parseInt(officer.id, 10) : officer.id,
  //         label: officer.first_name + ' ' + officer.last_name
  //       };
  //     });
  //     // @lajos: originally this was declared as array...but as per above it is object....
  //     this.agreementAuthorizedOfficers = authorizedOfficerData;
  //   }
  // }

  validate() {
    let valid = true;
    const fieldSelectors = [
      '#signedByAuthorizedOfficer',
      '#signedByPartnerDateField',
      '#signedByUnicefDateField',
      '#signedIntervFile',
      '#submissionDateField'
    ];
    if (this.intervention.prc_review_attachment) {
      const dateFields = ['#submissionDatePrcField', '#reviewDatePrcField'];
      fieldSelectors.push(...dateFields);
    }
    fieldSelectors.forEach((selector: string) => {
      const field = this.shadowRoot!.querySelector(selector) as LitElement & {validate(): boolean};
      if (field && !field.validate()) {
        valid = false;
      }
    });
    return valid;
  }

  /**
   * intervention.submitted_to_prc is set only on bk if submission_date_prc, review_date_prc are filled in
   * For the submitted_to_prc field to be true when file is attached also,
   * we make the date fields required
   */
  _showSubmittedToPrcFields(submittedToPrc: boolean) {
    return true;
    return this._isNotSSFA(this.intervention.document_type) && submittedToPrc;
  }

  _isNotSSFA(documentType: string) {
    return documentType !== CONSTANTS.DOCUMENT_TYPES.SSFA;
  }

  _showDaysToSignedFields(status: string) {
    return !this._isDraft(status);
  }

  _isSubmittedToPrcCheckReadonly(isPrcDocEditable: boolean, lockSubmitToPrc: boolean) {
    return !isPrcDocEditable || lockSubmitToPrc;
  }

  _interventionDocTypeChanged(interventionDocumentType: string) {
    if (typeof interventionDocumentType === 'undefined') {
      return;
    }

    const submittedToPrc = this._showSubmittedToPrcFields(this.intervention.submitted_to_prc);
    if (!submittedToPrc) {
      this.intervention.submitted_to_prc = false;
      this._resetPrcFields();
    }
  }

  _resetPrcFields() {
    this.intervention.submission_date_prc = '';
    this.intervention.review_date_prc = '';
    this.intervention.prc_review_attachment = '';
  }

  // update FR Number on intervention
  // _handleFrsUpdate(e: CustomEvent) {
  //   e.stopImmediatePropagation();
  //   try {
  //     this.intervention.frs_details = e.detail.frsDetails;
  //     const frIds = e.detail.frsDetails.frs.map((fr: Fr) => fr.id);
  //     this.intervention = {...this.intervention, frs: frIds};
  //   } catch (err) {
  //     logError('[_handleFrsUpdate] An error occurred during FR Numbers update', null, err);
  //   }
  // }

  // /**
  //  * If a signed document is selected then all fields required
  //  * for the intervention to move in signed status are required; only for draft status.
  //  */
  // _signedPdDocHasChanged(signedDocument: any) {
  //   if (typeof signedDocument === 'undefined') {
  //     return;
  //   }
  //   // this functionality is available only after pd is saved and in draft status
  //   if (this.intervention && this.intervention.status === CONSTANTS.STATUSES.Draft.toLowerCase()) {
  //     setTimeout(() => {
  //       // delay micro task execution; set to make sure _signedDocChangedForDraft will run on page load
  //       if (signedDocument) {
  //         // new document uploaded or file url provided
  //         fireEvent(this, 'signed-doc-change-for-draft', {docSelected: true});
  //       } else {
  //         // there is no signedDocument
  //         fireEvent(this, 'signed-doc-change-for-draft', {
  //           docSelected: false
  //         });
  //       }
  //     }, 0);
  //   }
  // }

  _signedPDUploadFinished(e: CustomEvent) {
    getStore().dispatch({type: CONSTANTS.DECREASE_UPLOADS_IN_PROGRESS});
    if (e.detail.success) {
      const response = e.detail.success;
      this.intervention.signed_pd_attachment = response.id;
      getStore().dispatch({type: CONSTANTS.INCREASE_UNSAVED_UPLOADS});
    }
  }

  _signedPDDocDelete(_e: CustomEvent) {
    // @lajos: originally null
    this.intervention.signed_pd_attachment = '';
    getStore().dispatch({type: CONSTANTS.DECREASE_UNSAVED_UPLOADS});
  }

  // _prcRevDocUploadFinished(e: CustomEvent) {
  //   getStore().dispatch({type: DECREASE_UPLOADS_IN_PROGRESS});
  //   if (e.detail.success) {
  //     const response = e.detail.success;
  //     this.intervention.prc_review_attachment = response.id;
  //     getStore().dispatch({type: INCREASE_UNSAVED_UPLOADS});
  //   }
  // }

  _prcRevDocDelete(_e: CustomEvent) {
    // @lajos this initially was set to undefined
    this.intervention.prc_review_attachment = '';
    getStore().dispatch({type: CONSTANTS.DECREASE_UNSAVED_UPLOADS});
    this._resetPrcFieldsValidations();
  }

  showPrcReviewDeleteBtn(status: string) {
    return this._isDraft(status) && !!this.originalIntervention && !this.originalIntervention.prc_review_attachment;
  }

  showSignedPDDeleteBtn(status: string) {
    return this._isDraft(status) && !!this.originalIntervention && !this.originalIntervention.signed_pd_attachment;
  }

  getCurrentDate() {
    return new Date();
  }
}
