import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from "@angular/router"

export class SimpleReuseStrategy implements RouteReuseStrategy {

  public static handlers: { [key: string]: DetachedRouteHandle } = {}

  /** 表示对所有路由允许复用 如果你有路由不想利用可以在这加一些业务逻辑判断 */
  public shouldDetach(route: ActivatedRouteSnapshot): boolean {
    if(route.routeConfig && route.routeConfig.path){
      if(route.routeConfig['path'] === ':type'){
        return false;
      }
    }
    return true
  }

  /** 当路由离开时会触发。按path作为key存储路由快照&组件当前实例对象 */
  public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    if(route.routeConfig && route.routeConfig.path){
      SimpleReuseStrategy.handlers[route.routeConfig.path] = handle;
    }
  }

  /** 若 path 在缓存中有的都认为允许还原路由 */
  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    if(route.routeConfig && route.routeConfig.path){
      if(route.routeConfig['path'] === 'login'){
        SimpleReuseStrategy.handlers = {};
      }
      return !!route.routeConfig && !!SimpleReuseStrategy.handlers[route.routeConfig.path];
    }
    return false;
  }

  /** 从缓存中获取快照，若无则返回nul */
  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    if(route.routeConfig && route.routeConfig.path){
      return SimpleReuseStrategy.handlers[route.routeConfig.path];
    }
    return null as any;
  }

  /** 进入路由触发，判断是否同一路由 */
  public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}
