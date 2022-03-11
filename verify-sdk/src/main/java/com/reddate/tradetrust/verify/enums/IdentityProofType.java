package com.reddate.tradetrust.verify.enums;

/**
 * 身份证明类型
 * @author SunKangJian
 */

public enum IdentityProofType {

    /**
     * 文档已篡改
     */
    DNSDid(0, "DNS-DID"),
    /**
     * 意外错误
     */
    DNSTxt(1, "DNS-TXT"),
    /**
     * 跳过的
     */
    Did(2, "DID");

    private Integer code;
    private String codeString;

    IdentityProofType(Integer code, String codeString) {
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
