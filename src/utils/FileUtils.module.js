/************************************************
 * FileUtils.module.js
 * Created at 2021. 8. 18. 오후 3:42:51.
 *
 * @author Miracom
 ************************************************/

module.depends("utils/ServiceUrls");
module.depends("utils/CommonUtils");
var ServiceUrls = cpr.core.Module.require("utils/ServiceUrls").ServiceUrls;
var CommonUtils = cpr.core.Module.require("utils/CommonUtils").CommonUtils;

var FileUtils = {};

/**
 * 스토리지 서버에 파일을 업로드한다.
 * @param {object} file 파일 Object 객체
 * @param {function} success 파일 업로드 성공 콜백 함수
 * @param {function} fail 파일 업로드 실패 콜백 함수
 */
FileUtils.uploadFile = function(file, success, fail) {
    // TODO 기존에는 사용자 정보에서 companyTenantCode를 버킷명으로 사용하고 있음
    var bucketName = "mrc";
    // uuidjs 오픈소스 사용
    var uuid = uuidv4();
    var url = "" + ServiceUrls.CLOUD_STORAGE_SERVICE_URL + "object/" + uuid;
    var submission = new cpr.protocols.Submission();
    
    submission.method = "post";
    submission.action = url;
    submission.mediaType = "multipart/form-data";
    
    submission.setParameters('bucketName', bucketName);
    submission.setParameters('id', uuid);
    submission.setParameters('object', file);
    submission.setParameters('prefix', 'tmp');
    
    submission.addEventListener("submit-success", success);
    submission.addEventListener("submit-error", fail);
    submission.addEventListener("error-status", function(e) {
        e.preventDefault();
    });
    
    return submission.send();
}

/**
 * 스토리지 서버에서 파일을 다운로드한다.
 * @param {object} file 파일 정보
 * @param {string} file.id 파일 ID
 * @param {string} file.fileName 파일명
 * @param {string} file.filePath 파일 경로?
 * @param {any} success 파일 다운로드 성공 콜백 함수
 * @param {any} fail 파일 다운로드 실패 콜백 함수
 */
FileUtils.downloadFile = function(file, success, fail) {
    var params = this._makeParams(file);
    var queryString = new URLSearchParams(params).toString();
    var url = "" + ServiceUrls.CLOUD_STORAGE_SERVICE_URL + "object/" + params.id + "/stream";
    var submission = new cpr.protocols.Submission();
    
    submission.method = "get";
    submission.action = url;
    submission.responseType = "filedownload";
    submission.mediaType = "application/x-www-form-urlencoded;simple";
    
    submission.setParameters('bucketName', params.bucketName);
    submission.setParameters('id', params.id);
    submission.setParameters('fileName', params.fileName);
    submission.setParameters('prefix', params.prefix);
    
    // TODO 파일 다운로드 관련 이슈 확인 및 개선 진행 필요 https://devops.miracom.co.kr/confluence/x/RBYlAw
    //	submission.addEventListener("submit-success", success);
    //	submission.addEventListener("submit-error", fail);
    //	submission.addEventListener("error-status", function(e) {
    //		e.preventDefault();
    //	});
    
    submission.send();
}

FileUtils._makeParams = function(info) {
    var bucketName = "mrc"; // TODO BucketName 지정
    var prefix = '';
    var fileId = '';
    
    if (CommonUtils.isNullOrEmpty(info)) return;
    
    if (!CommonUtils.isNullOrEmpty(info.filePathEnc)) {
        prefix = info.filePathEnc.substring(0, info.filePathEnc.lastIndexOf('/'));
        fileId = info.filePathEnc.substring(info.filePathEnc.lastIndexOf('/') + 1, info.filePathEnc.length);
    } else if (!CommonUtils.isNullOrEmpty(info.filePath)) {
        prefix = info.filePath.substring(0, info.filePath.lastIndexOf('/'));
        fileId = info.filePath.substring(info.filePath.lastIndexOf('/') + 1, info.filePath.length);
    } else {
        prefix = 'tmp';
        fileId = info.id;
    }
    
    return {
        bucketName: bucketName.toLowerCase(),
        prefix: prefix,
        id: fileId,
        fileName: info.fileName,
    }
}
exports.FileUtils = FileUtils;