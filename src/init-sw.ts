import { registerSW } from 'virtual:pwa-register';

const update = registerSW({
	onNeedRefresh() {
		(async () => {
			await update(true);
		})();
	},
	onOfflineReady() {
		// show a ready to work offline to user
	},
	immediate: true,
});
