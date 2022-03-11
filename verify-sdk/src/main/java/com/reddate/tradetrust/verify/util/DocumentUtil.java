package com.reddate.tradetrust.verify.util;

import com.alibaba.fastjson.JSON;
import org.everit.json.schema.Schema;
import org.everit.json.schema.ValidationException;
import org.everit.json.schema.loader.SchemaLoader;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

public class DocumentUtil {

    private static final Logger logger = LoggerFactory.getLogger(DocumentUtil.class);

    private static final Integer UUIDV4_LENGTH = 37;

    public static boolean isWrappedV2Document(JSONObject document) {
        if (document == null) {
            return false;
        }
        try (InputStream inputStream = DocumentUtil.class.getResourceAsStream("/schema/schema-2.0.json")) {
            JSONObject rawSchema = new JSONObject(new JSONTokener(inputStream));
            Schema schema = SchemaLoader.load(rawSchema);
            schema.validate(getData(document));
            return true;
        } catch (ValidationException e) {
            logger.info("invalid v2document, {}", e.getMessage());
            e.getCausingExceptions().stream()
                    .map(ValidationException::getMessage)
                    .forEach(logger::info);
        } catch (IOException e) {
            logger.warn("load schema failed, {}", e.getMessage());
        } catch (Exception e) {
            logger.info("isWrappedV2Document error, {}", e.getMessage());
        }
        return false;
    }

    public static boolean isWrappedV3Document(JSONObject document) {
        if (document == null) {
            return false;
        }
        try (InputStream inputStream = DocumentUtil.class.getResourceAsStream("/schema/schema-3.0.json")) {
            JSONObject rawSchema = new JSONObject(new JSONTokener(inputStream));
            Schema schema = SchemaLoader.load(rawSchema);
            schema.validate(document);
            return true;
        } catch (ValidationException e) {
            logger.info("invalid v3document, {}", e.getMessage());
            e.getCausingExceptions().stream()
                    .map(ValidationException::getMessage)
                    .forEach(logger::info);
        } catch (IOException e) {
            logger.warn("load schema failed, {}", e.getMessage());
        } catch (Exception e) {
            logger.info("isWrappedV3Document error, {}", e.getMessage());
        }
        return false;
    }

    public static JSONObject getData(JSONObject document) {
        JSONObject data = document.getJSONObject("data");
        return unsaltData(data);
    }

    private static JSONObject unsaltData(JSONObject data) {
        Map map = (Map)deepMap(data.toMap(), new UnSalt());
        return new JSONObject(map);
    }

    private static Object recursivelyApply(Object value, Function<String, String> function) {
        if (value instanceof String) {
            return function.apply(String.valueOf(value));
        }
        return deepMap(value, function);
    }

    private static Object deepMap(Object collection, Function<String, String> function) {
        if (collection instanceof List) {
            List<Map<Object, Object>> list = (List<Map<Object, Object>>) collection;
            for (Map<Object, Object> map : list) {
                for (Map.Entry<Object, Object> entry : map.entrySet()) {
                    entry.setValue(recursivelyApply(entry.getValue(), function));
                }
            }
        }
        if(collection instanceof Map) {
            Map<Object, Object> map = (Map<Object, Object>) collection;
            for (Map.Entry<Object, Object> entry : map.entrySet()) {
                entry.setValue(recursivelyApply(entry.getValue(), function));
            }
        }
        return collection;
    }

    private static boolean startsWithUuidV4(String input) {
        String[] elements = input.split(":");
        return isUUID(elements[0]);
    }

    private static boolean isUUID(String uuid) {
        // UUID校验
        String regex = "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$";
        if (uuid != null && uuid.matches(regex)) {
            return true;
        }
        return false;
    }

    static class UnSalt implements Function<String, String> {
        @Override
        public String apply(String value) {
            if (startsWithUuidV4(value)) {
                String untypedValue = value.substring(UUIDV4_LENGTH).trim();
                return untypedValue.substring(untypedValue.indexOf(":")+1);
            }
            return value;
        }
    }
}
