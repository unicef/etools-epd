export const efaceEndpoints: any = {
  efaceAction: {
    // TODO eface
    template: '/api/v1/forms/<%=efaceId%>/<%=action%>/'
  },
  efaceForms: {
    url: '/api/eface/v1/forms/'
  },
  efaceForm: {
    template: '/api/eface/v1/forms/<%=id%>/'
  }
};
