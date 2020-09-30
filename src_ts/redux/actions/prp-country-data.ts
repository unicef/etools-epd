import {LitElement, customElement} from 'lit-element';
// eslint-disable-next-line max-len
import EndpointsLitMixin from '../../components/pages/interventions/intervention-tab-pages/common/mixins/endpoints-mixin-lit';

@customElement('prp-country-data')
export class PrpCountryData extends EndpointsLitMixin(LitElement) {
  getPRPCountries() {
    return this.fireRequest('getPRPCountries', {});
  }
}
