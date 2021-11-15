/************************************************
 * ServiceUrls.module.js
 * Created at 2021. 5. 26. 오후 12:13:46.
 *
 * @author Miracom
 ************************************************/
//var SiteServiceUrls = cpr.core.Module.require("config/SiteServiceUrls").SiteServiceUrls;

var SERVICE_URL = "https://developers.miracom.co.kr";
var CONTEXT_PATH = "/berlin";

var CoreServiceUrls ={
    CONTEXT_PATH : CONTEXT_PATH,
    
	ADM_SERVICE_URL: SERVICE_URL + CONTEXT_PATH + "/v1/adm/",
	WIP_SERVICE_URL: SERVICE_URL + CONTEXT_PATH + "/v1/wip/",
	QCM_SERVICE_URL: SERVICE_URL + CONTEXT_PATH + "/v1/qcm/",
	INV_SERVICE_URL: SERVICE_URL + CONTEXT_PATH + "/v1/inv/",
	BAS_SERVICE_URL: SERVICE_URL + CONTEXT_PATH + "/v1/bas/",
	RAS_SERVICE_URL: SERVICE_URL + CONTEXT_PATH + "/v1/ras/",
	SCHEDULING_SERVICE_URL: SERVICE_URL + CONTEXT_PATH + "/v1/scheduling/",
	
	RAS_SERVICE_URL: SERVICE_URL + CONTEXT_PATH + "/v1/ras/",
	EIS_SERVICE_URL: SERVICE_URL + CONTEXT_PATH + "/v1/eis/",
	
	PUSH_SERVER_URL: SERVICE_URL + CONTEXT_PATH + "/mesplus",
	
	CLOUD_STORAGE_SERVICE_URL: "https://mes-dev.miracom.co.kr" + CONTEXT_PATH + "/v1/",
	REDIRECT_SERVICE_URL: "https://mes-dev.miracom.co.kr" + CONTEXT_PATH,
}

var ServiceUrls = Object.assign(CoreServiceUrls, {} /*SiteServiceUrls*/);

exports.ServiceUrls = ServiceUrls;

cpr.expression.ExpressionEngine.INSTANCE.registerConstant("ServiceUrls" , ServiceUrls);