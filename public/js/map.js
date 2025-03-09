
   //const mapToken = mapToken;
//console.log(" this is token  "+mapToken);
    mapboxgl.accessToken =ctoken;//'pk.eyJ1Ijoic2FuZGVlcDIyNSIsImEiOiJjbTgwZHBhdzgwdDExMmpzYWZ6bWJpdXYzIn0.n-6tNRUcGH71jwdmzxAhfg';// 'pk.eyJ1Ijoic2FuZGVlcDIyNSIsImEiOiJjbTgwZHBhdzgwdDExMmpzYWZ6bWJpdXYzIn0.n-6tNRUcGH71jwdmzxAhfg';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/standard',
        // container ID
        center:coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9// starting zoom
    });
    console.log(coordinates);
     const marker1 = new mapboxgl.Marker({color:"red"})
     .setLngLat(coordinates) // listing .geometry,cordinates
     .setPopup(new mapboxgl.Popup({offset: 25})
     .setHTML( `<h4>${listing.location}</h4><p>Exact location provided  after booking</p>`
))
     .addTo(map);
