import {LitElement, html, property, customElement} from 'lit-element';
import {connect} from '../../utils/store-subscribe-mixin';
import {Location} from '../geographical-coverage/geographicalCoverage.models';
import EtoolsDialog from '@unicef-polymer/etools-dialog/etools-dialog';
import {isJsonStrMatch} from '../../../../../utils/utils';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import {buttonsStyles} from '../../common/styles/button-styles';

class GroupedLocations {
  adminLevelLocation: Location | null = null;
  subordinateLocations: Location[] = [];
}

/**
 * @customElement
 */
@customElement('grouped-locations-dialog')
export class GroupedLocationsDialog extends connect(LitElement) {
  static get styles() {
    return [gridLayoutStylesLit, buttonsStyles];
  }

  render() {
    // language=HTML
    return html`
      <style>
        [hidden] {
          display: none !important;
        }

        etools-dialog {
          --etools-dialog-scrollable: {
            min-height: 300px;
            font-size: 16px;
          }
        }

        .adminLevelLoc {
          color: var(--primary-color);
          font-weight: bold;
        }

        .left-padding {
          padding-left: 16px;
        }

        .top-padding {
          padding-top: 16px;
        }

        .child-bottom-padding {
          padding-bottom: 8px;
        }

        .parent-padding {
          padding-bottom: 8px;
          padding-top: 8px;
        }

        .bordered-div {
          border: solid 1px var(--error-box-border-color);
          background-color: var(--error-box-bg-color);
          padding: 10px;
          margin: 16px 0px;
        }

        div.child-bottom-padding:last-of-type {
          padding-bottom: 0px;
        }
      </style>

      <etools-dialog
        id="groupedLocDialog"
        size="md"
        dialog-title="Locations PD/SSFA Covers"
        hide-confirm-btn
        ?opened="${this.dialogOpened}"
        @close="${() => this.closeDialog()}"
      >
        <etools-dropdown
          id="adminLevelsDropdw"
          label="Group Locations By"
          .selected="${this.adminLevel}"
          placeholder="&#8212;"
          .options="${this.adminLevels}"
          option-label="name"
          option-value="name"
          disable-on-focus-handling
        >
        </etools-dropdown>

        <div class="bordered-div" ?hidden="${!this.message}">
          [[message]]
        </div>

        <div class="row-padding-v" ?hidden="${this.adminLevel}">
          ${this.interventionLocations.map((item: Location) => html`<div class="top-padding">- ${item.name}</div>`)}
        </div>
        <div class="row-padding-v" ?hidden="${!this.adminLevel}">
          ${this.groupedLocations.map(item => html`
            <div class="parent-padding">
              <div class="adminLevelLoc">${item.adminLevelLocation.name}</div>
              <div class="left-padding">
                ${item.subordinateLocations.map(sub => html`
                  <div class="child-bottom-padding">
                    - ${sub.name}
                  </div>
                `)}
              </div>
            </div>
          `)}
        </div>
      </etools-dialog>
    `;
  }

  @property({
    type: Array,
    observer: GroupedLocationsDialog.prototype.adminLevelsChanged
  })
  adminLevels!: {id: number; name: string; admin_level: any}[];

  @property({
    type: String,
    observer: GroupedLocationsDialog.prototype.adminLevelChanged
  })
  adminLevel!: string | null;

  @property({type: Array})
  locations!: Location[];

  @property({type: Array})
  interventionLocations!: Location[];

  @property({
    type: Array,
    // @ts-ignore
    observer: GroupedLocationsDialog.prototype.interventionLocationIdsChanged
  })
  interventionLocationIds!: [];

  @property({type: Array})
  groupedLocations!: GroupedLocations[] | null;

  @property({type: String})
  message = '';

  @property({type: Boolean, reflect: true})
  dialogOpened = false;

  @property({type: Object})
  toastEventSource!: LitElement;

  stateChanged(state) {
    if (!isJsonStrMatch(this.locations, state.commonData!.locations)) {
      this.locations = [...state.commonData!.locations];
    }
    if (!isJsonStrMatch(this.adminLevels, state.commonData!.locationTypes)) {
      this.adminLevels = [...state.commonData!.locationTypes];
    }
  }

  connectedCallback() {
    // TODO: remove dummy data
    super.connectedCallback();
    this.adminLevels = [{admin_level: null, id: 1, name: "School"}, {admin_level: null, id: 2, name: "Community Center"}]
    this.locations = [{id: '1107', name: 'Aaba [Village - LBN54001]', p_code: 'LBN54001'}];
    this.interventionLocations = [{id: '1107', name: 'Aaba [Village - LBN54001]', p_code: 'LBN54001'}];
    this.groupedLocations = [{adminLevelLocation: {gateway: {admin_level: null, created: "2019-02-07T15:50:29.685383Z", id: 1, modified: "2019-02-07T15:50:29.807718Z", name: "School"},id: "4415", name: "Aaba Intermediate Public School [School - 1156]", p_code: "1156"}, subordinateLocations: []}]
  }

  public openDialog() {
    this.dialogOpened = true;
  }

  adminLevelsChanged(adminLevels: any) {
    if (!adminLevels || !adminLevels.length) {
      return;
    }
    this._removeCountry(adminLevels);
  }

  _removeCountry(adminLevels: any) {
    const index = adminLevels.findIndex(function (al: any) {
      return al.name === 'Country';
    });
    if (index > -1) {
      adminLevels.splice(index, 1);
      const aux = JSON.parse(JSON.stringify(adminLevels));
      this.adminLevels = [];
      this.adminLevels = aux;
    }
  }

  interventionLocationIdsChanged(locationIds: string[]) {
    if (!locationIds || !locationIds.length || !this.locations) {
      this.interventionLocations = [];
      return;
    }
    this._setInterventionLocationsDetails(locationIds);
  }

  _setInterventionLocationsDetails(locationIds: any[]) {
    locationIds = locationIds.map(function (loc) {
      return parseInt(loc);
    });
    const interventionLocations: Location[] = this.locations.filter(function (loc: any) {
      return locationIds.indexOf(parseInt(loc.id)) > -1;
    });

    this.interventionLocations = [];
    this.interventionLocations = interventionLocations;
  }

  adminLevelChanged(selectedAdminLevel: any) {
    this.message = '';
    const groupedLocations: GroupedLocations[] = [];
    const locationsUnableToGroup = [];

    if (!selectedAdminLevel) {
      this.groupedLocations = null;
      return;
    }
    let i;
    // Build grouped locations structure
    for (i = 0; i < this.interventionLocations.length; i++) {
      const grouping = new GroupedLocations();

      if (this.interventionLocations[i].gateway.name === selectedAdminLevel) {
        // gateway.name is location_type
        grouping.adminLevelLocation = this.interventionLocations[i];
        groupedLocations.push(grouping);
        continue;
      }

      // Find admin level parent location
      const adminLevelLocation = this._findAdminLevelParent(this.interventionLocations[i], selectedAdminLevel);
      if (!adminLevelLocation) {
        locationsUnableToGroup.push(this.interventionLocations[i].name);
        continue;
      }
      // Check if admin level parent Location is already a parent to another intervention location
      const existingGroup = this._findInGroupedLocations(groupedLocations, adminLevelLocation);
      if (!existingGroup) {
        groupedLocations.push({
          adminLevelLocation: adminLevelLocation,
          subordinateLocations: [this.interventionLocations[i]]
        });
      } else {
        existingGroup.subordinateLocations.push(this.interventionLocations[i]);
      }
    }

    if (locationsUnableToGroup && locationsUnableToGroup.length) {
      this.message = 'Locations unable to group: ' + locationsUnableToGroup.join(', ');
    }

    this.groupedLocations = groupedLocations;

    (this.$.groupedLocDialog as EtoolsDialog).notifyResize();
  }

  _findInGroupedLocations(groupedLocations: GroupedLocations[], adminLevelLocation: any) {
    if (!groupedLocations || !groupedLocations.length) {
      return null;
    }
    const existingGroup = groupedLocations.find(function (g) {
      return parseInt((g.adminLevelLocation!.id as unknown) as string) === parseInt(adminLevelLocation.id);
    });

    if (!existingGroup) {
      return null;
    }
    return existingGroup;
  }

  _findAdminLevelParent(location: Location, adminLevel: string): Location | null {
    if (!location.parent) {
      return null;
    }
    const parentLoc: Location | undefined = this.locations.find(function (loc: any) {
      return parseInt(loc.id) === parseInt(location.parent as string);
    });
    if (!parentLoc) {
      return null;
    }
    if (parentLoc.gateway.name === adminLevel) {
      return parentLoc;
    }
    return this._findAdminLevelParent(parentLoc, adminLevel);
  }

  public closeDialog() {
    this.dialogOpened = false;
  }
}
