// import "./marker.css"

export function CustomMarker(center, map, url) {
  this.latlng = center;
  this.pos = new window.google.maps.LatLng(center.lat, center.lng)
  this.url = url
}

CustomMarker.prototype = new window.google.maps.OverlayView();

CustomMarker.prototype.onAdd = function () {
    console.log('this', this)
  let div = document.createElement("DIV");
//   div.style.position = "absolute";
  div.innerHTML = `<div class="marker">
    <div class="pin">
        <div class="tag">
            <strong></strong>
        </div>
        <div class="background" style="background-image: url(${this.url})"></div>
    </div>
</div>`;
  let panes = this.getPanes();
  panes.overlayImage.appendChild(div);
  this.div = div;
};

CustomMarker.prototype.draw = function () {
    let overlayProjection = this.getProjection();
    console.log('overlayProjection', overlayProjection)
    // let position = overlayProjection.fromLatLngToDivPixel(this.pos);
    // console.log('position', position)
    // var panes = this.getPanes();
    // this.div.style.left = position.x + 'px';
    // this.div.style.top = position.y + 'px'; 
}


 //to use it
//  var htmlMarker = new CustomMarker(52.323907, -150.109291);
//  htmlMarker.setMap(this.map);
//  var htmlMarker = new CustomMarker(52.323907, -11.109291);
//  htmlMarker.setMap(this.map);