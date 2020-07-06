import {AnyObject} from '../../../../../types/globals';

export const handleItemsNoLongerAssignedToCurrentCountry = (availableItems: AnyObject[], savedItems?: AnyObject[]) => {
  if (savedItems && savedItems.length > 0 && availableItems && availableItems.length > 0) {
    let changed = false;
    savedItems.forEach((savedItem) => {
      if (availableItems.findIndex((x) => x.id === savedItem.id) < 0) {
        availableItems.push(savedItem);
        changed = true;
      }
    });
    if (changed) {
      availableItems.sort((a, b) => (a.name < b.name ? -1 : 1));
    }
  }
};
