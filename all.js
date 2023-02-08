require([
    "esri/portal/Portal",
    "esri/identity/OAuthInfo",
    "esri/identity/IdentityManager"
], function (Portal, OAuthInfo, esriId) {
    const clientId = "JiM7IJ9k519eIGIR";
    const redirectUri = window.location.origin + "/authenticate.html";


    const info = new OAuthInfo({
        appId: clientId,
        popup: false, // the default,
        //flowType: "authorization-code",
        //popupCallbackUrl: redirectUri
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
    }

    function handleSignedOut() {
        document.getElementById("results").innerText = 'Signed Out'
    }

    document.getElementById("withPopupButton").addEventListener("click", function () {
        esriId.getCredential(info.portalUrl + "/sharing");
    });

    document.getElementById("signOutButton").addEventListener("click", function () {
        esriId.destroyCredentials();
        window.location.reload();
    });
});


// import { ArcGISIdentityManager } from 'https://cdn.skypack.dev/@esri/arcgis-rest-request@4.0.0';

// let session = null;
// const clientId = "JiM7IJ9k519eIGIR";
// const redirectUri = window.location.origin + "/authenticate.html";

// const serializedSession = localStorage.getItem("__ARCGIS_REST_USER_SESSION__"); // Check to see if there is a serialized session in local storage.

// if (serializedSession !== null && serializedSession !== "undefined") {
//     session = ArcGISIdentityManager.deserialize(serializedSession);
// }

// function updateSessionInfo(session) {
//     let sessionInfo = document.getElementById("sessionInfo");

//     if (session) {
//         sessionInfo.innerHTML = "Logged in as " + session.username;
//         localStorage.setItem("__ARCGIS_REST_USER_SESSION__", session.serialize());
//         document.getElementById("withPopupButton").hidden = true;
//         document.getElementById("signOutButton").hidden = false;
//     } else {
//         sessionInfo.innerHTML = "";
//         document.getElementById("withPopupButton").hidden = false;
//         document.getElementById("signOutButton").hidden = true;
//     }
// }

// updateSessionInfo(session);

// document.getElementById("withPopupButton").addEventListener("click", (event) => {
//     // Begin an OAuth2 login using a popup.
//     ArcGISIdentityManager.beginOAuth2({
//         clientId: clientId,
//         redirectUri: redirectUri,
//         popup: true
//     })
//         .then((newSession) => {
//             // Upon a successful login, update the session with the new session.
//             session = newSession;
//             console.log(session);
//             updateSessionInfo(session);
//         })
//         .catch((error) => {
//             console.log(error);
//         });
//     event.preventDefault();
// });

// document.getElementById("signOutButton").addEventListener("click", (event) => {
//     event.preventDefault();
//     // call the signOut method to invalidate the token.
//     session.signOut().then(() => {
//         session = null; // Clear the session from memory.
//         localStorage.removeItem("__ARCGIS_REST_USER_SESSION__");
//         updateSessionInfo();
//     });
// });
