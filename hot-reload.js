chrome.runtime.onMessage.addListener (msg => {

    if (msg.action === 'runtime_reloaded') {
        window.location.reload ()
    }
})
