/************************************************
 * dialogPopup.js
 * Created at 2021. 11. 23. 오전 8:53:18.
 *
 * @author LHS_0212
 ************************************************/



/*
 * 루트 컨테이너에서 load 이벤트 발생 시 호출.
 * 앱이 최초 구성된후 최초 랜더링 직후에 발생하는 이벤트 입니다.
 */
function onBodyLoad(/* cpr.events.CEvent */ e){
	var idData = app.getHost().initValue;
	
	var dm1 = app.lookup("dm1");
	dm1.setValue("id", idData);
	
	var sms1 = app.lookup("sms1");
	sms1.send();
}


/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSms1SubmitSuccess(/* cpr.events.CSubmissionEvent */ e){
	/** 
	 * @type cpr.protocols.Submission
	 */
	var sms1 = e.control;
	
	var dsFuncParams = app.lookup("dsFuncParams");
	var dsTags = app.lookup("dsTags");
	
	var responseText = sms1.xhr.responseText;
	var jsonData = JSON.parse(responseText);
	
	var funcParams = jsonData.funcParams;
	var tags = jsonData.tags;
	
	var arrFuncParams = funcParams.split(",");
	arrFuncParams.forEach(function (element){
		dsFuncParams.addRowData({"param" : element.split("=")[0], "value" : element.split("=")[1]});
	})
	
	var arrTags = tags.split(",");
	arrTags.forEach(function (element){
		dsTags.addRowData({"tag" : element});
	})
	
	var dm1 = app.lookup("dm1");
	dm1.build(jsonData);
	
	app.lookup("grp1").redraw();
}
