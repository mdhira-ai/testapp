const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

const versiontext = document.querySelector('footer')

window.versions.version().then((version) => {
    versiontext.textContent = `v ${version}`

})
