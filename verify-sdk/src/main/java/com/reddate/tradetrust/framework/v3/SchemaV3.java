package com.reddate.tradetrust.framework.v3;

/**
 * @author SunKangJian
 */
public class SchemaV3 {

    public enum Method {
        // DID
        Did("DID"),
        // 可验证文档
        DocumentStore("DOCUMENT_STORE"),
        // 可流转记录
        TokenRegistry("TOKEN_REGISTRY");

        private String key;

        Method(String key) {
            this.key = key;
        }

        public String getKey() {
            return key;
        }

        public void setKey(String key) {
            this.key = key;
        }

        @Override
        public String toString() {
            return key;
        }
    }

}
