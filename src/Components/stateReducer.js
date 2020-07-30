export default function (state, action) {
    switch (action.type) {
        case "setSymbol": {
            return {
                symbol: action.data
            }
        }
        default:
            return state
    }
}