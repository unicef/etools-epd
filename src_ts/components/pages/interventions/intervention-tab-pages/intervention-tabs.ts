import '@polymer/paper-button/paper-button';

import {SharedStylesLit} from '../../../styles/shared-styles-lit';
import '../../../common/layout/page-content-header/page-content-header';
import '../../../common/layout/etools-tabs';
// eslint-disable-next-line max-len
import {pageContentHeaderSlottedStyles} from '../../../common/layout/page-content-header/page-content-header-slotted-styles';
import '../../../common/layout/status/etools-status';

import {AnyObject} from '../../../../types/globals';
import {updateAppLocation} from '../../../../routing/routes';
import {customElement, LitElement, html, property} from 'lit-element';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import {elevationStyles} from '../../../styles/lit-styles/elevation-styles';
import {RouteDetails} from '../../../../routing/router';
import cloneDeep from 'lodash-es/cloneDeep';
import get from 'lodash-es/get';
import {isJsonStrMatch} from '../../../utils/utils';
import {getIntervention} from '../../../../redux/actions/interventions';
import {connect} from './common/store-subscribe-mixin';

/**
 * @LitElement
 * @customElement
 */
@customElement('intervention-tabs')
export class InterventionTabs extends connect(LitElement) {
  static get styles() {
    return [elevationStyles, pageLayoutStyles, pageContentHeaderSlottedStyles];
  }

  render() {
    // main template
    // language=HTML
    console.log('intervention-tabs');
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
        <intervention-details ?hidden="${!this.isActiveTab(this.activeTab, 'details')}" .store="${this.store}">
        </intervention-details>
        <intervention-overview ?hidden="${!this.isActiveTab(this.activeTab, 'overview')}" .store="${this.store}">
        </intervention-overview>
        <intervention-results ?hidden="${!this.isActiveTab(this.activeTab, 'results')}" .store="${this.store}">
        </intervention-results>
        <intervention-timing ?hidden="${!this.isActiveTab(this.activeTab, 'timing')}" .store="${this.store}">
        </intervention-timing>
        <intervention-management ?hidden="${!this.isActiveTab(this.activeTab, 'management')}" .store="${this.store}">
        </intervention-management>
        <intervention-attachments ?hidden="${!this.isActiveTab(this.activeTab, 'attachments')}" .store="${this.store}">
        </intervention-attachments>
      </div>
    `;
  }

  @property({type: Object})
  routeDetails!: RouteDetails;

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

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  isActiveTab(tab: string, expectedTab: string): boolean {
    return tab === expectedTab;
  }

  public stateChanged(state: any) {
    if (state.app!.routeDetails.routeName === 'interventions' && state.app!.routeDetails.subRouteName !== 'list') {
      this.activeTab = state.app!.routeDetails.subRouteName as string;

      if (get(state, 'interventions.current')) {
        const currentIntervention = state.interventions.current;
        if (!isJsonStrMatch(this.intervention, currentIntervention)) {
          this.intervention = cloneDeep(currentIntervention);
        }
      }
      const currentInterventionId = get(state, 'app.routeDetails.params.interventionId');
      if (currentInterventionId !== String(get(this.intervention, 'id'))) {
        this.store.dispatch(getIntervention(currentInterventionId));
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
      if (this.routeDetails.path === newPath) {
        return;
      }
      // go to new tab
      updateAppLocation(newPath, true);
    }
  }
}
