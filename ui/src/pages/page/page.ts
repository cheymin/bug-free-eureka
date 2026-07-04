// Secondary page: handles both "settings" and "compose" modes.
// Mode is supplied via navTo options: $falcon.navTo('page', { mode: 'settings' | 'compose' }).
// Uses the built-in Keyboard component for text entry (no physical keyboard on device).

import Keyboard from '../../components/Keyboard.vue';
import { MemosClient } from '../../utils/memos';

var STORAGE_KEY_CONFIG = 'memos_config';

var page = {
    name: 'page',
    components: { Keyboard: Keyboard },
    data: function () {
        return {
            mode: 'settings',
            serverUrl: '',
            token: '',
            content: '',
            activeField: '',
            keyboardVisible: false,
            testing: false,
            saving: false,
            error: '',
            success: ''
        };
    },
    computed: {
        pageTitle: function (): string {
            return this.mode === 'compose' ? '新建 Memo' : '设置';
        },
        serverUrlDisplay: function (): string {
            return this.serverUrl || '点击输入服务器地址';
        },
        tokenDisplay: function (): string {
            return this.token ? '******' : '点击输入访问令牌';
        },
        contentDisplay: function (): string {
            return this.content;
        },
        contentAreaClass: function (): string {
            return this.keyboardVisible ? 'content-area content-area-small' : 'content-area content-area-large';
        }
    },
    methods: {
        onShow: function () {
            var opts = (this as any).$page.options || {};
            this.mode = opts.mode === 'compose' ? 'compose' : 'settings';
            this.error = '';
            this.success = '';
            if (this.mode === 'settings') {
                this.loadConfig();
            }
        },
        loadConfig: function () {
            var self = this;
            ($falcon as any).jsapi.storage.getStorage({ key: STORAGE_KEY_CONFIG })
                .then(function (res: any) {
                    var raw = (res && res.data) ? res.data : '';
                    if (raw) {
                        try {
                            var cfg = JSON.parse(raw);
                            self.serverUrl = cfg.serverUrl || '';
                            self.token = cfg.token || '';
                        } catch (e) {
                            // ignore
                        }
                    }
                })
                .catch(function () {
                    // ignore
                });
        },
        focusField: function (name: string) {
            this.activeField = name;
            this.keyboardVisible = true;
        },
        onKeyboardInput: function (ch: string) {
            if (this.activeField === 'serverUrl') {
                this.serverUrl = this.serverUrl + ch;
            } else if (this.activeField === 'token') {
                this.token = this.token + ch;
            } else if (this.activeField === 'content') {
                this.content = this.content + ch;
            }
        },
        onKeyboardBackspace: function () {
            if (this.activeField === 'serverUrl') {
                this.serverUrl = this.serverUrl.substring(0, this.serverUrl.length - 1);
            } else if (this.activeField === 'token') {
                this.token = this.token.substring(0, this.token.length - 1);
            } else if (this.activeField === 'content') {
                this.content = this.content.substring(0, this.content.length - 1);
            }
        },
        onKeyboardDone: function () {
            this.keyboardVisible = false;
            this.activeField = '';
        },
        hideKeyboard: function () {
            this.keyboardVisible = false;
            this.activeField = '';
        },
        testConnection: function () {
            var self = this;
            if (self.testing) {
                return;
            }
            if (!self.serverUrl || !self.token) {
                self.error = '请先填写服务器地址和访问令牌';
                self.success = '';
                return;
            }
            self.testing = true;
            self.error = '';
            self.success = '';
            var client = new MemosClient({ serverUrl: self.serverUrl, token: self.token });
            client.testConnection().then(function (ok: boolean) {
                self.testing = false;
                if (ok) {
                    self.success = '连接成功';
                } else {
                    self.error = '连接失败，请检查地址、令牌或网络（建议使用 HTTP）';
                }
            });
        },
        save: function () {
            if (this.mode === 'settings') {
                this.saveConfig();
            } else {
                this.saveMemo();
            }
        },
        saveConfig: function () {
            var self = this;
            if (!self.serverUrl || !self.token) {
                self.error = '服务器地址和访问令牌不能为空';
                self.success = '';
                return;
            }
            self.error = '';
            self.success = '';
            var cfg = JSON.stringify({ serverUrl: self.serverUrl, token: self.token });
            ($falcon as any).jsapi.storage.setStorage({ key: STORAGE_KEY_CONFIG, data: cfg })
                .then(function () {
                    self.success = '配置已保存';
                    self.hideKeyboard();
                })
                .catch(function (e: any) {
                    self.error = '保存失败：' + (e && e.message ? e.message : String(e));
                });
        },
        saveMemo: function () {
            var self = this;
            var text = (self.content || '').trim();
            if (!text) {
                self.error = '内容不能为空';
                self.success = '';
                return;
            }
            if (self.saving) {
                return;
            }
            self.saving = true;
            self.error = '';
            self.success = '';
            // Read config (the compose page may have been opened without the index loading config here).
            ($falcon as any).jsapi.storage.getStorage({ key: STORAGE_KEY_CONFIG })
                .then(function (res: any) {
                    var raw = (res && res.data) ? res.data : '';
                    var cfg = null;
                    if (raw) {
                        try {
                            cfg = JSON.parse(raw);
                        } catch (e) {
                            cfg = null;
                        }
                    }
                    if (!cfg || !cfg.serverUrl || !cfg.token) {
                        self.saving = false;
                        self.error = '请先在"设置"中配置服务器';
                        return;
                    }
                    var client = new MemosClient({ serverUrl: cfg.serverUrl, token: cfg.token });
                    client.createMemo(text).then(function () {
                        self.saving = false;
                        self.success = '已保存';
                        self.content = '';
                        self.hideKeyboard();
                        // Give the user a moment to see the success message before going back.
                        setTimeout(function () {
                            ($falcon as any).closePageByName('page');
                        }, 600);
                    }).catch(function (err: any) {
                        self.saving = false;
                        self.error = '保存失败：' + (err && err.message ? err.message : String(err));
                    });
                })
                .catch(function (e: any) {
                    self.saving = false;
                    self.error = '读取配置失败：' + (e && e.message ? e.message : String(e));
                });
        },
        clearContent: function () {
            this.content = '';
        },
        goBack: function () {
            ($falcon as any).closePageByName('page');
        }
    }
};

export default page;
