package com.reddate.tradetrust.framework.v2;

import com.reddate.tradetrust.framework.Verify;
import org.json.JSONArray;
import org.json.JSONObject;

import static com.reddate.tradetrust.framework.v2.Digest.digestDocument;
import static com.reddate.tradetrust.framework.Merkle.checkProof;

/**
 * v2版本文档验证
 * @author SunKangJian
 */
public class VerifyV2 implements Verify {

    /**
     * 验证文档
     * @param document
     * @return
     */
    @Override
    public boolean verify(JSONObject document) {
        JSONObject signature = document.optJSONObject("signature");
        if (signature == null) {
            return false;
        }
        // 检查 targetHash
        String digest = digestDocument(document);
        String targetHash = signature.optString("targetHash");
        if (!digest.equals(targetHash)) {
            return false;
        }
        JSONArray proof = signature.optJSONArray("proof");
        proof = proof == null ? new JSONArray() : proof;
        String merkleRoot = signature.optString("merkleRoot");
        // 从 targetHash 和 proof 中计算出merkleRoot，然后与文件中的 merkleRoot 进行比较
        return checkProof(proof, merkleRoot, targetHash);
    }

}
