/************************************************
 * admSetupFuntionsPopup.js
 * Created at 2021. 11. 22. 오후 9:56:54.
 *
 * @author oricaptain
 ************************************************/

/**
 * 모듈 선언 영역
 */	


/**
 * 멤버 변수
 */
	var data;
	var initValues = {}; // initVlaue
	var flag = false; // 값 변경 여부	
	
/**
 * 함수 선언 영역 
 */
	
	cpr.expression.ExpressionEngine.INSTANCE.registerConstant("funcCode", data);
	
	/**
	 * @param {cpr.controls.Grid} grid 
	 */
	function gridAddRow(grid){
		grid.insertRow(grid.rowCount, true);
	}
	
	/**
	 * @param {cpr.controls.Grid} grid
	 */
	function gridDeleteRow(grid){
		var checkRowIndices = grid.getCheckRowIndices();	//현재 check 되어 있는 row index 배열을 반환
		
		if(checkRowIndices.length > 0) {
			var confirmResult = confirm("삭제 하시겠습니까?");
			if(confirmResult) {
				checkRowIndices.forEach(function(index){
					grid.deleteRow(index);
				});
			}
		}
	}
	
	/**
 * @return {Array} 입력 되지 않은 label 값
 */
	function requireValidate(){
		var returnValArr = []; // 필수 입력 라벨들의 문자를 담을 배열
		
		
		/*ID 명*/ var ipbFuncCode = app.lookup("ipbFuncCode"); // 기능 코드
		/*ID 명*/ var ipbFuncDesc = app.lookup("ipbFuncDesc"); // 기능명
		/*ID 명*/ var ipbFuncTypeDesc = app.lookup("ipbFuncTypeDesc"); // 기능 유형
		/*ID 명*/ var colName = undefined; // 매개변수
		
		var grd1 = app.lookup("grd1");
		for(var idx = 0; idx < grd1.getRowCount(); idx++){
			/*컬럼명*/ var colNameVal = grd1.getDataRow(idx).getValue("name");
			if (colNameVal == ""){ // 값이 입력되지 않은 행이 있는지 없는지 체크
				colName = false; // 값 작성 여부
			}
		}
		
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
		if (colName == false){
			returnValArr.push("매개 변수");
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
	
	//initValue 반환
	var initValues = app.getHost().initValue;
	
	var idData = initValues.clickRowID;
	var state = initValues.state;
	
	if (state == "save"){
		app.lookup("ipbFuncCode").enabled = true;
	}

	//1번
	var dmPopup = app.lookup("dmPopup");
	var ipb1 = app.lookup("ipbFuncCode");
	
	dmPopup.setValue("id", idData);
	ipb1.redraw();
	
	//2번
	var smDialog = app.lookup("smDialog");
	smDialog.send();
}


/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSmDialogSubmitSuccess(/* cpr.events.CSubmissionEvent */ e){
	/** 
	 * @type cpr.protocols.Submission
	 */
	var smDialog = e.control;
	var dsFuncParams = app.lookup("dsFuncParams");
	var dsTags = app.lookup("dsTags");
	
	var responseText = smDialog.xhr.responseText;
	var jsonData = JSON.parse(responseText);
	
	var dmPopup = app.lookup("dmPopup");
	dmPopup.build(jsonData);
	
	var funcParams = jsonData.funcParams;
	var tags = jsonData.tags;
	
	if(funcParams) {
		var arrFuncParams = funcParams.split(",");
		arrFuncParams.forEach(function (element){
			dsFuncParams.pushRowData({"name" : element.split("=")[0], "value" : element.split("=")[1]});
		})
	}
	
	if(tags) {
		var arrTags = tags.split(",");
		arrTags.forEach(function (element){
			dsTags.pushRowData({"tag" : element});
		})
	}
	
	var dm1 = app.lookup("dmPopup");
	dm1.build(jsonData);
	
	var grp1 = app.lookup("grp1");
	grp1.redraw();
	
}


/*
 * "+" 버튼(btn2)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn2Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn2 = e.control;
	
	var grd1 = app.lookup("grd1");
	gridAddRow(grd1);
	
}


/*
 * "-" 버튼(btn1)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn1Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn1 = e.control;
	
	var grd1 = app.lookup("grd1");
	
	gridDeleteRow(grd1);
	
}


/*
 * "+" 버튼(btn6)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn6Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn6 = e.control;
	
	var grd2 = app.lookup("grd2");
	
	gridAddRow(grd2);
}


/*
 * "-" 버튼(btn5)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn5Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn5 = e.control;
	var grd2 = app.lookup("grd2");
	
	gridDeleteRow(grd2);
}


/*
 * "저장" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
	
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
	var dmPopup = app.lookup("dmPopup");

	rowDatas.forEach(function(rowData){
		if (rowData.value != "" && rowData.value != null){
			arr.push(rowData.name + "=" + rowData.value);
		} else {
			arr.push(rowData.name);
		}
	});
	
	dataStr = arr.join(",");
	
	dmPopup.setValue("funcParams", dataStr);
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
	var dmPopup = app.lookup("dmPopup");
	
	rowDatas[1].forEach(function(rowData){
		arr.push(rowData.value);
	});
	
	dataStr = arr.join(",");
	
	dmPopup.setValue("funcParams", dataStr);
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
	var dmPopup = app.lookup("dmPopup");
	
	rowDatas.forEach(function(rowData){
		arr.push(rowData.value);
	});
	
	dataStr = arr.join(",");
	
	dmPopup.setValue("tags", dataStr);
	
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
	var dmPopup = app.lookup("dmPopup");
	
	var rowDatas = dsTags.getRowDatasByState(cpr.data.tabledata.RowState.UNCHANGED || cpr.data.tabledata.RowState.UPDATED);
	
	rowDatas[1].forEach(function(rowData){
		arr.push(rowData.value);
	});
	
	dataStr = arr.join(",");
	
	dmPopup.setValue("tags", dataStr);
}


/*
 * 버튼(btn3)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn3Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn3 = e.control;
	var ipbSearchWord = app.lookup("ipbSearchWord");
	
	ipbSearchWord.value = "";
	
}


/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSubSaveSubmitSuccess(/* cpr.events.CSubmissionEvent */ e){
	/** 
	 * @type cpr.protocols.Submission
	 */
	var subSave = e.control;
	
	flag = true;
	app.close(flag);
}


/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSubUpdateSubmitSuccess(/* cpr.events.CSubmissionEvent */ e){
	/** 
	 * @type cpr.protocols.Submission
	 */
	var subUpdate = e.control;
	
	flag = true;
	app.close(flag);
}

/*
 * "Button" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick6(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
	
	var ipbSearchWord = app.lookup("ipbSearchWord");
	ipbSearchWord.value = "";
}

/**
 * 
 * @param {cpr.controls.Grid} grd1 소스 그리드(데이터 내보낼 그리드)
 * @param {cpr.controls.Grid} grd2 타겟 그리드(데이터 받을 그리드)
 * @param {cpr.data.DataSet} ds 소스 데이터 셋
 */
function moveRow(grd1, grd2, ds){
	var checkRowIndices = grd1.getCheckRowIndices();
	
	checkRowIndices.forEach(function(index){
		grd2.insertRowData(grd2.rowCount, true, grd1.getRow(index).getRowData());
		ds.deleteRow(index);
	});
}


/*
 * 버튼(btn11)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn11Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn11 = e.control;
	
	var grd3 = app.lookup("grd3");
	var checkRowIndices = grd3.getCheckRowIndices();
	
	var grd4 = app.lookup("grd4");
	
	var funcCodeDatas = [];
	
	for(var idx = 0; idx < grd4.rowCount; idx++){
		funcCodeDatas.push(grd4.getRow(idx).getRowData().funcCode);
	}
	
	checkRowIndices.forEach(function(index){
		var indexOf = funcCodeDatas.indexOf(grd3.getRow(index).getRowData().funcCode);
		if(indexOf == -1) {
			grd4.insertRowData(grd4.rowCount, true, grd3.getRow(index).getRowData());
		} else {
			alert("기능 코드 값이 동일한 데이터는 추가되지 않습니다.");
		}
	});
}


/*
 * 버튼(btn12)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn12Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn12 = e.control;
	
	var grd4 = app.lookup("grd4");
	var checkRowIndices = grd4.getCheckRowIndices();
	
	var grd3 = app.lookup("grd3");
	
	checkRowIndices.forEach(function(index){
		grd3.insertRowData(grd3.rowCount, true, grd4.getRow(index).getRowData());
	});
}


/*
 * 버튼(btn4)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn4Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn4 = e.control;
	
	var subSearchRel = app.lookup("subSearchRel");
	
	subSearchRel.send();
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
	
	var grd4 = app.lookup("grd4");
	var checkRowIndices = grd4.getCheckRowIndices();
	
	for(var i = 0; i < checkRowIndices.length; i++){
		grd4.dataSet.moveRowIndex(checkRowIndices[i], i, false);
	}
	
	grd4.redraw();
}


/*
 * 버튼(btn8)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn8Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn8 = e.control;
	
	var grd4 = app.lookup("grd4");
	var checkRowIndices = grd4.getCheckRowIndices();
	
	for(var i=0; i<checkRowIndices.length; i++) {
		grd4.dataSet.moveRowIndex(checkRowIndices[i], checkRowIndices[i]-1, false);
	}
	grd4.redraw();
}


/*
 * 버튼(btn9)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn9Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn9 = e.control;
	
	var grd4 = app.lookup("grd4");
	var checkRowIndices = grd4.getCheckRowIndices();
	
	for(var i=checkRowIndices.length-1; i>=0; i--) {
		grd4.dataSet.moveRowIndex(checkRowIndices[i], checkRowIndices[i]+1, true);
	}
	grd4.redraw();
}


/*
 * 버튼(btn10)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn10Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn10 = e.control;
	
	var grd4 = app.lookup("grd4");
	var checkRowIndices = grd4.getCheckRowIndices();
	var vnRowCount = grd4.rowCount;
	
	for(var i=0; i<checkRowIndices.length; i++) {
		grd4.dataSet.moveRowIndex(checkRowIndices[i]-i, vnRowCount-1, true);
	}
	grd4.redraw();
}
