/*
 * Copyright 2015 Network New Technologies Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.networknt.light.rule;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.networknt.light.server.DbService;
import com.networknt.light.util.HashUtil;
import com.networknt.light.util.ServiceLocator;
import com.networknt.light.util.Util;
import com.orientechnologies.orient.core.command.script.OCommandScript;
import com.orientechnologies.orient.core.db.document.ODatabaseDocumentTx;
import com.orientechnologies.orient.core.db.record.OIdentifiable;
import com.orientechnologies.orient.core.index.OCompositeKey;
import com.orientechnologies.orient.core.index.OIndex;
import com.orientechnologies.orient.core.metadata.schema.OSchema;
import com.orientechnologies.orient.core.record.impl.ODocument;
import com.orientechnologies.orient.core.serialization.serializer.OJSONWriter;
import com.orientechnologies.orient.core.sql.query.OSQLSynchQuery;
import com.tinkerpop.blueprints.Direction;
import com.tinkerpop.blueprints.Edge;
import com.tinkerpop.blueprints.Vertex;
import com.tinkerpop.blueprints.impls.orient.OrientGraph;
import com.tinkerpop.blueprints.impls.orient.OrientVertex;

import java.util.*;

/**
 * Created by steve on 28/12/14.
 * This the abstract class that implements functions for Blog, Forum and News as
 * they share similar traits. Since ids are generated and there is no need to check
 * uniqueness. Just make sure parent and children are checked and converted to ids.
 *
 */
public abstract class AbstractBfnRule  extends AbstractRule implements Rule {
    ObjectMapper mapper = ServiceLocator.getInstance().getMapper();
    public abstract boolean execute (Object ...objects) throws Exception;

    public boolean addBfn (String bfnType, Object ...objects) throws Exception {
        Map<String, Object> inputMap = (Map<String, Object>) objects[0];
        Map<String, Object> data = (Map<String, Object>) inputMap.get("data");
        Map<String, Object> payload = (Map<String, Object>) inputMap.get("payload");
        Map<String, Object> user = (Map<String, Object>)payload.get("user");
        String bfnId = (String) data.get(bfnType + "Id");
        String host = (String) data.get("host");
        String error = null;
        String userHost = (String)user.get("host");
        if(userHost != null && !userHost.equals(host)) {
            error = "You can only add " + bfnType + " from host: " + host;
            inputMap.put("responseCode", 403);
        } else {
            Map eventMap = getEventMap(inputMap);
            Map<String, Object> eventData = (Map<String, Object>)eventMap.get("data");
            inputMap.put("eventMap", eventMap);
            eventData.putAll((Map<String, Object>) inputMap.get("data"));
            eventData.put("createDate", new java.util.Date());
            eventData.put("createUserId", user.get("userId"));
            OrientGraph graph = ServiceLocator.getInstance().getGraph();
            try {
                ODocument bfn = getODocumentByHostId(graph, bfnType + "HostIdIdx", host, bfnId);
                if(bfn != null) {
                    error = "Id " + bfnId + " exists on host " + host;
                    inputMap.put("responseCode", 400);
                } else {
                    // make sure parent exists if it is not empty.
                    String parentRid = (String)data.get("parent");
                    if(parentRid != null) {
                        Vertex parent = DbService.getVertexByRid(graph, parentRid);
                        if(parent == null) {
                            error = "Parent with @rid " + parentRid + " cannot be found.";
                            inputMap.put("responseCode", 404);
                        } else {
                            // convert parent from @rid to id
                            eventData.put("parent", parent.getProperty(bfnType + "Id"));
                        }
                    }
                    if(error == null) {
                        // make sure all children exist if there are any.
                        // and make sure all children have empty parent.
                        List<String> childrenRids = (List<String>)data.get("children");
                        if(childrenRids != null && childrenRids.size() > 0) {
                            List<String> childrenIds = new ArrayList<String>();
                            for(String childRid: childrenRids) {
                                if(childRid != null) {
                                    if(childRid.equals(parentRid)) {
                                        error = "Parent shows up in the Children list";
                                        inputMap.put("responseCode", 400);
                                        break;
                                    }
                                    Vertex child = DbService.getVertexByRid(graph, childRid);
                                    if(child == null) {
                                        error = "Child with @rid " + childRid + " cannot be found.";
                                        inputMap.put("responseCode", 404);
                                        break;
                                    } else {
                                        childrenIds.add((String)child.getProperty(bfnType + "Id"));
                                    }
                                }
                            }
                            eventData.put("children", childrenIds);
                        }
                    }
                    if(error == null) {
                        String id = bfnType + "Id";
                        eventMap.put(id, HashUtil.generateUUID());
                    }
                }
            } catch (Exception e) {
                logger.error("Exception:", e);
                throw e;
            } finally {
                graph.shutdown();
            }
        }
        if(error != null) {
            inputMap.put("error", error);
            return false;
        } else {
            return true;
        }
    }

    public boolean addBfnEv (String bfnType, Object ...objects) throws Exception {
        Map<String, Object> eventMap = (Map<String, Object>) objects[0];
        Map<String, Object> data = (Map<String, Object>) eventMap.get("data");
        addBfnDb(bfnType, data);
        return true;
    }

    protected void addBfnDb(String bfnType, Map<String, Object> data) throws Exception {
        String className = bfnType.substring(0, 1).toUpperCase() + bfnType.substring(1);
        String id = bfnType + "Id";
        String index = className + "." + id;
        OrientGraph graph = ServiceLocator.getInstance().getGraph();
        try{
            graph.begin();
            Vertex createUser = graph.getVertexByKey("User.userId", data.remove("createUserId"));
            OrientVertex bfn = graph.addVertex("class:" + className, data);
            createUser.addEdge("Create", bfn);
            // parent
            if(data.get("parent") != null) {
                Vertex parent = graph.getVertexByKey(index, data.get("parent"));
                if(parent != null) {
                    parent.addEdge("Own", bfn);
                }
            }
            // children
            List<String> childrenIds = (List<String>)data.get("children");
            if(childrenIds != null) {
                for(String childId: childrenIds) {
                    Vertex child = graph.getVertexByKey(index, childId);
                    if(child != null) {
                        bfn.addEdge("Own", child);
                    }
                }
            }
            graph.commit();
        } catch (Exception e) {
            logger.error("Exception:", e);
            graph.rollback();
        } finally {
            graph.shutdown();
        }
    }

    public boolean delBfn (String bfnType, Object ...objects) throws Exception {
        Map<String, Object> inputMap = (Map<String, Object>) objects[0];
        Map<String, Object> data = (Map<String, Object>) inputMap.get("data");
        String rid = (String) data.get("@rid");
        String host = (String) data.get("host");
        String error = null;
        Map<String, Object> payload = (Map<String, Object>) inputMap.get("payload");
        Map<String, Object> user = (Map<String, Object>)payload.get("user");
        OrientGraph graph = ServiceLocator.getInstance().getGraph();
        try {
            String userHost = (String)user.get("host");
            if(userHost != null && !userHost.equals(host)) {
                error = "You can only delete " + bfnType + " from host: " + host;
                inputMap.put("responseCode", 403);
            } else {
                Vertex bfn = DbService.getVertexByRid(graph, rid);
                if(bfn != null) {
                    Map eventMap = getEventMap(inputMap);
                    Map<String, Object> eventData = (Map<String, Object>)eventMap.get("data");
                    inputMap.put("eventMap", eventMap);
                    String id = bfnType + "Id";
                    eventData.put(id, bfn.getProperty(id));
                } else {
                    error = "@rid " + rid + " doesn't exist on host " + host;
                    inputMap.put("responseCode", 404);
                }
            }
        } catch (Exception e) {
            logger.error("Exception:", e);
            throw e;
        } finally {
            graph.shutdown();
        }
        if(error != null) {
            inputMap.put("error", error);
            return false;
        } else {
            return true;
        }
    }

    public boolean delBfnEv (String bfnType, Object ...objects) throws Exception {
        Map<String, Object> eventMap = (Map<String, Object>) objects[0];
        Map<String, Object> data = (Map<String, Object>) eventMap.get("data");
        delBfnDb(bfnType, data);
        return true;
    }

    protected void delBfnDb(String bfnType, Map<String, Object> data) throws Exception {
        String className = bfnType.substring(0, 1).toUpperCase() + bfnType.substring(1);
        String id = bfnType + "Id";
        OrientGraph graph = ServiceLocator.getInstance().getGraph();
        try{
            graph.begin();
            Vertex bfn = graph.getVertexByKey(className + "." + id, data.get(id));
            if(bfn != null) {
                graph.removeVertex(bfn);
            }
            graph.commit();
        } catch (Exception e) {
            logger.error("Exception:", e);
            graph.rollback();
        } finally {
            graph.shutdown();
        }
    }

    public boolean updBfn (String bfnType, Object ...objects) throws Exception {
        Map<String, Object> inputMap = (Map<String, Object>) objects[0];
        Map<String, Object> data = (Map<String, Object>) inputMap.get("data");
        String rid = (String) data.get("@rid");
        String host = (String) data.get("host");
        String id = bfnType + "Id";
        Map<String, Object> payload = (Map<String, Object>) inputMap.get("payload");
        Map<String, Object> user = (Map<String, Object>)payload.get("user");
        OrientGraph graph = ServiceLocator.getInstance().getGraph();
        try {
            String userHost = (String)user.get("host");
            if(userHost != null && !userHost.equals(host)) {
                inputMap.put("error", "You can only update " + bfnType + " from host: " + host);
                inputMap.put("responseCode", 403);
                return false;
            } else {
                Vertex bfn = DbService.getVertexByRid(graph, rid);
                if(bfn != null) {
                    Map eventMap = getEventMap(inputMap);
                    Map<String, Object> eventData = (Map<String, Object>)eventMap.get("data");
                    inputMap.put("eventMap", eventMap);
                    eventData.putAll((Map<String, Object>)inputMap.get("data"));
                    eventData.put("updateDate", new java.util.Date());
                    eventData.put("updateUserId", user.get("userId"));

                    // make sure parent exists if it is not empty.
                    String parentRid = (String)data.get("parent");
                    if(parentRid != null) {
                        if(rid.equals(parentRid)) {
                            inputMap.put("error", "parent @rid is the same as current @rid");
                            inputMap.put("responseCode", 400);
                            return false;
                        }
                        Vertex parent = DbService.getVertexByRid(graph, parentRid);
                        if(parent != null) {
                            eventData.put("parent", parent.getProperty(id));
                        } else {
                            inputMap.put("error", "Parent with @rid " + parentRid + " cannot be found");
                            inputMap.put("responseCode", 404);
                            return false;
                        }
                    }
                    // make sure all children exist if there are any.
                    // and make sure all children have empty parent.
                    List<String> childrenRids = (List<String>)data.get("children");
                    if(childrenRids != null && childrenRids.size() > 0) {
                        List<String> childrenIds = new ArrayList<String>();
                        Set<String> inputChildren = new HashSet<String>();
                        for(String childRid: childrenRids) {
                            if(childRid.equals(parentRid)) {
                                inputMap.put("error", "Parent shows up in the Children list");
                                inputMap.put("responseCode", 400);
                                return false;
                            }
                            if(childRid.equals(rid)) {
                                inputMap.put("error", "Current object shows up in the Children list");
                                inputMap.put("responseCode", 400);
                                return false;
                            }
                            Vertex child = DbService.getVertexByRid(graph, childRid);
                            if(child == null) {
                                inputMap.put("error", "Child with @rid " + childRid + " cannot be found");
                                inputMap.put("responseCode", 404);
                                return false;
                            } else {
                                inputChildren.add((String)child.getProperty(id));


                            }
                        }
                        Set<String> storedChildren = new HashSet<String>();
                        for (Vertex vertex : (Iterable<Vertex>) bfn.getVertices(Direction.OUT, "Own")) {
                            storedChildren.add((String)vertex.getProperty(id));
                        }

                        Set<String> addChildren = new HashSet<String>(inputChildren);
                        Set<String> delChildren = new HashSet<String>(storedChildren);
                        addChildren.removeAll(storedChildren);
                        delChildren.removeAll(inputChildren);

                        if(addChildren.size() > 0) eventData.put("addChildren", addChildren);
                        if(delChildren.size() > 0) eventData.put("delChildren", delChildren);
                    }
                } else {
                    inputMap.put("error",  "@rid " + rid + " cannot be found");
                    inputMap.put("responseCode", 404);
                    return false;
                }
            }
        } catch (Exception e) {
            logger.error("Exception:", e);
            throw e;
        } finally {
            graph.shutdown();
        }
        return true;
    }

    public boolean updBfnEv (String bfnType, Object ...objects) throws Exception {
        Map<String, Object> eventMap = (Map<String, Object>) objects[0];
        Map<String, Object> data = (Map<String, Object>) eventMap.get("data");
        updBfnDb(bfnType, data);
        return true;
    }

    protected void updBfnDb(String bfnType, Map<String, Object> data) throws Exception {
        String className = bfnType.substring(0, 1).toUpperCase() + bfnType.substring(1);
        String id = bfnType + "Id";
        String index = className + "." + id;
        OrientGraph graph = ServiceLocator.getInstance().getGraph();
        try{
            graph.begin();
            Vertex updateUser = graph.getVertexByKey("User.userId", data.remove("updateUserId"));
            Vertex bfn = graph.getVertexByKey(className + "." + id, data.get(id));
            if(bfn != null) {
                if(data.get("name") != null) {
                    bfn.setProperty("name", data.get("name"));
                } else {
                    bfn.removeProperty("name");
                }
                if(data.get("desc") != null) {
                    bfn.setProperty("desc", data.get("desc"));
                } else {
                    bfn.removeProperty("desc");
                }
                if(data.get("attributes") != null) {
                    bfn.setProperty("attributes", data.get("attributes"));
                } else {
                    bfn.removeProperty("attributes");
                }
                bfn.setProperty("updateDate", data.get("updateDate"));

                // parent
                if(data.get("parent") != null) {
                    Vertex parent = graph.getVertexByKey(className + "." + id, data.get("parent"));
                    if (parent != null) {
                        // check if the edge exists or not.
                        boolean createEdge = true;
                        for (Edge edge : (Iterable<Edge>) parent.getEdges(Direction.OUT, "Own")) {
                            if (edge.getVertex(Direction.IN).equals(bfn)) createEdge = false;
                        }
                        if (createEdge) parent.addEdge("Own", bfn);
                    }
                } else {
                    // no parent in the map.
                    for (Edge edge : (Iterable<Edge>) bfn.getEdges(Direction.IN, "Own")) {
                        graph.removeEdge(edge);
                    }
                }
                // handle addChildren and delChildren
                Set<String> addChildren = (Set)data.get("addChildren");
                if(addChildren != null) {
                    for(String childId: addChildren) {
                        Vertex vertex = graph.getVertexByKey(className + "." + id, childId);
                        bfn.addEdge("Own", vertex);
                    }
                }
                Set<String> delChildren = (Set)data.get("delChildren");
                if(delChildren != null) {
                    for(String childId: delChildren) {
                        Vertex vertex = graph.getVertexByKey(className + "." + id, childId);
                        for (Edge edge : (Iterable<Edge>) bfn.getEdges(Direction.OUT, "Own")) {
                            if(edge.getVertex(Direction.IN).equals(vertex)) graph.removeEdge(edge);
                        }
                    }
                }
                // updateUser
                updateUser.addEdge("Update", bfn);
            }
            graph.commit();
        } catch (Exception e) {
            logger.error("Exception:", e);
            graph.rollback();
        } finally {
            graph.shutdown();
        }
    }


    public boolean addPost(String bfnType, Object ...objects) throws Exception {
        Map<String, Object> inputMap = (Map<String, Object>) objects[0];
        Map<String, Object> data = (Map<String, Object>) inputMap.get("data");
        String parentId = (String) data.get("parentId");
        String host = (String) data.get("host");
        String error = null;
        Map<String, Object> payload = (Map<String, Object>) inputMap.get("payload");
        String className = bfnType.substring(0, 1).toUpperCase() + bfnType.substring(1);
        String id = bfnType + "Id";
        String index = className + "." + id;
        OrientGraph graph = ServiceLocator.getInstance().getGraph();
        try {
            Vertex parent = graph.getVertexByKey(index, parentId);
            if(parent == null) {
                error = "Id " + parentId + " doesn't exist on host " + host;
                inputMap.put("responseCode", 400);
            } else {
                Map<String, Object> user = (Map<String, Object>)payload.get("user");
                Map eventMap = getEventMap(inputMap);
                Map<String, Object> eventData = (Map<String, Object>)eventMap.get("data");
                inputMap.put("eventMap", eventMap);
                eventData.putAll((Map<String, Object>) inputMap.get("data"));
                eventData.put("postId", HashUtil.generateUUID());
                eventData.put("createDate", new java.util.Date());
                eventData.put("createUserId", user.get("userId"));
            }
        } catch (Exception e) {
            logger.error("Exception:", e);
            throw e;
        } finally {
            graph.shutdown();
        }
        if(error != null) {
            inputMap.put("error", error);
            return false;
        } else {
            return true;
        }
    }

    public boolean addPostEv (String bfnType, Object ...objects) throws Exception {
        Map<String, Object> eventMap = (Map<String, Object>) objects[0];
        Map<String, Object> data = (Map<String, Object>) eventMap.get("data");
        addPostDb(bfnType, data);
        return true;
    }

    protected void addPostDb(String bfnType, Map<String, Object> data) throws Exception {
        String className = bfnType.substring(0, 1).toUpperCase() + bfnType.substring(1);
        String id = bfnType + "Id";
        String index = className + "." + id;
        OrientGraph graph = ServiceLocator.getInstance().getGraph();
        try{
            graph.begin();
            Vertex createUser = graph.getVertexByKey("User.userId", data.remove("createUserId"));
            OrientVertex post = graph.addVertex("class:Post", data);
            createUser.addEdge("Create", post);
            // parent
            Vertex parent = graph.getVertexByKey(index, data.get("parent"));
            if(parent != null) {
                parent.addEdge("HasPost", post);
            }
            // tag
            Set<String> inputTags = data.get("tags") != null? new HashSet<String>(Arrays.asList(((String)data.get("tags")).split("\\s*,\\s*"))) : new HashSet<String>();
            String host = (String)data.get("host");
            for(String tagId: inputTags) {
                Vertex tag = null;
                // get the tag is it exists
                OIndex<?> tagHostNameIdx = graph.getRawGraph().getMetadata().getIndexManager().getIndex("tagHostNameIdx");
                OCompositeKey tagKey = new OCompositeKey(host, tagId);
                OIdentifiable tagOid = (OIdentifiable) tagHostNameIdx.get(tagKey);
                if (tagOid != null) {
                    tag = (Vertex) tagOid.getRecord();
                    post.addEdge("HasTag", tag);
                } else {
                    tag = graph.addVertex("class:Tag", "host", host, "tagId", tagId, "createDate", data.get("createDate"));
                    createUser.addEdge("Create", tag);
                    post.addEdge("HasTag", tag);
                }
            }
            graph.commit();
        } catch (Exception e) {
            logger.error("Exception:", e);
            graph.rollback();
        } finally {
            graph.shutdown();
        }
    }

    public boolean getBfnTree(String bfnType, Object ...objects) throws Exception {
        Map<String, Object> inputMap = (Map<String, Object>) objects[0];
        Map<String, Object> data = (Map<String, Object>)inputMap.get("data");
        String host = (String)data.get("host");
        String json = getBfnTree(bfnType, host);
        if(json != null) {
            inputMap.put("result", json);
            return true;
        } else {
            inputMap.put("error", "No document can be found");
            inputMap.put("responseCode", 404);
            return false;
        }
    }

    protected String getBfnTree(String bfnType, String host) {
        String json = null;
        String sql = "SELECT FROM " + bfnType + " WHERE host = ? and parent IS NULL ORDER BY id";
        OrientGraph graph = ServiceLocator.getInstance().getGraph();
        try {
            OSQLSynchQuery<ODocument> query = new OSQLSynchQuery<ODocument>(sql);
            List<ODocument> docs = graph.getRawGraph().command(query).execute(host);
            if(docs.size() > 0) {
                json = OJSONWriter.listToJSON(docs, "fetchPlan:*:-1");
            }
        } catch (Exception e) {
            logger.error("Exception:", e);
        } finally {
            graph.shutdown();
        }
        return json;
    }

    public boolean getBfnPost(String bfnType, Object ...objects) throws Exception {
        Map<String, Object> inputMap = (Map<String, Object>) objects[0];
        Map<String, Object> data = (Map<String, Object>)inputMap.get("data");
        if(data.get("id") == null || data.get("host") == null) {
            inputMap.put("error", "Host and Id are required");
            inputMap.put("responseCode", 400);
            return false;
        }
        String posts = getBfnPostDb(bfnType, data);
        if(posts != null) {
            inputMap.put("result", posts);
            return true;
        } else {
            inputMap.put("error", "No post can be found");
            inputMap.put("responseCode", 404);
            return false;
        }
    }

    protected String getBfnPostDb(String bfnType, Map<String, Object> data) {
        String json = null;
        String sql = "select from (traverse posts, children from (select from " + bfnType + " where host = ? and id = ?)) where @class = 'Post'";
        OrientGraph graph = ServiceLocator.getInstance().getGraph();
        try {
            OSQLSynchQuery<ODocument> query = new OSQLSynchQuery<ODocument>(sql);
            List<ODocument> forums = graph.getRawGraph().command(query).execute(data.get("host"), data.get("id"));
            if(forums.size() > 0) {
                json = OJSONWriter.listToJSON(forums, null);
            }
        } catch (Exception e) {
            logger.error("Exception:", e);
        } finally {
            graph.shutdown();
        }
        return json;
    }

    public boolean getBfn(String bfnType, Object ...objects) throws Exception {
        Map<String, Object> inputMap = (Map<String, Object>) objects[0];
        Map<String, Object> data = (Map<String, Object>)inputMap.get("data");
        Map<String, Object> payload = (Map<String, Object>) inputMap.get("payload");
        Map<String, Object> user = (Map<String, Object>) payload.get("user");
        String host = (String)data.get("host");
        Object userHost = user.get("host");
        if(userHost != null && !userHost.equals(host)) {
            inputMap.put("error", "You can only get " + bfnType + " from host: " + host);
            inputMap.put("responseCode", 403);
            return false;
        } else {
            String docs = getBfnDb(bfnType, host);
            if(docs != null) {
                inputMap.put("result", docs);
                return true;
            } else {
                inputMap.put("error", "No document can be found");
                inputMap.put("responseCode", 404);
                return false;
            }
        }
    }

    protected String getBfnDb(String bfhType, String host) {
        String json = null;
        String sql = "SELECT FROM " + bfhType + " WHERE host = ? ORDER BY createDate";
        OrientGraph graph = ServiceLocator.getInstance().getGraph();
        try {
            OSQLSynchQuery<ODocument> query = new OSQLSynchQuery<ODocument>(sql);
            List<ODocument> docs = graph.getRawGraph().command(query).execute(host);
            if(docs.size() > 0) {
                json = OJSONWriter.listToJSON(docs, null);
            }
        } catch (Exception e) {
            logger.error("Exception:", e);
        } finally {
            graph.shutdown();
        }
        return json;
    }

    public boolean getBfnDropdown (String bfnType, Object ...objects) throws Exception {
        Map<String, Object> inputMap = (Map<String, Object>) objects[0];
        Map<String, Object> data = (Map<String, Object>)inputMap.get("data");
        Map<String, Object> payload = (Map<String, Object>) inputMap.get("payload");
        String host = (String)data.get("host");
        if(payload == null) {
            inputMap.put("error", "Login is required");
            inputMap.put("responseCode", 401);
            return false;
        } else {
            String docs = getBfnDropdownDb(bfnType, host);
            if(docs != null) {
                inputMap.put("result", docs);
                return true;
            } else {
                inputMap.put("error", "No document can be found");
                inputMap.put("responseCode", 404);
                return false;
            }
        }
    }

    protected String getBfnDropdownDb(String bfnType, String host) {
        String json = null;
        String sql = "SELECT FROM " + bfnType + " WHERE host = ? ORDER BY id";
        OrientGraph graph = ServiceLocator.getInstance().getGraph();
        try {
            OSQLSynchQuery<ODocument> query = new OSQLSynchQuery<ODocument>(sql);
            List<ODocument> docs = graph.getRawGraph().command(query).execute(host);
            if(docs.size() > 0) {
                List<Map<String, String>> list = new ArrayList<Map<String, String>>();
                for(ODocument doc: docs) {
                    Map<String, String> map = new HashMap<String, String>();
                    map.put("label", (String)doc.field("id"));
                    map.put("value", doc.field("@rid").toString());
                    list.add(map);
                }
                json = mapper.writeValueAsString(list);
            }
        } catch (Exception e) {
            logger.error("Exception:", e);
        } finally {
            graph.shutdown();
        }
        return json;
    }

}
