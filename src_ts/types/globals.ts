/*
 * The type Constructor<T> is an alias for the construct signature
 * that describes a type which can construct objects of the generic type T
 * and whose constructor function accepts an arbitrary number of parameters of any type
 * On the type level, a class can be represented as a newable function
 */
export type Constructor<T> = new (...args: any[]) => T;

export interface AnyObject {
  [key: string]: any;
}

export interface UnicefUser {
  first_name: string;
  last_name: string;
  middle_name: string;
  name: string;
  email: string;
}

export type GenericObject<T> = {
  [key: string]: T;
};

export type LocationObject = {
  id: string;
  name: string;
  p_code: string;
  parent: string;
  gateway: {
    id: number;
    created: string;
    modified: string;
    name: string;
    admin_level: null;
  };
};

export type Section = {
  id: string;
  created: string;
  modified: string;
  name: string;
  description: string;
  alternate_id: null;
  alternate_name: string;
  dashboard: boolean;
  color: string;
  active: boolean;
};

export type Disaggregation = {
  active: boolean;
  disaggregation_values: DisaggregationValue[];
  id: number;
  name: string;
};

export type DisaggregationValue = {
  active: boolean;
  id: number;
  value: string;
};

export type ListResponse<T> = {
  count: number;
  next: string | null;
  prev: string | null;
  results: T[];
};

export interface LabelAndValue {
  label: string;
  value: string;
}

export type InterventionAmendment = {
  id?: number;
  intervention?: number;
  created?: string;
  amendment_number: string | null;
  types: string[];
  other_description: string | null;
  signed_date: string | null;
  signed_amendment_attachment: number | string | null;
  internal_prc_review: number | string | null;
};
