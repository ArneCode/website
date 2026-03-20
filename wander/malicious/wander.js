window.wander = {
    // Other Wander consoles that visitors can reach from my console.
    consoles: [
        'https://susam.net/wander/',
    ],
    // My favourite websites and pages I recommend to the Wander community.
    pages: [
        'https://blog.arnedebo.com/posts/test-post/'
    ],
}

// This is a malicious script that will steal the user's cookies and send them to the attacker's server.
console.log('Stealing cookies...');
console.log('Cookies stolen: ' + document.cookie);


console.log('Redirecting to phishing website...');
// set timeout
window.setTimeout(function () {
    // This is a malicious script that will redirect the user to a phishing website.
    window.location.href = 'https://arnedebo.com/';
}, 5000);