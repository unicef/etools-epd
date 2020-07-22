export interface EtoolsEndpoint {
  url?: string;
  template?: string;
  exp?: any;
  cachingKey?: string;
  cacheTableName?: string;
}
export interface EtoolsEndpoints {
  intervention: EtoolsEndpoint;
  partnerStaffMembers: EtoolsEndpoint;
  partnerAgreements: EtoolsEndpoint;
  specialReportingRequirements: EtoolsEndpoint;
  reportingRequirements: EtoolsEndpoint;
  specialReportingRequirementsUpdate: EtoolsEndpoint;
  resultLinks: EtoolsEndpoint;
  ramIndicators: EtoolsEndpoint;
  resultLinkDetails: EtoolsEndpoint;
  attachmentsUpload: EtoolsEndpoint;
  interventionAmendmentAdd: EtoolsEndpoint;
}

export const interventionEndpoints: EtoolsEndpoints = {
  intervention: {
    template: '/api/pmp/v3/interventions/<%=interventionId%>/'
  },
  partnerStaffMembers: {
    template: '/api/v2/partners/<%=id%>/staff-members/'
  },
  partnerAgreements: {
    template: '/api/pmp/v3/agreements/?partner_id=<%=id%>'
  },
  specialReportingRequirements: {
    template: '/api/v2/reports/interventions/<%=intervId%>/special-reporting-requirements/'
  },
  reportingRequirements: {
    template: '/api/v2/interventions/<%=intervId%>/reporting-requirements/<%=reportType%>/'
  },
  specialReportingRequirementsUpdate: {
    template: '/api/v2/reports/interventions/special-reporting-requirements/<%=reportId%>/'
  },
  resultLinks: {
    template: '/api/v2/interventions/<%=id%>/result-links/'
  },
  resultLinkDetails: {
    template: '/api/v2/interventions/result-links/<%=result_link%>/'
  },
  ramIndicators: {
    template: '/api/v2/reports/results/<%=id%>/indicators/'
  },
  attachmentsUpload: {
    url: '/api/v2/attachments/upload/'
  },
  interventionAmendmentAdd: {
    template: '/api/v2/interventions/<%=intervId%>/amendments/'
  }
};
