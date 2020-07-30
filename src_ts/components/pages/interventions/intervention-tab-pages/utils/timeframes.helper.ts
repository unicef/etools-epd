import {InterventionActivityTimeframe} from '../common/models/intervention.types';
import {GenericObject} from '../common/models/globals.types';

export type ActivityTime = {
  start: Date;
  end: Date;
  year: number;
  frameDisplay: string;
  frameName: string;
  enabled: boolean;
};

// @ts-ignore
const moment = window.moment;

export function serializeTimeFrameData(data: InterventionActivityTimeframe[]): ActivityTime[] {
  return (data || []).map((frame: InterventionActivityTimeframe, index: number) => {
    const start: Date = new Date(frame.start_date);
    const end: Date = new Date(frame.end_date);
    return {
      start,
      end,
      year: start.getFullYear(),
      frameDisplay: `${moment(start).format('DD MMM')} - ${moment(end).format('DD MMM')}`,
      frameName: `Q${index + 1}`,
      enabled: frame.enabled
    };
  });
}

export function convertActivityTimeToData(time: ActivityTime[]): InterventionActivityTimeframe[] {
  return time.map((timeData: ActivityTime) => ({
    start_date: moment(timeData.start).format('YYYY-MM-DD'),
    end_date: moment(timeData.end).format('YYYY-MM-DD'),
    enabled: timeData.enabled
  }));
}

export function groupByYear(times: ActivityTime[]): [string, ActivityTime[]][] {
  return Object.entries(
    times.reduce((byYear: GenericObject<ActivityTime[]>, frame: ActivityTime) => {
      if (!byYear[frame.year]) {
        byYear[frame.year] = [];
      }
      byYear[frame.year].push(frame);
      return byYear;
    }, {})
  );
}
