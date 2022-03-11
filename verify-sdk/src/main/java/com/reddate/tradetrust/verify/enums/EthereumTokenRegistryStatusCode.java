package com.reddate.tradetrust.verify.enums;

/**
 * 以太坊Token注册验证状态代码
 * @author SunKangJian
 */

public enum EthereumTokenRegistryStatusCode {

    /**
     * 意外错误
     */
    UNEXPECTED_ERROR(0, "UNEXPECTED_ERROR"),
    /**
     * 文档未铸造
     */
    DOCUMENT_NOT_MINTED(1, "DOCUMENT_NOT_MINTED"),
    /**
     * 合约地址无效
     */
    CONTRACT_ADDRESS_INVALID(2, "CONTRACT_ADDRESS_INVALID"),

    /**
     * 以太坊未处理错误
     */
    ETHERS_UNHANDLED_ERROR(3, "ETHERS_UNHANDLED_ERROR"),

    /**
     * 跳过的
     */
    SKIPPED(4, "SKIPPED"),

    /**
     * 无效发行者
     */
    INVALID_ISSUERS(5, "INVALID_ISSUERS"),

    /**
     * 无效参数
     */
    INVALID_ARGUMENT(6, "INVALID_ARGUMENT"),

    /**
     * 未定义的TokenRegistry
     */
    UNDEFINED_TOKEN_REGISTRY(7, "UNDEFINED_TOKEN_REGISTRY"),

    /**
     * 无效的验证方法
     */
    INVALID_VALIDATION_METHOD(8, "INVALID_VALIDATION_METHOD"),

    /**
     * 无法识别的文件
     */
    UNRECOGNIZED_DOCUMENT(9, "UNRECOGNIZED_DOCUMENT"),

    /**
     * 服务器错误
     */
    SERVER_ERROR(500, "SERVER_ERROR");

    private Integer code;
    private String codeString;

    EthereumTokenRegistryStatusCode(Integer code, String codeString) {
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
