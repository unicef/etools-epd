import {LitElement, html, TemplateResult, customElement, CSSResultArray} from 'lit-element';
import '@unicef-polymer/etools-content-panel/etools-content-panel';
import {connect} from 'pwa-helpers/connect-mixin';
import {getStore} from '../../utils/redux-store-access';
import {
  ExpectedResult,
  Intervention,
  InterventionActivity,
  InterventionActivityTimeframe,
  InterventionQuarter,
  ResultLinkLowerResult
} from '../../common/models/intervention.types';
import {GenericObject} from '../../common/models/globals.types';
import {ActivityTime, groupByYear, GroupedActivityTime, serializeTimeFrameData} from '../../utils/timeframes.helper';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import {ActivityTimeframesStyles} from './activity-timeframes.styles';

@customElement('activity-timeframes')
export class ActivityTimeframes extends connect(getStore())(LitElement) {
  static get styles(): CSSResultArray {
    // language=css
    return [gridLayoutStylesLit, ActivityTimeframesStyles];
  }

  private timeFrames: GroupedActivityTime[] = [];
  private mappedActivities: GenericObject<InterventionActivity[]> = {};
  private loadingInProcess = true;

  protected render(): TemplateResult {
    if (this.loadingInProcess) {
      return html``;
    }
    return html`
      <etools-content-panel panel-title="Activity Timeframes">
        <div class="layout-vertical align-items-center">
          ${this.timeFrames.map(
            ([year, frames]: GroupedActivityTime, index: number) => html`
              <div class="layout-horizontal align-items-center time-frames">
                <!--      Year title        -->
                <div class="year">${year}</div>

                <div class="frames-grid">
                  ${frames.map(
                    ({name, frameDisplay}: ActivityTime, index: number) => html`
                      <!--   Frame data   -->
                      <div class="frame ${index === frames.length - 1 ? 'hide-border' : ''}">
                        <div class="frame-name">${name}</div>
                        <div class="frame-dates">${frameDisplay}</div>
                      </div>

                      <div class="activities-container ${index === frames.length - 1 ? 'hide-border' : ''}">
                        <div class="no-activities" ?hidden="${this.mappedActivities[name].length}">- No Activities</div>
                        ${this.mappedActivities[name].map(
                          ({name: activityName}: InterventionActivity) => html`
                            <div class="activity-name">Activity ${activityName}</div>
                          `
                        )}
                      </div>
                    `
                  )}
                </div>
              </div>
              <div class="year-divider" ?hidden="${index === this.timeFrames.length - 1}"></div>
            `
          )}
        </div>
      </etools-content-panel>
    `;
  }

  stateChanged(state: any): void {
    const intervention: Intervention = state.interventions.current;
    if (!intervention) {
      return;
    }
    // process time frames
    const quarters: InterventionQuarter[] = intervention.quarters || [];
    const serialisedFrames: ActivityTime[] = serializeTimeFrameData(quarters as InterventionActivityTimeframe[]);
    this.timeFrames = groupByYear(serialisedFrames);

    // get activities array
    const pdOutputs: ResultLinkLowerResult[] = intervention.result_links
      .map(({ll_results}: ExpectedResult) => ll_results)
      .flat();
    const activities: InterventionActivity[] = pdOutputs
      .map(({activities}: ResultLinkLowerResult) => activities)
      .flat();

    // map activities to time frames
    const mappedActivities: GenericObject<InterventionActivity[]> = quarters.reduce(
      (data: GenericObject<InterventionActivity[]>, quarter: InterventionQuarter) => ({
        ...data,
        [quarter.name]: []
      }),
      {}
    );
    activities.forEach((activity: InterventionActivity) => {
      activity.time_frames.forEach(({name}: InterventionActivityTimeframe) => {
        mappedActivities[name].push(activity);
      });
    });
    this.mappedActivities = mappedActivities;

    this.loadingInProcess = false;
    this.performUpdate();
  }
}
