class Analytics {


    noMetamask() {
        window.ga('send', {
            hitType: 'event',
            eventCategory: 'Play',
            eventAction: 'Meta Mask',
            eventLabel: 'Not installed'
        });
    }


    playSuccess() {
        window.ga('send', {
            hitType: 'event',
            eventCategory: 'Play',
            eventAction: 'Meta Mask',
            eventLabel: 'Success'
        });
    }

    openMetamask() {
        window.ga('send', {
            hitType: 'event',
            eventCategory: 'Play',
            eventAction: 'Meta Mask',
            eventLabel: 'Open window'
        });
    }

    noMetamaskAccount() {
        window.ga('send', {
            hitType: 'event',
            eventCategory: 'Play',
            eventAction: 'Meta Mask',
            eventLabel: 'No account set'
        });
    }

    errorMetamask() {
        window.ga('send', {
            hitType: 'event',
            eventCategory: 'Play',
            eventAction: 'Meta Mask',
            eventLabel: 'error: rejected'
        });
    }


    openHowTo() {
        window.ga('send', {
            hitType: 'event',
            eventCategory: 'Site',
            eventAction: 'How To Play',
            eventLabel: 'open'
        });
    }

    closeHowTo() {
        window.ga('send', {
            hitType: 'event',
            eventCategory: 'Site',
            eventAction: 'How To Play',
            eventLabel: 'close'
        });
    }

}

export {Analytics as default}