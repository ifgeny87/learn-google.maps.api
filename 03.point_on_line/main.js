class App
{
	constructor()
	{
		this.start = {lat: 0, lng: 0}
		this.ends = []
		for(let i=-7; i<=7; i++) {
			this.ends.push({lat: i*10, lng: 170-Math.abs(i)*10})
		}
		this.map = new google.maps.Map(document.querySelector('#map'), {
			zoom: 1,
			center: {lat: 0, lng: 75},
			mapTypeId: 'terrain',
			cursor: 'pointer'
        })
        this.lines = []
        // draw
        this.ends.forEach(this.drawLine.bind(this))
        this.lines.forEach(this.drawPoints.bind(this))
	}

	drawLine(endPosition)
	{
		let line = new google.maps.Polyline({
			map: this.map,
			path: [this.start, endPosition],
			geodesic: true,
			strokeOpacity: .2,
			strokeWeight: 2,
			icons: [{
				icon: {
					path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
					scale: 3,
					strokeColor: '#ff0000',
					strokeOpacity: 0.5,
					strokeWeight: 1,
					fillOpacity: 0.35,
				},
				offset: '35%',
				repeat: '10%'
			}]
		})
		this.lines.push(line)
	}

	drawPoints(line)
	{
		setInterval(() => {
			let icons = line.get('icons')
			icons.forEach(icon => {
				let o = icon.offset.match(/\d+/)[0]*1
				icon.offset = o+1+'%'
			})
			line.set('icons', icons)
		}, 100)
	}
}

function initMap() {
	window.addEventListener('load', () => new App())
}

const EARTH_AVERAGE_RADIUS = 6371.21

// Метод расчета расстояния между точками на сфере 
function sphereDistance(a, b) {
	let fa = a.lat() / 180 * Math.PI
	let da = a.lng() / 180 * Math.PI
	let fb = b.lat() / 180 * Math.PI
	let db = b.lng() / 180 * Math.PI
	let x = Math.sin(fa)*Math.sin(fb) + Math.cos(fa)*Math.cos(fb)*Math.cos(da-db)
	let dist = Math.acos(x)*EARTH_AVERAGE_RADIUS
	return dist
}