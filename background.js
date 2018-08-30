let currentTabId;
let messagesTabId;
let previousTab;

function onError(e) {
  console.log("***Error: " + e);
};

function createPinnedTab() {
  browser.tabs.create(
    {
      url: "https://messages.android.com",
      pinned: true,
      active: true
    }
  )
};

function handleSearch(messagesTabs) {
  //console.log("currentTabId: " + currentTabId);
  if(messagesTabs.length > 0) {
    //console.log("there is a calendar tab");
    messagesTabId = messagesTabs[0].id;
    if(messagesTabId === currentTabId) {
      //console.log("I'm in the messages tab");
      browser.tabs.update(previousTab, {active: true,});
    } else {
      //console.log("I'm NOT in the messages tab");
      previousTab = currentTabId;
      browser.tabs.update(messagesTabId, {active: true,});
    }
  } else {
    //console.log("there is NO messages tab");
    previousTab = currentTabId;
    createPinnedTab();
  }
};

function handleClick(tab) {
  //console.log("*********Button clicked*********");
  currentTabId = tab.id;
  var querying = browser.tabs.query({url: "*://messages.android.com/*"});
  querying.then(handleSearch, onError);
};

function update(details) {
  if (details.reason === "install" || details.reason === "update") {
    var opening = browser.runtime.openOptionsPage();
    opening.then(onOpened, onError);
  }
};

browser.browserAction.onClicked.addListener(handleClick);
browser.runtime.onInstalled.addListener(update);