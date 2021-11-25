/************************************************
 * admSetupFuntionsPopup.js
 * Created at 2021. 11. 22. 오전 11:21:54.
 *
 * @author KBJ
 ************************************************/

var initValues = {};

var data;
cpr.expression.ExpressionEngine.INSTANCE.registerConstant("data", data);
/*
 * 루트 컨테이너에서 load 이벤트 발생 시 호출.
 * 앱이 최초 구성된후 최초 랜더링 직후에 발생하는 이벤트 입니다.
 */
function onBodyLoad(/* cpr.events.CEvent */ e){
	// initValue 반환
	initValues = app.getHost().initValue;
	
	var idData = initValues.clickRowID;
	var state = initValues.state;
	
	if (state == "save"){
		app.lookup("ipbFuncCode").enabled = true;
	}
	
	//1번
	var dm1 = app.lookup("dm1");
	dm1.setValue("id", idData);
	app.lookup("ipbFuncCode").redraw();
	
	//2번
	var subSearch = app.lookup("sms1");
	subSearch.send();
	
//	var code = app.getHost().initValue;
//	console.log(app.getHost().initValue);
//	var dm = app.lookup("dm1");
//	dm.setValue("funcCode", code);
//	
//	var sms = app.lookup("sms1");
//	sms.send();
//	console.log(dm.getDatas());
//	
//	var ipb = app.lookup("ipb1");
//	ipb.redraw();
//	
//	data = code;
}

/*
 * 인풋 박스에서 value-change 이벤트 발생 시 호출.
 * 변경된 value가 저장된 후에 발생하는 이벤트.
 */
function onIpb1ValueChange(/* cpr.events.CValueChangeEvent */ e){
	/** 
	 * @type cpr.controls.InputBox
	 */
	var ipb1 = e.control;
	
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
	
	var dml = app.lookup("dm1");
	dml.build(jsonData);
	
	app.lookup("grp1").redraw();
	
	var dsFuncParams = app.lookup("dsFuncParams");
	var dsTags = app.lookup("dsTags");
	
	var funcParams = jsonData.funcParams;
	var tags = jsonData.tags;
	
	if (funcParams){
		var arrFuncParams = funcParams.split(",");
		console.log(arrFuncParams);
		arrFuncParams.forEach(function (element){
			dsFuncParams.pushRowData({"param" : element.split("=")[0], "value" : element.split("=")[1]});
		})
	}
	
	if(tags){
		var arrTags = tags.split(",");
		console.log(arrTags);
		arrTags.forEach(function (element){
			dsTags.pushRowData({"tag" : element});
		})
	}
	
}

// 그리드 행추가 메소드(두곳에서 사용하기 떄문에 사용하기 편하게 메소드로 구분)
/**
 * 
 * @param {cpr.controls.Grid} grid
 */
function gridAddRow(grid){
	grid.insertRow(grid.rowCount, true);
}

// 선택 그리드 행 삭제 메소드
/**
 * 
 * @param {cpr.controls.Grid} grid
 */
function gridDeleteRow(grid){
	
	var checkRowIndices = grid.getCheckRowIndices(); // 현재 check 되어 있는 row index 배열을 반환합니다. 
	
	console.log(checkRowIndices);
	
	if (checkRowIndices.length > 0){
		var confirmResult = confirm("삭제 하시겠습니까?");
		
		if (confirmResult){
			console.log(confirmResult);
			checkRowIndices.forEach(function(index){
				console.log(index);
				grid.deleteRow(index);
			});
		}
	}
}


/*
 * "left +" 버튼(btn1)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn1Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn1 = e.control;
	
	var grd1 = app.lookup("grd1")
	gridAddRow(grd1);
	
}


/*
 * "left -" 버튼(btn2)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn2Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn2 = e.control;
	
	var grd1 = app.lookup("grd1")
	gridDeleteRow(grd1);	
}


/*
 * "right +" 버튼(btn3)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn3Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn3 = e.control;
	
	var grd2 = app.lookup("grd2");
	gridAddRow(grd2);
}


/*
 * "right -" 버튼(btn4)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn4Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn4 = e.control;
	
	var grd2 = app.lookup("grd2");
	gridDeleteRow(grd2);
}


/*
 * left 데이터셋에서 update 이벤트 발생 시 호출.
 * 데이터가 수정되는 경우 발생하는 이벤트. 발생 메소드 : setValue, updateRow
 */
function onDsFuncParamsUpdate(/* cpr.events.CDataEvent */ e){
	/** 
	 * @type cpr.data.DataSet
	 */
	var dsFuncParams = e.control;
	
	var arr = [];
	var dataStr = "";
	
	var rowDatas = dsFuncParams.getRowDataRanged();
	rowDatas.forEach(function(rowData){
		
	});
}

/*
 * left 데이터셋에서 delete 이벤트 발생 시 호출.
 * 로우가 삭제되는 경우 발생하는 이벤트. 발생 메소드 : deleteRow
 */
function onDsFuncParamsDelete(/* cpr.events.CDataEvent */ e){
	/** 
	 * @type cpr.data.DataSet
	 */
	var dsFuncParams = e.control;
	
}

/*
 * right 데이터셋에서 update 이벤트 발생 시 호출.
 * 데이터가 수정되는 경우 발생하는 이벤트. 발생 메소드 : setValue, updateRow
 */
function onDsTagsUpdate(/* cpr.events.CDataEvent */ e){
	/** 
	 * @type cpr.data.DataSet
	 */
	var dsTags = e.control;
	
}

/*
 * right 데이터셋에서 delete 이벤트 발생 시 호출.
 * 로우가 삭제되는 경우 발생하는 이벤트. 발생 메소드 : deleteRow
 */
function onDsTagsDelete(/* cpr.events.CDataEvent */ e){
	/** 
	 * @type cpr.data.DataSet
	 */
	var dsTags = e.control;
	
}


/**
 * @return {Array} 입력 되지 않은 label 값
 */
function requireValidate() {
	var returnValArr = []; // 필수 입력 라벨들의 문자를 담을 배열
	
	/* id명 */ var ipbFuncCode = app.lookup("ipbFuncCode"); // 기능 코드
	/* id명 */ var ipbFuncDesc = app.lookup("ipbFuncDesc"); // 기능명
	/* id명 */ var ipbFuncTypeDesc = app.lookup("ipbFuncTypeDesc"); // 기능 유형
	/* id명 */ var colName = undefined; // 매개변수
	
	var grd1 = app.lookup("grd1");
	for(var idx = 0; idx < grd1.getRowCount(); idx++){
		var colNameVal = grd1.getDataRow(idx).getValue("name");
		if (colNameVal == ""){ // 값이 입력되지 않은 행이 있는지 없는지 체크
			colName = false; // 값 작성 여부
		}
	}
	
	var ipbFuncCodeVal = ipbFuncCode.value;
	var ipbFuncDescVal = ipbFuncDesc.value;
	var ipbFuncTypeDescVal = ipbFuncTypeDesc.value;
	
	if (ipbFuncCodeVal == "" || ipbFuncCodeVal == null){
		returnValArr.push("기능 코드");
		alert(returnValArr);
		return;
	}
	if (ipbFuncDescVal == "" || ipbFuncDescVal == null){
		returnValArr.push("기능명");
		alert(returnValArr);
		return;
	}
	if (ipbFuncTypeDescVal == "" || ipbFuncTypeDescVal == null){
		returnValArr.push("기능 유형");
		alert(returnValArr);
		return;
	}
	if (colName == false){
		returnValArr.push("매개 변수");
		alert(returnValArr);
		return;
	} 
	
	return returnValArr;

}


/*
 * 버튼(btn5)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn5Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn5 = e.control;
	
	var searchWord = app.lookup("ipb3");
	searchWord.value = "";
	
}


/*
 * ">" 버튼(btn12)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 * 왼쪽 -> 오른쪽 마지막으로 이동
 */
function onBtn12Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
//	var btn12 = e.control;
//	
//	var grd3 = app.lookup("grd3"); // 좌측 그리드
//	var grd4 = app.lookup("grd4"); // 우측 그리드
//	
//	var checkRowIndices = grd3.getCheckRowIndices();
//	checkRowIndices.forEach(function(index){
////		console.log(index);
//		var grd3Value = grd3.getRow(index);
//		console.log(grd3Value.getRowData());
//		
//		grd4.insertRowData(grd4.rowCount, false, grd3Value.getRowData());
//		console.log(grd3Value);
//
//		grd3.deleteRow(index); // 위치 이동한 row 삭제
//	});

	var grd3 = app.lookup("grd3");
	var checkRowIndices = grd3.getCheckRowIndices();
	
	var grd4 = app.lookup("grd4");
	var funcCodeDatas = [];
	for(var idx = 0; idx < grd4.rowCount; idx++){
		funcCodeDatas.push(grd4.getRow(idx).getRowData().funcCode);
	}
	
	var dsFunCode = app.lookup("dsFuncCode");
	
	checkRowIndices.forEach(function(index){
		var indexof = funcCodeDatas.indexOf(grd3.getRow(index).getRowData().funcCode);
		console.log(indexof);
		if (indexof == -1){
			grd4.insertRowData(grd4.rowCount, true, grd3.getRow(index).getRowData())
			dsFunCode.deleteRow(index);
		}
		else {
			alert("기능 코드값이 동일한 데이터는 추가되지 않습니다.");
		}
	});

}


/*
 * "<" 버튼(btn13)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn13Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn13 = e.control;
	
	var grd4 = app.lookup("grd4"); // 우측 그리드
	var grd3 = app.lookup("grd3"); // 좌측 그리드
	
	var checkRowIndices = grd4.getCheckRowIndices();
	checkRowIndices.forEach(function(index){
		
		var grd4Value = grd4.getRow(index);
		
		grd3.insertRowData(grd4.rowCount, false, grd4Value.getRowData());
		
		var dsFuncCodeRel = app.lookup("dsFuncCodeRel");
		dsFuncCodeRel.deleteRow(index);
//		grd4.deleteRow(index); // 위치 이동한 row 삭제
	});
}

// 좌측 그리드 조회버튼 클릭시 조회 기능
function subSearchSend(){
	app.lookup("subSearch").send();
}

/*
 * 버튼(btn7)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn7Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn7 = e.control;
	
	subSearchSend();
}


/*
 * 인풋 박스에서 keyup 이벤트 발생 시 호출.
 * 사용자가 키에서 손을 뗄 때 발생하는 이벤트.
 */
function onIpb3Keyup(/* cpr.events.CKeyboardEvent */ e){
	/** 
	 * @type cpr.controls.InputBox
	 */
	var ipb3 = e.control;
	
	if(e.keyCode == cpr.events.KeyCode.ENTER){
		subSearchSend();
	}
}


/*
 * "왼쪽그리드 저장" 버튼(btn6)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn6Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn6 = e.control;
	
}

/*
 * "오른쪽그리드 저장" 버튼(btn14)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn14Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn14 = e.control;
	
	var requireValidationArr = requireValidate();
	
	if (requireValidationArr.length == 0){
		var confirmResult = confirm("저장 하시겠습니까?");
		if (confirmResult){
			 if(initValues.state == "save"){
				var subSave = app.lookup("subSave");
				
				subSave.setRequestEncoder(function(api, data){
					return {content : data["data"]["dm1"]}
				});
				
				subSave.send();
			}
			else if (initValues.state == "update"){
				var subUpdate = app.lookup("subUpdate");
				
				subUpdate.setRequestEncoder(function(api, data){
					return {content : data["data"]["dm1"]}
				});
				
				subUpdate.send();				
			}
		}
	}
	else {
		var alertStr = "";
		requireValidationArr.forEach(function(requireLabel){
			alertStr += "[" + requireLabel + "] ";
		});
		alert(alertStr + "필수 입력입니다.");
	}
}