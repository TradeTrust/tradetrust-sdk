package com.reddate.tradetrust.framework.v3;

import com.reddate.tradetrust.framework.Verify;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.reddate.tradetrust.framework.v3.Digest.digestCredential;
import static com.reddate.tradetrust.framework.v3.Salt.*;
import static com.reddate.tradetrust.framework.Merkle.checkProof;

/**
 * v3版本文档验证
 * @author SunKangJian
 */
public class VerifyV3 implements Verify {

    /**
     * 验证文档
     * @param document
     * @return
     */
    @Override
    public boolean verify(JSONObject document) {
        JSONObject proof = document.optJSONObject("proof");
        if (proof == null) {
            return false;
        }
        List<Map<String, String>> decodedSalts = decodeSalt(proof.getString("salts"));
        JSONObject documentWithoutProof = new JSONObject();
        for (String key : document.keySet()) {
            if (!"proof".equals(key)) {
                documentWithoutProof.put(key, document.get(key));
            }
        }
        List<Map<String, Object>> visibleSalts = salt(documentWithoutProof);
        if (visibleSalts.size() != decodedSalts.size()) {
            return false;
        }

        // 检查 targetHash
        List<String> obfuscatedData = new ArrayList<>();
        Object obfuscated = document.optQuery("/proof/privacy/obfuscated");
        if (obfuscated != null) {
            for (Object o : ((JSONArray) obfuscated)) {
                obfuscatedData.add(o.toString());
            }
        }
        String digest = digestCredential(document, decodedSalts, obfuscatedData);
        String targetHash = proof.optString("targetHash");
        if (!digest.equals(targetHash)) {
            return false;
        }
        // 从 targetHash 和 proof 中计算出merkleRoot，然后与文件中的 merkleRoot 进行比较
        JSONArray proofs = proof.optJSONArray("proofs");
        proofs = proofs == null ? new JSONArray() : proofs;
        String merkleRoot = proof.optString("merkleRoot");
        return checkProof(proofs, merkleRoot, targetHash);
    }


}
