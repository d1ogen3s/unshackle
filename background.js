const ADULT_DOMAIN_META_URL = "https://raw.githubusercontent.com/Bon-Appetit/porn-domains/refs/heads/main/meta.json"

async function getDomainListUrl() {
    const response = await fetch(ADULT_DOMAIN_META_URL)
    const metaJson = await response.json()

    console.log(metaJson)
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    browser.scripting.executeScript
})
