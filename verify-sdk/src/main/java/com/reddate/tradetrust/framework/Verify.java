package com.reddate.tradetrust.framework;

import org.json.JSONObject;

/**
 * 文档验证接口
 * @author SunKangJian
 */
public interface Verify {

    /**
     * 验证文档
     * @param document
     * @return
     */
    boolean verify(JSONObject document);
}
