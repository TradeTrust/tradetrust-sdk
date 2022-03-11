package com.reddate.tradetrust.framework;

import com.reddate.tradetrust.verify.common.VerificationFragment;
import com.reddate.tradetrust.verify.common.VerifierOptions;
import org.json.JSONObject;

/**
 * 验证者接口
 * @author SunKangJian
 */
public interface Verifier {

    /**
     * 跳过
     * @param document
     * @param options
     * @return 跳过的结果片段
     */
    VerificationFragment skip(JSONObject document, VerifierOptions options);

    /**
     * 测试
     * @param document
     * @param options
     * @return 是否满足条件
     */
    boolean test(JSONObject document, VerifierOptions options);

    /**
     * 验证
     * @param document
     * @param options
     * @return 验证的结果片段
     */
    VerificationFragment verify(JSONObject document, VerifierOptions options);


}
