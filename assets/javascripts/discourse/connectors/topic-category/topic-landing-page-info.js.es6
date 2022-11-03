
const baseUrl = window.location.pathname.split('/t')[0];

export default {
    setupComponent(args, component) {
        component.set('baseUrl', baseUrl);
      }
  }
