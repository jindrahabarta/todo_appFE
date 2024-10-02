import gsap from 'gsap'

export default function showOfflineAlert(isShowed: boolean) {
    const offlineAlert = document.getElementById('offlineAlert')
    if (isShowed) {
        gsap.to(offlineAlert, {
            display: 'flex',
            opacity: 1,
        })

        gsap.fromTo(
            '#offlineAlertDot',
            {
                opacity: 0.5,
            },
            {
                opacity: 1,
                yoyo: true,
                duration: 0.5,
                repeat: -1,
            }
        )
    } else {
        gsap.to(offlineAlert, {
            opacity: 0,
            onComplete: () => {
                gsap.to(offlineAlert, {
                    display: 'none',
                })
            },
        })
    }
}
