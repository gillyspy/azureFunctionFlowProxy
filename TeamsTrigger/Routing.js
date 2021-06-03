const _map = {
  SFLink: {
    name: "SFLink",
    pattern: /SF[ ]?Link/i,
    externalURL: "",
  }
};

const getRoute = function (name, map) {
  let route;
  for (let option in map) {
      let _map = map[option];
      if(!route && typeof _map === 'object'){
      const rgx = new RegExp(_map.pattern, _map.flags);
      if (rgx.test(name)) {
        route = _map;
      }
    }
  }
  return route; 
};

class RouteTeams {
  constructor(search, map = _map) {
    Object.defineProperties(this, {
      name: {
        get() {
          return getRoute(search, map).name;
        },
      },
      url: {
        get() {
          let route = getRoute(this.name, map);

          if (route.externalURL && route.sig)
            return route.externalURL + route.sig;
        },
      },
    });

    return this;
  }
}

exports.Routing = RouteTeams;
