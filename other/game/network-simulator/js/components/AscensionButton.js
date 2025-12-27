// Ascension Button Component
const AscensionButton = {
    name: 'AscensionButton',
    props: {
        coresEarned: { type: Number, required: true },
        minTierReached: { type: Number, required: true }
    },
    emits: ['ascend'],
    computed: {
        canAscend() {
            // Can ascend after reaching Tier 3+
            return this.minTierReached >= 3 && this.coresEarned >= 1;
        }
    },
    methods: {
        handleAscend() {
            if (!this.canAscend) return;
            
            const message = `转生并重置你的进度?\n\n你将获得: ${this.coresEarned} 量子核心${this.coresEarned !== 1 ? '' : ''}\n\n这将重置:\n- 所有资源\n- 所有解锁的节点 (核心除外)\n- 所有自动化\n\n量子核心会持续存在，并且可以用于永久的升级.`;
            
            if (confirm(message)) {
                this.$emit('ascend');
            }
        },
        formatNumber(num) {
            return GameData.formatNumber(Math.floor(num));
        }
    },
    template: `
        <div id="ascension-section" v-if="minTierReached >= 3">
            <h2>Ascension</h2>
            <button 
                id="ascension-button"
                class="action-button ascension"
                :disabled="!canAscend"
                @click="handleAscend"
                :title="canAscend ? 'Reset for Quantum Cores' : 'Reach Tier 3+ to ascend'"
            >
                <div class="button-content">
                    <span class="button-icon">🌌</span>
                    <span class="button-text">Ascend</span>
                    <span class="button-value">+{{ formatNumber(coresEarned) }} 💎</span>
                </div>
            </button>
            <p class="ascension-hint">Reset progress for permanent upgrades</p>
        </div>
    `
};
