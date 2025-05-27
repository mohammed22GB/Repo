/* 
  convert the object for the query into backend-understood crazy string, e.g.
      const options = {
        query: {
          type: "form",
        },
        param: {
          app: appId,
        }
      }

*/
export const composeQueryString = (params) => {
  const prm = [],
    qry = [];
  let options;
  let paramStr, queryStr, urlStr;

  // alert(JSON.stringify(params))
  if (!!params && !!params.queryKey) {
    options = params.queryKey[1];
    // if(!options?.query) return false;
  } else {
    options = params;
  }
  if (typeof options === "undefined") urlStr = "";
  else if (options?.param || options?.query) {
    if (options?.param) {
      Object.keys(options.param).forEach((q) => {
        prm.push(options.param[q]);
      });
      paramStr = !!prm.length ? `${prm.join("/")}` : "";
    }

    if (options?.query) {
      Object.keys(options.query).forEach((q) => {
        if (q === "selection")
          qry.push(`selection=${options.query.selection.join("+")}`);
        else if (q === "population")
          qry.push(`population=${JSON.stringify(options.query.population)}`);
        else qry.push(`${q}=${options.query[q]}`);
      });
      queryStr = !!qry.length ? `?${qry.join("&")}` : "";
    }

    // alert(`>>>> ${paramStr?.length} >> ${queryStr?.length}`)
    const urlArr = [];
    !!paramStr && urlArr.push(paramStr);
    !!queryStr && urlArr.push(queryStr);
    urlStr = (!!paramStr ? "/" : "") + urlArr.join("/");
  } else urlStr = false;

  return urlStr;
};
