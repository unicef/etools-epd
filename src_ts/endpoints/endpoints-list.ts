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
  dropdownsData: EtoolsEndpoint;
  agreements: EtoolsEndpoint;
  environmentFlags: EtoolsEndpoint;
}

export const etoolsEndpoints: EtoolsEndpoints = {
  userProfile: {
    url: '/api/v3/users/profile/'
  },
  changeCountry: {
    url: '/api/v3/users/changecountry/'
  },
  interventions: {
    url: '/api/pmp/v3/interventions/'
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
    url: '/api/pmp/v3/partners/'
  },
  sections: {
    url: '/api/sections/v3/'
  },
  offices: {
    url: '/api/offices/v3/'
  },
  disaggregations: {
    url: '/api/v2/reports/disaggregations/'
  },
  unicefUsers: {
    url: '/api/v3/users/?verbosity=minimal'
  },
  dropdownsData: {
    url: '/api/pmp/v3/dropdowns/dynamic/'
  },
  agreements: {
    url: '/api/pmp/v3/agreements/'
  },
  environmentFlags: {
    url: '/api/v2/environment/flags/'
  }
};
