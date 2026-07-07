const ADULT_DOMAIN_META_URL = "https://raw.githubusercontent.com/Bon-Appetit/porn-domains/refs/heads/main/meta.json"
const DEFALT_REDIRECT_URL = "https://nofap.com/"

var blocklist = new Set()
var tabUrlsBeforeRedirect = {}

async function getDomainListUrl() {
    const response = await fetch(ADULT_DOMAIN_META_URL)
    const metaJson = await response.json()

    return metaJson['blocklist']['raw_url']
}

async function requestDomainList() {
    const listUrl = await getDomainListUrl()
    const response = await fetch(listUrl)

    if (!response.ok) {
        console.log("Couldn't load blocklist from " + listUrl)
        return []
    }

    console.log("Loaded blocklist from " + listUrl)

    const text = await response.text()

    const domains = text.split('\n')

    blocklist = new Set(domains)

    return domains
}


browser.runtime.onStartup.addListener(requestDomainList)
browser.runtime.onInstalled.addListener(requestDomainList)

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {

    if (blocklist.size === 0) {
        await requestDomainList()
    }

    if (tabUrlsBeforeRedirect[tabId] === tab.url) {
        return
    }
    else {
        delete tabUrlsBeforeRedirect[tabId]
        console.log(tabUrlsBeforeRedirect[tabId])
    }

    const tabUrl = new URL(tab.url)

    if (!blocklist.has(tabUrl.hostname.replace(/^www\./, "")) || !tabUrl.hostname) {
        console.log(`${tabUrl.hostname} is ok.`)
        return
    }

    console.log(`${tabUrl.hostname} is blocked.`)

    console.log(`Redirecting from ${tabUrl.hostname} to ${DEFALT_REDIRECT_URL}`)

    tabUrlsBeforeRedirect[tabId] = tab.url
    browser.tabs.update(tabId, {
        loadReplace: true,
        url: DEFALT_REDIRECT_URL
    })
})
