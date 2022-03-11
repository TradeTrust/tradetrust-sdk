package com.reddate.tradetrust.verify.type;

/**
 * @author SunKangJian
 */
public class TradeTrustDnsDidRecord {

    private String type;
    private String algorithm;
    private String publicKey;
    private String version;

    public TradeTrustDnsDidRecord(String type, String algorithm, String publicKey, String version) {
        this.type = type;
        this.algorithm = algorithm;
        this.publicKey = publicKey;
        this.version = version;
    }

    private TradeTrustDnsDidRecord(Builder builder) {
        setType(builder.type);
        setAlgorithm(builder.algorithm);
        setPublicKey(builder.publicKey);
        setVersion(builder.version);
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }

    public String getPublicKey() {
        return publicKey;
    }

    public void setPublicKey(String publicKey) {
        this.publicKey = publicKey;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }


    /**
     * {@code TradeTrustDnsDidRecord} builder static inner class.
     */
    public static final class Builder {
        private String type;
        private String algorithm;
        private String publicKey;
        private String version;

        public Builder() {
        }

        /**
         * Sets the {@code type} and returns a reference to this Builder enabling method chaining.
         *
         * @param type the {@code type} to set
         * @return a reference to this Builder
         */
        public Builder type(String type) {
            this.type = type;
            return this;
        }

        /**
         * Sets the {@code algorithm} and returns a reference to this Builder enabling method chaining.
         *
         * @param algorithm the {@code algorithm} to set
         * @return a reference to this Builder
         */
        public Builder algorithm(String algorithm) {
            this.algorithm = algorithm;
            return this;
        }

        /**
         * Sets the {@code publicKey} and returns a reference to this Builder enabling method chaining.
         *
         * @param publicKey the {@code publicKey} to set
         * @return a reference to this Builder
         */
        public Builder publicKey(String publicKey) {
            this.publicKey = publicKey;
            return this;
        }

        /**
         * Sets the {@code version} and returns a reference to this Builder enabling method chaining.
         *
         * @param version the {@code version} to set
         * @return a reference to this Builder
         */
        public Builder version(String version) {
            this.version = version;
            return this;
        }

        /**
         * Returns a {@code TradeTrustDnsDidRecord} built from the parameters previously set.
         *
         * @return a {@code TradeTrustDnsDidRecord} built with parameters of this {@code TradeTrustDnsDidRecord.Builder}
         */
        public TradeTrustDnsDidRecord build() {
            return new TradeTrustDnsDidRecord(this);
        }
    }
}
