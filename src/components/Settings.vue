<template>
    <div class="settings">
        <h3>Settings</h3>
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">API Key (BYOK)</h5>
                <p class="card-text">
                    <small>Enter your own API key. It will be stored locally in your browser and sent with requests via the <code>x-api-key</code> header.</small>
                </p>
                <div class="input-group mb-3">
                    <input
                        :type="showKey ? 'text' : 'password'"
                        class="form-control"
                        v-model="apiKey"
                        placeholder="Enter your API key"
                        aria-label="API Key"
                    />
                    <button class="btn btn-outline-secondary" type="button" @click="toggleShowKey">
                        <i :class="showKey ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" @click="saveApiKey">
                        Save <i class="bi bi-save"></i>
                    </button>
                    <button class="btn btn-danger" @click="clearApiKey">
                        Clear <i class="bi bi-trash"></i>
                    </button>
                </div>
                <div v-if="message" class="alert mt-3" :class="messageType" role="alert">
                    {{ message }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Settings",
    data() {
        return {
            apiKey: '',
            showKey: false,
            message: '',
            messageType: 'alert-success',
        }
    },
    metaInfo() {
        return {
            'title': 'Settings - Cite.GG',
        }
    },
    mounted() {
        this.apiKey = window.localStorage.getItem('apiKey') || '';
    },
    methods: {
        toggleShowKey() {
            this.showKey = !this.showKey;
        },
        saveApiKey() {
            window.localStorage.setItem('apiKey', this.apiKey);
            this.$axios.defaults.headers.common['x-api-key'] = this.apiKey;
            this.showMessage('API key saved successfully!', 'alert-success');
        },
        clearApiKey() {
            this.apiKey = '';
            window.localStorage.removeItem('apiKey');
            delete this.$axios.defaults.headers.common['x-api-key'];
            this.showMessage('API key cleared.', 'alert-warning');
        },
        showMessage(msg, type) {
            this.message = msg;
            this.messageType = type;
            setTimeout(() => {
                this.message = '';
            }, 3000);
        },
    },
};
</script>

<style scoped>
.settings {
    margin-top: 20px;
}

.card {
    max-width: 600px;
}

code {
    background-color: #f4f4f4;
    padding: 2px 6px;
    border-radius: 4px;
}
</style>
