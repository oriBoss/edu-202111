// 의존 모듈 선언.
module.depends("utils/CommonUtils");
var CommonUtils = cpr.core.Module.require("utils/CommonUtils").CommonUtils;
var ControlUtils = cpr.core.Module.require("utils/ControlUtils").ControlUtils;

/**
 * @class 공통 Validation 클래스
 */
var ValidationUtils = {};

/**
 * 해당 값이 'E-mail' 유형인지 여부를 반환한다.
 * @param {String} value  값  문자열
 * @return {Boolean} true/false
 */
ValidationUtils.isEmail = function(value) {
    var isValid = false;
    var regex;
    
    if (!value) {
        isValid = true;
    } else {
        regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (regex.test(value)) {
            isValid = true;
        }
    }
    
    return isValid;
}

/**
 * 해당 값이 'URL' 형식에 맞는 문자열인지 여부를 반환한다.
 * @param {String} value  값  문자열
 * @return {Boolean} true/false
 */
ValidationUtils.isURL = function(value) {
    var isValid = false;
    var regex;
    
    if (!value) {
        isValid = true
    } else {
        // w3resource.com
        regex = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        if (regex.test(value)) {
            isValid = true;
        }
    }
    
    return isValid;
}

/**
 * 해당 값이 '사업자 번호' 형식에 맞는 문자열인지 여부를 반환한다.
 * @param {String} value  값  문자열
 * @return {Boolean} true/false
 */
ValidationUtils.isBizCSN = function(value) {
    var isValid = false;
    
    var key = [1, 3, 7, 1, 3, 7, 1, 3, 5]; // 체크키
    var sum;
    var i;
    
    if (!value) {
        isValid = true;
    } else if ((value = (value + '').match(/\d{1}/g)).length != 10) {
        // 넘어온 값의 정수만 추츨하여 문자열의 배열로 만들고 10자리 숫자인지 확인합니다.
        isValid = false;
    } else {
        sum = 0;
        // 0 ~ 8 까지 9개의 숫자를 체크키와 곱하여 합에 더합니다.
        for (i = 0; i < 9; i++) {
            sum += (key[i] * Number(value[i]));
        }
        
        // 각 8번배열의 값을 곱한 후 10으로 나누고 내림하여 기존 합에 더합니다.
        // 다시 10의 나머지를 구한후 그 값을 10에서 빼면 이것이 검증번호 이며 기존 검증번호와 비교하면됩니다.
        isValid = (10 - ((sum + Math.floor(key[8] * Number(value[8]) / 10)) % 10)) == Number(value[9]);
    }
    
    return isValid;
}

/**
 * 해당 값이 '주민등록번호' 형식에 맞는지 여부를 반환한다.<br>
 * 주민등록번호 체크 (전자정부프레임워크 : http://www.egovframe.go.kr/wiki/doku.php?id=egovframework:rte:ptl:validation:add_rules_in_commons_validator)
 * @param {String} value  값  문자열
 * @return {Boolean} true/false
 */
ValidationUtils.isSSN = function(value) {
    var isValid = false;
    var regex;
    var birthYear;
    var birthMonth;
    var birthDate;
    var birth;
    var arrDivide;
    var checkDigit;
    var i;
    
    if (!value) {
        isValid = true;
    } else {
        value = value.replace(/[\-]/g, "");
        regex = /^\d{6}[1234]\d{6}$/;
        
        if (regex.test(value)) {
            birthYear = (value.charAt(7) <= "2") ? "19" : "20";
            birthYear += value.substr(0, 2);
            birthMonth = value.substr(2, 2) - 1;
            birthDate = value.substr(4, 2);
            birth = new Date(birthYear, birthMonth, birthDate);
            
            if (birth.getFullYear() % 100 === value.substr(0, 2) &&
                birth.getMonth() === birthMonth &&
                birth.getDate() === birthDate) {
                
                arrDivide = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
                checkDigit = 0;
                for (i = 0; i < value.length - 1; i++) {
                    checkDigit += parseInt(value.charAt(i)) * parseInt(arrDivide[i]);
                }
                checkDigit = (11 - (checkDigit % 11)) % 10;
                if (checkDigit === value.charAt(12)) {
                    isValid = true;
                }
            }
        }
    }
    
    return isValid;
}

/**
 * 해당 값이 일반 '전화번호' 형식에 맞는 문자열인지 여부를 반환한다.
 * @param {String} value 값  문자열
 * @return {Boolean} true/false
 */
ValidationUtils.isTelNo = function(value) {
    var isValid = false;
    var regex;
    
    if (!value) {
        isValid = true;
    } else {
        regex = /^\d{2,3}[\)\-\. ]?\d{3,4}[\-\. ]?\d{4}$/;
        if (regex.test(value)) {
            isValid = true;
        }
    }
    
    return isValid;
}

/**
 * 해당 값이 '핸드폰번호' 형식에 맞는 문자열인지 여부를 반환한다.
 * @param {String} value  값  문자열
 * @return {Boolean} true/false
 */
ValidationUtils.isTelMobile = function(value) {
    var isValid = false;
    var regex;
    
    if (!value) {
        isValid = true;
    } else {
        regex = /^01([0|1|6|7|8|9]?)[\-\. ]?([0-9]{3,4})[\-\. ]?([0-9]{4})$/;
        if (regex.test(value)) {
            isValid = true;
        }
    }
    
    return isValid;
}

/**
 * 해당 값이 'function' 유형인지 여부를 반환한다.
 * @param {Function} poFunc  
 * @return {Boolean} true/false
 */
ValidationUtils.isFunc = function(poFunc) {
    var isValid = false;
    
    if (poFunc != null && (typeof poFunc === "function")) {
        isValid = true;
    }
    
    return isValid;
}

/**
 * 컨트롤(그룹) 또는 Grid의 내의 입력 값에 대한 유효성 체크를 수행한다.
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @param {#uicontrol | Array} paCtlId 컨트롤 ID
 * @param {Function} failCallbackFn 유효성 체크 실패시 처리할 콜백 함수
 * @returns {Boolean} Valid true, Invalid false. <br>
 *  	참고 : 1. 그리드에 연결된 데이터셋의 info는 PK컬럼으로 인식<br>
 *              그리드 초기화시 (Grid.init) info에 설정된 PK컬럼은 필수값으로 지정되고 해당 컬럼에 ignorePk="Y" 사용자속성 부여시 필수여부 체크를 무시한다.<br>
 *           2. 그리드 + 폼레이아웃(입력폼) 구성이고 그리드 사용자 속성에 bindDataFormId(폼레이아웃ID) 지정시 유효성체크 부적합 셀은  bindDataFormId에 지정된 폼레이아웃의 컨트롤에 포커싱이 간다. 
 *           
 */
ValidationUtils.validate = function(app, paCtlId, failCallbackFn) {
    var isValid = true;
    var ctrl = null;
    var i;
    var len;
    var voBindContext;
    var voDs;
    var rowIndex;
    
    if (!(paCtlId instanceof Array)) {
        paCtlId = [paCtlId];
    }
    
    for (i = 0, len = paCtlId.length; i < len; i++) {
        ctrl = app.lookup(paCtlId[i]);
        if (ctrl instanceof cpr.controls.Grid) {
            isValid = this._validateGrid(app, ctrl);
        } else if (ctrl instanceof cpr.controls.Container) {
            /** @type cpr.bind.BindContext */
            voBindContext = ctrl.getBindContext()
            if (voBindContext) {
                /**@type cpr.data.DataSet */
                voDs = voBindContext.grid ? voBindContext.grid.dataSet : voBindContext.dataSet;
                rowIndex = voBindContext.grid ? voBindContext.grid.getSelectedRowIndex() : voBindContext.rowIndex;
                
                //프리폼의 상태가 삭제상태이면... 유효성 체크에서 제외함
                if (voDs.getRowState(rowIndex) == cpr.data.tabledata.RowState.DELETED) continue;
            }
            isValid = this._validateControl(app, ctrl);
        } else {
            isValid = this._validateControl(app, ctrl);
        }
        
        if (isValid == false) {
            if (failCallbackFn) {
                failCallbackFn(ctrl);
            }
            break;
        }
    }
    
    return isValid;
};

/**
 * 일반 컨트롤에 대한 Validation 체크
 * @param {cpr.controls.UIControl} ctrl
 * @param {cpr.controls.UIControl} poParentCtl
 * @private
 */
ValidationUtils._validateControl = function(app, ctrl, poParentCtl) {
    var isValid = true;
    var children;
    var child;
    var i;
    var len;
    var embApp;
    
    if (!ctrl) return true;
    
    if (ctrl instanceof cpr.controls.Container) { // Group 일 경우 체크
        children = ControlUtils.getChildren(ctrl);
        
        for (i = 0, len = children.length; i < len; i++) {
            child = children[i];
            // 컨트롤별 Validation Check
            if (this._validateControl(app, child, ctrl) == false) {
                isValid = false;
                break;
            }
        }
    } else if (ctrl instanceof cpr.controls.UDCBase) { //UDC인 경우
        embApp = ctrl.getEmbeddedAppInstance();
        children = embApp.getContainer().getAllRecursiveChildren();
        
        for (i = 0, len = children.length; i < len; i++) {
            child = children[i];
            // 컨트롤별 Validation Check
            if (this._validateControl(app, child, ctrl) == false) {
                isValid = false;
                break;
            }
        }
    } else {
        isValid = this._validate(app, ctrl, ctrl.value, poParentCtl);
    }
    
    return isValid;
};

/**
 * Grid의 변경된 전체 데이터에 대한 Validation 체크<br>
 * - 사이트별 Customizing 필요<br>
 * 가능한 한 Validation 체크시 validate 메소드를 사용
 * @param {cpr.controls.Grid} poGrid 체크할 Grid
 * @returns {Boolean}
 * @private
 */
ValidationUtils._validateGrid = function(app, poGrid) {
    var _this = this;
    /** @type cpr.controls.Grid */
    var grd = poGrid;
    var vsDataBindCtxId;
    var detailBand;
    var cellCnt;
    var dataSet;
    var rowIndexes;
    var isValid;
    
    if (!grd) return false;
    
    vsDataBindCtxId = grd.userAttr("bindDataFormId");
    
    /**
     * @type cpr.controls.gridpart.GridBand
     */
    detailBand = grd.detail;
    cellCnt = detailBand.cellCount;
    
    /**
     * @type cpr.data.DataSet
     */
    dataSet = grd.dataSet;
    rowIndexes = grd.getCheckRowIndices();
    isValid = rowIndexes.some(function(idx) {
        var row = dataSet.getRow(idx);
        var col = null;
        var i;
        var valid = true;
        
        for (i = 0; i < cellCnt; i++) {
            /**  @type cpr.controls.gridpart.GridColumn */
            col = detailBand.getColumn(i);
            
            //컬럼 매핑노드가 없으면... SKIP
            if (col.columnName == null || col.columnName == "") continue;
            if (col.columnType == "checkbox" || col.columnType == "rowindex") continue;
            //컬럼 유형이 output이면... SKIP
            if (col.controlType == null || col.controlType == "output" || col.controlType == "button" || col.controlType == "img") continue;
            //신규행  PK 체크 무시... SKIP
            if (row.getState() == cpr.data.tabledata.RowState.INSERTED && (col.control && col.control.userAttr("ignorePk") == "Y")) continue;
            
            // 컨트롤별 Validation Check
            valid = _this._validate(app, col.control, row.getValue(col.columnName), grd, idx, i);
            
            if (!valid) {
                break;
            }
        }
        return valid;
    });
    
    return isValid;
};

/**
 * 
 * @param {String} ctrlId
 * @param {String} ctrlValue
 * @param {cpr.controls.UIControl} poParentCtl
 * @param {Number} pnIdx
 * @param {Number} pnCellIdx
 */
ValidationUtils._validate = function(app, ctrl, ctrlValue, poParentCtl, pnIdx, pnCellIdx, poRow, poMstCtrl) {
    var isValid = true;
    var required;
    var vsFieldLabel;
    var vsMsg;
    
    if (!ctrl) return true;
    if (ctrl.type == "output" || ctrl.type == "img" || ctrl.type == "button") return true;
    
    //바인딩 및 헤더컬럼으로 수정 필요
    vsFieldLabel = ctrl.fieldLabel;
    if (CommonUtils.isNullOrEmpty(vsFieldLabel) && ctrl.getHost) {
        vsFieldLabel = ctrl.getHost().fieldLabel;
    }
    
    function getGridFieldLabel(poParentCtl, psFieldLabel) {
        var vcDetailCtl;
        var vaHeaderCtl;
        var vcHeaderCtl;
        
        if (poParentCtl instanceof cpr.controls.Grid) {
            vcDetailCtl = poParentCtl.detail.getColumn(pnCellIdx);
            vaHeaderCtl = poParentCtl.header.getColumnByColIndex(vcDetailCtl.colIndex, vcDetailCtl.colSpan);
            if (vaHeaderCtl.length > 0) {
                vcHeaderCtl = vaHeaderCtl[0];
                if (vcHeaderCtl) {
                    psFieldLabel = vcHeaderCtl.getText();
                }
            }
        }
        return psFieldLabel;
    }
    
    function parentValidMsg(app, psMsg, poParentCtl, pnIdx) {
        var dataSet;
        var vsIdxColNm;
        var vnRowIdx;
        var vsMsg;
        
        //그리드 내 컨트롤
        if (poParentCtl instanceof cpr.controls.Grid) {
            dataSet = poParentCtl.dataSet;
            vsIdxColNm = dataSet.getColumn("index");
            
            if (!CommonUtils.isNullOrEmpty(vsIdxColNm)) {
                vnRowIdx = dataSet.getValue(pnIdx, "index");
                vsMsg = Intl.get("{fieldLabel}의 {index}번째 데이터에서", null, {
                    fieldLabel: poParentCtl.fieldLabel,
                    index: vnRowIdx
                });
            } else {
                vsMsg = Intl.get("{fieldLabel}의 {index}번째 데이터에서", null, {
                    fieldLabel: poParentCtl.fieldLabel,
                    index: (Number(pnIdx) + 1)
                });
            }
            psMsg = vsMsg + " " + psMsg;
        }
        
        CommonUtils.alert(app, "에러", psMsg, function() {
            var vsDataBindCtxId;
            var dctrl; // UDC 컨트롤 처리
            // var dataSet;
            // var col;
            // var cctrl;
            
            if (poParentCtl instanceof cpr.controls.Grid) {
                vsDataBindCtxId = poParentCtl.userAttr("bindDataFormId");
                
                //유효성 체크로 인해 selection-change 발생여부 셋팅 
                poParentCtl.userAttr("selectionChangeByValidation", "true");
                //탭내에 컨트롤이 존재하는 경우... 해당 탭페이지 포커싱
                //_appKit._focusToTabItem(poParentCtl);
                
                if (CommonUtils.isNullOrEmpty(vsDataBindCtxId)) {
                    poParentCtl.setEditRowIndex(pnIdx, true);
                    poParentCtl.focusCell(pnIdx, pnCellIdx);
                    //포커싱할 컬럼이 UDC인 경우에...
                    dctrl = poParentCtl.detail.getColumn(pnCellIdx).control;
                    if (dctrl instanceof cpr.controls.UDCBase) {
                        var empApp = dctrl.getEmbeddedAppInstance();
                        dctrl = ControlUtils.getValueControl(dctrl);
                        if (dctrl) empApp.focus(dctrl.id);
                    }
                } else {
                    poParentCtl.selectRows(pnIdx);
                    // dataSet = poParentCtl.dataSet;
                    // col = poParentCtl.detail.getColumn(pnCellIdx);
                    // cctrl = _appKit.Group.getDataBindedControl(dataSet.getAppInstance(), vsDataBindCtxId, col.columnName);
                    // if(cctrl) _appKit.Control.setFocus(cctrl.getAppInstance(), cctrl.id);
                }
                
            } else {
                //탭내에 컨트롤이 존재하는 경우... 해당 탭페이지 포커싱
                //_appKit._focusToTabItem(ctrl);
                ctrl.focus();
            }
        });
    }
    
    // 필수 입력 체크
    required = "";
    if (poParentCtl instanceof cpr.controls.Grid && ctrl instanceof cpr.controls.UDCBase) {
        if (ctrl.getAppProperty("required") === undefined) {
            required = ctrl.userAttr("required");
        } else {
            required = ctrl.getAppProperty("required") === true || ctrl.getAppProperty("required") === "Y" ? "Y" : "";
        }
    } else {
        required = ctrl.userAttr("required");
    }
    
    if (required === "Y") {
        if (ctrlValue == null || new String(ctrlValue) == "") {
            vsFieldLabel = getGridFieldLabel(poParentCtl, vsFieldLabel);
            //{0}은(는) 필수 입력 항목입니다.
            vsMsg = "[" + Intl.get(vsFieldLabel) + "] " + Intl.get("MIC-00399");
            parentValidMsg(app, vsMsg, poParentCtl, pnIdx);
            
            isValid = false;
        }
    }
    
    // 지정된 컬럼중 하나 이상 필수 입력 체크
    // 그리드일경우 columnname, 그룹 및 일반컨트롤일 경우 id
    //    {
    //        var xorNull = ctrl.userAttr("xorRequired");
    //        if (xorNull) {
    //            var vaXorNull = xorNull.replace(/\[|\]/g, "").split(",");
    //            var vsName = "";
    //            //그리드 내 컨트롤
    //            
    //            var vbStatus = false;
    //            if (poParentCtl instanceof cpr.controls.Grid) {
    //                for (var j = 0; j < vaXorNull.length; j++) {
    //                    var vsValue = poRow != null ? poRow.getValue(vaXorNull[j]) : poParentCtl.getCellValue(pnIdx, vaXorNull[j]);
    //                    if (!CommonUtils.isNullOrEmpty(vsValue)) {
    //                        vbStatus = true;
    //                        break;
    //                    }
    //                    var vaDetailCell = poParentCtl.detail.getColumnByName(vaXorNull[j]);
    //                    vaDetailCell.some(function(vcCell) {
    //                        var vcHeaderCtl = poParentCtl.header.getColumn(vcCell.colIndex).control;
    //                        if (vcHeaderCtl)
    //                            vsName += vcHeaderCtl.getText() + " ,";
    //                        //vsName += vcCell.control.userattr("name") + " ,";
    //                    });
    //                }
    //                if (!vbStatus) {
    //                    //{0}중 하나는 필수 입력 항목입니다.
    //                    var vsMsg = Intl.get("{id}중 하나는 필수 입력 항목입니다.", null, {
    //                        id: [vsName.substring(0, vsName.length - 1)]
    //                    });
    //                    parentValidMsg(app, vsMsg, poParentCtl, pnIdx);
    //                    return false;
    //                }
    //            } else {
    //                for (var j = 0; j < vaXorNull.length; j++) {
    //                    var vcCtl = ctrl.getAppInstance().lookup(vaXorNull[j]);
    //                    var vsValue = vcCtl.value;
    //                    if (!CommonUtils.isNullOrEmpty(vsValue)) {
    //                        vbStatus = true;
    //                        break;
    //                    }
    //                    vsName += vcCtl.fieldLabel + " ,";
    //                }
    //                
    //                if (!vbStatus) {
    //                    //{0}중 하나는 필수 입력 항목입니다.
    //                    var vsMsg = Intl.get("{id}중 하나는 필수 입력 항목입니다.", null, {
    //                        id: [vsName.substring(0, vsName.length - 1)]
    //                    });
    //                    parentValidMsg(app, vsMsg, poParentCtl, pnIdx);
    //                    return false;
    //                }
    //            }
    //        }
    //    }
    //	
    //	// 나머지 항목은 값이 있을 때만 체크
    //	if(ctrlValue == null || ctrlValue == "") return true;
    //	
    //	// type check
    //	{
    //		var type = ctrl.userAttr("columnType");
    //		if(type) {
    //			var isChk = true;
    //			if(type == "email"){
    //				isChk = this.isEmail(ctrlValue);
    //			}else if(type == "ssn"){
    //				isChk = this.isSSN(ctrlValue);
    //			}else if(type == "bizno"){
    //				isChk = this.isBizCSN(ctrlValue);
    //			}else if(type == "phone"){
    //				isChk = this.isTelMobile(ctrlValue);
    //			}else if(type == "tel"){
    //				isChk = this.isTelNo(ctrlValue);
    //			}else if(type == "url"){
    //				isChk = this.isURL(ctrlValue);
    //			}
    //			if(isChk == false) {
    //				vsFieldLabel = getGridFieldLabel(poParentCtl, vsFieldLabel);
    //				//{0}은(는) 유효하지 않은 형식입니다.
    //				var vsMsg = Intl.get("{fieldLabel}은(는) 유효하지 않은 형식입니다.", null,  {fieldLabel: vsFieldLabel});				
    //				parentValidMsg(app, vsMsg, poParentCtl, pnIdx);
    //				return false;
    //			}
    //		}
    //	}
    //	
    //	// minlength
    //	{
    //		var minlength = ctrl.userAttr("minlength");
    //		if(minlength) {
    //			var minlengthNum = Number(minlength);
    //			var length = ValueUtil.getLength(ctrlValue, ctrl.lengthUnit);
    //			if(length < minlength) {
    //				vsFieldLabel = getGridFieldLabel(poParentCtl, vsFieldLabel);
    //				//{0}은(는) {1}자 이상으로 입력하십시오.
    //				var vsMsg = Intl.get("{fieldLabel}은(는) {length}자 이상으로 입력하십시오.", null, {fieldLabel : vsFieldLabel, length : minlength});
    //				parentValidMsg(app, vsMsg, poParentCtl, pnIdx);
    //				return false;
    //			}
    //		}
    //	}
    //	
    //	// fixlength
    //	{
    //		var fixlength = ctrl.userAttr("fixlength");
    //		if(fixlength) {
    //			var fixlength = Number(fixlength);
    //			var length = ValueUtil.getLength(ctrlValue, ctrl.lengthUnit);
    //			if(length != fixlength) {
    //				vsFieldLabel = getGridFieldLabel(poParentCtl, vsFieldLabel);
    //				//{0}은(는) {1} 자리수만큼 입력하십시오.
    //				var vsMsg = Intl.get("{fieldLabel}은(는) {length}자리수만큼 입력하십시오.", null, {fieldLabel : vsFieldLabel, length : fixlength});
    //				parentValidMsg(app, vsMsg, poParentCtl, pnIdx);
    //				return false;
    //			}
    //		}
    //	}
    //	
    //	{
    //		//두 값을 비교
    //		//그리드 일경우 컬럼명, 일반 컨트롤일 경우 컨트롤 id
    //		var compare = ctrl.userAttr("compare");
    //		if(!ValueUtil.isNull(compare)) {
    //			var compareCol = compare.substring(0, compare.indexOf(","));			
    //			var compareType = compare.substr(compare.indexOf(",") + 1).trim();
    //			//그리드 내 컨트롤
    //			var vbStatus = false;
    //			var vsCompareColValue;
    //        	var vsCompareColLable;
    //        	var value = ctrlValue;
    //			if(poParentCtl instanceof cpr.controls.Grid){				
    //				vsCompareColValue = poRow != null ? poRow.getValue(compareCol) : poParentCtl.getCellValue(pnIdx, compareCol);
    //				var vcDetailColumn = poParentCtl.detail.getColumnByName(compareCol)[0];				
    //				var vaHeaderCol = poParentCtl.header.getColumnByColIndex(vcDetailColumn.colIndex, vcDetailColumn.colSpan);
    //				if(vaHeaderCol.length > 0){
    //					var vcHeaderCtl = vaHeaderCol[0];
    //					if(vcHeaderCtl){
    //						vsCompareColLable = vcHeaderCtl.getText();
    //					}
    //				}
    //			}else{
    //				vsCompareColValue = ctrl.getAppInstance().lookup(compareCol).value;
    //				vsCompareColLable = ctrl.getAppInstance().lookup(compareCol).fieldLabel;
    //			}
    //			
    //			if(!ValueUtil.isNull(value) && !ValueUtil.isNull(vsCompareColValue)){
    //				var vbReturn = false;
    //				if (ValueUtil.isNumber(value) && ValueUtil.isNumber(vsCompareColValue)) {
    //					vbReturn = eval(value + compareType + vsCompareColValue);
    //				}else{
    //					vbReturn = eval("'"+value+"'" + compareType + "'"+vsCompareColValue+"'");
    //				}
    //		            
    //	            if (!vbReturn) {
    //	            	 vsFieldLabel = getGridFieldLabel(poParentCtl, vsFieldLabel);
    //	            	 var vsMsg = "";
    //	            	if(compareType == "<=" || compareType == "<" ){
    //	            		//{0}은(는) {1}보다 클 수 없습니다.
    //	            		vsMsg = Intl.get("{fieldLabel}은(는) {compareFieldLabel} 보다 클 수 없습니다.", null, {fieldLabel : vsFieldLabel, compareFieldLabel : vsCompareColLable});
    //	            	}else if (compareType == ">=" || compareType == ">" ){
    //	            		//{0}은(는) {1}보다 작을수 없습니다.
    //	            		vsMsg = Intl.get("{fieldLabel}은(는) {compareFieldLabel} 보다 작을수 없습니다.", null, {fieldLabel : vsFieldLabel, compareFieldLabel : vsCompareColLable});	            		
    //	            	}else if (compareType == "==" || compareType == "="){
    //	            		//{0}은(는) {1}와 같아야 합니다.
    //	            		vsMsg = Intl.get("{fieldLabel}은(는) {compareFieldLabel} 와 같아야 합니다.", null, {fieldLabel : vsFieldLabel, compareFieldLabel : vsCompareColLable});
    //	            	}else{
    //	            		
    //	            	}
    //	            	parentValidMsg(app, vsMsg, poParentCtl, pnIdx);
    //	                return false;
    //	            }
    //			}
    //		}
    //	}
    return isValid;
}

exports.ValidationUtils = ValidationUtils;