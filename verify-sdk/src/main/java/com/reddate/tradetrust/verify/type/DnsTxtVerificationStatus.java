package com.reddate.tradetrust.verify.type;

import com.reddate.tradetrust.verify.common.VerificationReason;

public class DnsTxtVerificationStatus {

    private String status;
    private String location;
    private String value;
    private VerificationReason reason;

    public DnsTxtVerificationStatus(String status, String location, String value, VerificationReason reason) {
        this.status = status;
        this.location = location;
        this.value = value;
        this.reason = reason;
    }

    private DnsTxtVerificationStatus(Builder builder) {
        setStatus(builder.status);
        setLocation(builder.location);
        setValue(builder.value);
        setReason(builder.reason);
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public VerificationReason getReason() {
        return reason;
    }

    public void setReason(VerificationReason reason) {
        this.reason = reason;
    }


    /**
     * {@code DnsTxtVerificationStatus} builder static inner class.
     */
    public static final class Builder {
        private String status;
        private String location;
        private String value;
        private VerificationReason reason;

        public Builder() {
        }

        /**
         * Sets the {@code status} and returns a reference to this Builder enabling method chaining.
         *
         * @param status the {@code status} to set
         * @return a reference to this Builder
         */
        public Builder status(String status) {
            this.status = status;
            return this;
        }

        /**
         * Sets the {@code location} and returns a reference to this Builder enabling method chaining.
         *
         * @param location the {@code location} to set
         * @return a reference to this Builder
         */
        public Builder location(String location) {
            this.location = location;
            return this;
        }

        /**
         * Sets the {@code value} and returns a reference to this Builder enabling method chaining.
         *
         * @param value the {@code value} to set
         * @return a reference to this Builder
         */
        public Builder value(String value) {
            this.value = value;
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
         * Returns a {@code DnsTxtVerificationStatus} built from the parameters previously set.
         *
         * @return a {@code DnsTxtVerificationStatus} built with parameters of this {@code DnsTxtVerificationStatus.Builder}
         */
        public DnsTxtVerificationStatus build() {
            return new DnsTxtVerificationStatus(this);
        }
    }
}
