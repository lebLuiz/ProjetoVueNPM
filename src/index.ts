import { App } from 'vue';
import components from '@/components/index';

export function install(Vue: App) {
    // @ts-ignore
    if (install?.installed) return;
    // @ts-ignore
    install.installed = true;

    Object.entries(components).forEach(([componentName, component]: any) => {
        Vue.component(componentName, component);
	});
}

const plugin = { install, }

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null;

if (typeof window !== 'undefined') {
    // @ts-ignore
    GlobalVue = window.Vue;

    // @ts-ignore
} else if (typeof global !== 'undefined') {
    // @ts-ignore
    GlobalVue = global.Vue;
}
if (GlobalVue) GlobalVue.use(plugin);

// To allow use as module (npm/webpack/etc.) export component
export default components;