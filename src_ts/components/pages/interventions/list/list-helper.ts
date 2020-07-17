import {EtoolsPaginator} from '@unicef-polymer/etools-table/pagination/etools-pagination';
import {GenericObject} from '../../../../types/globals';
import {isEqual, sortBy} from 'lodash-es';
import {sendRequest} from '@unicef-polymer/etools-ajax/etools-ajax-request';
import {getEndpoint} from '../../../../endpoints/endpoints';
import {etoolsEndpoints} from '../../../../endpoints/endpoints-list';
import {abortRequestByKey} from '@unicef-polymer/etools-ajax/etools-iron-request';

export type ListHelperResponse<T> = {
  list: T[];
  paginator: EtoolsPaginator;
};

export class InterventionsListHelper {
  private listData: InterventionListData[] = [];
  private lastParams!: GenericObject<string>;
  private requestInProcess = false;
  private readonly requestUid = 'INTERVENTIONS_REQUEST';

  async getList(params: GenericObject<string>): Promise<ListHelperResponse<InterventionListData>> {
    const {page = 1, page_size: pageSize = this.listData.length, sort, ...filters} = params;
    // checks if filters was changed and returns interventions list
    const filteredList: InterventionListData[] = await this.getFilteredList(filters);
    // returns sorted list if sort param exists
    const sortedList: InterventionListData[] = this.sortList(filteredList, sort);
    // paginates list depending on provided params
    const list: InterventionListData[] = this.paginate(Number(page), Number(pageSize), sortedList);
    const paginator: EtoolsPaginator = this.getPaginationData(Number(page), Number(pageSize), filteredList.length);
    return {
      list,
      paginator
    };
  }

  private async getFilteredList(filtersParams: GenericObject<string>): Promise<InterventionListData[]> {
    if (isEqual(filtersParams, this.lastParams)) {
      // return cached list if params wasn't changed
      return this.listData;
    } else {
      if (this.requestInProcess) {
        abortRequestByKey(this.requestUid);
      }
      this.requestInProcess = true;
      // save last params
      this.lastParams = filtersParams;
      // make request
      const list: InterventionListData[] = await this.listRequest(filtersParams);
      this.requestInProcess = false;
      // cache response
      this.listData = list;
      return list;
    }
  }

  private listRequest(filtersParams: GenericObject<string>): Promise<InterventionListData[]> {
    return sendRequest(
      {
        endpoint: getEndpoint(etoolsEndpoints.interventions),
        params: filtersParams
      },
      this.requestUid
    ).catch((error: any) => {
      // don't update flag if request was aborted
      if (error.status !== 0) {
        this.requestInProcess = false;
      }
      console.log(error);
      return [];
    });
  }

  private sortList(list: InterventionListData[], sort = ''): InterventionListData[] {
    const [field, direction] = sort.split('.') as [keyof InterventionListData, string];
    if (!field || !direction || !list.length || !list[0].hasOwnProperty(field)) {
      return list;
    }
    const sorted: InterventionListData[] = sortBy(list, (intervention: InterventionListData) => {
      if (field === 'end' || field === 'start') {
        const stringDate: string | null = intervention[field];
        return stringDate ? new Date(stringDate).getTime() : 0;
      } else {
        return intervention[field];
      }
    });
    return direction === 'asc' ? sorted : sorted.reverse();
  }

  private paginate(page: number, pageSize: number, data: InterventionListData[]): InterventionListData[] {
    const fromIndex: number = (page - 1) * pageSize;
    const toIndex: number = fromIndex + pageSize;
    return data.slice(fromIndex, toIndex);
  }

  private getPaginationData(page: number, pageSize: number, count: number): EtoolsPaginator {
    return {
      page,
      page_size: pageSize,
      total_pages: count ? Math.ceil(count / pageSize) : 0,
      count: count,
      visible_range: this.getVisibleRange(pageSize, page, count)
    };
  }

  private getVisibleRange(pageSize: number, page: number, count: number): [number, number] {
    const from: number = (page - 1) * pageSize;
    const to: number = from + pageSize;
    if (from > count) {
      return [0, 0];
    }
    return [from + 1, Math.min(to, count)];
  }
}
