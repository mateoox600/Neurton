var site = [];
var currentIdx = 0;
var createdTabsID = 0;
        
function changeTab(newIdx){
    currentIdx = newIdx;
    for (var i = 0; i < tabs.children.length; i++) {
        tabs.children[i].style.visibility = 'hidden';
        tabsBar.children[i].style.backgroundColor = 'rgb(70, 70, 70)';
    }
    tabs.children[currentIdx].style.visibility = 'visible';
    tabsBar.children[currentIdx].style.backgroundColor = 'rgb(48, 48, 48)';
    document.getElementById("title").innerHTML = 'Neurton - ' + site[currentIdx];
    url.value = site[currentIdx];
    if(favorites.hasOwnProperty(site[currentIdx])) favoritesButton.children[0].style.color = '#73a9ff';
    else favoritesButton.children[0].style.color = '#fff';
}

function createTab(newTabSite = settings.defaultWebsiteURL){
    const id = createdTabsID;
    createdTabsID++;

    const tabBar = document.createElement('button');
    const tabBarP = document.createElement('p');
    const tabBarCloseButton = document.createElement('button');
    const tabBarI = document.createElement('i');

    tabBarP.className = 'tabs-name';
    tabBarP.innerHTML = 'Loading...';
    tabBar.append(tabBarP);

    tabBarI.className = 'fas fa-times';
    tabBarCloseButton.className = 'tabs-close';
    tabBarCloseButton.append(tabBarI);

    tabBarCloseButton.onclick = (e) => {
        idx = null;
        for (var i = 0; i < tabsBar.children.length; i++) {
            if(parseInt(tabsBar.children[i].id) == id){
                idx = i;
                break;
            }
        }
        closeTab(idx);
    };

    tabBar.append(tabBarCloseButton);

    tabBar.onclick = (e) => {
        if(e.target.className === 'tabs-close') return;
        idx = null;
        for (var i = 0; i < tabsBar.children.length; i++) {
            if(parseInt(tabsBar.children[i].id) == id){
                idx = i;
                break;
            }
        }
        changeTab(idx);
    };

    tabBar.id = id;
    tabsBar.append(tabBar);

    const tab = document.createElement('webview');
    tab.nodeintegration = true;
    tab.useragent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) old-airport-include/1.0.0 Chrome Electron/7.1.7 Safari/537.36';
    tab.src = newTabSite;
    site.push(newTabSite);
    tab.id = id;

    tab.addEventListener('did-finish-load', (e) => {
         reloadButton.innerHTML = '<i class="fas fa-redo"></i>';
    });
    tab.addEventListener('did-fail-load', (e) => {
        reloadButton.innerHTML = '<i class="fas fa-redo"></i>';
    });
    tab.addEventListener('did-start-loading', (e) => {
        reloadButton.innerHTML = '<i class="fas fa-times"></i>';
    });
    tab.addEventListener('load-commit', (e) => {
        idx = null;
        for (var i = 0; i < tabsBar.children.length; i++) {
            if(parseInt(tabsBar.children[i].id) == id){
                idx = i;
                break;
            }
        }
        if(currentIdx == idx) url.value = tab.src;
        var tabTitle = '';
        if(tab.getTitle() !== '') tabTitle = tab.getTitle();
        else tabTitle = site[idx];
        tabTitle = tabTitle.substring(0, (tabTitle.length > 25 ? 25: tabTitle.length));
        tabBarP.innerHTML = tabTitle;
        //console.log(tab.getWebContentsId().history);
    });
    tab.addEventListener('new-window', async (e) => {
        const protocol = require('url').parse(e.url).protocol;
        if (protocol === 'http:' || protocol === 'https:' || protocol === 'file:') {
            createTab(e.url);
        }
    });
    tab.addEventListener('console-message', (e) => {
        console.log(e.message);
        console.log(e.sourceId);
        console.log(e.line);
        if(e.message.startsWith('neurtonSettingsEvent') && e.sourceId === ('file:///' + __dirname + '/settings.html').replaceAll('\\', '/')){
            var event = JSON.parse(e.message.replaceAll('neurtonSettingsEvent:', ''));
            settings[event.field] = event.value;
            saveSettings();
        }
    });

    tabs.append(tab)

    idx = null;
    for (var i = 0; i < tabsBar.children.length; i++) {
        if(parseInt(tabsBar.children[i].id) == id){
            idx = i;
            break;
        }
    }
    changeTab(idx);
}

function closeTab(idx){
    tabs.removeChild(tabs.children[idx]);
    tabsBar.removeChild(tabsBar.children[idx]);
    site.splice(idx, 1);
    if(site.length >= 1) {
        if(idx <= 1) changeTab(0);
        else changeTab(idx-1);
    }
    else if (site.length < 1) window.close();
}

function updateSite(){
    document.getElementById("title").innerHTML = 'Neurton - ' + site[currentIdx];
    tabs.children[currentIdx].src = site[currentIdx];
    url.value = site[currentIdx];
}

function goSite(){
    var newSite = url.value;
    if(!newSite.startsWith('http://') && !newSite.startsWith('https://') && !newSite.startsWith('file://') && !(newSite==='about:blank')) newSite = `https://www.google.com/search?q=${newSite.replaceAll(' ', '+')}`;
    site[currentIdx] = newSite;
    updateSite();
}