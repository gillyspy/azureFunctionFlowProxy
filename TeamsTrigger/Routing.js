
const _map = {
  'SFLink' : {
    name : 'SFLink',
    pattern : /SF[ ]?Link/i,
    externalURL : ''
  }
}

const getRoute = function( name, map  ){
  let route;
  for(let option in map){
    const rgx = new RegExp( option.pattern, option.flag);
    if( rgx.test( name )){
      route = map[name];
    } 
  
  }
}

class RouteTeams{
  constructor( search, map = _map ){   

    Object.defineProperty(this, {
      'name' : {
        get(){
          return getRoute(search,map);
        }    
      },
      'url' : {
        get(){    
          let route = getRoute( this.name, map );    
        
          if( route.externalURL && route.sig) 
             return  route.externalURL + route.sig;
        }
      }
    });   

    return this;
  }

}

exports = RouteTeams;