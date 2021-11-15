var ValueUtils = function () {
}

ValueUtils.prototype.isEmpty = function (obj) {
	if (obj === null || obj === undefined) {
		return true;
	}

	if (obj instanceof Array) {
		if (obj.length === 0) {
			return true;
		}
	} else if (typeof obj === 'string') {
		if (obj.trim() == '') {
			return true;
		}
	}

	return false;
}

exports.ValueUtils = ValueUtils;