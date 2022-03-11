package com.reddate.tradetrust.verify.common;

/**
 * 验证原因
 * @author SunKangJian
 */
public class VerificationReason {

    private String message;
    private Integer code;
    private String codeString;

    public VerificationReason(String message, Integer code, String codeString) {
        this.message = message;
        this.code = code;
        this.codeString = codeString;
    }

    private VerificationReason(Builder builder) {
        setMessage(builder.message);
        setCode(builder.code);
        setCodeString(builder.codeString);
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
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


    /**
     * {@code VerificationReason} builder static inner class.
     */
    public static final class Builder {
        private String message;
        private Integer code;
        private String codeString;

        public Builder() {
        }

        /**
         * Sets the {@code message} and returns a reference to this Builder enabling method chaining.
         *
         * @param message the {@code message} to set
         * @return a reference to this Builder
         */
        public Builder message(String message) {
            this.message = message;
            return this;
        }

        /**
         * Sets the {@code code} and returns a reference to this Builder enabling method chaining.
         *
         * @param code the {@code code} to set
         * @return a reference to this Builder
         */
        public Builder code(Integer code) {
            this.code = code;
            return this;
        }

        /**
         * Sets the {@code codeString} and returns a reference to this Builder enabling method chaining.
         *
         * @param codeString the {@code codeString} to set
         * @return a reference to this Builder
         */
        public Builder codeString(String codeString) {
            this.codeString = codeString;
            return this;
        }

        /**
         * Returns a {@code VerificationReason} built from the parameters previously set.
         *
         * @return a {@code VerificationReason} built with parameters of this {@code VerificationReason.Builder}
         */
        public VerificationReason build() {
            return new VerificationReason(this);
        }
    }
}
