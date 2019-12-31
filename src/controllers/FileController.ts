import * as express from "express";
import { default as axios, AxiosResponse } from "axios"; // try to help tree-shaking?
import * as path from "path";
import * as expressStaticProxy from "express-static-proxy";

export function serveStaticFiles(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const localhostPort = 3081;
  const env = process.env.NODE_ENV || "local";

  // Do not server anything out of /api
  if(req.path.startsWith('/api')) {
    res.status(404).json({error:'NotFoundError'});
    return;
  }

  if (env === "local") {
    console.log(`redirecting ${req.path} to localhost:${localhostPort}`);
    axios({
      method: "get",
      url: `http://localhost:${localhostPort}`,
      responseType: "text"
    })
      .then((response: AxiosResponse<any>) => {
        res.type("text/html");
        res.send(response.data);
      })
      .catch(error => console.error(error));
  } else {
    res.sendFile(path.resolve(__dirname, "../build", "index.html"));
  }
}

export function staticProxy(isDevelopment: boolean) {
  if (isDevelopment) {
    var staticProxySettings = {
      target: {
        protocol: "http",
        hostname: "localhost",
        port: "3150"
      },
      changeOrigin: true,
      prependPath: true,
      regex: "jpeg|gif|png|jpg|js|css|ico|woff|svg|ttf|json|map"
    };
    return expressStaticProxy(staticProxySettings);
  } else {
    return express.static(path.resolve(__dirname, "../build"));
  }
}
