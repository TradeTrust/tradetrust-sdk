package com.reddate.tradetrust.verify.type;

public class DnsDidVerificationStatus {

    private String status;
    private String location;
    private String key;

    public DnsDidVerificationStatus(String status, String location, String key) {
        this.status = status;
        this.location = location;
        this.key = key;
    }

    private DnsDidVerificationStatus(Builder builder) {
        setStatus(builder.status);
        setLocation(builder.location);
        setKey(builder.key);
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

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }


    /**
     * {@code DnsDidVerificationStatus} builder static inner class.
     */
    public static final class Builder {
        private String status;
        private String location;
        private String key;

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
         * Sets the {@code key} and returns a reference to this Builder enabling method chaining.
         *
         * @param key the {@code key} to set
         * @return a reference to this Builder
         */
        public Builder key(String key) {
            this.key = key;
            return this;
        }

        /**
         * Returns a {@code DnsDidVerificationStatus} built from the parameters previously set.
         *
         * @return a {@code DnsDidVerificationStatus} built with parameters of this {@code DnsDidVerificationStatus.Builder}
         */
        public DnsDidVerificationStatus build() {
            return new DnsDidVerificationStatus(this);
        }
    }
}
