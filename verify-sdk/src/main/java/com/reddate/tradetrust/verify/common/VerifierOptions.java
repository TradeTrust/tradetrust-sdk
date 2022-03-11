package com.reddate.tradetrust.verify.common;

import com.reddate.tradetrust.blockchain.provider.Web3jProvider;

/**
 * 验证者选项
 * @author SunKangJian
 */
public class VerifierOptions {

    private Web3jProvider provider;

    private VerifierOptions(Builder builder) {
        setProvider(builder.provider);
    }

    public Web3jProvider getProvider() {
        return provider;
    }

    public void setProvider(Web3jProvider provider) {
        this.provider = provider;
    }


    /**
     * {@code VerifierOptions} builder static inner class.
     */
    public static final class Builder {
        private Web3jProvider provider;

        public Builder() {
        }

        /**
         * Sets the {@code provider} and returns a reference to this Builder enabling method chaining.
         *
         * @param provider the {@code provider} to set
         * @return a reference to this Builder
         */
        public Builder provider(Web3jProvider provider) {
            this.provider = provider;
            return this;
        }

        /**
         * Returns a {@code VerifierOptions} built from the parameters previously set.
         *
         * @return a {@code VerifierOptions} built with parameters of this {@code VerifierOptions.Builder}
         */
        public VerifierOptions build() {
            return new VerifierOptions(this);
        }
    }
}
