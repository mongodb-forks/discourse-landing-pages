
const baseUrl = window.location.href.split('/t')[0];

export default {
    setupComponent(args, component) {
        component.set('baseUrl', baseUrl);
      }
  }
