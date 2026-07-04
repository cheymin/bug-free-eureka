// Memos API client
// Target: Memos v0.22+ (gRPC-gateway REST API under /api/v1)
//
// All HTTP calls go through $falcon.jsapi.http.request.
// The Dictionary Pen's network stack may not negotiate modern TLS,
// so server URLs should prefer HTTP when the Memos instance is on LAN.

function normalizeUrl(url: string): string {
    var u = (url || '').trim();
    while (u.length > 0 && u.charAt(u.length - 1) === '/') {
        u = u.substring(0, u.length - 1);
    }
    return u;
}

function parseBody(data: any): any {
    if (data === null || data === undefined) {
        return null;
    }
    if (typeof data === 'string') {
        if (data.length === 0) {
            return null;
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            return null;
        }
    }
    return data;
}

function extractMemo(m: any): any {
    if (!m) {
        return { name: '', uid: '', content: '', createTime: '', updateTime: '' };
    }
    return {
        name: m.name || (m.uid != null ? String(m.uid) : ''),
        uid: m.uid != null ? String(m.uid) : '',
        content: m.content || '',
        createTime: m.createTime || m.createdTs || '',
        updateTime: m.updateTime || m.updatedTs || ''
    };
}

class MemosClient {
    config: any;

    constructor(config: any) {
        this.config = config;
    }

    baseUrl(): string {
        return normalizeUrl(this.config.serverUrl);
    }

    authHeaders(): any {
        var h: any = {
            'Accept': 'application/json'
        };
        if (this.config.token && this.config.token.length > 0) {
            h['Authorization'] = 'Bearer ' + this.config.token;
        }
        return h;
    }

    listMemos(): Promise<any[]> {
        var self = this;
        var url = self.baseUrl() + '/api/v1/memos?pageSize=100';
        return ($falcon as any).jsapi.http.request({
            url: url,
            method: 'GET',
            headers: self.authHeaders(),
            timeout: 10000
        }).then(function (resp: any) {
            if (!resp || resp.statusCode !== 200) {
                var code = resp ? resp.statusCode : 0;
                var err = resp && resp.error ? resp.error : '';
                throw new Error('HTTP ' + code + (err ? (' ' + err) : ''));
            }
            var body = parseBody(resp.data);
            var arr = (body && body.memos) ? body.memos : [];
            var result: any[] = [];
            for (var i = 0; i < arr.length; i++) {
                result.push(extractMemo(arr[i]));
            }
            return result;
        });
    }

    createMemo(content: string): Promise<any> {
        var self = this;
        var url = self.baseUrl() + '/api/v1/memos';
        var headers = self.authHeaders();
        headers['Content-Type'] = 'application/json';
        return ($falcon as any).jsapi.http.request({
            url: url,
            method: 'POST',
            headers: headers,
            data: JSON.stringify({ content: content, visibility: 'PRIVATE' }),
            timeout: 10000
        }).then(function (resp: any) {
            if (!resp || resp.statusCode !== 200) {
                var code = resp ? resp.statusCode : 0;
                var err = resp && resp.error ? resp.error : '';
                throw new Error('HTTP ' + code + (err ? (' ' + err) : ''));
            }
            return extractMemo(parseBody(resp.data));
        });
    }

    deleteMemo(name: string): Promise<void> {
        var self = this;
        var url = self.baseUrl() + '/api/v1/' + name;
        return ($falcon as any).jsapi.http.request({
            url: url,
            method: 'DELETE',
            headers: self.authHeaders(),
            timeout: 10000
        }).then(function (resp: any) {
            if (!resp || resp.statusCode !== 200) {
                var code = resp ? resp.statusCode : 0;
                throw new Error('HTTP ' + code);
            }
        });
    }

    testConnection(): Promise<boolean> {
        var self = this;
        var url = self.baseUrl() + '/api/v1/users/me';
        return ($falcon as any).jsapi.http.request({
            url: url,
            method: 'GET',
            headers: self.authHeaders(),
            timeout: 10000
        }).then(function (resp: any) {
            return !!(resp && resp.statusCode === 200);
        }).catch(function () {
            return false;
        });
    }
}

export { MemosClient };
