import {css, CSSResultArray, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {gridLayoutStylesLit} from '../../../../common/styles/grid-layout-styles-lit';
import {sharedStyles} from '../../../../common/styles/shared-styles-lit';
import {buttonsStyles} from '../../../../common/styles/button-styles';
import '@polymer/paper-radio-group';
import '@polymer/paper-radio-button';
import {Indicator, IndicatorIndicator} from '../../../../common/models/intervention.types';
import {PaperCheckboxElement} from '@polymer/paper-checkbox/paper-checkbox';
import {fireEvent} from '../../../../utils/fire-custom-event';
import {LocationObject} from '../../../../common/models/globals.types';

const numberPattern = '(^\\d+(\\.?\\d+)?$)|(^\\d+(,?\\d+)?$)';
const digitsPattern = '^\\d+';
const digitsNotStartingWith0Pattern = '^[1-9]{1}(\\d+)?$';

@customElement('non-cluster-indicator')
export class NonClusterIndicator extends LitElement {
  @property() isReadonly = false;
  @property() baselineIsUnknown = true;
  @property() interventionStatus = '';
  @property() locations = [];

  get isRatioType(): boolean {
    const displayType: string = (this.indicator.indicator && this.indicator.indicator.display_type) || '';
    return displayType === 'ratio' && this.indicatorUnit === 'percentage';
  }

  get indicatorUnit(): string {
    return (this.indicator.indicator && this.indicator.indicator.unit) || '';
  }

  get isReadonlyDenominator(): boolean {
    return Boolean(this.interventionStatus && this.interventionStatus.toLowerCase() === 'active' && this.indicator.id);
  }

  get indicator(): Partial<Indicator> {
    return this._indicator;
  }
  set indicator(indicator: Partial<Indicator>) {
    if (!indicator) {
      return;
    }
    this._indicator = indicator;
    const baselineValue = (indicator.baseline && indicator.baseline.v) || null;
    this.baselineIsUnknown = Boolean(indicator.id && baselineValue === null);
    this.isReadonly = Boolean(indicator.id);
  }

  @property() private _indicator!: Partial<Indicator>;

  static get styles(): CSSResultArray {
    // language=css
    return [
      gridLayoutStylesLit,
      buttonsStyles,
      css`
        :host {
          display: block;
          border: 1px solid var(--main-border-color);
        }
        .row-h {
          padding: 8px 24px;
        }
      `
    ];
  }

  protected render(): TemplateResult {
    return html`
      <style>
        ${sharedStyles} *[hidden] {
          display: none !important;
        }

        .radioGroup {
          width: 320px;
        }

        paper-input,
        paper-textarea {
          display: inline-block;
          width: 100%;
        }

        paper-textarea {
          --paper-input-container-input: {
            display: block;
          }
        }

        .unknown {
          padding-left: 24px;
          padding-bottom: 16px;
        }

        .no-left-padding {
          padding-left: 0px !important;
        }

        .dash-separator {
          padding: 0 8px 0 8px;
          margin-bottom: 10px;
        }

        .add-locations {
          padding-right: 0;
          @apply --layout-end;
          padding-bottom: 12px;
        }
      </style>

      <div class="row-h flex-c">
        <div class="layout-vertical">
          <label class="paper-label">Type </label>
          <div class="radioGroup">
            <paper-radio-group
              .selected="${this.indicatorUnit}"
              @iron-select="${({detail}: CustomEvent) => this.updateInnerIndicatorField('unit', detail.item.name)}"
            >
              <paper-radio-button ?disabled="${this.isReadonly}" class="no-left-padding" name="number"
                >Quantity / Scale
              </paper-radio-button>
              <paper-radio-button ?disabled="${this.isReadonly}" name="percentage">Percent/Ratio</paper-radio-button>
            </paper-radio-group>
          </div>
        </div>
        <div class="layout-vertical" ?hidden="${this.unitIsNumeric(this.indicatorUnit)}">
          <label class="paper-label">Display Type </label>
          <div class="radioGroup">
            <paper-radio-group
              .selected="${this.indicator.indicator && this.indicator.indicator.display_type}"
              @iron-select="${({detail}: CustomEvent) =>
                this.updateInnerIndicatorField('display_type', detail.item.name)}"
            >
              <paper-radio-button ?disabled="${this.isReadonly}" class="no-left-padding" name="percentage"
                >Percentage
              </paper-radio-button>
              <paper-radio-button ?disabled="${this.isReadonly}" name="ratio">Ratio</paper-radio-button>
            </paper-radio-group>
          </div>
        </div>
      </div>
      <div class="row-h flex-c">
        <paper-input
          id="titleEl"
          required
          label="Indicator"
          value="${(this.indicator.indicator && this.indicator.indicator.title) || ''}"
          placeholder="&#8212;"
          error-message="Please add a title"
          auto-validate
          ?readonly="${this.isReadonly}"
          @value-changed="${({detail}: CustomEvent) => this.updateInnerIndicatorField('title', detail.value)}"
        >
        </paper-input>
      </div>

      <!-- Baseline & Target -->
      <div class="row-h flex-c" ?hidden="${this.unitIsNumeric(this.indicatorUnit)}">
        <div class="col col-3">
          <paper-input
            id="numeratorLbl"
            label="Numerator Label"
            value="${this.indicator.numerator_label || ''}"
            placeholder="&#8212;"
            @value-changed="${({detail}: CustomEvent) => this.updateIndicatorField('numerator_label', detail.value)}"
          >
          </paper-input>
        </div>
        <div class="col col-3">
          <paper-input
            id="denomitorLbl"
            label="Denominator Label"
            value="${this.indicator.denominator_label || ''}"
            placeholder="&#8212;"
            @value-changed="${({detail}: CustomEvent) => this.updateIndicatorField('denominator_label', detail.value)}"
          >
          </paper-input>
        </div>
      </div>
      <div class="row-h flex-c">
        ${!this.isRatioType
          ? html`
              <div class="col col-3">
                <paper-input
                  id="${this.unitIsNumeric(this.indicatorUnit) ? 'baselineNumeric' : 'baselineNonNumeric'}"
                  label="Baseline"
                  .value="${this.indicator.baseline && this.indicator.baseline.v}"
                  .allowed-pattern="${this.unitIsNumeric(this.indicatorUnit) ? '[0-9.,]' : '[0-9]'}"
                  pattern="${this.unitIsNumeric(this.indicatorUnit) ? numberPattern : digitsPattern}"
                  auto-validate
                  error-message="Invalid number"
                  placeholder="&#8212;"
                  ?disabled="${this.baselineIsUnknown}"
                  @value-changed="${({detail}: CustomEvent) => this.updateBaseOrTarget('baseline', 'v', detail.value)}"
                >
                </paper-input>
              </div>
              <div class="col col-3">
                <paper-input
                  id="${this.unitIsNumeric(this.indicatorUnit)
                    ? 'targetElForNumericUnit'
                    : 'targetElForNonNumericUnit'}"
                  label="Target"
                  .value="${this.indicator.target && this.indicator.target.v}"
                  .allowed-pattern="${this.unitIsNumeric(this.indicatorUnit) ? '[0-9.,]' : '[0-9]'}"
                  pattern="${this.unitIsNumeric(this.indicatorUnit) ? numberPattern : digitsPattern}"
                  auto-validate
                  error-message="Please add a valid target"
                  placeholder="&#8212;"
                  @value-changed="${({detail}: CustomEvent) => this.updateBaseOrTarget('target', 'v', detail.value)}"
                >
                </paper-input>
              </div>
            `
          : html`
              <div class="col-3 layout-horizontal">
                <paper-input
                  id="baselineNumerator"
                  label="Baseline"
                  .value="${this.indicator.baseline && this.indicator.baseline.v}"
                  allowed-pattern="[0-9]"
                  .pattern="${digitsNotStartingWith0Pattern}"
                  auto-validate
                  error-message="Invalid"
                  placeholder="Numerator"
                  ?disabled="${this.baselineIsUnknown}"
                  @value-changed="${({detail}: CustomEvent) => this.updateBaseOrTarget('baseline', 'v', detail.value)}"
                >
                </paper-input>
                <div class="layout-horizontal bottom-aligned dash-separator">/</div>
                <paper-input
                  id="baselineDenominator"
                  .value="${this.indicator.baseline && this.indicator.baseline.d}"
                  allowed-pattern="[0-9]"
                  .pattern="${digitsNotStartingWith0Pattern}"
                  auto-validate
                  error-message="Invalid"
                  placeholder="Denominator"
                  ?disabled="${this.baselineIsUnknown}"
                  @value-changed="${({detail}: CustomEvent) => this.updateBaseOrTarget('baseline', 'd', detail.value)}"
                >
                </paper-input>
              </div>
              <div class="col col-3">
                <paper-input
                  label="Target"
                  id="targetNumerator"
                  .value="${this.indicator.target && this.indicator.target.v}"
                  allowed-pattern="[0-9]"
                  .pattern="${digitsNotStartingWith0Pattern}"
                  auto-validate
                  required
                  error-message="Invalid"
                  placeholder="Numerator"
                  @value-changed="${({detail}: CustomEvent) => this.updateBaseOrTarget('target', 'v', detail.value)}"
                >
                </paper-input>
                <div class="layout-horizontal bottom-aligned dash-separator">/</div>
                <paper-input
                  id="targetDenominator"
                  .value="${this.indicator.target && this.indicator.target.d}"
                  required
                  allowed-pattern="[0-9]"
                  .pattern="${digitsNotStartingWith0Pattern}"
                  auto-validate
                  error-message="Empty or < 1"
                  placeholder="Denominator"
                  ?readonly="${this.isReadonlyDenominator}"
                  @value-changed="${({detail}: CustomEvent) => this.updateBaseOrTarget('target', 'd', detail.value)}"
                >
                </paper-input>
              </div>
            `}
        <div class="col col-6">
          <paper-toggle-button
            ?checked="${this.indicator.is_high_frequency}"
            @checked-changed="${({detail}: CustomEvent) =>
              this.updateIndicatorField('is_high_frequency', detail.value)}"
          >
            High Frequency Humanitarian Indicator
          </paper-toggle-button>
        </div>
      </div>
      <div class="unknown">
        <paper-checkbox
          ?checked="${this.baselineIsUnknown}"
          @change="${(event: CustomEvent) =>
            (this.baselineIsUnknown = Boolean((event.target as PaperCheckboxElement).checked))}"
        >
          Unknown
        </paper-checkbox>
      </div>
      <!-- Baseline & Target -->
      <div class="row-h flex-c">
        <paper-textarea
          label="Means of Verification"
          type="text"
          .value="${this.indicator.means_of_verification}"
          placeholder="&#8212;"
          @value-changed="${({detail}: CustomEvent) =>
            this.updateIndicatorField('means_of_verification', detail.value)}"
        >
        </paper-textarea>
      </div>
      <div class="row-h flex-c">
        <etools-dropdown-multi
          id="locationsDropdw"
          label="Locations"
          placeholder="&#8212;"
          .selectedValues="${this.indicator.locations || []}"
          .options="${this.locations}"
          option-label="name"
          option-value="id"
          required
          auto-validate
          error-message="Please select locations"
          disable-on-focus-handling
          @etools-selected-items-changed="${({detail}: CustomEvent) => this.onLocationsSelected(detail.selectedItems)}"
          trigger-value-change-event
        >
        </etools-dropdown-multi>
        <paper-button
          class="secondary-btn add-locations"
          @click="${() => this.onLocationsSelected(this.locations)}"
          title="Add all locations"
        >
          Add all
        </paper-button>
      </div>
    `;
  }

  unitIsNumeric(unit: string) {
    return unit === 'number';
  }

  updateIndicatorField(field: keyof Indicator, value: any): void {
    this._indicator[field] = value;
    fireEvent(this, 'indicator-changed', {...this.indicator});
  }

  updateInnerIndicatorField(field: keyof IndicatorIndicator, value: any): void {
    if (!this._indicator.indicator) {
      this._indicator.indicator = {} as IndicatorIndicator;
    }
    this._indicator.indicator[field] = value as never;
    fireEvent(this, 'indicator-changed', {...this.indicator});
  }

  updateBaseOrTarget(type: 'baseline' | 'target', field: 'v' | 'd', value: number | string): void {
    if (!this._indicator[type]) {
      this._indicator[type] = {d: ''};
    }
    this._indicator[type]![field] = value;
    fireEvent(this, 'indicator-changed', {...this.indicator});
  }

  onLocationsSelected(locations: LocationObject[]): void {
    const ids: string[] = locations.map(({id}: LocationObject) => id);
    this.updateIndicatorField('locations', ids);
  }
}
