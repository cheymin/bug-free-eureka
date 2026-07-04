<template>
    <div class="container">
        <div class="header">
            <text class="header-title">Memos 同步</text>
            <text class="header-status">{{ statusText }}</text>
        </div>
        <div class="toolbar">
            <text class="btn btn-flex btn-primary" @click="goCompose">新建</text>
            <text class="btn btn-flex btn-success" @click="syncMemos">同步</text>
            <text class="btn btn-flex btn-info" @click="goSettings">设置</text>
        </div>
        <div class="status-bar">
            <text v-if="error" class="error-text">{{ error }}</text>
            <text v-else-if="info" class="success-text">{{ info }}</text>
        </div>
        <scroller class="memo-list" scroll-direction="vertical" :show-scrollbar="true">
            <text v-if="!hasMemos && !loading" class="empty-text">暂无 Memo

点击"设置"配置服务器
点击"新建"撰写 Memo
点击"同步"拉取列表</text>
            <div v-for="(memo, i) in memos" :key="i" class="memo-item">
                <text class="memo-content">{{ truncate(memo.content, 100) }}</text>
                <text class="memo-time">{{ formatTime(memo.createTime) }}</text>
            </div>
        </scroller>
    </div>
</template>

<style lang="less" scoped>
@import url('index.less');
</style>

<script>
import index from './index';
export default index;
</script>
