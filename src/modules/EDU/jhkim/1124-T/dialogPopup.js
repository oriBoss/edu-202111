/************************************************
 * dialogPopup.js
 * Created at 2021. 11. 23. 오전 8:53:18.
 *
 * @author LHS_0212
 ************************************************/

var serviceModule = cpr.core.Module.require("module/service");

/** 멤버 변수 **/
var initValues = {}; // initVlaue
var flag = false; // 값 변경 여부


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
function gridDeleteRow(/* cpr.controls.Grid */grid){
	var checkRowIndices = grid.getCheckRowIndices(); // 현재 check 되어 있는 row index 배열을 반환합니다. 
	
	if (checkRowIndices.length > 0){
		var confirmResult = confirm("삭제 하시겠습니까?");
		if (confirmResult){
			
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
	
	/* id명 */ var ipbFuncCode = app.lookup("ipbFuncCode"); // 기능 코드 
	/* id명 */ var ipbFuncDesc = app.lookup("ipbFuncDesc"); // 기능명
	/* id명 */ var ipbFuncTypeDesc = app.lookup("ipbFuncTypeDesc"); // 기능 유형
	
	//유효성 검사하는건데 여기서 필요없어서 삭제
//	/* id명 */ var colName = undefined; // 매개변수
//	
//	var grd1 = app.lookup("grd1");
//	for(var idx = 0; idx < grd1.getRowCount(); idx++){
//		/* 컬럼명 */ var colNameVal = grd1.getDataRow(idx).getValue("name");
//		if (colNameVal == ""){ // 값이 입력되지 않은 행이 있는지 없는지 체크
//			colName = false; // 값 작성 여부
//		}
//	}
	
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
//	if (colName == false){
//		returnValArr.push("매개 변수");
//	}
//	
	return returnValArr
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
	dm1.setValue("funcCode", idData);
	app.lookup("ipbFuncCode").redraw();
	
	//2번
	var subSearch = app.lookup("subSearch");
	subSearch.send();
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
		arrFuncParams.forEach(function (data){
			dsFuncParams.pushRowData({"name" : data.split("=")[0], "value" : data.split("=")[1]});
		})
	}
	
	if(tags){
		var arrTags = tags.split(",");
		arrTags.forEach(function (data){
			dsTags.pushRowData({"value" : data});
		})
	}
}


/*
 * "+" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
	
	var grd1 = app.lookup("grd1");
	gridAddRow(grd1);
}


/*
 * "-" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick2(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
	
	var grd1 = app.lookup("grd1");
	gridDeleteRow(grd1);
}


/*
 * "+" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick3(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
	
	var grd2 = app.lookup("grd2");
	gridAddRow(grd2);
}


/*
 * "-" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick4(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
	
	var grd2 = app.lookup("grd2");
	gridDeleteRow(grd2);
}


/*
 * "저장" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick5(/* cpr.events.CMouseEvent */ e){
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
	rowDatas.forEach(function(rowData){
		if (rowData.value != "" && rowData.value != null){
			arr.push(rowData.name + "=" + rowData.value);
		}
		else {
			arr.push(rowData.name);
		}
	});
	
	dataStr = arr.join(",");
	
	app.lookup("dm1").setValue("funcParams", dataStr);
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
		arr.push(rowData.value);
	});
	
	dataStr = arr.join(",");
	console.log(dataStr);
	
	app.lookup("dm1").setValue("tags", dataStr);
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
	
	flag = true;//전역변수 
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
	
	var ipb1 = app.lookup("ipb1");
	ipb1.value = "";
}


/*
 * ">" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick7(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
// 단순 왼쪽에서 오른쪽으로 넘기기	
//	var grd3 = app.lookup("grd3");
//	var checkRowIndices = grd3.getCheckRowIndices();
//	
//	var grd4 = app.lookup("grd4");
//	
//	checkRowIndices.forEach(function(index){
//		grd4.insertRowData(grd4.rowCount, true, grd3.getRow(index).getRowData())
//	});

// 중복된 값을 검사하기 위해 추가했다
	var grd3 = app.lookup("grd3");
    var checkRowIndices = grd3.getCheckRowIndices();    
    var grd4 = app.lookup("grd4");
    var funcCodeDatas = [];
    var dsFuncCode = app.lookup("dsFuncCode");
    
    for(var idx = 0; idx < grd4.rowCount; idx++){
        funcCodeDatas.push(grd4.getRow(idx).getRowData().funcCode);
    }
    
    
    checkRowIndices.forEach(function(index){
        var indexof = funcCodeDatas.indexOf(grd3.getRow(index).getRowData().funcCode);
        console.log(indexof);
        if (indexof == -1){
            grd4.insertRowData(grd4.rowCount, true, grd3.getRow(index).getRowData());
            dsFuncCode.deleteRow(index);
        }
        else {
            alert("기능 코드값이 동일한 데이터는 추가되지 않습니다.");
        }
    });
	
	
}


/*
 * "<" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick8(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
    var grd4 = app.lookup("grd4");
    var checkRowIndices = grd4.getCheckRowIndices();    
    var grd3 = app.lookup("grd3");
    var funcCodeDatas = [];
    var dsFuncCode = app.lookup("dsFuncCode");
    
    for(var idx = 0; idx < grd3.rowCount; idx++){
        funcCodeDatas.push(grd3.getRow(idx).getRowData().funcCode);
    }
    
    
    checkRowIndices.forEach(function(index){
        var indexof = funcCodeDatas.indexOf(grd4.getRow(index).getRowData().funcCode);
        console.log(indexof);
        if (indexof == -1){
            grd3.insertRowData(grd3.rowCount, true, grd4.getRow(index).getRowData());
            dsFuncCode.deleteRow(index);
        }
        else {
            alert("기능 코드값이 동일한 데이터는 추가되지 않습니다.");
        }
    });
	
}


/*
 * "Button" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.검색시사용
 */
function onButtonClick9(/* cpr.events.CMouseEvent */ e){
    /** 
     * @type cpr.controls.Button
     */
    var button = e.control;
    app.lookup("subSearchRel").send();
   
}
