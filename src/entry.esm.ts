// Import vue components
import { App } from 'vue';
import * as components from '@/components/index';

// install function executed by Vue.use()
const install = function installLibrary(Vue: App) {
	Object.entries(components).forEach(([componentName, component]: any) => {
		Vue.component(componentName, component);
	});
};

// Create module definition for Vue.use()
export default install;

// To allow individual component use, export components
// each can be registered via Vue.component()
export * from '@/components/index';