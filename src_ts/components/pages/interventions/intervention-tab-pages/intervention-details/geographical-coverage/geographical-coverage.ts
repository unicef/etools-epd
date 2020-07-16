import {customElement, html, LitElement, property} from 'lit-element';
import '@polymer/paper-button/paper-button';
import '@unicef-polymer/etools-dropdown/etools-dropdown-multi';
import './grouped-locations-dialog';
import {GroupedLocationsDialog} from './grouped-locations-dialog';

import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import {buttonsStyles} from '../../common/styles/button-styles';
import {sharedStyles} from '../../common/styles/shared-styles-lit';
import {cloneDeep, isJsonStrMatch} from '../../../../../utils/utils';
import {getStore} from '../../utils/redux-store-access';
import {connect} from 'pwa-helpers/connect-mixin';
import {layoutHorizontal} from '../../common/styles/flex-layout-styles';
import PermissionsMixin from '../../common/mixins/permissions-mixins';
import {Locations, LocationsPermissions} from './geographicalCoverage.models';
import {Permission} from '../../common/models/intervention-types';
import {selectLocations, selectLocationsPermissions} from './geographicalCoverage.selectors';

/**
 * @customElement
 */
@customElement('geographical-coverage')
export class GeographicalCoverage extends connect(getStore())(PermissionsMixin(LitElement)) {
  static get styles() {
    return [gridLayoutStylesLit, buttonsStyles];
  }

  render() {
    if (!this.locations) {
      return html` ${sharedStyles}
        <etools-loading loading-text="Loading..." active></etools-loading>`;
    }
    // language=HTML
    return html`
      ${sharedStyles}
      <style>
        :host {
          display: block;
          margin-bottom: 24px;
        }

        .see-locations {
          padding-right: 0;
          color: var(--primary-color);
          min-width: 100px;
          flex-direction: row;
          padding-bottom: 12px;
        }

        .see-locations iron-icon {
          margin-right: 0;
          margin-bottom: 2px;
          --iron-icon-height: 18px;
          --iron-icon-width: 18px;
        }

        .see-locations[disabled] {
          background-color: transparent;
        }

        #locations {
          max-width: 100%;
        }

        .no-side-pad {
          ${layoutHorizontal}
          padding: 16px 0;
        }
      </style>

      <etools-content-panel show-expand-btn panel-title="Geographical Coverage">
        <etools-loading loading-text="Loading..." .active="${this.showLoading}"></etools-loading>

        <div slot="panel-btns">
          <paper-icon-button
            icon="create"
            @tap="${this.allowEdit}"
            ?hidden="${this.hideEditIcon(this.editMode, this.canEditLocations)}"
          ></paper-icon-button>
        </div>

        <div class="flex-c no-side-pad">
          <etools-dropdown-multi
            id="locations"
            label="Location(s)"
            placeholder="&#8212;"
            .options="${this.locations}"
            .selected-values="${this.flatLocations}"
            ?readonly="${this.isReadonly(this.editMode, this.permissions.edit.locations)}"
            ?required="${this.permissions.required.locations}"
            option-label="name"
            option-value="id"
            error-message="Please select locations"
            disable-on-focus-handling
            trigger-value-change-event
            @etools-selected-items-changed="${this.locationsChanged}"
          >
          </etools-dropdown-multi>
          <paper-button
            class="secondary-btn see-locations right-align"
            @tap="${this.openLocationsDialog}"
            ?hidden="${this.hideActionButtons(this.editMode, this.canEditLocations)}"
            ?disabled="${this._isEmpty(this.flatLocations)}"
            title="See all locations"
          >
            <iron-icon icon="add"></iron-icon>
            See all
          </paper-button>
        </div>

        ${this.renderActions(this.editMode, this.canEditLocations)}
      </etools-content-panel>
    `;
  }

  private locationsDialog!: GroupedLocationsDialog;

  @property({type: String})
  flatLocations!: string[];

  @property({type: Object})
  originalLocations = [];

  @property({type: Array})
  locations!: Locations[];

  @property({type: Boolean})
  showLoading = false;

  @property({type: Boolean})
  canEditLocations!: boolean;

  @property({type: Object})
  permissions!: Permission<LocationsPermissions>;

  connectedCallback() {
    super.connectedCallback();
  }

  stateChanged(state: any) {
    if (!isJsonStrMatch(this.locations, state.commonData!.locations)) {
      this.locations = [...state.commonData!.locations];
    }

    if (state.interventions.current) {
      this.permissions = selectLocationsPermissions(state);
      this.setCanEditLocations(this.permissions.edit);
    }
  }

  setCanEditLocations(editPermissions: LocationsPermissions) {
    this.canEditLocations = editPermissions.locations;
  }

  locationsChanged(event: CustomEvent) {
    this.flatLocations = event.detail.selectedItems.map((i: any) => i.id);
  }

  private openLocationsDialog() {
    this.createDialog();
    this.locationsDialog.adminLevel = null;
    this.locationsDialog.interventionLocationIds = this.flatLocations;
    (this.locationsDialog as GroupedLocationsDialog).openDialog();
  }

  createDialog() {
    this.locationsDialog = document.createElement('grouped-locations-dialog') as GroupedLocationsDialog;
    this.locationsDialog.setAttribute('id', 'groupedLocDialog');
    this.locationsDialog.toastEventSource = this;
    document.querySelector('body')!.appendChild(this.locationsDialog);
  }

  _isEmpty(array) {
    if (array) {
      return !array.length;
    }
  }

  cancelLocations() {
    Object.assign(this.locations, this.originalLocations);
    this.locations = cloneDeep(this.originalLocations);
    this.editMode = false;
  }

  saveLocations() {
    this.editMode = false;
  }

  renderActions(editMode: boolean, canEditLocations: boolean) {
    if (!this.hideActionButtons(editMode, canEditLocations)) {
      return html`
        <div class="layout-horizontal right-align row-padding-v">
          <paper-button class="default" @tap="${this.cancelLocations}">
            Cancel
          </paper-button>
          <paper-button class="primary" @tap="${this.saveLocations}">
            Save
          </paper-button>
        </div>
      `;
    } else {
      return html``;
    }
  }
}
