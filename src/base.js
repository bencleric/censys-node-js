const pack = require("../package.json");
const utils = require("./utils");
const fetch = require("isomorphic-unfetch");

const DEFAULT_OPTIONS = {
  timeout: 30,
  userAgent: `${pack.name}/${pack.version}`,
};

class Base {
  constructor(baseUrl, options = {}, headers = {}) {
    this.baseUrl = baseUrl;
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.headers = {
      Accept: "application/json, */8",
      "User-Agent": this.options.userAgent,
      ...headers,
    };
  }

  request(endpoint, params = {}, options = {}) {
    let url = this.baseUrl + endpoint;
    if (!utils.isEmpty(params)) {
      let searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }
    const headers = {
      "Content-type": "application/json",
      ...this.headers,
    };
    const config = {
      ...options,
      headers,
    };
    // console.log(url);
    return fetch(url, config).then((_res) => {
      return _res.json().then((json) => {
        return _res.ok ? json : Promise.reject(json ? json : _res.statusText);
      });
    });
  }
}

module.exports = Base;
