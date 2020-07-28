import '@polymer/paper-button/paper-button';

import {SharedStylesLit} from '../../../styles/shared-styles-lit';
import '../../../common/layout/page-content-header/page-content-header';
import '../../../common/layout/etools-tabs';
// eslint-disable-next-line max-len
import {pageContentHeaderSlottedStyles} from '../../../common/layout/page-content-header/page-content-header-slotted-styles';
import '../../../common/layout/status/etools-status';

import {updateAppLocation} from '../../../../routing/routes';
import {customElement, LitElement, html, property} from 'lit-element';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import {RouteDetails} from '../../../../routing/router';
import cloneDeep from 'lodash-es/cloneDeep';
import get from 'lodash-es/get';
import {isJsonStrMatch} from '../../../utils/utils';
import {setStore, getStore} from './utils/redux-store-access';
import {currentPage, currentSubpage} from './common/selectors';
import {elevationStyles} from './common/styles/elevation-styles';
import {AnyObject} from './common/models/globals.types';
import {getIntervention} from './common/actions';

/**
 * @LitElement
 * @customElement
 */
@customElement('intervention-tabs')
export class InterventionTabs extends LitElement {
  static get styles() {
    return [elevationStyles, pageLayoutStyles, pageContentHeaderSlottedStyles];
  }

  render() {
    // main template
    // language=HTML
    return html`
      ${SharedStylesLit}
      <style>
        etools-status {
          justify-content: center;
        }
      </style>
      <etools-status></etools-status>

      <page-content-header with-tabs-visible>
        <h1 slot="page-title">Title here</h1>

        <div slot="title-row-actions" class="content-header-actions">
          <paper-button raised>Action 1</paper-button>
          <paper-button raised>Action 2</paper-button>
        </div>

        <etools-tabs
          slot="tabs"
          .tabs="${this.pageTabs}"
          .activeTab="${this.activeTab}"
          @iron-select="${this.handleTabChange}"
        ></etools-tabs>
      </page-content-header>

      <div class="page-content">
        <intervention-details ?hidden="${!this.isActiveTab(this.activeTab, 'details')}"> </intervention-details>
        <intervention-overview ?hidden="${!this.isActiveTab(this.activeTab, 'overview')}"> </intervention-overview>
        <intervention-results ?hidden="${!this.isActiveTab(this.activeTab, 'results')}"> </intervention-results>
        <intervention-timing ?hidden="${!this.isActiveTab(this.activeTab, 'timing')}"> </intervention-timing>
        <intervention-management ?hidden="${!this.isActiveTab(this.activeTab, 'management')}">
        </intervention-management>
        <intervention-attachments ?hidden="${!this.isActiveTab(this.activeTab, 'attachments')}">
        </intervention-attachments>
      </div>
    `;
  }

  @property({type: Array})
  pageTabs = [
    {
      tab: 'overview',
      tabLabel: 'Overview',
      hidden: false
    },
    {
      tab: 'details',
      tabLabel: 'Details',
      hidden: false
    },
    {
      tab: 'results',
      tabLabel: 'Results',
      hidden: false
    },
    {
      tab: 'timing',
      tabLabel: 'Timing',
      hidden: false
    },
    {
      tab: 'management',
      tabLabel: 'Management',
      hidden: false
    },
    {
      tab: 'attachments',
      tabLabel: 'Attachments',
      hidden: false
    }
  ];

  @property({type: String})
  activeTab = 'details';

  @property({type: Object})
  intervention!: AnyObject;

  _storeUnsubscribe!: () => void;
  _store!: AnyObject;

  @property({type: Object})
  get store() {
    return this._store;
  }

  set store(parentAppReduxStore: any) {
    setStore(parentAppReduxStore);
    this._storeUnsubscribe = getStore().subscribe(() => this.stateChanged(getStore().getState()));
    this.stateChanged(getStore().getState());
    this._store = parentAppReduxStore;
  }

  /*
   * Used to avoid unnecessary get intervention request
   */
  _routeDetails!: RouteDetails;

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    this._storeUnsubscribe();
    super.disconnectedCallback();
  }

  isActiveTab(tab: string, expectedTab: string): boolean {
    return tab === expectedTab;
  }

  public stateChanged(state: any) {
    if (currentPage(state) === 'interventions' && currentSubpage(state) !== 'list') {
      this.activeTab = currentSubpage(state) as string;

      const currentInterventionId = get(state, 'app.routeDetails.params.interventionId');
      const currentIntervention = get(state, 'interventions.current');
      if (currentInterventionId !== String(get(this.intervention, 'id'))) {
        if (currentIntervention) {
          if (!isJsonStrMatch(this.intervention, currentIntervention)) {
            this.intervention = cloneDeep(currentIntervention);
          }
        }
        if (!isJsonStrMatch(state.app!.routeDetails!, this._routeDetails)) {
          this._routeDetails = cloneDeep(state.app!.routeDetails);
          getStore().dispatch(getIntervention(currentInterventionId));
        }
      }
    }
  }

  handleTabChange(e: CustomEvent) {
    const newTabName: string = e.detail.item.getAttribute('name');
    if (newTabName === this.activeTab) {
      return;
    }
    this.tabChanged(newTabName, this.activeTab);
  }

  tabChanged(newTabName: string, oldTabName: string | undefined) {
    if (oldTabName === undefined) {
      // page load, tab init, component is gonna be imported in loadPageComponents action
      return;
    }
    if (newTabName !== oldTabName) {
      const newPath = `interventions/${this.intervention.id}/${newTabName}`;
      // if (this.routeDetails.path === newPath) {
      //   return; // Is this needed???
      // }
      // go to new tab
      updateAppLocation(newPath, true);
    }
  }
}
