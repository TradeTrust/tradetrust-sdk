package com.reddate.tradetrust.verify.enums;

/**
 * @author SunKangJian
 */

public enum TradeTrustDnsDidCode {
    /**
     * 跳过的
     */
    SKIPPED(0, "SKIPPED"),
    /**
     * 意外错误
     */
    UNEXPECTED_ERROR(1, "UNEXPECTED_ERROR"),
    /**
     * 无效的发行者
     */
    INVALID_ISSUERS(2, "INVALID_ISSUERS"),
    /**
     * 格式错误的身份证明
     */
    MALFORMED_IDENTITY_PROOF(3, "MALFORMED_IDENTITY_PROOF"),
    /**
     * 未签名
     */
    UNSIGNED(4, "UNSIGNED"),
    /**
     * 无法识别的文件
     */
    UNRECOGNIZED_DOCUMENT(5, "UNRECOGNIZED_DOCUMENT"),
    /**
     * 无效的身份
     */
    INVALID_IDENTITY(6, "INVALID_IDENTITY");

    private Integer code;
    private String codeString;

    TradeTrustDnsDidCode(Integer code, String codeString) {
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
