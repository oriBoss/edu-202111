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
		var checkRowIndices = grid.getCheckRowIndices();
		
		if(checkRowIndices.length > 0) {
			var confirmResult = confirm("삭제 하시겠습니까?");
			if(confirmResult) {
				checkRowIndices.forEach(function(index){
					console.log(index);
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
	rowDatas.forEach(function(rowDatas){
		
	});
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
 * 버튼(btn11)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 * 왼쪽 -> 오른쪽 마지막으로 이동
 */
function onBtn11Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn11 = e.control;
	
	var grd3 = app.lookup("grd3");
	var checkRowIndices = grd3.getCheckRowIndices();
	checkRowIndices.forEach(function(index){
		console.log(index);
	});
	
	
}
