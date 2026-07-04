<template>
    <div class="container">
        <div class="header">
            <text class="header-back" @click="goBack">‹ 返回</text>
            <text class="header-title">{{ pageTitle }}</text>
        </div>

        <!-- Settings mode -->
        <div v-if="mode === 'settings'" class="content">
            <div class="field-row" @click="focusField('serverUrl')">
                <text class="field-label">服务器</text>
                <text
                    :class="activeField === 'serverUrl' ? 'field-value field-value-active' : 'field-value'"
                >{{ serverUrlDisplay }}</text>
            </div>
            <div class="field-row" @click="focusField('token')">
                <text class="field-label">令牌</text>
                <text
                    :class="activeField === 'token' ? 'field-value field-value-active' : 'field-value'"
                >{{ tokenDisplay }}</text>
            </div>
            <div class="hint-row">
                <text class="hint-text">提示:建议使用 HTTP 局域网地址;令牌在 Memos 设置-访问令牌中生成</text>
            </div>
            <div class="msg-row">
                <text v-if="error" class="error-text">{{ error }}</text>
                <text v-else-if="success" class="success-text">{{ success }}</text>
            </div>
            <div class="btn-row">
                <text
                    :class="testing ? 'btn btn-flex btn-disabled' : 'btn btn-flex btn-info'"
                    @click="testConnection"
                >{{ testing ? '测试中...' : '测试连接' }}</text>
                <text
                    :class="saving ? 'btn btn-flex btn-disabled' : 'btn btn-flex btn-success'"
                    @click="save"
                >保存</text>
            </div>
        </div>

        <!-- Compose mode -->
        <div v-if="mode === 'compose'" class="content">
            <div :class="contentAreaClass" @click="focusField('content')">
                <text v-if="content" class="textarea-text">{{ contentDisplay }}</text>
                <text v-else class="textarea-placeholder">点击输入 Memo 内容...</text>
            </div>
            <div class="msg-row">
                <text v-if="error" class="error-text">{{ error }}</text>
                <text v-else-if="success" class="success-text">{{ success }}</text>
            </div>
            <div class="btn-row">
                <text class="btn btn-flex btn-warning" @click="clearContent">清空</text>
                <text
                    :class="saving ? 'btn btn-flex btn-disabled' : 'btn btn-flex btn-success'"
                    @click="save"
                >{{ saving ? '保存中...' : '保存' }}</text>
            </div>
        </div>

        <!-- Built-in keyboard -->
        <div v-if="keyboardVisible" class="keyboard-area">
            <Keyboard
                @input="onKeyboardInput"
                @backspace="onKeyboardBackspace"
                @done="onKeyboardDone"
            />
        </div>
    </div>
</template>

<style lang="less" scoped>
@import url('page.less');
</style>

<script>
import page from './page';
export default page;
</script>
