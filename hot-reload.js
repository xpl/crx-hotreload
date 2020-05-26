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

const reload = (reloadTab) => {

    if (reloadTab) {
        chrome.tabs.query ({ active: true, currentWindow: true }, tabs => { // NB: see https://github.com/xpl/crx-hotreload/issues/5

            if (tabs[0]) { chrome.tabs.reload (tabs[0].id) }

            chrome.runtime.reload ()
        })
    } else {
        chrome.runtime.reload ()
    }
}

const watchChanges = (dir, reloadTab, lastTimestamp) => {

    timestampForFilesInDirectory (dir).then (timestamp => {

        if (!lastTimestamp || (lastTimestamp === timestamp)) {

            setTimeout (() => watchChanges (dir, reloadTab, timestamp), 1000) // poll every 1s

        } else {

            reload (reloadTab)
        }
    })

}

const defaultOpts = {
    reloadTab: true
};

if (typeof module === 'object') {
    exports.default = (opts) => {
        const combinedOpts = Object.assign({}, defaultOpts, opts);
        chrome.management.getSelf (self => {
            if (self.installType === 'development') {
                chrome.runtime.getPackageDirectoryEntry (dir => watchChanges (dir, combinedOpts.reloadTab))
            }
        })
    }
} else {
    chrome.management.getSelf (self => {
        if (self.installType === 'development') {
            chrome.runtime.getPackageDirectoryEntry (dir => watchChanges (dir, defaultOpts.reloadTab))
        }
    })
}
