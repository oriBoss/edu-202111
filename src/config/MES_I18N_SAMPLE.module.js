function MES_I18N_SAMPLE () {
}

MES_I18N_SAMPLE.prototype.loadI18nData = function (completed) {
	var MES_REST_CONFIG = cpr.core.Module.require("config/MES_REST_API_CONFIG").MES_REST_API_CONFIG;
	var ServiceUrls = MES_REST_CONFIG.getInstance();

	var submission = new cpr.protocols.Submission();
	submission.action = ServiceUrls.ADM_LOCALES_KO;
	submission.method = cpr.protocols.Submission.METHOD_GET;
	submission.async = false;
	
	submission.addEventListener("receive-json", function (event) {
		var contents = event.content;
		cpr.I18N.INSTANCE.currentLanguage = "ko";
		cpr.I18N.INSTANCE.setLocaleData("ko", contents);
	});
	
	submission.addEventListener("submit-done", completed);
	
	submission.addEventListener("submit-error", function (event) {
//		alert("i18n data load error");
	});
	
	submission.send();
}

MES_I18N_SAMPLE.KO = {};
MES_I18N_SAMPLE.EN = {};


exports.MES_I18N_SAMPLE = MES_I18N_SAMPLE;