export const state = {};

let compoundData = [];
Object.defineProperties(state, {
    data: {
        set(value) {
            compoundData = value;
            this.listner(value);
        },
        get() {
            return compoundData
        },
        enumerable: true
    },
    listner: {
        value: function(value){},
        writable: true,
        configurable: true
    },
    registerListner: {
        value: function(listen) {
            this.listner = listen;
        },
        writable: true,
        configurable: true
    }
})