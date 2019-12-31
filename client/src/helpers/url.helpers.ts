import { Dataset } from "models/dataset.models";

export const urlAddQueryParameter = (url: string, name : string, value : number | string | boolean | undefined) => {
    if(value === undefined || (typeof(value) === "string" && value.length===0))
        return url;
    return urlAddQueryString(url, `${name}=${encodeURIComponent(value.toString())}`)
}

export const urlAddQueryString = (url: string, value : string | undefined) => {
    if(value === undefined || (typeof(value) === "string" && value.length===0))
        return url;
    return `${url}${(url.indexOf('?') === -1 ? "?": "&")}${value}`;
}

export const urlAddDataset = (url : string, dataset: Dataset) : string => {
    if(!dataset || dataset.month.length <= 0)
        return url;

    return urlAddQueryParameter(url, 'month', dataset.month);
}

export const urlAddPagination = (
    url: string,
    page?: number,
    pageSize?: number,
    orderByString?: string
  ) => {
    url = urlAddQueryParameter(url, 'page', page);
    url = urlAddQueryParameter(url, 'limit', pageSize);
    url = urlAddQueryString(url, orderByString);
    return url;
}

export const urlGetQueryParameter = (search: string, name:string) => {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};