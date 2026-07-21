<template>
    <div class="app-container">
        <div class="sidebar">
            <div class="sidebar-header">
                <text class="app-title">ChatBox</text>
                <text class="app-subtitle">AI Assistant</text>
            </div>
            
            <div class="sidebar-actions">
                <div class="btn-new-chat" @click="createNewChat">
                    <text class="btn-icon">+</text>
                    <text class="btn-text">新对话</text>
                </div>
                <div class="btn-settings" @click="goToSettings">
                    <text class="btn-icon">⚙</text>
                </div>
            </div>
            
            <scroller class="conversation-list" scroll-direction="vertical">
                <div 
                    v-for="conv in conversations" 
                    :key="conv.id"
                    :class="['conv-item', { active: conv.id === currentConversationId }]"
                    @click="loadConversation(conv.id)"
                >
                    <div class="conv-icon">
                        <text class="conv-icon-text">{{ conv.title.charAt(0) }}</text>
                    </div>
                    <div class="conv-info">
                        <text class="conv-title ellipsis">{{ conv.title }}</text>
                        <text class="conv-time">{{ formatTime(conv.updatedAt) }}</text>
                    </div>
                    <div class="conv-delete" @click.stop="deleteConversation(conv.id)">
                        <text class="delete-icon">×</text>
                    </div>
                </div>
                
                <div v-if="conversations.length === 0" class="empty-state">
                    <text class="empty-icon">🤖</text>
                    <text class="empty-text">开始你的对话</text>
                    <text class="empty-hint">点击上方按钮创建新对话</text>
                </div>
            </scroller>
        </div>
        
        <div class="main-content">
            <div v-if="!currentConversationId" class="welcome-screen">
                <div class="welcome-icon">💬</div>
                <text class="welcome-title">Welcome to ChatBox</text>
                <text class="welcome-subtitle">智能对话助手</text>
                <text class="welcome-desc">选择一个对话开始聊天，或创建新对话</text>
            </div>
            
            <div v-else class="chat-container">
                <div class="chat-header glass-card">
                    <text class="chat-title">{{ currentConversationTitle }}</text>
                    <div class="chat-actions">
                        <div class="action-btn" @click="clearHistory">
                            <text class="action-icon">🗑</text>
                        </div>
                    </div>
                </div>
                
                <scroller 
                    class="message-list" 
                    scroll-direction="vertical"
                    :scroll-top="scrollTop"
                    @scroll="onScroll"
                >
                    <div class="message-list-inner">
                        <div 
                            v-for="msg in messages" 
                            :key="msg.id"
                            :class="['message-item', msg.role === 'user' ? 'user' : 'assistant']"
                        >
                            <div class="avatar">
                                <text class="avatar-text">{{ msg.role === 'user' ? '👤' : '🤖' }}</text>
                            </div>
                            <div class="message-content">
                                <text class="message-text">{{ msg.content }}</text>
                            </div>
                        </div>
                        
                        <div v-if="isGenerating" class="message-item assistant">
                            <div class="avatar">
                                <text class="avatar-text">🤖</text>
                            </div>
                            <div class="message-content">
                                <text class="message-text">{{ currentResponse }}</text>
                                <text class="typing-indicator">
                                    <text class="dot">.</text>
                                    <text class="dot">.</text>
                                    <text class="dot">.</text>
                                </text>
                            </div>
                        </div>
                        
                        <div v-if="errorMessage" class="error-message">
                            <text class="error-icon">❌</text>
                            <text class="error-text">{{ errorMessage }}</text>
                        </div>
                    </div>
                </scroller>
                
                <div class="input-area glass-card">
                    <textarea 
                        class="input-text"
                        v-model="inputText"
                        placeholder="输入消息..."
                        :disabled="isGenerating"
                        @confirm="sendMessage"
                    ></textarea>
                    <div class="input-actions">
                        <div 
                            :class="['send-btn', { disabled: !inputText.trim() || isGenerating }]"
                            @click="sendMessage"
                        >
                            <text class="send-icon">➤</text>
                        </div>
                        <div 
                            v-if="isGenerating" 
                            class="stop-btn"
                            @click="stopGeneration"
                        >
                            <text class="stop-icon">⏹</text>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import url('../../styles/global.less');

.app-container {
    display: flex;
    height: 100vh;
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
    overflow: hidden;
}

.sidebar {
    width: 320rpx;
    height: 100%;
    display: flex;
    flex-direction: column;
    border-right: 1rpx solid @glass-border;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
}

.sidebar-header {
    padding: @spacing-lg;
    border-bottom: 1rpx solid @glass-border;
    
    .app-title {
        display: block;
        font-size: 36rpx;
        font-weight: 700;
        color: @text-primary;
        margin-bottom: 4rpx;
    }
    
    .app-subtitle {
        font-size: 24rpx;
        color: @text-muted;
    }
}

.sidebar-actions {
    display: flex;
    gap: @spacing-sm;
    padding: @spacing-md;
}

.btn-new-chat {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: @spacing-xs;
    padding: @spacing-md;
    background: @accent-gradient;
    border-radius: @radius-md;
    color: #fff;
    font-size: 26rpx;
    
    .btn-icon {
        font-size: 32rpx;
        font-weight: 300;
    }
    
    &:active {
        opacity: 0.85;
        transform: scale(0.98);
    }
}

.btn-settings {
    width: 88rpx;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: @glass-bg;
    border: 1rpx solid @glass-border;
    border-radius: @radius-md;
    
    .btn-icon {
        font-size: 36rpx;
    }
    
    &:active {
        background: @glass-hover;
    }
}

.conversation-list {
    flex: 1;
    padding: @spacing-sm;
}

.conv-item {
    display: flex;
    align-items: center;
    padding: @spacing-md;
    margin-bottom: @spacing-xs;
    background: @glass-bg;
    border: 1rpx solid @glass-border;
    border-radius: @radius-md;
    transition: all 0.2s ease;
    
    &.active {
        background: rgba(99, 102, 241, 0.2);
        border-color: @accent-primary;
    }
    
    &:active {
        background: @glass-hover;
    }
}

.conv-icon {
    width: 72rpx;
    height: 72rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: @accent-gradient;
    border-radius: @radius-sm;
    margin-right: @spacing-sm;
    
    .conv-icon-text {
        color: #fff;
        font-size: 28rpx;
        font-weight: 600;
    }
}

.conv-info {
    flex: 1;
    min-width: 0;
    
    .conv-title {
        display: block;
        font-size: 26rpx;
        color: @text-primary;
        margin-bottom: 4rpx;
    }
    
    .conv-time {
        font-size: 22rpx;
        color: @text-muted;
    }
}

.conv-delete {
    width: 56rpx;
    height: 56rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .delete-icon {
        font-size: 40rpx;
        color: @error;
    }
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: @spacing-xl * 2;
    
    .empty-icon {
        font-size: 80rpx;
        margin-bottom: @spacing-md;
    }
    
    .empty-text {
        font-size: 28rpx;
        color: @text-secondary;
        margin-bottom: @spacing-xs;
    }
    
    .empty-hint {
        font-size: 24rpx;
        color: @text-muted;
    }
}

.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.welcome-screen {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: @spacing-xl;
    
    .welcome-icon {
        font-size: 120rpx;
        margin-bottom: @spacing-xl;
    }
    
    .welcome-title {
        font-size: 48rpx;
        font-weight: 700;
        color: @text-primary;
        margin-bottom: @spacing-sm;
    }
    
    .welcome-subtitle {
        font-size: 32rpx;
        color: @accent-primary;
        margin-bottom: @spacing-lg;
    }
    
    .welcome-desc {
        font-size: 28rpx;
        color: @text-muted;
        text-align: center;
    }
}

.chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: @spacing-md;
    gap: @spacing-md;
}

.chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: @spacing-md @spacing-lg;
    
    .chat-title {
        font-size: 32rpx;
        font-weight: 600;
        color: @text-primary;
    }
}

.chat-actions {
    display: flex;
    gap: @spacing-sm;
}

.action-btn {
    width: 72rpx;
    height: 72rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: @glass-bg;
    border: 1rpx solid @glass-border;
    border-radius: @radius-sm;
    
    .action-icon {
        font-size: 32rpx;
    }
    
    &:active {
        background: @glass-hover;
    }
}

.message-list {
    flex: 1;
    background: transparent;
}

.message-list-inner {
    padding-bottom: @spacing-md;
}

.message-item {
    display: flex;
    gap: @spacing-sm;
    margin-bottom: @spacing-md;
    
    &.user {
        flex-direction: row-reverse;
        
        .message-content {
            background: @accent-gradient;
            border-radius: @radius-lg @radius-lg @radius-sm @radius-lg;
        }
    }
    
    &.assistant {
        .message-content {
            background: @glass-bg;
            border: 1rpx solid @glass-border;
            border-radius: @radius-lg @radius-lg @radius-lg @radius-sm;
        }
    }
}

.avatar {
    width: 72rpx;
    height: 72rpx;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .avatar-text {
        font-size: 36rpx;
    }
}

.message-content {
    max-width: 70%;
    padding: @spacing-md;
    
    .message-text {
        font-size: 28rpx;
        line-height: 1.6;
        color: @text-primary;
        white-space: pre-wrap;
        word-break: break-word;
    }
}

.typing-indicator {
    display: inline-flex;
    gap: 8rpx;
    margin-left: 8rpx;
    
    .dot {
        font-size: 24rpx;
        color: @text-muted;
    }
}

.error-message {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: @spacing-sm;
    padding: @spacing-md;
    background: rgba(239, 68, 68, 0.15);
    border: 1rpx solid rgba(239, 68, 68, 0.3);
    border-radius: @radius-md;
    margin: @spacing-md 0;
    
    .error-icon {
        font-size: 32rpx;
    }
    
    .error-text {
        font-size: 26rpx;
        color: @error;
    }
}

.input-area {
    display: flex;
    gap: @spacing-sm;
    padding: @spacing-sm @spacing-md;
}

.input-text {
    flex: 1;
    height: 88rpx;
    padding: @spacing-md;
    background: rgba(255, 255, 255, 0.05);
    border: 1rpx solid @glass-border;
    border-radius: @radius-lg;
    color: @text-primary;
    font-size: 28rpx;
    placeholder-color: @text-muted;
    
    &:focus {
        border-color: @accent-primary;
    }
    
    &[disabled] {
        opacity: 0.5;
    }
}

.input-actions {
    display: flex;
    gap: @spacing-sm;
    align-items: center;
}

.send-btn {
    width: 88rpx;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: @accent-gradient;
    border-radius: @radius-lg;
    
    .send-icon {
        font-size: 36rpx;
        color: #fff;
        transform: rotate(-45deg);
    }
    
    &:active {
        opacity: 0.85;
    }
    
    &.disabled {
        opacity: 0.4;
        pointer-events: none;
    }
}

.stop-btn {
    width: 88rpx;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: @error;
    border-radius: @radius-lg;
    
    .stop-icon {
        font-size: 32rpx;
    }
    
    &:active {
        opacity: 0.85;
    }
}

.formatTime {
    font-size: 22rpx;
    color: @text-muted;
}
</style>

<script>
import { defineComponent, nextTick } from 'vue';

export default defineComponent({
    name: 'ChatBox',
    data() {
        return {
            $page: {} ,
            AI: null,
            conversations: [],
            currentConversationId: '',
            currentConversationTitle: '',
            messages: [],
            inputText: '',
            currentResponse: '',
            isGenerating: false,
            errorMessage: '',
            scrollTop: 0,
            nodeMap: {},
            currentNodeId: '',
            rootNodeId: ''
        };
    },
    
    async onShow() {
        await this.initializeAI();
        await this.loadConversations();
    },
    
    methods: {
        async initializeAI() {
            try {
                const custom = await import('custom');
                this.AI = new custom.AI();
                this.AI.initialize();
                this.AI.on('ai_stream', (delta) => {
                    this.handleStream(delta);
                });
            } catch (e) {
                console.error('AI init error:', e);
            }
        },
        
        async loadConversations() {
            try {
                this.conversations = await this.AI.getConversationList();
                if (this.conversations.length > 0 && !this.currentConversationId) {
                    await this.loadConversation(this.conversations[0].id);
                }
            } catch (e) {
                console.error('Load conversations error:', e);
            }
        },
        
        async createNewChat() {
            try {
                await this.AI.createConversation('新对话');
                await this.loadConversations();
            } catch (e) {
                console.error('Create chat error:', e);
            }
        },
        
        async loadConversation(id) {
            try {
                this.currentConversationId = id;
                const conv = this.conversations.find(c => c.id === id);
                if (conv) {
                    this.currentConversationTitle = conv.title;
                }
                
                await this.AI.loadConversation(id);
                await this.refreshMessages();
            } catch (e) {
                console.error('Load conversation error:', e);
            }
        },
        
        async refreshMessages() {
            try {
                const path = this.AI.getCurrentPath();
                this.messages = path.filter(m => m.role !== 2).map(m => ({
                    id: m.id,
                    role: m.role === 0 ? 'user' : 'assistant',
                    content: m.content
                }));
                this.currentNodeId = this.AI.getCurrentNodeId();
                this.rootNodeId = this.AI.getRootNodeId();
                this.errorMessage = '';
                
                await nextTick();
                this.scrollToBottom();
            } catch (e) {
                console.error('Refresh messages error:', e);
            }
        },
        
        async sendMessage() {
            if (!this.inputText.trim() || this.isGenerating) return;
            
            const text = this.inputText.trim();
            this.inputText = '';
            this.isGenerating = true;
            this.errorMessage = '';
            this.currentResponse = '';
            
            try {
                await this.AI.addUserMessage(text);
                await this.refreshMessages();
                
                await this.AI.generateResponse();
            } catch (e) {
                this.errorMessage = String(e);
            } finally {
                this.isGenerating = false;
                await this.refreshMessages();
            }
        },
        
        async stopGeneration() {
            try {
                this.AI.stopGeneration();
            } catch (e) {
                console.error('Stop generation error:', e);
            }
        },
        
        async deleteConversation(id) {
            try {
                await this.AI.deleteConversation(id);
                await this.loadConversations();
                
                if (this.currentConversationId === id) {
                    this.currentConversationId = '';
                    this.currentConversationTitle = '';
                    this.messages = [];
                }
            } catch (e) {
                console.error('Delete conversation error:', e);
            }
        },
        
        async clearHistory() {
            try {
                await this.AI.deleteConversation(this.currentConversationId);
                await this.AI.createConversation('新对话');
                await this.loadConversations();
            } catch (e) {
                console.error('Clear history error:', e);
            }
        },
        
        handleStream(delta) {
            this.currentResponse += delta;
            this.scrollToBottom();
        },
        
        scrollToBottom() {
            this.scrollTop = 99999;
        },
        
        onScroll(e) {
        },
        
        formatTime(timestamp) {
            const date = new Date(parseInt(timestamp) * 1000);
            const now = new Date();
            const diff = now.getTime() - date.getTime();
            
            if (diff < 60000) return '刚刚';
            if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
            if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
            if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;
            
            return `${date.getMonth() + 1}/${date.getDate()}`;
        },
        
        goToSettings() {
            $falcon.navTo({ url: '/pages/settings/settings' });
        }
    }
});
</script>
