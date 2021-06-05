const cfg = {};
const _m = {
  initRgx: function (p, f, i) {
    let r = new RegExp(p, f);

    r.lastIndex = cfg.lastIndex;

    if (typeof i !== "undefined") r.lastIndex = i;

    return r;
  },
  closeRgx: function (r, i) {
    if (typeof i !== "undefined") r.lastIndex = i;

    cfg.lastIndex = r.lastIndex;
  },
  doTest: function () {
    let r = _m.initRgx(cfg.pattern, cfg.flags);
    let result = r.test(cfg.string);
    _m.closeRgx(r);
    return result;
  },
  doMatch: function () {
    let r = _m.initRgx(cfg.pattern, cfg.flags, 0);
    let result = cfg.string.match(r);
    _m.closeRgx(r);
    return result;
  },
  doExec: function () {
    let r = _m.initRgx(cfg.pattern, cfg.flags);
    let result = r.exec(cfg.string);
    _m.closeRgx(r);
    return result;
  },
  doReplace: function () {
    let r = _m.initRgx(cfg.pattern, cfg.flags, 0);
    let result = cfg.string.replace(r, cfg.replace);
    _m.closeRgx(r);
    return result;
  },
  doMatchAll: function () {
    let r = _m.initRgx(cfg.pattern, cfg.flags, 0);    
    let result = cfg.string.matchAll(r);
    _m.closeRgx(r);
    return Array.from( result );
  },
};

class RegExCustom {
  constructor(
    str = "",
    method = "test",
    pattern = "^$",
    flags = "gim",
    replace = "$1",
    lastIndex = 0
  ) {
    Object.assign(cfg, {
      string: str,
      method: method,
      pattern: pattern,
      flags: flags,
      replace: replace,
    });
    let result = null;
    cfg.lastIndex = lastIndex;
    try {
      switch (method) {
        case "test":
          result = _m.doTest();
          break;
        case "match":
          result = _m.doMatch();
          break;
        case "exec":
          result = _m.doExec();
          break;
        case "replace":
          result = _m.doReplace();
          break;
        case "matchAll":
          result = _m.doMatchAll();
        default:
          result = null;
          message = "not supported"
          break;
      }
    } catch (e) {
      result = null;
    }
    this.result = result;
    this.lastIndex = cfg.lastIndex;
    return this;
  }
}

exports.RegExCustom = RegExCustom;
