const filesInDirectory = dir => new Promise (resolve =>
    dir.createReader ().readEntries (entries =>
        Promise.all (entries.filter (e => e.name[0] !== '.').map (e =>
            e.isDirectory
                ? filesInDirectory (e)
                : new Promise (resolve => e.file (resolve))
        ))
        .then (files => [].concat (...files))
        .then (resolve)
    )
)

const timestampForFilesInDirectory = dir =>
        filesInDirectory (dir).then (files =>
            files.map (f => f.name + f.lastModifiedDate).join ())

const reload = () => {
    chrome.permissions.contains ({
        origins: ["http://*/*", "https://*/*"]
    }, granted => {
        if (granted) {
            chrome.tabs.query ({ active: true, lastFocusedWindow: true }, tabs => { // NB: see https://github.com/xpl/crx-hotreload/issues/5
                if (tabs[0]) {
                    chrome.tabs.executeScript (tabs[0].id, { code: 'setTimeout(() => { location.reload() }, 300)' }, () => {})
                    chrome.runtime.reload ()
                }
            })
        } else {
            alert ('Unable to reload the active tab — please add "http://*/*" and "https://*/*" permissions to manifest.json!')
            chrome.runtime.reload ()
        }
    })
}

const watchChanges = (dir, lastTimestamp) => {
    timestampForFilesInDirectory (dir).then (timestamp => {
        if (!lastTimestamp || (lastTimestamp === timestamp)) {
            setTimeout (() => watchChanges (dir, timestamp), 1000) // retry after 1s
        } else {
            reload ()
        }
    })
}

chrome.management.getSelf (self => {
    if (self.installType === 'development') {
        chrome.runtime.getPackageDirectoryEntry (dir => watchChanges (dir))
    }
})
