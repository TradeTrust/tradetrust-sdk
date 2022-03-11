package com.reddate.tradetrust.framework.v2;

import com.alibaba.fastjson.JSON;
import com.github.wnameless.json.flattener.FlattenMode;
import com.github.wnameless.json.flattener.JsonFlattener;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.reddate.tradetrust.framework.Hash.*;

/**
 * @author SunKangJian
 */
public class Digest {

    private static final Logger logger = LoggerFactory.getLogger(Digest.class);

    /**
     * TODO
     * @param document
     * @return
     */
    public static String digestDocument(JSONObject document) {
        // 从过滤后的数据中准备哈希集合
        List<String> hashedDataArray = new ArrayList<>();
        try {
            JSONArray objects = document
                    .getJSONObject("privacy")
                    .getJSONArray("obfuscatedData");
            for (int i = 0; i < objects.length(); i++) {
                hashedDataArray.add(objects.getString(i));
            }
        } catch (JSONException e) {
            logger.debug("privacy.obfuscatedData not found, default hashedDataArray is []");
        }

        // 从可见数据准备哈希集合
        JSONObject unhashedData = document.getJSONObject("data");
        String flattenedData = new JsonFlattener(unhashedData.toString())
                .withFlattenMode(FlattenMode.MONGODB)
                .ignoreReservedCharacters()
                .flatten();
        List<String> hashedUnhashedDataArray = new JSONObject(flattenedData).toMap().entrySet().stream()
                .map(entry -> keccak256(JSON.toJSONString(entry)))
                .collect(Collectors.toList());

        // 组合两个集合并对它们进行排序，以确保确定性
        List<String> combinedHashes = Stream.of(hashedDataArray, hashedUnhashedDataArray)
                .flatMap(Collection::stream)
                .sorted()
                .collect(Collectors.toList());
        return keccak256(JSON.toJSONString(combinedHashes));
    }


}
