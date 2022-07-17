 
import _ from 'lodash';
import md5 from 'md5';
 
 
const APP_USED = [];
const ROUTER = {};
 
function printRouter() {
    _.each(APP_USED, function(used) {
        _.each(used.app._router.stack, function(stackElement) {
            if (stackElement.name === 'router') {
                stackElement.handle.stack.forEach((f) => {
                    let path = f.route.path;
                    let method = f.route.stack[0].method.toUpperCase();
 
                    // console.log(method + ' -> ' + used.urlBase + path);
                    _.updateWith(ROUTER, [used.urlBase], function(n) {
                        if (n) {
                            n.push({
                                method,
                                path: used.urlBase + path
                            });
                        } else {
                            n = [];
                        }
 
                        return n;
                    });
                });
            }
        });
    });
 
    let result = {};
 
    _.forEach(ROUTER, function(val) {
        val.forEach(v => {
            result[v.path] = md5(v.path);
        });
    });
 
    return result;
}
 
export function rewriteUse(app) {
    let oldUse = app.use;
    let oldGet = app.get;
    let oldPost = app.post;
    let oldDelete = app.delete;
    let oldPut = app.put;
 
    app.use = function() {
        let urlBase = '';
 
        if (typeof arguments[0] === 'string') {
            urlBase = arguments[0];
            console.log('rewriteUse',urlBase)
        }

        _.forEach(arguments, function(arg) {
            if (arg.name === 'app') {
                APP_USED.push({
                    urlBase: urlBase,
                    app: arg
                });
            }
        });
 
        return oldUse.apply(app, arguments);
    };


    app.get = function(...argv) {
        let urlBase = '';
 
        if (typeof argv[0] === 'string') {
            urlBase = argv[0];
        }

        _.forEach(argv, function(arg) {
            if (arg.name === 'app') {
                console.log('rewriteUse',urlBase)
                APP_USED.push({
                    urlBase: urlBase,
                    app: arg
                });
            }
        });
 
        return oldGet.apply(app, argv);
    };

    // app.post = function() {
    //     let urlBase = '';
 
    //     if (typeof arguments[0] === 'string') {
    //         urlBase = arguments[0];
    //         console.log('rewriteUse',urlBase)
    //     }

    //     _.forEach(arguments, function(arg) {
    //         if (arg.name === 'app') {
    //             APP_USED.push({
    //                 urlBase: urlBase,
    //                 app: arg
    //             });
    //         }
    //     });
 
    //     oldPost.apply(app, arguments);
    // };

    // app.delete = function() {
    //     let urlBase = '';
 
    //     if (typeof arguments[0] === 'string') {
    //         urlBase = arguments[0];
    //         console.log('rewriteUse',urlBase)
    //     }

    //     _.forEach(arguments, function(arg) {
    //         if (arg.name === 'app') {
    //             APP_USED.push({
    //                 urlBase: urlBase,
    //                 app: arg
    //             });
    //         }
    //     });
 
    //     oldDelete.apply(app, arguments);
    // };

    // app.put = function() {
    //     let urlBase = '';
 
    //     if (typeof arguments[0] === 'string') {
    //         urlBase = arguments[0];
    //         console.log('rewriteUse',urlBase)
    //     }

    //     _.forEach(arguments, function(arg) {
    //         if (arg.name === 'app') {
    //             APP_USED.push({
    //                 urlBase: urlBase,
    //                 app: arg
    //             });
    //         }
    //     });
 
    //     oldPut.apply(app, arguments);
    // };
 
    return printRouter;
};

export function getRoutes(){
    return ROUTER
}