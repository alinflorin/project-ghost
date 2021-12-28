export class BehaviorSubject<T> {
	private value: T;
	private subscriptions: Subscription<T>[];

	constructor(initial: T) {
		this.value = initial;
		this.subscriptions = [];
	}

	subscribe(reference: (value: T) => void): Subscription<T> {
		const newSub = new Subscription<T>(reference, this);
		newSub.fire(this.value);
		this.subscriptions.push(newSub);
		return newSub;
	}

	unsubscribe(sub: Subscription<T>): void {
		this.subscriptions.splice(this.subscriptions.indexOf(sub), 1);
	}

	getValue(): T {
		return this.value;
	}

	next(value: T): void {
		this.value = value;
		for (const sub of this.subscriptions) {
			sub.fire(this.value);
		}
	}
}

export class Subscription<T> {
	constructor(
		private reference: (value: T) => void,
		private subject: BehaviorSubject<T>
	) {}

	fire(value: T): void {
		this.reference(value);
	}

	unsubscribe(): void {
		this.subject.unsubscribe(this);
	}
}
