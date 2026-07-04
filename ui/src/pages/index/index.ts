// Copyright (C) 2025 Template Author
//
// This file is part of miniapp-template.
//
// miniapp-template is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// miniapp-template is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with miniapp-template.  If not, see <https://www.gnu.org/licenses/>.

import { defineComponent } from 'vue';

export type indexOptions = {};

const index = defineComponent({
    data() {
        return {
            $page: {} as FalconPage<indexOptions>,
        };
    },

    methods: {
        // /**
        //  * 页面生命周期：页面进入前台
        //  * 由 base-page.js 的 onShow() 代理调用
        //  */
        // onShow() {
        //     // TODO: 页面显示时的逻辑
        // },
        //
        // /**
        //  * 页面生命周期：页面进入后台
        //  * 由 base-page.js 的 onHide() 代理调用
        //  */
        // onHide() {
        //     // TODO: 页面隐藏时的逻辑
        // },
        //
        // /**
        //  * 页面生命周期：页面卸载
        //  * 由 base-page.js 的 onUnload() 代理调用
        //  */
        // onUnload() {
        //     // TODO: 页面卸载时的清理逻辑
        // },
    }
});

export default index;
