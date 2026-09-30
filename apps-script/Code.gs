/**
 * 수강신청 오류 점검 앱 - 의견 게시판 백엔드 (Google Apps Script)
 *
 * 배포: 배포 > 새 배포 > 웹 앱 > 실행 계정: 나, 액세스 권한: 모든 사용자
 * 설정: 프로젝트 설정 > 스크립트 속성에 ADMIN_KEY 를 직접 입력
 * 최초 1회: setup() 실행 (시트 탭과 SALT 생성)
 */

var POSTS_SHEET = "posts";
var COMMENTS_SHEET = "comments";
var POST_HEADERS = ["id", "createdAt", "nickname", "content", "appVersion", "passwordHash", "status"];
var COMMENT_HEADERS = ["id", "postId", "createdAt", "nickname", "content", "isAdmin", "status"];
var MAX_NICKNAME = 20;
var MAX_CONTENT = 2000;
var DEFAULT_PAGE_SIZE = 20;

function setup() {
  var ss = SpreadsheetApp.getActive();
  ensureSheet_(ss, POSTS_SHEET, POST_HEADERS);
  ensureSheet_(ss, COMMENTS_SHEET, COMMENT_HEADERS);
  var props = PropertiesService.getScriptProperties();
  if (!props.getProperty("SALT")) {
    props.setProperty("SALT", Utilities.getUuid());
  }
  if (!props.getProperty("ADMIN_KEY")) {
    Logger.log("ADMIN_KEY 가 없습니다. 프로젝트 설정 > 스크립트 속성에서 직접 입력하세요.");
  }
}

function ensureSheet_(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }
}

function doGet(e) {
  var params = (e && e.parameter) || {};
  var action = params.action || "list";
  try {
    if (action === "list") {
      return json_(listPosts_(params));
    }
    if (action === "ping") {
      return json_({ ok: true });
    }
    return json_({ ok: false, error: "unknown_action" });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function doPost(e) {
  var body = {};
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
  } catch (err) {
    return json_({ ok: false, error: "invalid_json" });
  }
  var action = body.action;
  try {
    switch (action) {
      case "createPost":
        return json_(createPost_(body));
      case "createComment":
        return json_(createComment_(body));
      case "deletePost":
        return json_(deletePost_(body));
      case "deleteComment":
        return json_(deleteComment_(body));
      case "verifyAdmin":
        return json_({ ok: true, isAdmin: isAdmin_(body.adminKey) });
      default:
        return json_({ ok: false, error: "unknown_action" });
    }
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function listPosts_(params) {
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var pageSize = Math.min(50, Math.max(1, parseInt(params.pageSize, 10) || DEFAULT_PAGE_SIZE));
  var posts = readRows_(POSTS_SHEET, POST_HEADERS).filter(function (row) {
    return row.status === "active";
  });
  posts.sort(function (a, b) {
    return String(b.createdAt).localeCompare(String(a.createdAt));
  });
  var total = posts.length;
  var pagePosts = posts.slice((page - 1) * pageSize, page * pageSize);
  var postIds = {};
  pagePosts.forEach(function (post) {
    postIds[post.id] = true;
  });
  var comments = readRows_(COMMENTS_SHEET, COMMENT_HEADERS).filter(function (row) {
    return row.status === "active" && postIds[row.postId];
  });
  comments.sort(function (a, b) {
    return String(a.createdAt).localeCompare(String(b.createdAt));
  });
  var byPost = {};
  comments.forEach(function (comment) {
    if (!byPost[comment.postId]) byPost[comment.postId] = [];
    byPost[comment.postId].push({
      id: comment.id,
      postId: comment.postId,
      createdAt: comment.createdAt,
      nickname: comment.nickname,
      content: comment.content,
      isAdmin: comment.isAdmin === true || comment.isAdmin === "TRUE" || comment.isAdmin === "true"
    });
  });
  return {
    ok: true,
    page: page,
    pageSize: pageSize,
    total: total,
    posts: pagePosts.map(function (post) {
      return {
        id: post.id,
        createdAt: post.createdAt,
        nickname: post.nickname,
        content: post.content,
        appVersion: post.appVersion,
        comments: byPost[post.id] || []
      };
    })
  };
}

function createPost_(body) {
  if (body.website) {
    return { ok: true, id: Utilities.getUuid() };
  }
  var nickname = cleanText_(body.nickname, MAX_NICKNAME);
  var content = cleanText_(body.content, MAX_CONTENT);
  if (!nickname) return { ok: false, error: "nickname_required" };
  if (!content) return { ok: false, error: "content_required" };
  var password = String(body.password || "").trim();
  var passwordHash = password ? hash_(password) : "";
  var appVersion = cleanText_(body.appVersion, 30);
  var id = Utilities.getUuid();
  var createdAt = new Date().toISOString();
  appendRow_(POSTS_SHEET, [id, createdAt, nickname, content, appVersion, passwordHash, "active"]);
  return { ok: true, id: id, createdAt: createdAt };
}

function createComment_(body) {
  if (body.website) {
    return { ok: true, id: Utilities.getUuid() };
  }
  var postId = String(body.postId || "").trim();
  if (!postId || !findRow_(POSTS_SHEET, POST_HEADERS, "id", postId)) {
    return { ok: false, error: "post_not_found" };
  }
  var isAdmin = isAdmin_(body.adminKey);
  var nickname = isAdmin ? "운영자" : cleanText_(body.nickname, MAX_NICKNAME);
  var content = cleanText_(body.content, MAX_CONTENT);
  if (!nickname) return { ok: false, error: "nickname_required" };
  if (!content) return { ok: false, error: "content_required" };
  var id = Utilities.getUuid();
  var createdAt = new Date().toISOString();
  appendRow_(COMMENTS_SHEET, [id, postId, createdAt, nickname, content, isAdmin, "active"]);
  return { ok: true, id: id, createdAt: createdAt, isAdmin: isAdmin };
}

function deletePost_(body) {
  var postId = String(body.postId || "").trim();
  var found = findRow_(POSTS_SHEET, POST_HEADERS, "id", postId);
  if (!found) return { ok: false, error: "post_not_found" };
  var allowed = isAdmin_(body.adminKey);
  if (!allowed) {
    var password = String(body.password || "").trim();
    allowed = !!password && !!found.row.passwordHash && hash_(password) === found.row.passwordHash;
  }
  if (!allowed) return { ok: false, error: "forbidden" };
  setCell_(POSTS_SHEET, found.rowIndex, POST_HEADERS.indexOf("status") + 1, "deleted");
  return { ok: true };
}

function deleteComment_(body) {
  if (!isAdmin_(body.adminKey)) return { ok: false, error: "forbidden" };
  var commentId = String(body.commentId || "").trim();
  var found = findRow_(COMMENTS_SHEET, COMMENT_HEADERS, "id", commentId);
  if (!found) return { ok: false, error: "comment_not_found" };
  setCell_(COMMENTS_SHEET, found.rowIndex, COMMENT_HEADERS.indexOf("status") + 1, "deleted");
  return { ok: true };
}

function isAdmin_(adminKey) {
  var expected = PropertiesService.getScriptProperties().getProperty("ADMIN_KEY");
  return !!expected && !!adminKey && String(adminKey) === expected;
}

function cleanText_(value, maxLength) {
  return String(value == null ? "" : value).replace(/\r\n/g, "\n").trim().slice(0, maxLength);
}

function hash_(value) {
  var salt = PropertiesService.getScriptProperties().getProperty("SALT") || "";
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + ":" + value, Utilities.Charset.UTF_8);
  return bytes.map(function (b) {
    var v = (b + 256) % 256;
    return (v < 16 ? "0" : "") + v.toString(16);
  }).join("");
}

function readRows_(sheetName, headers) {
  var sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues();
  return values.map(function (cells) {
    var row = {};
    headers.forEach(function (header, i) {
      var cell = cells[i];
      row[header] = cell instanceof Date ? cell.toISOString() : cell;
    });
    return row;
  });
}

function findRow_(sheetName, headers, key, value) {
  var rows = readRows_(sheetName, headers);
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][key]) === String(value)) {
      return { row: rows[i], rowIndex: i + 2 };
    }
  }
  return null;
}

function appendRow_(sheetName, values) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    SpreadsheetApp.getActive().getSheetByName(sheetName).appendRow(values);
  } finally {
    lock.releaseLock();
  }
}

function setCell_(sheetName, rowIndex, colIndex, value) {
  SpreadsheetApp.getActive().getSheetByName(sheetName).getRange(rowIndex, colIndex).setValue(value);
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
