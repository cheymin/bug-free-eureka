<!--
  Built-in on-screen keyboard for the Dictionary Pen (no physical keyboard).
  Emits:
    - input   (ch: string)   when a character key is pressed
    - backspace ()           when the backspace key is pressed
    - done    ()             when the "完成" (done) key is pressed
  The parent is responsible for updating the focused field's value.
-->
<template>
    <div class="kb">
        <div class="kb-row" v-for="(row, ri) in displayRows" :key="ri">
            <text
                v-for="(key, ki) in row"
                :key="ki"
                :class="key.cls"
                @click="onKey(key)"
            >{{ key.l }}</text>
        </div>
    </div>
</template>

<script>
var LETTER_ROWS = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];
var NUMBER_ROWS = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['-', '/', '@', '.', ':', ',', '!', '?'],
    ['#', '$', '%', '&', '*', '+', '=', '(', ')']
];

function buildKey(letter, opts) {
    opts = opts || {};
    var cls = 'kb-key';
    if (opts.wide) {
        cls = cls + ' kb-key-wide';
    }
    if (opts.action === 'backspace') {
        cls = cls + ' kb-key-bk';
    } else if (opts.action === 'enter') {
        cls = cls + ' kb-key-go';
    } else if (opts.action === 'shift') {
        cls = cls + ' kb-key-sh';
    } else if (opts.action === 'mode') {
        cls = cls + ' kb-key-md';
    } else if (opts.action === 'space') {
        cls = cls + ' kb-key-sp';
    } else if (opts.action === 'newline') {
        cls = cls + ' kb-key-nl';
    }
    return {
        l: opts.label != null ? opts.label : letter,
        c: letter,
        a: opts.action,
        wide: !!opts.wide,
        cls: cls
    };
}

export default {
    name: 'Keyboard',
    data: function () {
        return {
            mode: 'letter',
            shifted: false
        };
    },
    computed: {
        displayRows: function () {
            var self = this;
            var rows = [];
            if (self.mode === 'number') {
                for (var i = 0; i < NUMBER_ROWS.length; i++) {
                    var nrow = [];
                    for (var j = 0; j < NUMBER_ROWS[i].length; j++) {
                        var nch = NUMBER_ROWS[i][j];
                        nrow.push(buildKey(nch, { label: nch }));
                    }
                    rows.push(nrow);
                }
                rows.push([
                    buildKey('', { action: 'mode', label: 'ABC', wide: true }),
                    buildKey('\n', { action: 'newline', label: '↵' }),
                    buildKey(' ', { action: 'space', label: '空格', wide: true }),
                    buildKey('', { action: 'enter', label: '完成', wide: true })
                ]);
            } else {
                for (var r = 0; r < LETTER_ROWS.length; r++) {
                    var lrow = [];
                    for (var c = 0; c < LETTER_ROWS[r].length; c++) {
                        var lower = LETTER_ROWS[r][c];
                        var disp = self.shifted ? lower.toUpperCase() : lower;
                        lrow.push(buildKey(lower, { label: disp }));
                    }
                    rows.push(lrow);
                }
                // Row 3 (index 2): prepend shift, append backspace
                var row3 = [buildKey('', { action: 'shift', label: self.shifted ? 'A↑' : '↑', wide: true })];
                for (var k = 0; k < rows[2].length; k++) {
                    row3.push(rows[2][k]);
                }
                row3.push(buildKey('', { action: 'backspace', label: '⌫', wide: true }));
                rows[2] = row3;
                rows.push([
                    buildKey('', { action: 'mode', label: '123', wide: true }),
                    buildKey('\n', { action: 'newline', label: '↵' }),
                    buildKey(' ', { action: 'space', label: '空格', wide: true }),
                    buildKey('', { action: 'enter', label: '完成', wide: true })
                ]);
            }
            return rows;
        }
    },
    methods: {
        onKey: function (key) {
            if (key.a === 'shift') {
                this.shifted = !this.shifted;
                return;
            }
            if (key.a === 'mode') {
                this.mode = (this.mode === 'letter') ? 'number' : 'letter';
                return;
            }
            if (key.a === 'backspace') {
                this.$emit('backspace');
                return;
            }
            if (key.a === 'space') {
                this.$emit('input', ' ');
                return;
            }
            if (key.a === 'newline') {
                this.$emit('input', '\n');
                return;
            }
            if (key.a === 'enter') {
                this.$emit('done');
                return;
            }
            var ch = this.shifted ? key.c.toUpperCase() : key.c;
            this.$emit('input', ch);
            if (this.shifted) {
                this.shifted = false;
            }
        }
    }
};
</script>

<style lang="less" scoped>
.kb {
    width: 100%;
    background-color: #1a1a1a;
    padding: 4px;
    display: flex;
    flex-direction: column;
}
.kb-row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 3px;
}
.kb-key {
    flex: 1;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 16px;
    color: #ffffff;
    background-color: #333333;
    border-radius: 4px;
    margin-left: 1px;
    margin-right: 1px;
}
.kb-key:active {
    background-color: #555555;
}
.kb-key-wide {
    flex: 2;
}
.kb-key-sp {
    flex: 4;
}
.kb-key-bk {
    background-color: #c0392b;
}
.kb-key-go {
    background-color: #27ae60;
}
.kb-key-sh {
    background-color: #2980b9;
}
.kb-key-md {
    background-color: #7f8c8d;
}
.kb-key-nl {
    background-color: #8e44ad;
}
</style>
