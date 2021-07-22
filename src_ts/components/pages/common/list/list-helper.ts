import {EtoolsPaginator} from '@unicef-polymer/etools-table/pagination/etools-pagination';
import {isEqual, sortBy} from 'lodash-es';
import {sendRequest} from '@unicef-polymer/etools-ajax/etools-ajax-request';
import {getEndpoint} from '../../../../endpoints/endpoints';
import {abortRequestByKey} from '@unicef-polymer/etools-ajax/etools-iron-request';
import {EtoolsEndpoint, GenericObject} from '@unicef-polymer/etools-types';
import {store} from '../../../../redux/store';
import {setShouldReGetList} from '../../interventions/intervention-tab-pages/common/actions/interventions';

export type ListHelperResponse<T> = {
  list: T[];
  paginator: EtoolsPaginator;
};

export class ListHelper<T> {
  private listData: T[] = [];
  private lastParams!: GenericObject<string>;
  private requestInProcess = false;
  private readonly requestUid = 'INTERVENTIONS_REQUEST';

  constructor(public endpoint: EtoolsEndpoint) {}

  async getList(params: GenericObject<string>, forceReGet: boolean): Promise<ListHelperResponse<T>> {
    const {page = 1, page_size: pageSize = this.listData.length, sort, ...filters} = params;
    // checks if filters was changed and returns interventions list
    const filteredList: T[] = await this.getFilteredList(filters, forceReGet);
    // returns sorted list if sort param exists
    const sortedList: T[] = this.sortList(filteredList, sort);
    // paginates list depending on provided params
    const list: T[] = this.paginate(Number(page), Number(pageSize), sortedList);
    const paginator: EtoolsPaginator = this.getPaginationData(Number(page), Number(pageSize), filteredList.length);
    return {
      list,
      paginator
    };
  }

  private async getFilteredList(filtersParams: GenericObject<string>, forceReGet: boolean): Promise<T[]> {
    if (isEqual(filtersParams, this.lastParams) && !forceReGet) {
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
      const list: T[] = await this.listRequest(filtersParams);
      this.requestInProcess = false;
      // cache response
      this.listData = list;
      return list;
    }
  }

  private listRequest(filtersParams: GenericObject<string>): Promise<T[]> {
    return sendRequest(
      {
        endpoint: getEndpoint(this.endpoint),
        params: filtersParams
      },
      this.requestUid
    )
      .then((response) => {
        store.dispatch(setShouldReGetList(false));
        return response;
      })
      .catch((error: any) => {
        // don't update flag if request was aborted
        if (error.status !== 0) {
          this.requestInProcess = false;
        }
        // This error must be handled inside component
        return Promise.reject(error);
      });
  }

  private sortList(list: T[], sort = ''): T[] {
    const [field, direction] = sort.split('.') as [keyof T, string];
    if (!field || !direction || !list.length || !Object.hasOwnProperty.call(list[0], field)) {
      return list;
    }
    const sorted: T[] = sortBy(list, (intervention: T) => {
      if (field === 'end' || field === 'start') {
        const stringDate: string | null = (intervention[field] as unknown) as string;
        return stringDate ? new Date(stringDate).getTime() : 0;
      } else {
        return intervention[field];
      }
    });
    return direction === 'asc' ? sorted : sorted.reverse();
  }

  private paginate(page: number, pageSize: number, data: T[]): T[] {
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
