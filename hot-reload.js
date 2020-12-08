const includes = []

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

const timestampForFilesInDirectory = dir => {
        return filesInDirectory (dir).then (files => {
            if (includes.length && !includes.every(i => files.some(f => i === f.name))) return;

            return files
                .filter(f => includes.length ? includes.includes(f.name) : true)
                .map (f => f.name + f.lastModifiedDate).join ()
        })
}

const reload = () => {

    chrome.tabs.query ({ active: true, currentWindow: true }, tabs => { // NB: see https://github.com/xpl/crx-hotreload/issues/5

        if (tabs[0]) { chrome.tabs.reload (tabs[0].id) }

        setTimeout(() => { chrome.runtime.reload () }, 500)
    })
}

const watchChanges = (dir, lastTimestamp) => {

    timestampForFilesInDirectory (dir).then (timestamp => {

        if (!timestamp || !lastTimestamp || (lastTimestamp === timestamp)) {

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

if (typeof module === 'object') {
    exports.include = (files) => {
        includes.push(...files)
    }
}

