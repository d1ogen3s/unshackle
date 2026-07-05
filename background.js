const ADULT_DOMAIN_META_URL = "https://raw.githubusercontent.com/Bon-Appetit/porn-domains/refs/heads/main/meta.json"
var blocklist = new Set()

async function getDomainListUrl() {
    const response = await fetch(ADULT_DOMAIN_META_URL)
    const metaJson = await response.json()

    return metaJson['blocklist']['raw_url']
}

async function loadDomainList() {
    const listUrl = await getDomainListUrl()
    const response = await fetch(listUrl)
    
    const text = await response.text()

    const domains = text.split('\n')

    blocklist = new Set(domains)

    return domains
}

function editContent() {
    document.body.innerHTML = ""
}

loadDomainList()

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {

    const tabUrl = new URL(tab.url)

    if (!blocklist.has(tabUrl.hostname.replace(/^www\./, ""))) {
        console.log(`${tabUrl.hostname} is ok.`)
        return
    }

    console.log(`${tabUrl.hostname} is blocked.`)

    await browser.scripting.executeScript({
        target: {
            tabId: tab.id,
            allFrames: false
        },
        func: editContent
    })
})
