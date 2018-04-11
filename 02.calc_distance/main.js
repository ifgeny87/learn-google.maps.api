class App
{
	constructor()
	{
		this.points = []
		this.lines = null
		this.infos = null

		this.map = new google.maps.Map(document.querySelector('#map'), {
			zoom: 5,
			center: {lat: 55.75, lng: 37.62},
			mapTypeId: 'terrain',
			cursor: 'pointer'
        })
		this.map.addListener('click', this.handleMapClick.bind(this))
	}

	handleMapClick(e)
	{
		let marker = new google.maps.Marker({
			position: e.latLng,
			map: this.map,
			label: e.latLng.lat().toFixed(3) + ', ' + e.latLng.lng().toFixed(3),
			draggable: true,
			animation: google.maps.Animation.DROP,
		})
		marker.addListener('dragend', this.handleDragMarker.bind(this, marker))
		// shift markers
		if(this.points.length > 4) {
			this.points.shift().setMap(null)
		}
		this.points.push(marker)
		this.updateLines()
	}

	updateLines()
	{
		if(this.points.length < 2) return
		if(this.lines) this.lines.forEach(l => l.setMap(null))
		this.lines = []
		if(this.infos) this.infos.forEach(l => l.setMap(null))
		this.infos = []

		let sum = 0
		let p = this.points[0].getPosition()
		for(let i=1; i<this.points.length; ++i) {
			// calc distance
			let p1 = this.points[i].getPosition()
			let dist = sphereDistance(p, p1)
			sum += dist
			// add line
			let line = new google.maps.Polyline({
				map: this.map,
				path: [p, p1],
				//geodesic: true,
				strokeColor: '#ff00000',
				strokeOpacity: .5,
				strokeWeight: 2,
			})
			this.lines.push(line)
			// add info window
			let p2 = {lat: (p.lat()+p1.lat())/2, lng: (p.lng()+p1.lng())/2}
			let infow = new google.maps.InfoWindow({
				map: this.map,
				position: p2,
				content: dist.toFixed(1) + ' km',
				disableAutoPan: true,
			})
			infow.open(this.map, line)
			this.infos.push(infow)
			p = p1
		}
	}

	handleDragMarker(marker)
	{
		this.updateLines()
		let pos = marker.getPosition()
		marker.setLabel(pos.lat().toFixed(3) + ', ' + pos.lng().toFixed(3))
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