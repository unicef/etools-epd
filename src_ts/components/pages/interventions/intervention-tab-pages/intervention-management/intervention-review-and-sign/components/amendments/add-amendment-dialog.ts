import {LitElement, html, property, customElement} from 'lit-element';
import '@polymer/paper-input/paper-input';
import '@unicef-polymer/etools-dialog/etools-dialog';
import '@unicef-polymer/etools-dropdown/etools-dropdown-multi';
import '@unicef-polymer/etools-upload/etools-upload';
import '@unicef-polymer/etools-date-time/datepicker-lite';

import '../../../../../../layout/etools-warn-message';
// @lajos -> to be refactored
import {fireEvent} from '../../../../../../utils/fire-custom-event';
import {connect} from 'pwa-helpers/connect-mixin';
import {getStore} from '../../../../utils/redux-store-access';
import '../../../../common/styles/grid-layout-styles-lit'
import {gridLayoutStylesLit} from '../../../../common/styles/grid-layout-styles-lit';
import {buttonsStyles} from '../../../../common/styles/button-styles';
import {sharedStyles} from '../../../../common/styles/shared-styles-lit';
import {requiredFieldStarredStyles} from '../../../../common/styles/required-field-styles';
import {interventionEndpoints} from '../../../../utils/intervention-endpoints';
import {isJsonStrMatch} from '../../../../utils/utils';
import {LabelAndValue} from '../../../../common/models/globals.types';
import {InterventionAmendment} from '../../../../common/models/intervention.types';
import {sendRequest} from '@unicef-polymer/etools-ajax/etools-ajax-request';
import {parseRequestErrorsAndShowAsToastMsgs} from '@unicef-polymer/etools-ajax/ajax-error-parser';
import CONSTANTS from '../../../../common/constants';
import EtoolsDialog from '@unicef-polymer/etools-dialog/etools-dialog';
import {EtoolsDropdownMultiEl} from '@unicef-polymer/etools-dropdown/etools-dropdown-multi';
import {getEndpoint} from '../../../../utils/endpoint-helper';

/**
 * @polymer
 * @customElement
 * @mixinFunction
 * @appliesMixin EndpointsMixin
 */
customElement('add-amendment-dialog')
export class AddAmendmentDialog extends connect(getStore())(LitElement) {
  static get style() {
    return [gridLayoutStylesLit, buttonsStyles];
  }
  static get template() {
    return html`
      ${sharedStyles} ${requiredFieldStarredStyles}
      <style>
        paper-input#other {
          width: 100%;
        }

        .row-h {
          padding-top: 0;
          padding-bottom: 16px;
          overflow: hidden;
        }
      </style>

      <etools-dialog
        no-padding
        keep-dialog-open
        id="add-amendment"
        opened="{{opened}}"
        size="md"
        hidden="?[[datePickerOpen]]"
        ok-btn-text="Save"
        dialog-title="Add Amendment"
        @confirm-btn-clicked="_validateAndSaveAmendment"
        disable-confirm-btn="[[uploadInProgress]]"
        disable-dismiss-btn="[[uploadInProgress]]"
      >
        <div class="row-h flex-c">
          <!-- Signed Date -->
          <datepicker-lite
            id="signed-date"
            label="Signed date"
            value="{{newAmendment.signed_date}}"
            open="{{datePickerOpen}}"
            max-date="[[getCurrentDate()]]"
            max-date-error-msg="Date can not be in the future"
            auto-validate
            required
            selected-date-display-format="D MMM YYYY"
          >
          </datepicker-lite>
        </div>
        <div class="row-h flex-c">
          <!-- Amendment Type -->
          <etools-dropdown-multi
            id="amendment-types"
            label="Amendment Types"
            placeholder="&#8212;"
            options="[[filteredAmendmentTypes]]"
            selected-values="{{newAmendment.types}}"
            hide-search
            required
            auto-validate
            error-message="Type is required"
          >
          </etools-dropdown-multi>
        </div>
        <div class="row-h flex-c" hidden="?[[!newAmendment.types.length]]">
          <etools-warn-message
            messages="[[_getSelectedAmendmentTypeWarning(newAmendment.types, newAmendment.types.length)]]"
          >
          </etools-warn-message>
        </div>
        <div class="row-h" hidden="?[[!_showOtherInput(newAmendment.types, newAmendment.types.length)]]">
          <paper-input
            id="other"
            placeholder="&#8212;"
            label="Other"
            invalid
            required
            auto-validate
            error-message="This is required"
            value="{{newAmendment.other_description}}"
          >
          </paper-input>
        </div>
        <div class="row-h flex-c">
          <!-- Signed Agreement -->
          <etools-upload
            id="signed-agreement-upload"
            label="Signed Amendment"
            accept=".doc,.docx,.pdf,.jpg,.png"
            file-url="[[newAmendment.signed_amendment_attachment]]"
            upload-endpoint="[[uploadEndpoint]]"
            @upload-finished="_amendmentUploadFinished"
            required
            auto-validate
            upload-in-progress="{{amdUploadInProgress}}"
            error-message="Attachment required"
          >
          </etools-upload>
        </div>
        <div class="row-h flex-c">
          <etools-upload
            id="prc-review-upload"
            label="Internal / PRC Reviews"
            accept=".doc,.docx,.pdf,.jpg,.png"
            file-url="[[newAmendment.internal_prc_review]]"
            upload-endpoint="[[uploadEndpoint]]"
            upload-in-progress="{{prcUploadInProgress}}"
            @upload-finished="_prcReviewUploadFinished"
          >
          </etools-upload>
        </div>
      </etools-dialog>
    `;
  }

  @property({type: String})
  endpointName = 'interventionAmendmentAdd';

  @property({type: Object})
  toastEventSource!: LitElement;

  @property({type: Boolean})
  datePickerOpen = false;

  // @lajso another observer
  @property({type: Boolean, notify: true, observer: '_resetFields'})
  opened = false;

  @property({type: Number})
  interventionId: number | null = null;

  @property({type: String})
  interventionDocumentType = '';

  @property({type: Array})
  amendmentTypes!: LabelAndValue[];

  @property({type: Object})
  newAmendment!: InterventionAmendment;

  @property({type: String})
  uploadEndpoint: string = interventionEndpoints.attachmentsUpload.url;

  // @lajso -> computed
  @property({
    type: Boolean,
    computed: 'getUploadInProgress(amdUploadInProgress, prcUploadInProgress)'
  })
  uploadInProgress = false;

  @property({type: Boolean})
  amdUploadInProgress = false;

  @property({type: Boolean})
  prcUploadInProgress = false;

  @property({type: Array})
  filteredAmendmentTypes!: LabelAndValue[];

  private _validationSelectors: string[] = ['#amendment-types', '#signed-date', '#signed-agreement-upload', '#other'];

  static get observers() {
    return ['_filterAmendmentTypes(amendmentTypes, interventionDocumentType)'];
  }

  stateChanged(state: any) {
    if (!isJsonStrMatch(this.amendmentTypes, state.commonData!.interventionAmendmentTypes)) {
      this.amendmentTypes = [...state.commonData!.interventionAmendmentTypes];
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.resetAmendment();
  }

  getUploadInProgress(amdInProgress: boolean, prcInProgress: boolean) {
    return amdInProgress || prcInProgress;
  }

  resetAmendment() {
    this.newAmendment = new InterventionAmendment();
  }

  startSpinner() {
    (this.shadowRoot!.querySelector('#add-amendment') as EtoolsDialog).startSpinner();
  }

  stopSpinner() {
    (this.shadowRoot!.querySelector('#add-amendment') as EtoolsDialog).stopSpinner();
  }

  _filterAmendmentTypes(amendmentTypes: LabelAndValue[], interventionDocumentType: string) {
    if (!amendmentTypes || !interventionDocumentType) {
      return;
    }
    if (interventionDocumentType === CONSTANTS.DOCUMENT_TYPES.SSFA) {
      this.filteredAmendmentTypes = this.amendmentTypes.filter((type: LabelAndValue) => {
        return ['no_cost', 'other'].indexOf(type.value) > -1;
      });
    } else {
      this.filteredAmendmentTypes = JSON.parse(JSON.stringify(this.amendmentTypes));
    }
    const typesDropdw = this.shadowRoot!.querySelector('#amendment-types') as EtoolsDropdownMultiEl;

    if (typesDropdw) {
      typesDropdw.set('invalid', false); // to fix eager validation
    }
  }

  _showOtherInput() {
    const amdTypes = this.newAmendment.types;
    return amdTypes && amdTypes.indexOf('other') > -1;
  }

  isValidAmendment() {
    let isValid = true;
    this._validationSelectors.forEach((selector: string) => {
      const el = this.shadowRoot!.querySelector(selector) as LitElement & {
        validate(): boolean;
      };
      if (selector === '#other' && !this._showOtherInput()) {
        return;
      }
      if (el && !el.validate()) {
        isValid = false;
      }
    });
    return isValid;
  }

  _resetFields() {
    this.resetAmendment();
    this._resetAmendmentValidations();
  }

  _resetAmendmentValidations() {
    this._validationSelectors.forEach((selector: string) => {
      const el = this.shadowRoot!.querySelector(selector) as LitElement;
      if (el) {
        // @lajos see bellow... el.invalid not found...only oninvalid
        // el.set('invalid', false);
        el.invalid = false;
      }
    });
  }

  _getSelectedAmendmentTypeWarning(types: string[]) {
    if (!types || !types.length) {
      return;
    }
    const messages: string[] = [];
    types.forEach((amdType: string) => {
      switch (amdType) {
        case 'admin_error':
          messages.push('Corrections in the programme document due to typos or administrative error.');
          break;
        case 'budget_lte_20':
          messages.push(
            'Changes to the budget of activities resulting in a change in the UNICEF contribution ≤20% of ' +
              'previously approved cash and/or supplies, with or without changes to the programme results.'
          );
          break;
        case 'budget_gt_20':
          messages.push(
            'Changes to the budget of activities resulting in a change in the UNICEF contribution >20% of ' +
              'previously approved cash and/or supplies, with or without changes to the programme results.'
          );
          break;
        case 'no_cost':
          messages.push('No cost extension');
          break;
        case 'change':
          messages.push(
            'Changes to planned results, population or geographical coverage of the programme with no ' +
              'change in UNICEF contribution.'
          );
          break;
        case 'other':
          messages.push('Other');
          break;
      }
    });
    return messages;
  }

  _validateAndSaveAmendment() {
    if (!this.isValidAmendment()) {
      return;
    }
    this._saveAmendment(this.newAmendment);
  }

  _saveAmendment(newAmendment: InterventionAmendment) {
    if (!newAmendment.internal_prc_review) {
      delete newAmendment.internal_prc_review;
    }
    // @lajos check getEndpoint
    const options = {
      method: 'POST',
      endpoint: getEndpoint(this.endpointName, {
        intervId: this.interventionId
      }),
      body: newAmendment
    };
    this.startSpinner();
    sendRequest(options)
      .then((resp: InterventionAmendment) => {
        this._handleResponse(resp);
        this.stopSpinner();
      })
      .catch((error: any) => {
        this._handleErrorResponse(error);
        this.stopSpinner();
      });
  }

  _handleResponse(response: InterventionAmendment) {
    this.opened = false;
    fireEvent(this, 'amendment-added', response);
  }

  _handleErrorResponse(error: any) {
    parseRequestErrorsAndShowAsToastMsgs(error, this.toastEventSource);
  }

  _amendmentUploadFinished(e: CustomEvent) {
    if (e.detail.success) {
      const uploadResponse = e.detail.success;
      this.newAmendment.signed_amendment_attachment = uploadResponse.id;
    }
  }

  _prcReviewUploadFinished(e: CustomEvent) {
    if (e.detail.success) {
      const uploadResponse = e.detail.success;
      this.newAmendment.internal_prc_review = uploadResponse.id;
    }
  }

  getCurrentDate() {
    return new Date();
  }
}
