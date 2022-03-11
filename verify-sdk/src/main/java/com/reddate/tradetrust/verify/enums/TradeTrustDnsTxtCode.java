package com.reddate.tradetrust.verify.enums;

/**
 * DnsTxt验证状态代码
 * @author SunKangJian
 */

public enum TradeTrustDnsTxtCode {
    /**
     * 意外错误
     */
    UNEXPECTED_ERROR(0, "UNEXPECTED_ERROR"),
    /**
     * 无效身份
     */
    INVALID_IDENTITY(1, "INVALID_IDENTITY"),
    /**
     * 跳过的
     */
    SKIPPED(2, "SKIPPED"),
    /**
     * 无效的发行者
     */
    INVALID_ISSUERS(3, "INVALID_ISSUERS"),
    /**
     * 匹配记录未找到
     */
    MATCHING_RECORD_NOT_FOUND(4, "MATCHING_RECORD_NOT_FOUND"),
    /**
     * 无法识别的文件
     */
    UNRECOGNIZED_DOCUMENT(5, "UNRECOGNIZED_DOCUMENT"),
    /**
     * 不支持的
     */
    UNSUPPORTED(6, "UNSUPPORTED");

    private Integer code;
    private String codeString;

    TradeTrustDnsTxtCode(Integer code, String codeString) {
        this.code = code;
        this.codeString = codeString;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getCodeString() {
        return codeString;
    }

    public void setCodeString(String codeString) {
        this.codeString = codeString;
    }

    @Override
    public String toString() {
        return codeString;
    }
}
