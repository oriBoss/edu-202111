/************************************************
 * admSetupFuntionsPopup.js
 * Created at 2021. 11. 22. 오전 11:29:44.
 *
 * @author kimks
 ************************************************/

/**
 * 모듈 선언 영역
 */	
//var ServiceUrls = cpr.core.Module.require("utils/ServiceUrls").ServiceUrls;
var initValues = {};
var flag = false;
/**
 * 함수 선언 영역 
 */
function search() {
	var smsGetFunctions = app.lookup("smsGetFunctions");
	smsGetFunctions.send();
}
/**
 * 
 * @param {cpr.controls.Grid} grid
 */
function gridAddRow(grid){
	grid.insertRow(grid.rowCount, true);
}

/**
 * 
 * @param {cpr.controls.Grid} grid
 */
function gridDeleteRow(grid){
	var checkRowIndices = grid.getCheckRowIndices();
	
	if(checkRowIndices.length > 0) {
		if(confirm("삭제하시겠습니까?")) {
			checkRowIndices.forEach(function(index){
				grid.deleteRow(index);
			});
		}
	} else {
			alert("선택된 행이 없습니다.");
		}
}

/**
 * @return {Array} 입력 되지 않은 label 값
 */
function requireValidate(){
	var returnValArr = []; // 필수 입력 라벨들의 문자를 담을 배열
	
	var ipbFuncCode = app.lookup("ipbID"); // 기능 코드
	var ipbFuncDesc = app.lookup("ipbFuncDesc"); // 기능명
	var ipbFuncTypeDesc = app.lookup("ipbFuncType"); // 기능 유형
	var ipbFuncCodeVal = ipbFuncCode.value;
	var ipbFuncDescVal = ipbFuncDesc.value;
	var ipbFuncTypeDescVal = ipbFuncTypeDesc.value;

	if (ipbFuncCodeVal == "" || ipbFuncCodeVal == null){
		returnValArr.push("기능 코드");
	}
	if (ipbFuncDescVal == "" || ipbFuncDescVal == null){
		returnValArr.push("기능명");
	}
	if (ipbFuncTypeDescVal == "" || ipbFuncTypeDescVal == null){
		returnValArr.push("기능 유형");
	}

	return returnValArr;
}

/**
 * 
 * @param {cpr.protocols.Submission} submission 인코딩 처리할 서브미션
 * @param {String} dataControlName 데이터 셋 id 명
 */
function subSetRequestEncoder(submission, dataControlName){
	submission.setRequestEncoder(function(api, data){
		return {content : data["data"][dataControlName]}
	});
}
/**
 * 이벤트 처리 영역
 */

/*
 * 아웃풋에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onOutputClick(/* cpr.events.CMouseEvent */ e){
	app.close();
}



/*
 * 루트 컨테이너에서 load 이벤트 발생 시 호출.	
 * 앱이 최초 구성된후 최초 랜더링 직후에 발생하는 이벤트 입니다.
 */
function onBodyLoad(/* cpr.events.CEvent */ e){
	initValues = app.getHost().initValue;
	var id = initValues.clickRowID;
	var state = initValues.state;
	var dmFunction = app.lookup("dmFunction");
	var smsGetDetail = app.lookup("smsGetDetail");
	var ipbID = app.lookup("ipbID");
	
	if(state !== "save") {
		dmFunction.setValue("id", id);		
		ipbID.enabled = false;
		smsGetDetail.send();
		
	}
	search();
}


/*
 * 버튼(btnParamAdd)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnParamAddClick(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btnParamAdd = e.control;
	var grdParams = app.lookup("grdParams");
	gridAddRow(grdParams);
}


/*
 * 버튼(btnTagAdd)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnTagAddClick(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btnTagAdd = e.control;
	var grdTags = app.lookup("grdTags");
	gridAddRow(grdTags);
}


/*
 * 버튼(btnParamRemove)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnParamRemoveClick(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btnParamRemove = e.control;
	var grdParams = app.lookup("grdParams");
	gridDeleteRow(grdParams);
}


/*
 * 버튼(btnTagRemove)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnTagRemoveClick(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btnTagRemove = e.control;
	var grdTags = app.lookup("grdTags");
	gridDeleteRow(grdTags);
}


/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSmsGetDetailSubmitSuccess(/* cpr.events.CSubmissionEvent */ e){
	/** 
	 * @type cpr.protocols.Submission
	 */
	var smsGetDetail = e.control;
	var grpTab1 = app.lookup("grpTab1");
	var dsFuncParams = app.lookup("dsFuncParams");
	var dsTags = app.lookup("dsTags");
	var dmFunction = app.lookup("dmFunction");
	var responseText = smsGetDetail.xhr.responseText;
	var jsonData = JSON.parse(responseText);		
	var funcParams = jsonData.funcParams;
	var tags = jsonData.tags;
	
	dmFunction.build(jsonData);
	
	if(funcParams){
		var arrFuncParams = funcParams.split(",");
		arrFuncParams.forEach(function (element){
			dsFuncParams.pushRowData({"param" : element.split("=")[0], "value" : element.split("=")[1]});
		})
	}
	
	if(tags){
		var arrTags = tags.split(",");
		arrTags.forEach(function (element){
			dsTags.pushRowData({"tag" : element});
		})
	}
	grpTab1.redraw();
}





/*
 * 버튼(btnSearch)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnSearchClick(/* cpr.events.CMouseEvent */ e){
	search();
}




/*
 * 버튼(btnReset)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnResetClick(/* cpr.events.CMouseEvent */ e){
	var ipbSearchWord = app.lookup("ipbSearchWord");
	var dmSearch = app.lookup("dmSearch");
	
	dmSearch.reset();
	ipbSearchWord.redraw();
	search();
}


/*
 * 인풋 박스에서 keydown 이벤트 발생 시 호출.
 * 사용자가 키를 누를 때 발생하는 이벤트.
 */
function onIpbSearchWordKeydown(/* cpr.events.CKeyboardEvent */ e){
	/** 
	 * @type cpr.controls.InputBox
	 */
	var ipbSearchWord = e.control;
	if (e.keyCode === cpr.events.KeyCode.ENTER) {
		search();
	}
}





/*
 * 데이터셋에서 update 이벤트 발생 시 호출.
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
		if (rowData.value != "" && rowData.value != null){
			arr.push(rowData.param + "=" + rowData.value);
		}
		else {
			arr.push(rowData.param);
		}
	});
	
	dataStr = arr.join(",");
	
	app.lookup("dmFunction").setValue("funcParams", dataStr);
}


/*
 * 데이터셋에서 delete 이벤트 발생 시 호출.
 * 로우가 삭제되는 경우 발생하는 이벤트. 발생 메소드 : deleteRow
 */
function onDsFuncParamsDelete(/* cpr.events.CDataEvent */ e){
	/** 
	 * @type cpr.data.DataSet
	 */
	var dsFuncParams = e.control;
	
	var arr = [];
	var dataStr = "";
	
	var rowDatas = dsFuncParams.getRowDatasByState(cpr.data.tabledata.RowState.UNCHANGED || cpr.data.tabledata.RowState.UPDATED);
	
	rowDatas[1].forEach(function(rowData){
		arr.push(rowData.value);
	});
	
	dataStr = arr.join(",");
	
	app.lookup("dmFunction").setValue("funcParams", dataStr);
}


/*
 * "저장" 버튼(btnSave)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnSaveClick(/* cpr.events.CMouseEvent */ e){
	var requireValidationArr = requireValidate();
	var smsAddFunction = app.lookup("smsAddFunction");
	var smsUpdateFunction = app.lookup("smsUpdateFunction");
	var alertStr = "";
	
	if (requireValidationArr.length == 0){
		if (confirm("저장 하시겠습니까?")){
			 if(initValues.state == "save"){			
				smsAddFunction.setRequestEncoder(function(api, data){
					return {content : data["data"]["dmFunction"]}
				});
				
				smsAddFunction.send();
			}
			else if (initValues.state == "update"){			
				smsUpdateFunction.setRequestEncoder(function(api, data){
					return {content : data["data"]["dmFunction"]}
				});
				
				smsUpdateFunction.send();
			}
		}
	}
	else {	
		requireValidationArr.forEach(function(requireLabel){
			alertStr += "[" + requireLabel + "] ";
		});
		alert(alertStr + "필수 입력입니다.");
	}
}

/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSmsAddFunctionSubmitSuccess(/* cpr.events.CSubmissionEvent */ e){
	flag = true;
	app.close(flag);
}


/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSmsUpdateFunctionSubmitSuccess(/* cpr.events.CSubmissionEvent */ e){
	flag = true;
	app.close(flag);
	
}

/*
 * 버튼(btnGoRight)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnGoRightClick(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btnGoRight = e.control;
	var grdLeft = app.lookup("grdLeft");
	var grdRight = app.lookup("grdRight");
	var rightRowCount = grdRight.getRowCount();
	var dsRelFunctions = app.lookup("dsRelFunctions");
	var checkRowIndices = grdLeft.getCheckRowIndices();
	var i= 0;
	var j= checkRowIndices.length-1;
	var row = undefined;
	var CodeValue = "";
	var DescValue = "";
	var funcCodeDatas = [];
	var indexof = 0;
	var idx = 0;
	for(idx; idx < grdRight.rowCount; idx++){
		funcCodeDatas.push(grdRight.getRow(idx).getRowData().relFuncCode);
	}
	
	for(i; i<checkRowIndices.length; i++) {
		row = grdLeft.getRow(checkRowIndices[i]);
		CodeValue = row.getValue("funcCode");
		DescValue = row.getValue("funcLocaleDesc");
		indexof = funcCodeDatas.indexOf(grdLeft.getRow(checkRowIndices[i]).getRowData().funcCode);
		if(indexof == -1) {
			dsRelFunctions.addRowData({"relFuncCode": CodeValue, "relFuncLocaleDesc": DescValue });
		} else {
			alert("기능 코드값이 동일한 데이터는 추가되지 않습니다.");
		}
	}
	for(j; j>=0; j--) {
		grdLeft.deleteRow(checkRowIndices[j]);
	}
	grdLeft.clearAllCheck();
}

/*
 * 버튼(btnGoLeft)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnGoLeftClick(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btnGoLeft = e.control;
	var grdRight = app.lookup("grdRight");
	var dsFunctions = app.lookup("dsFunctions");
	var checkRowIndices = grdRight.getCheckRowIndices();
	var i= 0;
	var j= checkRowIndices.length-1;
	var row = undefined;
	var CodeValue = "";
	var DescValue = "";
	
	for(i; i<checkRowIndices.length; i++) {
		row = grdRight.getRow(checkRowIndices[i]);
		CodeValue = row.getValue("relFuncCode");
		DescValue = row.getValue("relFuncLocaleDesc");
		dsFunctions.addRowData(
			 {
      "funcCode": CodeValue,
      "funcLocaleDesc": DescValue
    }
		);
	}
	for(j; j>=0; j--) {
		grdRight.deleteRow(checkRowIndices[j]);
	}
	grdRight.clearAllCheck();
}


/*
 * 버튼(btnTop)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnTopClick(/* cpr.events.CMouseEvent */ e){
	var grdRight = app.lookup("grdRight");
	var checkRowIndices = grdRight.getCheckRowIndices();
	var i=0
	for(i; i<checkRowIndices.length; i++) {
		grdRight.dataSet.moveRowIndex(checkRowIndices[i], i, false);
	}
	grdRight.redraw();
}


/*
 * 버튼(btnUp)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnUpClick(/* cpr.events.CMouseEvent */ e){
	var grdRight = app.lookup("grdRight");
	var checkRowIndices = grdRight.getCheckRowIndices();
	var i=0
	for(i; i<checkRowIndices.length; i++) {
		grdRight.dataSet.moveRowIndex(checkRowIndices[i], checkRowIndices[i]-1, false);
	}
	grdRight.redraw();
}


/*
 * 버튼(btnDown)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnDownClick(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btnDown = e.control;
	var grdRight = app.lookup("grdRight");
	var checkRowIndices = grdRight.getCheckRowIndices();
	var i = checkRowIndices.length-1;
	for(i; i>=0; i--) {
		grdRight.dataSet.moveRowIndex(checkRowIndices[i], checkRowIndices[i]+1, true);
	}
	grdRight.redraw();
}


/*
 * 버튼(btnBottom)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnBottomClick(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btnBottom = e.control;
	var grdRight = app.lookup("grdRight");
	var checkRowIndices = grdRight.getCheckRowIndices();
	var vnRowCount = grdRight.rowCount;
	var i=0
	for(i; i<checkRowIndices.length; i++) {
		grdRight.dataSet.moveRowIndex(checkRowIndices[i]-i, vnRowCount-1, true);
	}
	grdRight.redraw();
}

/*
 * 데이터셋에서 delete 이벤트 발생 시 호출.
 * 로우가 삭제되는 경우 발생하는 이벤트. 발생 메소드 : deleteRow
 */
function onDsTagsDelete(/* cpr.events.CDataEvent */ e){
	/** 
	 * @type cpr.data.DataSet
	 */
	var dsTags = e.control;
	var arr = [];
	var dataStr = "";
	
	var rowDatas = dsTags.getRowDatasByState(cpr.data.tabledata.RowState.UNCHANGED || cpr.data.tabledata.RowState.UPDATED);
	
	rowDatas[1].forEach(function(rowData){
		arr.push(rowData.tag);
	});
	
	dataStr = arr.join(",");
	
	app.lookup("dmFunction").setValue("tags", dataStr);
}


/*
 * 데이터셋에서 update 이벤트 발생 시 호출.
 * 데이터가 수정되는 경우 발생하는 이벤트. 발생 메소드 : setValue, updateRow
 */
function onDsTagsUpdate(/* cpr.events.CDataEvent */ e){
	/** 
	 * @type cpr.data.DataSet
	 */
	var dsTags = e.control;
	
	var arr = [];
	var dataStr = "";
	
	var rowDatas = dsTags.getRowDataRanged();
	rowDatas.forEach(function(rowData){
		arr.push(rowData.tag);
	});
	
	dataStr = arr.join(",");
	
	app.lookup("dmFunction").setValue("tags", dataStr);
}
