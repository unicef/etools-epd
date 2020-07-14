import {customElement, html, LitElement, property} from 'lit-element';
import {connect} from '../../utils/store-subscribe-mixin';
import '@polymer/paper-button/paper-button';
import '@unicef-polymer/etools-dropdown/etools-dropdown-multi';
import '../grouped-locations-dialog/grouped-locations-dialog';
import {GroupedLocationsDialog} from '../grouped-locations-dialog/grouped-locations-dialog';

import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import {buttonsStyles} from '../../common/styles/button-styles';
import {Intervention} from '../../common/models/intervention-types';
import {sharedStyles} from '../../common/styles/shared-styles-lit';
import {RootState} from '../../../../../../redux/store';
import {isJsonStrMatch} from '../../../../../utils/utils';
import get from 'lodash-es/get';

/**
 * @customElement
 */
@customElement('geographical-coverage')
export class GeographicalCoverage extends connect(LitElement) {
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
      </style>

      <etools-content-panel show-expand-btn panel-title="Geographical Coverage">
        <div class="row-h flex-c">
          <etools-dropdown-multi
            id="locations"
            label="Location(s)"
            placeholder="&#8212;"
            .options="${this.locations}"
            .selected-values="${this.flatLocations}"
            option-label="name"
            option-value="id"
            error-message="Please select locations"
            disable-on-focus-handling
            trigger-value-change-event
            @etools-selected-items-changed="${this.locationsChanged}"
          >
          </etools-dropdown-multi>
          <paper-button
            class="secondary-btn see-locations"
            @tap="${this.openLocationsDialog}"
            title="See all locations"
          >
            <iron-icon icon="add"></iron-icon>
            See all
          </paper-button>
        </div>
      </etools-content-panel>
    `;
  }

  private locationsDialog!: GroupedLocationsDialog;

  @property({type: String})
  flatLocations!: string[];

  @property({type: Object})
  originalIntervention!: Intervention;

  @property({type: Array})
  locations!: Location[];

  connectedCallback() {
    super.connectedCallback();
    this.createDialog();
  }

  stateChanged(state: RootState) {
    if (!isJsonStrMatch(this.locations, state.commonData!.locations)) {
      this.locations = [...state.commonData!.locations];
    }
  }

  locationsChanged(event: CustomEvent) {
    this.intervention.flat_locations = event.detail.selectedItems.map((i: any) => i.id);
  }

  private openLocationsDialog() {
    this.locationsDialog.adminLevel = null;
    this.locationsDialog.interventionLocationIds = this.intervention.flat_locations;
    (this.locationsDialog as GroupedLocationsDialog).openDialog();
  }

  createDialog() {
    this.locationsDialog = document.createElement('grouped-locations-dialog') as GroupedLocationsDialog;
    this.locationsDialog.setAttribute('id', 'groupedLocDialog');
    this.locationsDialog.toastEventSource = this;
    document.querySelector('body')!.appendChild(this.locationsDialog);
  }

  _isEmpty(length: number) {
    return !length;
  }
}
