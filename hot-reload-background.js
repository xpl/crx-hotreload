const watchChanges = (files, prevTexts) => {

    Promise.all (files.map (url => fetch (new Request (chrome.extension.getURL (url))).then (r => r.text ())))
           .then (sourceTexts => {

                chrome.tabs.query ({ active: true, currentWindow: true }, tabs => {

                    let changed = false

                    if (prevTexts) {
                        sourceTexts.forEach ((text, i) => {
                            changed = changed || (text !== prevTexts[i])
                        })
                    }

                    if (changed) {
                    
                        chrome.tabs.sendMessage (tabs[0].id, { action: 'runtime_reloaded' }, () => {})
                        chrome.runtime.reload ()

                    } else {

                        setTimeout (() => watchChanges (files, sourceTexts), 1000)
                    }
                })
                
            })
}

chrome.runtime.getPackageDirectoryEntry (entry => {

    entry.createReader ().readEntries (entries => {

        const urls = []

        entries.forEach (e => {

            const ext = e.name.split ('.').pop ()

            if (ext === 'js' ||
                ext === 'json') {

                urls.push ('/' + e.name)
            }
            
        })

        watchChanges (urls)
    });
})
