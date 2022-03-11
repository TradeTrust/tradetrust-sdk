package com.reddate.tradetrust.verify.enums;

/**
 * Hash验证状态代码
 * @author SunKangJian
 */

public enum TradeTrustHashCode {

    /**
     * 文档已篡改
     */
    DOCUMENT_TAMPERED(0, "DOCUMENT_TAMPERED"),
    /**
     * 意外错误
     */
    UNEXPECTED_ERROR(1, "UNEXPECTED_ERROR"),
    /**
     * 跳过的
     */
    SKIPPED(2, "SKIPPED");

    private Integer code;
    private String codeString;

    TradeTrustHashCode(Integer code, String codeString) {
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
