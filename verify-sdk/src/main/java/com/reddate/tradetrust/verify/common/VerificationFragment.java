package com.reddate.tradetrust.verify.common;

import com.reddate.tradetrust.verify.enums.VerificationFragmentStatus;
import com.reddate.tradetrust.verify.enums.VerificationFragmentType;

/**
 * 验证片段
 * @author SunKangJian
 */
public class VerificationFragment {

    private String name;
    private VerificationFragmentType type;
    private VerificationFragmentStatus status;
    private Object data;
    private VerificationReason reason;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public VerificationFragmentType getType() {
        return type;
    }

    public void setType(VerificationFragmentType type) {
        this.type = type;
    }

    public VerificationFragmentStatus getStatus() {
        return status;
    }

    public void setStatus(VerificationFragmentStatus status) {
        this.status = status;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public VerificationReason getReason() {
        return reason;
    }

    public void setReason(VerificationReason reason) {
        this.reason = reason;
    }

    private VerificationFragment(Builder builder) {
        name = builder.name;
        type = builder.type;
        status = builder.status;
        data = builder.data;
        reason = builder.reason;
    }

    /**
     * {@code VerificationFragment} builder static inner class.
     */
    public static final class Builder {
        private String name;
        private VerificationFragmentType type;
        private VerificationFragmentStatus status;
        private Object data;
        private VerificationReason reason;

        public Builder() {
        }

        /**
         * Sets the {@code name} and returns a reference to this Builder enabling method chaining.
         *
         * @param name the {@code name} to set
         * @return a reference to this Builder
         */
        public Builder name(String name) {
            this.name = name;
            return this;
        }

        /**
         * Sets the {@code type} and returns a reference to this Builder enabling method chaining.
         *
         * @param type the {@code type} to set
         * @return a reference to this Builder
         */
        public Builder type(VerificationFragmentType type) {
            this.type = type;
            return this;
        }

        /**
         * Sets the {@code status} and returns a reference to this Builder enabling method chaining.
         *
         * @param status the {@code status} to set
         * @return a reference to this Builder
         */
        public Builder status(VerificationFragmentStatus status) {
            this.status = status;
            return this;
        }

        /**
         * Sets the {@code data} and returns a reference to this Builder enabling method chaining.
         *
         * @param data the {@code data} to set
         * @return a reference to this Builder
         */
        public Builder data(Object data) {
            this.data = data;
            return this;
        }

        /**
         * Sets the {@code reason} and returns a reference to this Builder enabling method chaining.
         *
         * @param reason the {@code reason} to set
         * @return a reference to this Builder
         */
        public Builder reason(VerificationReason reason) {
            this.reason = reason;
            return this;
        }

        /**
         * Returns a {@code VerificationFragment} built from the parameters previously set.
         *
         * @return a {@code VerificationFragment} built with parameters of this {@code VerificationFragment.Builder}
         */
        public VerificationFragment build() {
            return new VerificationFragment(this);
        }
    }
}
