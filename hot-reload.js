const filesInDirectory = (dir, exclude, include) => new Promise (resolve =>

    dir.createReader ().readEntries (entries =>

        Promise.all (entries
            .filter (e => e.name[0] !== '.')
            .filter (f => !f.isDirectory && include.length > 0 ? include.includes(f.name) : true)
            .filter (f => !exclude.includes(f.name))
            .map (e =>
            e.isDirectory
                ? filesInDirectory (e, exclude, include)
                : new Promise (resolve => e.file (resolve))
        ))
        .then (files => [].concat (...files))
        .then (resolve)
    )
)

const timestampForFilesInDirectory = (dir, exclude, include) =>
        filesInDirectory (dir, exclude, include).then (files =>
            files. map (f => f.name + f.lastModifiedDate).join ())

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

const watchChanges = (dir, opts, lastTimestamp) => {

    timestampForFilesInDirectory (dir, opts.exclude, opts.include).then (timestamp => {
        if (!lastTimestamp || (lastTimestamp === timestamp)) {

            setTimeout (() => watchChanges (dir, opts, timestamp), 1000) // poll every 1s

        } else {
            reload (opts.reloadTab)
        }
    })

}

const defaultOpts = {
    reloadTab: true,
    exclude: [],
    include: [],
};

if (typeof module === 'object') {
    exports.default = (opts) => {
        const combinedOpts = Object.assign({}, defaultOpts, opts);
        chrome.management.getSelf (self => {
            if (self.installType === 'development') {
                chrome.runtime.getPackageDirectoryEntry (dir => watchChanges (dir, combinedOpts))
            }
        })
    }
} else {
    chrome.management.getSelf (self => {
        if (self.installType === 'development') {
            chrome.runtime.getPackageDirectoryEntry (dir => watchChanges (dir, defaultOpts))
        }
    })
}
