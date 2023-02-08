require([
    "esri/portal/Portal",
    "esri/identity/OAuthInfo",
    "esri/identity/IdentityManager",
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/portal/PortalQueryParams"
], function (Portal, OAuthInfo, esriId, esriConfig, Map, MapView, FeatureLayer, PortalQueryParams) {
    const clientId = "JiM7IJ9k519eIGIR";
    const redirectUri = window.location.origin + "/oauth-callback.html";

    const info = new OAuthInfo({
        appId: clientId,
        popup: true,
        flowType: "authorization-code",
        popupCallbackUrl: redirectUri
    });

    esriId.registerOAuthInfos([info]);

    esriId
        .checkSignInStatus(info.portalUrl + "/sharing")
        .then(() => {
            handleSignedIn();
        })

        .catch(() => {
            handleSignedOut();
        });

    function handleSignedIn() {
        const portal = new Portal();
        portal.load().then(() => {
            const results = { name: portal.user.fullName, username: portal.user.username };
            document.getElementById("results").innerText = JSON.stringify(results, null, 2);
        });
        displayPortalItems();
        displayMapWithLayer();
    }

    function handleSignedOut() {
        document.getElementById("results").innerText = 'Signed Out'
    }

    document.getElementById("withPopupButton").addEventListener("click", function () {
        // user will be redirected to OAuth sign-in page
        esriId.getCredential((info.portalUrl + "/sharing"), {
            oAuthPopupConfirmation: false
        }).then(function () {
            handleSignedIn();
        });
    });

    document.getElementById("signOutButton").addEventListener("click", function () {
        esriId.destroyCredentials();
        window.location.reload();
    });

    function displayMapWithLayer() {
        const map = new Map({
            basemap: "arcgis-topographic" // Basemap layer service
        });

        const view = new MapView({
            map: map,
            center: [122.642934, -25.404205], // Longitude, latitude
            zoom: 13, // Zoom level
            container: "viewDiv" // Div element
        });

        //Trailheads feature layer (points)
        const WATenemantsLayer = new FeatureLayer({
            url: "https://services.arcgis.com/1zcGoMGglHWsF36l/ArcGIS/rest/services/WA_Current_Tenements/FeatureServer/0",
        });

        map.add(WATenemantsLayer, 0);
    }

    function displayPortalItems() {
        const portal = new Portal();
        // Setting authMode to immediate signs the user in once loaded
        portal.authMode = "immediate";
        // Once loaded, user is signed in
        portal.load().then(() => {
            // Create query parameters for the portal search
            const queryParams = new PortalQueryParams({
                query: "owner:" + portal.user.username,
                sortField: "numViews",
                sortOrder: "desc",
                num: 20
            });

            // Query the items based on the queryParams created from portal above
            portal.queryItems(queryParams).then(createGallery);
        });
    }

    function createGallery(items) {
        let htmlFragment = "";

        items.results.forEach((item) => {
            htmlFragment +=
                '<div class="esri-item-container">' +
                (item.thumbnailUrl
                    ? '<div class="esri-image" style="background-image:url(' + item.thumbnailUrl + ');"></div>'
                    : '<div class="esri-image esri-null-image">Thumbnail not available</div>') +
                (item.title
                    ? '<div class="esri-title">' + (item.title || "") + "</div>"
                    : '<div class="esri-title esri-null-title">Title not available</div>') +
                ('<div class="esri-title">Access : ' + (item.access || "") + "</div>") +
                ('<div class="esri-title">Feature Layer : ' + (item.isLayer) + "</div>") +
                ('<div class="esri-title">Type : ' + (item.type || "") + "</div>") +
                ('<div class="esri-title">URL : ' + (item.url || "") + "</div>") +
                "</div>";
        });
        document.getElementById("listitems").innerHTML = htmlFragment;
    }
});