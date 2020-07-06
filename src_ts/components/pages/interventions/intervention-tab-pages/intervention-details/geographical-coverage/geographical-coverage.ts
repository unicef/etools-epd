import {LitElement, html, property, customElement} from 'lit-element';
import {connect} from '../../utils/store-subscribe-mixin';
import '@polymer/paper-button/paper-button';
import '@unicef-polymer/etools-dropdown/etools-dropdown-multi';
import '../grouped-locations-dialog/grouped-locations-dialog';
import {GroupedLocationsDialog} from '../grouped-locations-dialog/grouped-locations-dialog';

import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import {buttonsStyles} from '../../common/styles/button-styles';
import {Intervention} from '../../common/intervention-types';

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
      <style>
        /* CSS rules for your element */
      </style>

      <etools-content-panel show-expand-btn panel-title="Geographical Coverage">
        <div class="row-h flex-c">
          <etools-dropdown-multi
            id="locations"
            label="Location(s)"
            placeholder="&#8212;"
            .options="${this.locations}"
            option-label="name"
            option-value="id"
            error-message="Please select locations"
            disable-on-focus-handling
          >
          </etools-dropdown-multi>
          <paper-button
            class="secondary-btn see-locations"
            @tap="${this.openLocationsDialog}"
            title="See all locations"
            ?disabled="${this._isEmpty(intervention.flat_locations.length)}"
          >
            <iron-icon icon="add"></iron-icon>
            See all
          </paper-button>
        </div>
      </etools-content-panel>
    `;
  }

  private locationsDialog!: GroupedLocationsDialog;

  @property({
    type: Object
    // @ts-ignore
  })
  intervention!: Intervention;

  @property({type: Object})
  originalIntervention!: Intervention;

  @property({type: Array})
  locations: Location[] = [{id: '1107', name: 'Aaba [Village - LBN54001]', p_code: 'LBN54001'}];

  connectedCallback() {
    super.connectedCallback();
  }

  private openLocationsDialog() {
    if (!this.locationsDialog) {
      this.createDialog();
      (this.locationsDialog as GroupedLocationsDialog).openDialog();
    }
    (this.locationsDialog as GroupedLocationsDialog).openDialog();
  }

  createDialog() {
    this.locationsDialog = document.createElement('external-individual-dialog') as GroupedLocationsDialog;
    this.locationsDialog.setAttribute('id', 'groupedLocDialog');
    this.locationsDialog.toastEventSource = this;
    document.querySelector('body')!.appendChild(this.locationsDialog);
  }
}
