/************************************************
 * GlobalProps.module.js
 * Created at 2021. 10. 13. 오후 6:48:02.
 *
 * @author lagnaroc
 ************************************************/
var GlobalProps = function () {
	this.props = {
		"storageType": "localStorage",	// "ocalStorage" or "sessionStorage"
		"clientType": "ui"	// "ui" or "touch"
	};
}

GlobalProps.prototype.setProps = function (props) {
	this.props = props;
}

GlobalProps.getInstance = function () {
	if (GlobalProps.instance === undefined) {
		GlobalProps.instance = new GlobalProps();
	}
	
	window.mrcGlobalProps = GlobalProps.instance.props;
	
	return GlobalProps.instance;
}

exports.GlobalProps = GlobalProps;
