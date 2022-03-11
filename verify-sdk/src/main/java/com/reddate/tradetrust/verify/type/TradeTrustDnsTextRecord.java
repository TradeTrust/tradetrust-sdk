package com.reddate.tradetrust.verify.type;

/**
 * @author SunKangJian
 */
public class TradeTrustDnsTextRecord {

    private String type;
    private String net;
    private String netId;
    private String addr;

    public TradeTrustDnsTextRecord(String type, String net, String netId, String addr) {
        this.type = type;
        this.net = net;
        this.netId = netId;
        this.addr = addr;
    }

    private TradeTrustDnsTextRecord(Builder builder) {
        setType(builder.type);
        setNet(builder.net);
        setNetId(builder.netId);
        setAddr(builder.addr);
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getNet() {
        return net;
    }

    public void setNet(String net) {
        this.net = net;
    }

    public String getNetId() {
        return netId;
    }

    public void setNetId(String netId) {
        this.netId = netId;
    }

    public String getAddr() {
        return addr;
    }

    public void setAddr(String addr) {
        this.addr = addr;
    }


    /**
     * {@code TradeTrustDnsTextRecord} builder static inner class.
     */
    public static final class Builder {
        private String type;
        private String net;
        private String netId;
        private String addr;

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
         * Sets the {@code net} and returns a reference to this Builder enabling method chaining.
         *
         * @param net the {@code net} to set
         * @return a reference to this Builder
         */
        public Builder net(String net) {
            this.net = net;
            return this;
        }

        /**
         * Sets the {@code netId} and returns a reference to this Builder enabling method chaining.
         *
         * @param netId the {@code netId} to set
         * @return a reference to this Builder
         */
        public Builder netId(String netId) {
            this.netId = netId;
            return this;
        }

        /**
         * Sets the {@code addr} and returns a reference to this Builder enabling method chaining.
         *
         * @param addr the {@code addr} to set
         * @return a reference to this Builder
         */
        public Builder addr(String addr) {
            this.addr = addr;
            return this;
        }

        /**
         * Returns a {@code TradeTrustDnsTextRecord} built from the parameters previously set.
         *
         * @return a {@code TradeTrustDnsTextRecord} built with parameters of this {@code TradeTrustDnsTextRecord.Builder}
         */
        public TradeTrustDnsTextRecord build() {
            return new TradeTrustDnsTextRecord(this);
        }
    }
}
