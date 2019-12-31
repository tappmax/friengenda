export type PaginatedResponse = {
    items: any[];
    count: number;
    page: number;
    pageSize: number;
}

export type OrderBy<T> = {
    name: T;
    descend?: boolean;
}

export function paginatedResponse(items : any[], count: number, page: number, pageSize: number) {
    const response : PaginatedResponse = {
        items: items,
        count: count,
        page: page,
        pageSize: pageSize
    }

    return response;
}

export type PaginationOptions<OrderByT> = {
    limit?: number;
    offset?: number;
    orderBy?: OrderBy<OrderByT>[];
}

export function ClampPagination<T> (pagination : PaginationOptions<T>) : any {
    pagination.limit = Math.max(1,pagination.limit);
    pagination.offset = Math.max(pagination.offset,0);
    return pagination;
}

/**
 * Convert an OrderBy array to SQL using the given field map
 * @param orderBy 
 * @param fieldMap 
 */
export function orderByToSQL<T extends string> (orderBy : OrderBy<T>[], fieldMap : {[key in T] : string | string[]}) : string {
    if(!orderBy || orderBy.length == 0)
        return '';

    const results : string[] = [];
    for(let ob of orderBy) {
        const mapping = fieldMap[ob.name] as string | string[];
        if(!mapping) 
            continue;

        if(Array.isArray(mapping)) {
            for(let m of mapping) {
                results.push(`${(m as any) as string} ${ob.descend ? 'DESC' : 'ASC'}`);
            }
        } else {
            results.push(`${(mapping as any) as string} ${ob.descend ? 'DESC' : 'ASC'}`);
        }
    }

    if(results.length === 0)
        return '';

    return 'ORDER BY ' + results.join(',');
}
