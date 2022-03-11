package com.reddate.tradetrust.framework.v3;

import com.alibaba.fastjson.JSON;
import com.github.wnameless.json.flattener.FlattenMode;
import com.github.wnameless.json.flattener.JsonFlattener;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.reddate.tradetrust.framework.Hash.keccak256;

/**
 * @author SunKangJian
 */
public class Digest {

    private static final Logger logger = LoggerFactory.getLogger(Digest.class);

    public static String digestCredential(JSONObject document, List<Map<String, String>> salts, List<String> obfuscatedData) {
        Map<String, Object> documentFlattened = JsonFlattener.flattenAsMap(document.toString());
        List<String> hashedUnhashedDataArray = salts.stream()
                .filter(salt -> documentFlattened.containsKey(salt.get("path")))
                .map(salt -> {
                    JSONObject json = new JSONObject();
                    json.put(salt.get("path"), salt.get("value")+":"+documentFlattened.get(salt.get("path")));
                    return keccak256(json.toString());
                })
                .collect(Collectors.toList());

        // 组合两个集合并对它们进行排序，以确保确定性
        List<String> combinedHashes = Stream.of(obfuscatedData, hashedUnhashedDataArray)
                .flatMap(Collection::stream)
                .sorted()
                .collect(Collectors.toList());

        return keccak256(JSON.toJSONString(combinedHashes));
    }

}
