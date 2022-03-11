package com.reddate.tradetrust.verify.common;

/**
 * 验证错误异常
 * @author SunKangJian
 */
public class VerifierErrorException extends RuntimeException {

    private Integer code;
    private String codeString;

    public VerifierErrorException(String message, Integer code, String codeString) {
        super(message);
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
}
