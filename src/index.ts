import { App } from 'vue';
import components from '@/components/index';

const InstallComponents = {
    install(Vue: App, options: any) {
        // Let's register our component globally
        // https://vuejs.org/v2/guide/components-registration.html
        Object.entries(components).forEach(([componentName, component]: any) => {
            Vue.component(componentName, component);
        });
    }
};
   
// Automatic installation if Vue has been added to the global scope.
// @ts-ignore
if (typeof window !== 'undefined' && window?.Vue) window.Vue.use(InstallComponents);
   
export default InstallComponents;