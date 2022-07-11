class Key {
	constructor(b) {
		let binary = this.toBinaryString(b);
		this.wire = b & 0x07;
		this.field = b >> 3;
		this.value = binary;
		this.length = 0;
		this.actual = parseInt(this.value, 2);
		this.createType();
	}
	createType() {
		switch(this.wire) {
			case 0:
				this.type = 'varint';
			break;
			case 1:
				this.type = '64bit';
			break;
			case 2:
				this.type = 'length-encoded';
			break;
			case 5:
				this.type = '32bit';
			break;
			default:
				this.type = 'invalid';
			break;
		}
	}
	toBinaryString(b) {
		return this.pad(b.toString(2));
	}
	pad(b) {
		let str = '';
		str = str.padStart(8 - b.length, '0');
		str += b;
		return str;
	}
}

module.exports = Key;