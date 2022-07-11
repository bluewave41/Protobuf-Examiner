const Key = require('./Key');

class ProtobufReader {
	constructor(data) {
		this.data = data;
		this.index = 0;
		this.packed = false;
		this.parsed = {};
		this.schema = {};
	}
	getSchema() {
		return this.schema;
	}
	process() {
		const blocks = this.processBlocks(this);
		this.parsed = blocks;
	}
	parseSchema(schema) {
		const message = {};
		let res;

		this.index = 0;

		debugger;
		while (this.hasNext()) {
			const key = this.readVarint();
			if (schema[key.field]) {
				res = schema[key.field].type.read(this, schema[key.field], false);
			}
			else {
				res = this.parseUnknown(key);
			}

			switch (schema[key.field].type.rawType) {
				case 'packed':
					this.schema[key.field] = {
						...this.schema[key.field],
						type: 'packed',
						fields: this.buildPackedSchema(res),
						messages: res
					}
				break;
			}
			message[key] = res;
		}
		this.parsed = message;
		console.log('SCHEMA', this.schema);
		return message;
	}
	buildPackedSchema(responses) {
		const packedSchema = {};
		for(var i=0;i<responses.length;i++) {
			const response = responses[i];
			for(const key in response) {
				if(response[key].type == 'packed') {
					this.buildPackedSchema(responses.map(el => el[key]));
				}
				else if(response[key].type == 'group') {
					packedSchema[key] = {
						type: 'group',
						fields: this.buildPackedSchema(responses.map(el => el[key].fields))
					}
				}
				else {
					if(!packedSchema[key]) {
						packedSchema[key] = {
							type: response[key].type
						}
					}
				}
			}
		}
		return packedSchema;
	}
	parseUnknown(key) {
		switch (key.wire) {
			case 0:
				return {
					type: 'varint',
					val: this.readVarint().actual
				}
			case 1:
				return {
					type: '64bit',
					val: this.read64Bit()
				}
			case 2:
				const length = this.readVarint().actual;
				const buffer = this.slice(this.index, length);
				return {
					type: 'length-encoded',
					val: buffer,
					length
				}
			case 5:
				return {
					type: '32bit',
					val: this.read32Bit()
				}
		}
	}
	processBlocks() {
		while (this.hasNext()) {
			const key = this.readVarint();
			let val;

			switch (key.wire) {
				case 0:
					val = this.readVarint();
					this.schema[key.field] = {
						field: key.field,
						type: 'varint',
						fields: null,
					}
					break;
				case 1:
					val = this.read64Bit();
					this.schema[key.field] = {
						field: key.field,
						type: '64bit',
						fields: null,
					}
					break;
				case 2:
					const length = this.readVarint().actual;
					val = this.slice(this.index, length);
					this.schema[key.field] = {
						field: key.field,
						type: 'length-encoded',
						fields: null,
						data: val
					}
					break;
				case 5:
					val = this.read32Bit();
					this.schema[key.field] = {
						field: key.field,
						type: '32bit',
						fields: null,
						data: this.slice(this.index - 4, 4, false)
					}
					break;
			}
		}
	}
	isValidString(str) {
		for (var i = 0; i < str.length; i++) {
			//20 - 125
			if ((str[i] < 20 || str[i] > 125) && str[i] != 10 && ![128, 226, 162, 153].includes(str[i])) {
				return false;
			}
		}
		return true;
	}
	hasNext() {
		return this.index < this.data.length;
	}
	readByte() {
		return this.data.readUInt8(this.index++);
	}
	read32Bit() {
		const b = this.data.readUInt32LE();
		this.index += 4;
		return b;
	}
	read64Bit() {
		const b = this.data.readBigUInt64LE();
		this.index += 8;
		return b;
	}
	slice(start, length, increaseIndex = true) {
		const data = this.data.slice(start, start + length);
		if (increaseIndex) {
			this.index += length;
		}
		return new ProtobufReader(data);
	}
	readVarint() {
		let arr = [];
		while (true) {
			const by = this.readByte();
			const b = new Key(by);
			arr.push(b.value.slice(1));
			if (b.value.startsWith(0)) {
				break;
			}
		}
		const key = new Key(parseInt(arr.reverse().join(''), 2));
		key.length = arr.length;

		return key;
	}
	getLength() {
		return this.data.length;
	}
	readVarintAt(index) {
		if (index != -1) {
			this.index = index;
			const key = this.readVarint();
			return key;
		}
	}
}

export default ProtobufReader;