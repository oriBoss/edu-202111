/************************************************
 * GridUtils.module.js
 * Created at 2021. 8. 30. 오후 2:21:39.
 *
 * @author youminsang
 ************************************************/

/**
 * @class 공통 GridUtil 클래스
 */
var GridUtils = {};

/**
 * From 그리드에 선택된(체크박스가 체크된) 로우 데이터를 To 그리드로 복사한다.
 * @param {cpr.core.AppInstance} app 앱 인스턴스
 * @param {#grid} psFromGridId [IDREF] From 그리드 ID
 * @param {#grid} psToGridId [IDREF] To 그리드 ID
 * @param {String[]} paDuplicateKeys From 그리드에서 중복을 판단할 컬럼명(Keys)
 * @param {Boolean} pbAllowDuplicate? 중복 허용 여부(default : false)
 * @param {Boolean} pbIsRemove? 데이터 복사 후 From 그리드내 삭제 여부 (default : true)
 * @param {Object} poChangeColumns? 복사될 로우의 컬럼명이 다른 경우 변경될 컬럼 오브젝트</br>
 * ({"fromColumnName":"toColumnName"..})
 * @return void
 */
GridUtils.moveRowsToGrid = function(app, psFromGridId, psToGridId, paDuplicateKeys, pbAllowDuplicate, pbIsRemove, poChangeColumns) {
    /** @type cpr.controls.Grid*/
    var vcFromGrid = app.lookup(psFromGridId);
    /** @type cpr.controls.Grid*/
    var vcToGrid = app.lookup(psToGridId);
    var vaValidateRowIdx = [];
    var vaLeftGridColNm = [];
    var voAddRowData = {};
    var voDsFromGrid;
    var voDsToGrid;
    var vaChkRowIdx;
    var vnLeftGridColCnt;
    var i;
    var vsColTy;
    var vsColNm;
    var voAddRowData = {};
    var vnChkRowIdx;
    var voSelectRowData;
    var voDuplicateRow;
    
    voDsFromGrid = vcFromGrid.dataSet;
    voDsToGrid = vcToGrid.dataSet;
    vaChkRowIdx = vcFromGrid.getCheckRowIndices();
    vnLeftGridColCnt = vcFromGrid.columnCount;
    
    pbIsRemove = (pbIsRemove !== undefined && pbIsRemove !== null) ? pbIsRemove : true;
    pbAllowDuplicate = (pbAllowDuplicate !== undefined && pbAllowDuplicate !== null) ? pbAllowDuplicate : false;
    
    if (!(paDuplicateKeys instanceof Array)) {
        if (paDuplicateKeys === undefined || paDuplicateKeys === null) {
            paDuplicateKeys = [];
        } else {
            paDuplicateKeys = [paDuplicateKeys];
        }
    }
    
    // 중복을 허용하지 않는데 중복 판단 키 값이 없을 경우 error 처리
    if (!pbAllowDuplicate && paDuplicateKeys.length < 1) {
        console.error("duplicateKeys is not defined");
        return;
    }
    
    for (i = 0; i < vnLeftGridColCnt; i++) {
        vsColTy = vcFromGrid.detail.getColumn(i).columnType;
        vsColNm = vcFromGrid.detail.getColumn(i).columnName;
        
        if (vsColTy === "normal") vaLeftGridColNm.push(vsColNm);
    }
    
    // from -> to 그리드 데이터 삽입
    for (i = 0; i < vaChkRowIdx.length; i++) {
        voAddRowData = {};
        vnChkRowIdx = vaChkRowIdx[i];
        voSelectRowData = voDsFromGrid.getRowData(vnChkRowIdx);
        
        vaLeftGridColNm.forEach(function(LcolNm) {
            var vbChangeCol = false;
            
            if (poChangeColumns) { // 컬럼명이 다를 경우 변경			
                Object.keys(poChangeColumns).forEach(function(CcolNm) {
                    if (LcolNm === CcolNm) {
                        voAddRowData[poChangeColumns[CcolNm]] = voSelectRowData[LcolNm];
                        vbChangeCol = true;
                    }
                });
                if (!vbChangeCol) voAddRowData[LcolNm] = voSelectRowData[LcolNm];
            } else {
                voAddRowData[LcolNm] = voSelectRowData[LcolNm];
            }
        });
        
        if (!pbAllowDuplicate) { // 중복값 체크
            paDuplicateKeys.forEach(function(key) {
                var vsColNm = key;
                var vsValue = voAddRowData[vsColNm];
                voDuplicateRow = voDsToGrid.findFirstRow(vsColNm + "=='" + vsValue + "'");
                
                if (voDuplicateRow === null) { // 중복되지 않았을 경우					
                    vaValidateRowIdx.push(vnChkRowIdx);
                } else {
                    return false;
                }
            });
            
            if (voDuplicateRow !== null) continue;
        } else {
            vaValidateRowIdx = vaChkRowIdx;
        }
        voDsToGrid.addRowData(voAddRowData);
    }
    
    //  이동한 from 그리드 로우 데이터 삭제
    if (pbIsRemove) {
        vaValidateRowIdx.forEach(function(each, idx) {
            each = each - idx;
            voDsFromGrid.realDeleteRow(each);
        });
    }
    
}

/**
 * 그리드에서 체크된 항목을 최상단으로 이동한다.
 * @param {cpr.core.AppInstance} app 앱 인스턴스
 * @param {#grid} gridId [IDREF] 그리드 ID
 * @return void
 */
GridUtils.moveRowsToTop = function(app, gridId) {
    /**@type cpr.controls.Grid */
    var vcGrid = app.lookup(gridId);
    var voDs = vcGrid.dataSet;
    var vaChkRowIdx = vcGrid.getCheckRowIndices();
    var vnLastRowIdx = vcGrid.getRowCount() - 1;
    
    // 선택된 행이 없으면 정지
    if (vaChkRowIdx.length === 0) return;
    
    vaChkRowIdx.forEach(function(each, idx) {
        voDs.moveRowIndex(each, 0 + idx, false);
    });
    
    vcGrid.clearSelection();
    vcGrid.redraw();
}

/**
 * 그리드에서 체크된 항목을 한칸 위로 이동한다.
 * @param {cpr.core.AppInstance} app 앱 인스턴스
 * @param {#grid} gridId [IDREF] 그리드 ID
 * @return void
 */
GridUtils.moveRowsToUp = function(app, gridId) {
    /**@type cpr.controls.Grid */
    var vcGrid = app.lookup(gridId);
    var voDs = vcGrid.dataSet;
    var vaChkRowIdx = vcGrid.getCheckRowIndices();
    var vnLastRowIdx = vcGrid.getRowCount() - 1;
    
    // 선택된 행이 없으면 정지
    if (vaChkRowIdx.length === 0) return;
    
    vaChkRowIdx.forEach(function(each, idx) {
        if (each === 0 || each === idx) return;
        voDs.moveRowIndex(each, each - 1, false);
    });
    
    vcGrid.clearSelection();
    vcGrid.redraw();
}

/**
 * 그리드에서 체크된 항목을 한칸 아래로 이동한다.
 * @param {cpr.core.AppInstance} app 앱 인스턴스
 * @param {#grid} gridId [IDREF] 그리드 ID
 * @return void
 */
GridUtils.moveRowsToDown = function(app, gridId) {
    /**@type cpr.controls.Grid */
    var vcGrid = app.lookup(gridId);
    var voDs = vcGrid.dataSet;
    var vaChkRowIdx = vcGrid.getCheckRowIndices();
    var vnLastRowIdx = vcGrid.getRowCount() - 1;
    
    vaChkRowIdx.reverse();
    
    // 선택된 행이 없으면 정지
    if (vaChkRowIdx.length === 0) return;
    
    vaChkRowIdx.forEach(function(each, idx) {
        if (each === vnLastRowIdx || each === vnLastRowIdx - idx) return;
        voDs.moveRowIndex(each, each + 1, true);
    });
    
    vcGrid.clearSelection();
    vcGrid.redraw();
}

/**
 * 그리드에서 체크된 항목을 최하단으로 이동한다.
 * @param {cpr.core.AppInstance} app 앱 인스턴스
 * @param {#grid} gridId [IDREF] 그리드 ID
 * @return void
 */
GridUtils.moveRowsToBottom = function(app, gridId) {
    /**@type cpr.controls.Grid */
    var vcGrid = app.lookup(gridId);
    var voDs = vcGrid.dataSet;
    var vaChkRowIdx = vcGrid.getCheckRowIndices();
    var vnLastRowIdx = vcGrid.getRowCount() - 1;
    
    vaChkRowIdx.reverse();
    
    // 선택된 행이 없으면 정지
    if (vaChkRowIdx.length === 0) return;
    
    vaChkRowIdx.forEach(function(each, idx) {
        voDs.moveRowIndex(each, vnLastRowIdx - idx, true);
    });
    
    vcGrid.clearSelection();
    vcGrid.redraw();
}

/**
 * 그리드에서 체크된 항목을 데이터셋으로 복사해 준다.
 * @param {cpr.core.AppInstance} app 앱 인스턴스
 * @param {#grid} gridId [IDREF] 그리드 ID
 * @param {#dataset} dataSetId [IDREF] 데이터셋 ID
 * @return void
 */
GridUtils.copyCheckedRowData = function(app, gridId, dataSetId) {
    /** @type cpr.controls.Grid */
    var grid = app.lookup(gridId);
    /** @type cpr.data.DataSet */
    var toDs = app.lookup(dataSetId);
    
    if (!grid) {
        return;
    }
    
    var indexes = grid.getCheckRowIndices();
    var fromDs = grid.dataSet;
    var checkedData = [];
    
    for (var i = 0; i < indexes.length; i++) {
        var index = indexes[i];
        
        var row = fromDs.getRowData(index);
        checkedData.push(row);
    }
    toDs.build(checkedData);
}

exports.GridUtils = GridUtils;