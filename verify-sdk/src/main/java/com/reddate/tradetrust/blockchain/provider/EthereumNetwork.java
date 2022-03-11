package com.reddate.tradetrust.blockchain.provider;

/**
 * 以太坊网络参数
 * @author SunKangJian
 */

public enum EthereumNetwork {

    /**
     * 以太坊主网
     */
    MAINNET(1, "mainnet", "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"),

    /**
     * 以太坊 Ropsten
     */
    ROPSTEN(3, "ropsten", "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"),

    /**
     * 以太坊 Rinkeby
     */
    RINKEBY(4, "rinkeby", "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");

    private Integer chainId;
    private String name;
    private String rpcUrl;

    EthereumNetwork(Integer chainId, String name, String rpcUrl) {
        this.chainId = chainId;
        this.name = name;
        this.rpcUrl = rpcUrl;
    }

    public Integer getChainId() {
        return chainId;
    }

    public void setChainId(Integer chainId) {
        this.chainId = chainId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRpcUrl() {
        return rpcUrl;
    }

    public void setRpcUrl(String rpcUrl) {
        this.rpcUrl = rpcUrl;
    }
}
