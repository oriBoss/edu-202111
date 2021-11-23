/************************************************
 * admSetupFunctionsPopup.js
 * Created at 2021. 11. 22. 오후 12:03:05.
 *
 * @author ysm13
 ************************************************/


/*
 * 루트 컨테이너에서 load 이벤트 발생 시 호출.
 * 앱이 최초 구성된후 최초 랜더링 직후에 발생하는 이벤트 입니다.
 */
function onBodyLoad(/* cpr.events.CEvent */ e){
	// initValue 반환
	var idData = app.getHost().initValue;
	
	var dm1 = app.lookup("dm1");
	dm1.setValue("id", idData);
	app.lookup("ipb14").redraw();
	// 인풋박스에 있는 컨트롤들은 redraw를 해주자
	
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
	
	var responseText = sms1.xhr.responseText;
	var jsonData = JSON.parse(responseText);
	
	var dm1 = app.lookup("dm1");
	dm1.build(jsonData);
	
	app.lookup("grp1").redraw();
	
	var dsFuncParams = app.lookup("dsFuncParams");
	var dsTags = app.lookup("dsTags");
	
	var funcParams = jsonData.funcParams;
	var tags = jsonData.tags;
	
	if (funcParams){
		var arrFuncParams = funcParams.split(",");
		console.log(arrFuncParams);
		arrFuncParams.forEach(function (element){
			//addRowData가 아니라 pushRowData로
			dsFuncParams.pushRowData({"param" : element.split("=")[0], "value" : element.split("=")[1]});
		})
	}
	
	if(tags){
		var arrTags = tags.split(",");
		//console.log(arrTags);
		arrTags.forEach(function (element){
			dsTags.pushRowData({"tag" : element});
		})
	}

	
}
