import {Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, RequestOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';

export let AppProxy = {
  // Use proxy client in place of Http service for backend-less offline functionality
  provide: Http,
  useFactory: (backend: MockBackend, options: BaseRequestOptions) => {
    // Configure the proxy services
    backend.connections.subscribe((connection: MockConnection) => {
      /*
       return AppProxy.serve(connection)
       .catch((error: Error) => {
       connection.mockRespond(new Response(
       new ResponseOptions({status: 501, body: error})
       ));
       });
       */

      // wrap in timeout to simulate server api call
      setTimeout(() => {


        // fake authenticate api end point
        if (connection.request.url.endsWith('/api/authenticate') && connection.request.method === RequestMethod.Post) {
          // get parameters from post request
          let params = JSON.parse(connection.request.getBody());
          let testUser = {username: 'test', password: 'test', firstName: 'Test', lastName: 'User'};

          // check user credentials and return fake jwt token if valid
          if (params.username === testUser.username && params.password === testUser.password) {
            connection.mockRespond(new Response(
              new ResponseOptions({status: 200, body: {token: 'fake-jwt-token'}})
            ));
          } else {
            connection.mockRespond(new Response(
              new ResponseOptions({status: 200})
            ));
          }
        }

        // fake users api end point
        if (connection.request.url.endsWith('/api/users') && connection.request.method === RequestMethod.Get) {
          // check for fake auth token in header and return test users if valid, this security is implemented server side
          // in a real application
          if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
            connection.mockRespond(new Response(
              new ResponseOptions({status: 200, body: [
                {
                  username: 'test',
                  password: 'test',
                  firstName: 'Test',
                  lastName: 'User'
                }
              ]})
            ));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(
              new ResponseOptions({status: 401})
            ));
          }
        }

      }, 500);


    });
    return new Http(backend, options);
  },
  deps: [MockBackend, BaseRequestOptions],
  proxies: [
    {
      verb: 'POST',
      path: '/api/authenticate',
      resp: (req: RequestOptions, resp: ResponseOptions) => {
        // Get parameters from post request
        let params = req.body ? JSON.parse(req.body) : {};

        // Check user credentials and return jwt token if valid
        if (params.username === 'test' && params.password === 'test') {
          return Promise.resolve({
            status: 200,
            body: {
              token: 'fake-jwt-token'
            }
          });
        } else {
          // Login Failed...
          return Promise.resolve({
            status: 401
          });
        }
      }
    },
    {
      verb: 'GET',
      path: '/api/user',
      resp: (req: RequestOptions, resp: ResponseOptions) => {
        // Ensure there is an auth header present
        if (req.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          return Promise.resolve({
            status: 200,
            body: [
              {
                username: 'test',
                password: 'test',
                firstName: 'Test',
                lastName: 'User'
              }
            ]
          });
        } else {
          // return 401 not authorised if token is null or invalid
          return Promise.resolve({
            status: 401
          });
        }

      }
    },
  ],
  methodType: (method: string): RequestMethod => {
    switch (method) {
      case 'GET':
        return RequestMethod.Get;
      case 'POST':
        return RequestMethod.Post;
      case 'PUT':
        return RequestMethod.Put;
      case 'DELETE':
        return RequestMethod.Delete;
      case 'OPTIONS':
        return RequestMethod.Options;
      case 'HEAD':
        return RequestMethod.Head;
      case 'PATCH':
        return RequestMethod.Patch;
      default:
        return RequestMethod.Get;
    }
  },
  serve: (connection: MockConnection): Promise<ResponseOptions> => {
    const req = connection.request;
    const resp = connection.response;
    const found = this.proxies.filter((info: any) => {
      return info.path && req.url.endsWith(info.path) && req.method === this.methodType(info.verb);
    });

    const proxy: any = found.length ? found[0] : null;
    if (proxy && proxy.resp) {
      return proxy.resp(req, resp)
        .then((opts) => {
          connection.mockRespond(new Response(
            new ResponseOptions({status: 401})
          ));
        });
    } else {
      //return Http.request(req, );
      return Promise.reject(new Error('The requested route does not exists: ' + req.url));
    }
  },
};
