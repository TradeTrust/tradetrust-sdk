package com.reddate.tradetrust.blockchain.provider;

import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.Ethereum;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.ContractGasProvider;
import org.web3j.tx.gas.DefaultGasProvider;

/**
 * Web3j提供者
 * @author SunKangJian
 */
public class Web3jProvider {

    private EthereumNetwork ethereumNetwork;
    private Credentials credentials;
    private ContractGasProvider contractGasProvider;

    private Web3jProvider(Builder builder) {
        ethereumNetwork = builder.ethereumNetwork;
        credentials = builder.credentials;
        contractGasProvider = builder.contractGasProvider;
    }

    public EthereumNetwork getEthereumNetwork() {
        return ethereumNetwork;
    }

    public void setEthereumNetwork(EthereumNetwork ethereumNetwork) {
        this.ethereumNetwork = ethereumNetwork;
    }

    public Credentials getCredentials() {
        return credentials;
    }

    public void setCredentials(Credentials credentials) {
        this.credentials = credentials;
    }

    public ContractGasProvider getContractGasProvider() {
        return contractGasProvider;
    }

    public void setContractGasProvider(ContractGasProvider contractGasProvider) {
        this.contractGasProvider = contractGasProvider;
    }

    /**
     * 获取默认提供者
     * @return
     */
    public static Web3jProvider getDefaultProvider() {
        String privateKey = "0a574d449ae80d0a7633c6aec4784153b757cd2a875a57c20f295a7660940f63";
        return new Builder()
                .ethereumNetwork(EthereumNetwork.ROPSTEN)
                .credentials(Credentials.create(privateKey))
                .contractGasProvider(new DefaultGasProvider())
                .build();
    }

    /**
     * {@code Web3jProvider} builder static inner class.
     */
    public static final class Builder {
        private EthereumNetwork ethereumNetwork;
        private Credentials credentials;
        private ContractGasProvider contractGasProvider;

        public Builder() {
        }

        /**
         * Sets the {@code ethereumNetwork} and returns a reference to this Builder enabling method chaining.
         *
         * @param ethereumNetwork the {@code ethereumNetwork} to set
         * @return a reference to this Builder
         */
        public Builder ethereumNetwork(EthereumNetwork ethereumNetwork) {
            this.ethereumNetwork = ethereumNetwork;
            return this;
        }

        /**
         * Sets the {@code credentials} and returns a reference to this Builder enabling method chaining.
         *
         * @param credentials the {@code credentials} to set
         * @return a reference to this Builder
         */
        public Builder credentials(Credentials credentials) {
            this.credentials = credentials;
            return this;
        }

        /**
         * Sets the {@code contractGasProvider} and returns a reference to this Builder enabling method chaining.
         *
         * @param contractGasProvider the {@code contractGasProvider} to set
         * @return a reference to this Builder
         */
        public Builder contractGasProvider(ContractGasProvider contractGasProvider) {
            this.contractGasProvider = contractGasProvider;
            return this;
        }

        /**
         * Returns a {@code Web3jProvider} built from the parameters previously set.
         *
         * @return a {@code Web3jProvider} built with parameters of this {@code Web3jProvider.Builder}
         */
        public Web3jProvider build() {
            return new Web3jProvider(this);
        }
    }
}
