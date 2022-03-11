package com.reddate.tradetrust.framework;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.web3j.utils.Numeric;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.stream.Collectors;

import static com.reddate.tradetrust.framework.Hash.keccak256;

/**
 * 默克尔算法
 * @author SunKangJian
 */
public class Merkle {

    /**
     * 该方法通过提供的proof来获得提供的merkleRoot
     * @param proof 计算merkleRoot所需的叔叔Hash列表
     * @param merkleRoot 默克尔根
     * @param targetHash 被验证的叶子节点
     * @return
     */
    public static boolean checkProof(JSONArray proof, String merkleRoot, String targetHash) {
        LinkedList<String> proofList = proof.toList().stream()
                .map(String::valueOf).collect(Collectors.toCollection(LinkedList::new));
        proofList.addFirst(targetHash);
        String proofRoot = proofList.stream().reduce((first, second) -> {
            String[] arr = new String[]{first, second};
            Arrays.sort(arr);
            return keccak256(Numeric.hexStringToByteArray(StringUtils.join(arr)));
        }).orElse(null);
        return merkleRoot.equals(proofRoot);
    }
}
