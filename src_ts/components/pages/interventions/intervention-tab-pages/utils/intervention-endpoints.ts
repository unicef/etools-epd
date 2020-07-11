export interface EtoolsEndpoint {
  url?: string;
  template?: string;
  exp?: any;
  cachingKey?: string;
  cacheTableName?: string;
}
export interface EtoolsEndpoints {
  intervention: EtoolsEndpoint;
  reportingRequirements: EtoolsEndpoint;
  specialReportingRequirements: EtoolsEndpoint;
  specialReportingRequirementsUpdate: EtoolsEndpoint;
}

export const interventionEndpoints: EtoolsEndpoints = {
  intervention: {
    template: '/api/v2/interventions/<%=interventionId%>/'
  },

  reportingRequirements: {
    template: '/api/v2/interventions/<%=intervId%>/reporting-requirements/<%=reportType%>/'
  },

  specialReportingRequirements: {
    template: '/api/v2/reports/interventions/<%=intervId%>/special-reporting-requirements/'
  },

  specialReportingRequirementsUpdate: {
    template: '/api/v2/reports/interventions/special-reporting-requirements/<%=reportId%>/'
  }
};
