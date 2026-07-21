<template>
    <div class="settings-container">
        <div class="settings-header glass-card">
            <div class="header-back" @click="goBack">
                <text class="back-icon">←</text>
            </div>
            <text class="header-title">设置</text>
            <div class="header-placeholder"></div>
        </div>
        
        <scroller class="settings-content" scroll-direction="vertical">
            <div class="section glass-card">
                <text class="section-title">API 配置</text>
                
                <div class="form-item">
                    <text class="form-label">API Key</text>
                    <input 
                        class="form-input glass-input"
                        v-model="apiKey"
                        placeholder="sk-..."
                        password="true"
                    />
                </div>
                
                <div class="form-item">
                    <text class="form-label">Base URL</text>
                    <input 
                        class="form-input glass-input"
                        v-model="baseUrl"
                        placeholder="https://api.openai.com/v1/"
                    />
                </div>
            </div>
            
            <div class="section glass-card">
                <text class="section-title">模型设置</text>
                
                <div class="form-item">
                    <text class="form-label">模型</text>
                    <div class="form-select glass-input" @click="showModelPicker = true">
                        <text class="select-value">{{ model }}</text>
                        <text class="select-arrow">▼</text>
                    </div>
                </div>
                
                <div class="form-item">
                    <text class="form-label">最大 Token</text>
                    <input 
                        class="form-input glass-input"
                        v-model="maxTokens"
                        type="number"
                    />
                </div>
                
                <div class="form-item">
                    <text class="form-label">Temperature</text>
                    <input 
                        class="form-input glass-input"
                        v-model="temperature"
                        type="number"
                    />
                    <text class="form-hint">0.0 - 1.0</text>
                </div>
                
                <div class="form-item">
                    <text class="form-label">Top P</text>
                    <input 
                        class="form-input glass-input"
                        v-model="topP"
                        type="number"
                    />
                    <text class="form-hint">0.0 - 1.0</text>
                </div>
            </div>
            
            <div class="section glass-card">
                <text class="section-title">系统提示词</text>
                
                <textarea 
                    class="form-textarea glass-input"
                    v-model="systemPrompt"
                    placeholder="输入系统提示词..."
                ></textarea>
            </div>
            
            <div class="section glass-card">
                <text class="section-title">数据管理</text>
                
                <div class="action-item" @click="clearAllData">
                    <text class="action-icon">🗑</text>
                    <text class="action-text">清除所有数据</text>
                    <text class="action-arrow">→</text>
                </div>
            </div>
            
            <div class="section glass-card">
                <text class="section-title">关于</text>
                
                <div class="info-item">
                    <text class="info-label">版本</text>
                    <text class="info-value">1.0.0</text>
                </div>
                
                <div class="info-item">
                    <text class="info-label">应用</text>
                    <text class="info-value">ChatBox</text>
                </div>
            </div>
        </scroller>
        
        <div class="settings-footer">
            <div class="save-btn" @click="saveSettings">
                <text class="save-text">保存设置</text>
            </div>
        </div>
        
        <div v-if="showModelPicker" class="picker-overlay" @click="showModelPicker = false">
            <div class="picker-content glass-card" @click.stop>
                <div class="picker-header">
                    <text class="picker-title">选择模型</text>
                    <div class="picker-close" @click="showModelPicker = false">
                        <text class="close-icon">×</text>
                    </div>
                </div>
                
                <scroller class="picker-list" scroll-direction="vertical">
                    <div 
                        v-for="m in models" 
                        :key="m"
                        :class="['picker-item', { active: m === model }]"
                        @click="selectModel(m)"
                    >
                        <text class="picker-item-text">{{ m }}</text>
                    </div>
                    
                    <div v-if="models.length === 0" class="picker-empty">
                        <text class="empty-text">加载中...</text>
                    </div>
                </scroller>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import url('../../styles/global.less');

.settings-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
}

.settings-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: @spacing-md @spacing-lg;
    margin: @spacing-md;
}

.header-back {
    width: 72rpx;
    height: 72rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: @glass-bg;
    border: 1rpx solid @glass-border;
    border-radius: @radius-sm;
    
    .back-icon {
        font-size: 36rpx;
        color: @text-primary;
    }
    
    &:active {
        background: @glass-hover;
    }
}

.header-title {
    font-size: 36rpx;
    font-weight: 600;
    color: @text-primary;
}

.header-placeholder {
    width: 72rpx;
}

.settings-content {
    flex: 1;
    padding: 0 @spacing-md;
    margin-bottom: @spacing-md;
}

.section {
    padding: @spacing-lg;
    margin-bottom: @spacing-md;
}

.section-title {
    display: block;
    font-size: 32rpx;
    font-weight: 600;
    color: @text-primary;
    margin-bottom: @spacing-lg;
}

.form-item {
    margin-bottom: @spacing-lg;
    
    &:last-child {
        margin-bottom: 0;
    }
}

.form-label {
    display: block;
    font-size: 26rpx;
    color: @text-secondary;
    margin-bottom: @spacing-sm;
}

.form-input {
    width: 100%;
    height: 88rpx;
    padding: 0 @spacing-md;
    font-size: 28rpx;
    color: @text-primary;
    
    &[password="true"] {
        font-family: monospace;
        letter-spacing: 4rpx;
    }
}

.form-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 88rpx;
    padding: 0 @spacing-md;
    font-size: 28rpx;
    color: @text-primary;
    
    .select-value {
        flex: 1;
    }
    
    .select-arrow {
        font-size: 20rpx;
        color: @text-muted;
    }
}

.form-textarea {
    width: 100%;
    height: 200rpx;
    padding: @spacing-md;
    font-size: 28rpx;
    color: @text-primary;
    line-height: 1.6;
}

.form-hint {
    font-size: 22rpx;
    color: @text-muted;
    margin-top: @spacing-xs;
}

.action-item {
    display: flex;
    align-items: center;
    padding: @spacing-md 0;
    border-bottom: 1rpx solid @glass-border;
    
    &:last-child {
        border-bottom: none;
    }
    
    .action-icon {
        font-size: 36rpx;
        margin-right: @spacing-md;
    }
    
    .action-text {
        flex: 1;
        font-size: 28rpx;
        color: @text-primary;
    }
    
    .action-arrow {
        font-size: 24rpx;
        color: @text-muted;
    }
    
    &:active {
        opacity: 0.7;
    }
}

.info-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: @spacing-md 0;
    border-bottom: 1rpx solid @glass-border;
    
    &:last-child {
        border-bottom: none;
    }
    
    .info-label {
        font-size: 28rpx;
        color: @text-secondary;
    }
    
    .info-value {
        font-size: 28rpx;
        color: @text-primary;
    }
}

.settings-footer {
    padding: @spacing-md;
}

.save-btn {
    width: 100%;
    height: 96rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: @accent-gradient;
    border-radius: @radius-lg;
    
    .save-text {
        font-size: 32rpx;
        font-weight: 600;
        color: #fff;
    }
    
    &:active {
        opacity: 0.85;
        transform: scale(0.99);
    }
}

.picker-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: flex-end;
    z-index: 1000;
}

.picker-content {
    width: 100%;
    max-height: 70vh;
    border-radius: @radius-xl @radius-xl 0 0;
    padding: 0;
}

.picker-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: @spacing-lg;
    border-bottom: 1rpx solid @glass-border;
    
    .picker-title {
        font-size: 32rpx;
        font-weight: 600;
        color: @text-primary;
    }
}

.picker-close {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .close-icon {
        font-size: 48rpx;
        color: @text-muted;
    }
}

.picker-list {
    height: 50vh;
    padding: @spacing-sm;
}

.picker-item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: @spacing-md;
    border-radius: @radius-md;
    margin-bottom: @spacing-xs;
    
    .picker-item-text {
        font-size: 28rpx;
        color: @text-primary;
    }
    
    &.active {
        background: rgba(99, 102, 241, 0.2);
        
        .picker-item-text {
            color: @accent-primary;
        }
    }
    
    &:active {
        background: @glass-hover;
    }
}

.picker-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: @spacing-xl;
    
    .empty-text {
        font-size: 28rpx;
        color: @text-muted;
    }
}
</style>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Settings',
    data() {
        return {
            $page: {} ,
            AI: null,
            apiKey: '',
            baseUrl: '',
            model: 'gpt-3.5-turbo',
            maxTokens: 1000,
            temperature: 0.7,
            topP: 1.0,
            systemPrompt: '',
            models: [],
            showModelPicker: false
        };
    },
    
    async onShow() {
        await this.initializeAI();
        await this.loadSettings();
    },
    
    methods: {
        async initializeAI() {
            try {
                const custom = await import('custom');
                this.AI = new custom.AI();
                this.AI.initialize();
            } catch (e) {
                console.error('AI init error:', e);
            }
        },
        
        async loadSettings() {
            try {
                const settings = this.AI.getSettings();
                this.apiKey = settings.apiKey;
                this.baseUrl = settings.baseUrl;
                this.model = settings.modelName;
                this.maxTokens = settings.maxTokens;
                this.temperature = settings.temperature;
                this.topP = settings.topP;
                this.systemPrompt = settings.systemPrompt;
                
                await this.loadModels();
            } catch (e) {
                console.error('Load settings error:', e);
            }
        },
        
        async loadModels() {
            try {
                if (this.apiKey && this.baseUrl) {
                    this.models = await this.AI.getModels();
                }
            } catch (e) {
                console.error('Load models error:', e);
            }
        },
        
        async saveSettings() {
            try {
                this.AI.setSettings(
                    this.apiKey,
                    this.baseUrl,
                    this.model,
                    parseInt(this.maxTokens),
                    parseFloat(this.temperature),
                    parseFloat(this.topP),
                    this.systemPrompt
                );
                
                await this.loadModels();
                
                $falcon.showToast({
                    title: '保存成功',
                    duration: 2000
                });
            } catch (e) {
                console.error('Save settings error:', e);
                $falcon.showToast({
                    title: '保存失败',
                    duration: 2000
                });
            }
        },
        
        selectModel(m) {
            this.model = m;
            this.showModelPicker = false;
        },
        
        async clearAllData() {
            try {
                const conversations = await this.AI.getConversationList();
                for (const conv of conversations) {
                    await this.AI.deleteConversation(conv.id);
                }
                
                $falcon.showToast({
                    title: '已清除所有数据',
                    duration: 2000
                });
            } catch (e) {
                console.error('Clear data error:', e);
            }
        },
        
        goBack() {
            $falcon.navBack();
        }
    }
});
</script>
