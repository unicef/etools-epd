import {GenericObject, LocationObject} from '../common/types/types';

let mappedLocations: GenericObject<LocationObject> | null = null;
const resolvers: ((data: GenericObject<LocationObject>) => void)[] = [];

// language=JS
const workerFunction: Blob = new Blob([`
  self.onmessage = function(event) {
    const eventData = event.data || {};

    try {
      self.postMessage(mapData(eventData));
    } catch (error) {
      console.error(error);
    }
  };

  function mapData(data) {
    return data.reduce((mapped, data) => ({
      ...mapped,
      [data.id]: data
    }), {})
  }
`]);

const worker: Worker = new Worker(window.URL.createObjectURL(workerFunction));
worker.onmessage = function(event: MessageEvent): void {
  mappedLocations = event.data;
  while (resolvers.length) {
    const resolve = resolvers.pop() as (data: GenericObject<LocationObject>) => void;
    resolve(mappedLocations as GenericObject<LocationObject>);
  }
};

export function mapLocations(locations: LocationObject[]): void {
  worker.postMessage(locations);
}

export function getMappedLocations(): Promise<GenericObject<LocationObject>> {
  if (mappedLocations) {
    return Promise.resolve(mappedLocations);
  }
  return new Promise((resolve) => {
    resolvers.push(resolve);
  })
}


