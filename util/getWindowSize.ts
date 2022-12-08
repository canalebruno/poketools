export default function getWindowSize() {
    const {innerHeight, innerWidth} = window

    return {
        height: innerHeight,
        width: innerWidth
    }
}