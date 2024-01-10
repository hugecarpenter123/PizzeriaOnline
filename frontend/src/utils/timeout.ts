const timeout = (milis?: number) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        controller.abort();
    }, milis ? milis : 5000);
    controller.signal.addEventListener("abort", () => {
        clearTimeout(timeoutId)
    });

    return { timeoutId, controller };
}

export default timeout;