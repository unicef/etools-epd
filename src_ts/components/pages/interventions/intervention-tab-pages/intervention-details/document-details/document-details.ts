import {LitElement, html, customElement, property} from 'lit-element';
import {connect} from '../../utils/store-subscribe-mixin';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-input/paper-textarea';
import '@unicef-polymer/etools-loading/etools-loading';
import '@unicef-polymer/etools-content-panel/etools-content-panel';
import {buttonsStyles} from '../../common/styles/button-styles';
import {sharedStylesLit} from '../../common/styles/shared-styles-lit';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import {selectDocumentDetails} from './selectors';
import {DocumentDetails} from '../../common/intervention-types';
import {cloneDeep} from '../../../../../utils/utils';
import PermissionsMixin from '../../mixins/permissions-mixins';

/**
 * @customElement
 */
@customElement('document-details')
export class PartnerDetailsElement extends connect(LitElement) {
  static get styles() {
    return [gridLayoutStylesLit, buttonsStyles];
  }

  render() {
    // language=HTML
    return html`
      ${sharedStylesLit}
      <style>
        /* CSS rules for your element */
        paper-textarea[readonly] {
          --paper-input-container-underline: {
            display: none;
          }
        }
      </style>

      <etools-content-panel show-expand-btn panel-title="Document Details">
        <etools-loading loading-text="Loading..." .active="${this.showLoading}"></etools-loading>

        <div slot="panel-btns">
          <paper-icon-button
            icon="create"
            @tap="${() => this._editMode()}"
            ?hidden="${this.hideEditIcon(this.isNew, this.editMode, this.canEditDocumentDetails)}"
          ></paper-icon-button>
        </div>

        <div class="row-padding-v">
          <paper-input
            id="title"
            label="Title"
            .value="${this.documentDetails.details.title}"
            ?readonly="${this.isReadonly(this.editMode, this.documentDetails.permissions.edit.title)}"
          >
          </paper-input>
        </div>

        <div class="row-padding-v">
          <paper-textarea
            id="context"
            label="Context"
            type="text"
            .value="${this.documentDetails.details.context}"
            ?readonly="${this.isReadonly(this.editMode, this.documentDetails.permissions.edit.context)}"
          >
          </paper-textarea>
        </div>

        <div class="row-padding-v">
          <paper-textarea
            id="implementation-strategy"
            label="Implementation Strategy"
            .value="${this.documentDetails.details.implementation_strategy}"
            ?readonly="${this.isReadonly(this.editMode, this.documentDetails.permissions.edit.implementation_strategy)}"
          >
          </paper-textarea>
        </div>

        <div class="row-padding-v">
          <paper-textarea
            id="ip_progr_contrib"
            label="Partner non-financial contribution"
            .value="${this.documentDetails.details.ip_progr_contrib}"
            ?readonly="${this.isReadonly(this.editMode, this.documentDetails.permissions.edit.ip_progr_contrib)}"
          >
          </paper-textarea>
        </div>

        <div class="layout-horizontal right-align row-padding-v">
          <paper-button class="default" @tap="${this.cancelDocumentDetails}">
            Cancel
          </paper-button>
          <paper-button class="primary" @tap="${this.saveDocumentDetails}">
            Save
          </paper-button>
        </div>
      </etools-content-panel>
    `;
  }
  @property({type: Object})
  documentDetails!: DocumentDetails;

  @property({type: Object})
  originalDocumentDetails = {};

  @property({type: Boolean})
  showLoading = false;

  @property({type: Boolean})
  isNew = false;

  @property({type: Boolean})
  editMode = false;

  @property({type: Boolean})
  canEditDocumentDetails!: boolean;

  connectedCallback() {
    super.connectedCallback();
  }

  stateChanged(state: any) {
    if (!state.interventions.current) {
      return;
    }
    this.documentDetails = selectDocumentDetails(state);
    this.setDocumentDetailsPermissions(this.documentDetails.permissions.edit);
    this.originalDocumentDetails = cloneDeep(this.documentDetails.details);
  }

  _editMode() {
    this.editMode = true;
  }

  cancelDocumentDetails() {
    Object.assign(this.documentDetails.details, this.originalDocumentDetails);
    this.documentDetails.details = cloneDeep(this.originalDocumentDetails);
    this.editMode = false;
  }

  saveDocumentDetails() {
    this.editMode = false;
  }
}
