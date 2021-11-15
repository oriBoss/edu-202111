function MES_RestAPIConfig() {
	this.CLIENT_CONST = {
		CLIENT_ID: "oauth2_client",
		CLIENT_PW: "d42725d6-4893-42a3-a1a6-27f0510f2a5a"
	}
	
	this.CONTEXT_PATH =  "/berlin";
	this.CONTEXT_PATH2 =  "";
    this.SERVICE_URL = "https://mes-dev.miracom.co.kr/";
    
	this.ADM_SERVICE_URL = "http://10.0.4.211:32000" + this.CONTEXT_PATH + "/v1/adm/";
	this.WIP_SERVICE_URL = "http://10.0.4.68:18600" + this.CONTEXT_PATH2 + "/v1/wip/";
	this.QCM_SERVICE_URL = "http://10.0.4.68:18600" + this.CONTEXT_PATH2 + "/v1/qcm/";
	this.INV_SERVICE_URL = "http://10.0.4.68:18600" + this.CONTEXT_PATH2 + "/v1/inv/";
	this.BAS_SERVICE_URL = "http://10.0.4.68:18600" + this.CONTEXT_PATH2 + "/v1/bas/";
	
	this.PUSH_SERVER_URL = this.SERVICE_URL + this.CONTEXT_PATH + "/mesplus";
	
	this.CLOUD_STORAGE_SERVICE_URL = "https://mes-dev.miracom.co.kr" + this.CONTEXT_PATH2 + "/v1/";
//	CORS e
//	this.ADM_LOCALES_KO = "http://10.0.4.211:32000" + this.CONTEXT_PATH + "/v1/adm/locales/ko";
	this.ADM_LOCALES_KO = "https://mes-dev.miracom.co.kr" + "/v1/adm/locales/ko";
	
//	if (window.mrcGlobalProps.clientType === "ui") {
//		this.REDIRECT_SERVICE_URL = "http://127.0.0.1:52194/berlin-uiframework/src/ui-index.clx.html";
//	} else if (window.mrcGlobalProps.clientType === "touch") {
//		this.REDIRECT_SERVICE_URL = "http://127.0.0.1:52194/berlin-uiframework/src/touch-index.clx.html";
//	}	

	
	//localhost://"https://mes-dev.miracom.co.kr" + this.CONTEXT_PATH;
}

MES_RestAPIConfig.getInstance = function () {
	if (MES_RestAPIConfig.instance === undefined) {
		MES_RestAPIConfig.instance = new MES_RestAPIConfig();
	}
	return MES_RestAPIConfig.instance;
}

exports.MES_REST_API_CONFIG = MES_RestAPIConfig;

cpr.expression.ExpressionEngine.INSTANCE.registerConstant("MES_REST_API_CONFIG" , MES_RestAPIConfig);