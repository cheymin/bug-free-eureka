// Main page: list memos, sync, navigate to settings / compose.

import { MemosClient } from '../../utils/memos';

var STORAGE_KEY_CONFIG = 'memos_config';
var STORAGE_KEY_CACHE = 'memos_cache';

function pad(n: number): string {
    return n < 10 ? '0' + n : String(n);
}

function formatTime(iso: string): string {
    if (!iso) {
        return '';
    }
    var d = new Date(iso);
    if (isNaN(d.getTime())) {
        return iso;
    }
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
        ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

function truncate(s: string, n: number): string {
    if (!s) {
        return '';
    }
    // Collapse newlines for the list preview.
    var flat = s.replace(/\n/g, ' ');
    if (flat.length <= n) {
        return flat;
    }
    return flat.substring(0, n) + '...';
}

var index = {
    name: 'index',
    data: function () {
        return {
            memos: [] as any[],
            loading: false,
            error: '',
            info: '',
            config: { serverUrl: '', token: '' } as any,
            configured: false
        };
    },
    computed: {
        hasMemos: function (): boolean {
            return this.memos.length > 0;
        },
        statusText: function (): string {
            if (this.loading) {
                return '同步中...';
            }
            if (!this.configured) {
                return '未配置';
            }
            return '已连接 · ' + this.memos.length + ' 条';
        }
    },
    methods: {
        onShow: function () {
            var self = this;
            self.loadConfig().then(function () {
                self.loadCache();
                if (self.configured) {
                    self.fetchMemos(true);
                }
            });
        },
        loadConfig: function () {
            var self = this;
            return ($falcon as any).jsapi.storage.getStorage({ key: STORAGE_KEY_CONFIG })
                .then(function (res: any) {
                    var raw = (res && res.data) ? res.data : '';
                    if (raw) {
                        try {
                            var cfg = JSON.parse(raw);
                            self.config = {
                                serverUrl: cfg.serverUrl || '',
                                token: cfg.token || ''
                            };
                            self.configured = (self.config.serverUrl.length > 0 &&
                                self.config.token.length > 0);
                        } catch (e) {
                            self.configured = false;
                        }
                    } else {
                        self.configured = false;
                    }
                })
                .catch(function () {
                    self.configured = false;
                });
        },
        loadCache: function () {
            var self = this;
            return ($falcon as any).jsapi.storage.getStorage({ key: STORAGE_KEY_CACHE })
                .then(function (res: any) {
                    var raw = (res && res.data) ? res.data : '';
                    if (raw) {
                        try {
                            var arr = JSON.parse(raw);
                            if (arr && arr.length) {
                                self.memos = arr;
                            }
                        } catch (e) {
                            // ignore broken cache
                        }
                    }
                })
                .catch(function () {
                    // ignore
                });
        },
        saveCache: function () {
            try {
                ($falcon as any).jsapi.storage.setStorage({
                    key: STORAGE_KEY_CACHE,
                    data: JSON.stringify(this.memos)
                });
            } catch (e) {
                // ignore
            }
        },
        fetchMemos: function (silent: boolean) {
            var self = this;
            if (!self.configured) {
                self.error = '请先在"设置"中配置服务器地址和访问令牌';
                return;
            }
            self.loading = true;
            self.error = '';
            self.info = '';
            var client = new MemosClient(self.config);
            client.listMemos().then(function (list: any[]) {
                self.memos = list;
                self.loading = false;
                self.info = silent ? '' : ('已同步 ' + list.length + ' 条 Memo');
                self.saveCache();
            }).catch(function (err: any) {
                self.loading = false;
                self.error = '同步失败：' + (err && err.message ? err.message : String(err));
            });
        },
        goSettings: function () {
            ($falcon as any).navTo('page', { mode: 'settings' });
        },
        goCompose: function () {
            if (!this.configured) {
                this.error = '请先在"设置"中配置服务器地址和访问令牌';
                return;
            }
            ($falcon as any).navTo('page', { mode: 'compose' });
        },
        syncMemos: function () {
            this.fetchMemos(false);
        },
        formatTime: formatTime,
        truncate: truncate
    }
};

export default index;
