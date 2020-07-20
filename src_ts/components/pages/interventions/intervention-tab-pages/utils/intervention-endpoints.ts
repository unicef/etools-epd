export interface EtoolsEndpoint {
  url?: string;
  template?: string;
  exp?: any;
  cachingKey?: string;
  cacheTableName?: string;
}
export interface EtoolsEndpoints {
  intervention: EtoolsEndpoint;
}

export const interventionEndpoints: EtoolsEndpoints = {
  intervention: {
    // template: '/api/v2/interventions/<%=interventionId%>/'
    template: '/api/pmp/v3/interventions/<%=interventionId%>/'
  }
};
