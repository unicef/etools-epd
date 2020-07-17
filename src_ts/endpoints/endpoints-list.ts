export interface EtoolsEndpoint {
  url?: string;
  template?: string;
  exp?: any;
  cachingKey?: string;
  cacheTableName?: string;
}
export interface EtoolsEndpoints {
  [key: string]: EtoolsEndpoint;
}

export const etoolsEndpoints: EtoolsEndpoints = {
  userProfile: {
    url: '/api/v3/users/profile/'
  },
  changeCountry: {
    url: '/api/v3/users/changecountry/'
  },
  interventions: {
    url: '/api/v2/interventions/'
  },
  intervention: {
    template: '/api/v2/interventions/<%=interventionId%>/'
  },
  locations: {
    url: '/api/locations-light/'
  },
  static: {
    url: '/api/v2/dropdowns/static/'
  },
  partners: {
    url: '/api/v2/partners/'
  },
  sections: {
    url: '/api/sections/'
  },
  disaggregations: {
    url: '/api/v2/reports/disaggregations/'
  }
};
