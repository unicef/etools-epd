/**
 * TODO: this file provide mock-up data for list page
 */
import {InterventionSupplyItem} from '../intervention-tab-pages/common/models/intervention.types';

const ratings: string[] = ['Low', 'High', 'Medium'];
const statuses: string[] = ['Assigned', 'Submitted', 'Rejected'];
const assessors: string[] = ['John Doe', 'Jane Doe', 'Bruce Wayne'];
const randomValue = (myArray: string[]) => myArray[Math.floor(Math.random() * myArray.length)];

const listDataModel: any = {
  id: 1,
  ref_number: '2019/11',
  assessment_date: '2019-08-01',
  partner_name: 'Partner name',
  status: '',
  assessor: 'John Doe',
  rating: 'Low',
  rating_points: 23
};

let i = 0;
const data: any[] = [];
while (i < 150) {
  const item = {...listDataModel};
  item.id = item.id + i;
  item.assessor = randomValue(assessors);
  item.status = randomValue(statuses);
  item.rating = randomValue(ratings);
  item.partner_name = item.partner_name + ' ' + (i + 1);
  data.push(item);
  i++;
}

export const getListDummydata = (paginator: any) => {
  return new Promise((resolve, reject) => {
    try {
      const sliceStart = (paginator.page - 1) * paginator.page_size;
      const sliceEnd = paginator.page_size * paginator.page;
      const pageData = data.slice(sliceStart, sliceEnd);
      const paginatedData: any = {
        count: data.length,
        results: pageData
      };
      resolve(paginatedData);
    } catch (err) {
      reject(err);
    }
  });
};

export const getGenderEquityRatingsDummy = () => {
  return [
    {label: 'Principal', value: '1'},
    {label: 'Significant', value: '2'},
    {label: 'Marginal', value: '3'},
    {label: 'None', value: '4'}
  ];
};

export const getSupplyItems = () => {
  const arr = [];
  let i = 0;
  while (i < 10) {
    const supplyItem = new InterventionSupplyItem();
    supplyItem.id = i;
    supplyItem.title = `Title ${i}`;
    supplyItem.result = `CP Output ${i}`;
    supplyItem.other_mentions = `Other mentions ${i}`;
    supplyItem.unit_number = i;
    supplyItem.unit_price = Math.floor(Math.random() * Math.floor(15));
    supplyItem.total_price = supplyItem.unit_number * supplyItem.unit_price;
    supplyItem.outputs = ['CP Output Health Related', 'CP Output Health Related', 'CP Output Health Related'];
    arr.push(supplyItem);
    i++;
  }
  return arr;
};
