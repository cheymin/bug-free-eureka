<!--
 Copyright (C) 2025 Template Author
 
 This file is part of miniapp-template.
 
 miniapp-template is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 
 miniapp-template is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 
 You should have received a copy of the GNU General Public License
 along with miniapp-template.  If not, see <https://www.gnu.org/licenses/>.
-->

<template>
    <scroller class="container" scroll-direction="vertical" :show-scrollbar="true">
        <div class="section">
            <text class="section-title">miniapp-template</text>
            <div class="item"><text class="item-text">Hello, Dictionary Pen!</text></div>
        </div>
    </scroller>
</template>

<style lang="less" scoped>
@import url('index.less');
</style>

<script>
import index from './index';
export default index;
</script>
