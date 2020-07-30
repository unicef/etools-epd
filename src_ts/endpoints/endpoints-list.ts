export interface EtoolsEndpoint {
  url?: string;
  template?: string;
  exp?: any;
  cachingKey?: string;
  cacheTableName?: string;
}
export interface EtoolsEndpoints {
  userProfile: EtoolsEndpoint;
  changeCountry: EtoolsEndpoint;
  interventions: EtoolsEndpoint;
  intervention: EtoolsEndpoint;
  locations: EtoolsEndpoint;
  static: EtoolsEndpoint;
  partners: EtoolsEndpoint;
  sections: EtoolsEndpoint;
  disaggregations: EtoolsEndpoint;
  offices: EtoolsEndpoint;
  unicefUsers: EtoolsEndpoint;
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
    template: '/api/pmp/v3/interventions/<%=interventionId%>/'
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
    url: '/api/v2/reports/sections/'
  },
  offices: {
    url: '/api/offices/'
  },
  disaggregations: {
    url: '/api/v2/reports/disaggregations/'
  },
  unicefUsers: {
    url: '/api/v3/users/?verbosity=minimal'
  }
};
