import './styles.css'

const app = document.getElementById('app')

function render() {
	const now = new Date().toLocaleTimeString()
	document.getElementById('foo').textContent = `The current time is ${now}.`
}

render()

// Hot-reload demo: update time every second in dev.
setInterval(render, 1000)
