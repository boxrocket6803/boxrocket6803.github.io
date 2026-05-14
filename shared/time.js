export class TimeSince {
	constructor() {
		this.Base = window.performance.now()
	}
	
	Now() {
		var ms = window.performance.now() - this.Base
		return ms / 1000
	}
}