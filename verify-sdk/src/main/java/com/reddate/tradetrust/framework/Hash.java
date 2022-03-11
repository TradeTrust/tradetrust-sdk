package com.reddate.tradetrust.framework;

import org.bouncycastle.util.encoders.Hex;

import java.nio.charset.StandardCharsets;

public class Hash {

    /**
     * 字符串哈希
     * @param message
     * @return
     */
    public static String keccak256(String message) {
        return Hex.toHexString(org.web3j.crypto.Hash.sha3(message.getBytes(StandardCharsets.UTF_8)));
    }

    /**
     * 字节数组哈希
     * @param message
     * @return
     */
    public static String keccak256(byte[] message) {
        return Hex.toHexString(org.web3j.crypto.Hash.sha3(message));
    }
}
