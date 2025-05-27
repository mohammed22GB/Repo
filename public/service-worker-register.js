if (navigator && navigator.serviceWorker) {
    navigator.serviceWorker.register('./service-worker.js')
        .then((reg) => {})
        .catch((error) => console.log('', error))
}
