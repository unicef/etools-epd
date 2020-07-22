import {LitElement, customElement, html, property} from 'lit-element';
import {AnyObject} from '../../../../../types/globals';
import get from 'lodash-es/get';
import './reporting-requirements/partner-reporting-requirements';
import cloneDeep from 'lodash-es/cloneDeep';
import {connect} from '../utils/store-subscribe-mixin';
import './intervention-dates/intervention-dates';

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
      <partner-reporting-requirements class="content-section"> </partner-reporting-requirements>
      <intervention-dates></intervention-dates>
    `;
  }

  @property({type: Object})
  intervention!: AnyObject;

  stateChanged(state: any) {
    // move this to component
    console.log('--------------------------------------------------------------');
    const currentIntervention = get(state, 'interventions.current');
    this.intervention = cloneDeep(currentIntervention);
  }
}
