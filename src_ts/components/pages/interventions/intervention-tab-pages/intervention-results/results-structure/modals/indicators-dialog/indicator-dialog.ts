import {customElement, LitElement, html, TemplateResult, property, CSSResultArray, css} from 'lit-element';
import './non-cluster-indicator';
import {fireEvent} from '../../../../utils/fire-custom-event';
import {Indicator} from '../../../../common/models/intervention.types';
import {LocationObject} from '../../../../common/models/globals.types';

@customElement('indicator-dialog')
export class IndicatorDialog extends LitElement {
  static get styles(): CSSResultArray {
    // language=css
    return [
      css`
        .container {
          padding: 8px;
        }
      `
    ];
  }
  @property() dialogOpened = true;
  @property() loadingInProcess = false;
  @property() locations: LocationObject[] = [];
  @property() indicator: Partial<Indicator> = new Indicator();
  protected render(): TemplateResult {
    return html`
      <etools-dialog
        size="lg"
        keep-dialog-open
        ?opened="${this.dialogOpened}"
        dialog-title="Activity Data"
        @confirm-btn-clicked="${() => this.processRequest()}"
        @close="${this.onClose}"
        .okBtnText="Save"
        no-padding
      >
        <etools-loading ?active="${this.loadingInProcess}" loading-text="Loading..."></etools-loading>
        <div class="container layout vertical">
          <non-cluster-indicator
            .indicator="${this.indicator}"
            .locations="${this.locations}"
            @indicator-changed="${({detail}: CustomEvent) => this.updateIndicator(detail)}"
          ></non-cluster-indicator></div
      ></etools-dialog>
    `;
  }

  onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }

  updateIndicator(indicator: Partial<Indicator>): void {
    const displayInPercentage = Boolean(
      indicator.indicator && indicator.indicator.unit === 'percentage' && indicator.indicator.display_type !== 'ratio'
    );
    const currentBase = indicator.baseline!.v;
    const currentTarget = indicator.target!.v;
    indicator.baseline!.v = displayInPercentage ? this.getBaseOrTarget(currentBase) : currentBase;
    indicator.target!.v = displayInPercentage ? this.getBaseOrTarget(currentTarget) : currentTarget;
    this.indicator = indicator;
  }

  processRequest(): void {}

  private getBaseOrTarget(value: any): number {
    value = parseInt(value, 10);
    if (isNaN(value) || value < 0) {
      return 0;
    }
    return value > 100 ? 100 : value;
  }
}
