class App
{
	constructor()
	{
		// По умолчанию центр будет в Австралии
		this.center = {lat: -25.363, lng: 131.044}

		this.map = new google.maps.Map(document.querySelector('#map'), {
			zoom: 5,
			center: this.center,
			mapTypeId: 'terrain',
			disableDefaultUI: true
        })

		this.infoWindow = new google.maps.InfoWindow({
			map: this.map,
			position: this.center,
			content: 'Detecting location...',
		})

		// Попробую определить место положение клиента
		this.updateMyLocation()
	}

	updateMyLocation()
	{
		// Try HTML5 geolocation
        if (navigator.geolocation) {
          	navigator.geolocation.getCurrentPosition(position => {
          		// Пользователь разрешил определение гео позиции
            	this.center = {
              		lat: position.coords.latitude,
              		lng: position.coords.longitude
            	}
            	this.infoWindow.setPosition(this.center)
            	this.map.panTo(this.center)
    			this.infoWindow.setContent('You are here')
            	this.start()
          	}, () => {
            	// Пользователь заблокировал определение гео позиции
            	this.infoWindow.setContent('Default location')
            	this.start()
          	})
        } else {
          	// Браузер не поддерживает геолокацию
          	this.infoWindow.setContent('Your browser not support Geo location')
          	this.start()
        }
	}

	start()
	{
		this.createMarkers()
		this.animateInfoWindowContent('Try to catch the cool smile =)')
	}

	animateInfoWindowContent(text)
	{
		var f
		var reset = () => {
			this.infoWindow.setContent('')
			f()
		}
		f = () => {
			let textNow = this.infoWindow.getContent()
			if(textNow.length < text.length) {
				this.infoWindow.setContent(text.substr(0, textNow.length+1))
				setTimeout(f, 35)
			}
			else {
				setTimeout(reset, 5000)
			}
		}
		reset = reset.bind(this)
		f = f.bind(this)
		setTimeout(reset, 3000)
	}

	createMarkers()
	{
        this.markers = [...Array(100)].map((x, index) => {
        	let angle = index
        	let radius = 2+index/10
        	let center = Object.assign({}, this.center)
        	let position = {
        		lat: center.lat + radius * Math.cos(angle),
          		lng: center.lng + radius * Math.sin(angle)
          	}
          	let mapMarker = new google.maps.Marker({
	          	position,
	          	map: this.map,
	          	//label: 'L' + (index+1),
	          	icon: 'img/cool.gif',
          	})
          	let marker = {
        		enabled: true,
        		angle,
        		radius,
        		center,
        		position,
        		mapMarker,
        	}
          	mapMarker.addListener('click', this.handleClickOnSmile.bind(marker))
        	return marker
        })

        setInterval(this.updateMarkers.bind(this), 2000)
	}

	handleClickOnSmile()
	{
		this.enabled = false
      	this.mapMarker.setIcon('img/sleepy.gif')
        this.mapMarker.setClickable(false)        		
	}

	updateMarkers()
	{
		this.markers.filter(m => m.enabled).forEach(marker => {
			marker.angle += 0.1
			marker.position.lat = marker.center.lat + marker.radius * Math.cos(marker.angle)
			marker.position.lng = marker.center.lng + marker.radius * Math.sin(marker.angle)
			marker.mapMarker.setPosition(marker.position)
		})
	}
}

function initMap() {
	window.addEventListener('load', () => new App())
}