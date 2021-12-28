import { BehaviorSubject } from '../helpers/behavior-subject';

export interface HeaderState {
	isNavOpen: boolean;
}
export const HeaderStore = new BehaviorSubject<HeaderState>({
	isNavOpen: false,
});
export default HeaderStore;
