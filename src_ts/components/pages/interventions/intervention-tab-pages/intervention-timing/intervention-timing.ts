import {LitElement, customElement, html, property} from 'lit-element';
import {AnyObject} from '../../../../../types/globals';
import get from 'lodash-es/get';
import './reporting-requirements/partner-reporting-requirements';
import cloneDeep from 'lodash-es/cloneDeep';
import {connect} from '../utils/store-subscribe-mixin';

/**
 * @customElement
 */
@customElement('intervention-timing')
export class InterventionTiming extends connect(LitElement) {
  render() {
    // language=HTML
    return html`
      <style></style>

      Timing page
      <partner-reporting-requirements
        class="content-section"
        intervention-id="${this.intervention.id}"
        intervention-start="${this.intervention.start}"
        intervention-end="${this.intervention.end}"
        expected-results="${this.intervention.result_links}"
      >
      </partner-reporting-requirements>
    `;
  }

  @property({type: Object})
  intervention!: AnyObject;

  stateChanged(state: any) {
    console.log('--------------------------------------------------------------');
    const currentIntervention = get(state, 'interventions.current');
    this.intervention = cloneDeep(currentIntervention);
  }
}
