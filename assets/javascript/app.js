paper.install(window);

$(document).ready(() => {
 // Firebase setup
 var config = {
   apiKey: "AIzaSyBIxDWLxlf5c7pARWt5wL1LhhiODNA3LMY",
   authDomain: "synescribble.firebaseapp.com",
   databaseURL: "https://synescribble.firebaseio.com",
   projectId: "synescribble",
   storageBucket: "",
   messagingSenderId: "648660572319"
 };
 firebase.initializeApp(config);

 // Assigning our Database and our Canvas to a variable
 const database = firebase.database();
 const canvas = document.getElementById("drawingSurface");
 // Initializing Paper.js to avoid scope issues
 paper.setup(canvas);

 // Paper.js Tool object constructor, handles the drawing functions below
 const tool = new Tool();
 // Default color assignment
 let color = "#000";
 // Initialize a variable to create paths in our drawing functions
 let path;
 let drawing = {
   artist: "",
   image: ""
 };
 

 // On mouse down...
 tool.onMouseDown = e => {
   // the path variable becomes a Path object via a Paper.js Object Cosntructor
   path = new Path({
     // the point where the mouse was clicked is added to a segments array
     segments: [e.point],
     // stroke color is assigned as the color assigned to the color variable
     strokeColor: color,
     // the width of the stroke is set to 5 pixels
     strokeWidth: 5
   });
 }

 // On mouse drag...
 tool.onMouseDrag = e => {
   // Every time the mouse is dragged, a point given to us by the event argument is added
   // to the segments array
   path.add(e.point);
 }

 // On mouse up...
 tool.onMouseUp = e => {
   // .simplfy, a Paper.js method, "smooths" the line and removes imperfections
   path.simplify(10);
 }

 // These are example color switch buttons
 $(document).on("click", "#makeRed", () => {
   color = "#F00";
 });

 $(document).on("click", "#makeBlack", () => {
   color = "#000";
 });

 // On submit click...
 $("#submit").on("click", () => {
   // Convert Drawing Surface to image data
   let canvasImage = canvas.toDataURL();
   let artist = $("#artist").val().trim();
   drawing.image = canvasImage;
   drawing.artist = artist;
   // Push image data to the database
   database.ref().push(drawing);
   // Clear the current drawing surface
   project.clear();
 });

 $('#colorBtn').on("click", function() {
  // mode choices: monochrome monochrome-dark monochrome-light analogic complement analogic-complement triad quad
  // analogic-complement mode gives colors that are adjacent and across from each other on the color wheel
  var hex = "0047AB";
  var queryURL = "https://cors-anywhere.herokuapp.com/https:\/\/thecolorapi.com/scheme?" + hex + "&rgb=0,71,171&hsl=215,100%,34%&cmyk=100,58,0,33&format=json&mode=analogic-complement&count=6" 

  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {
    console.log(response);

var colorApi = response.colors;

for (i = 0; i < colorApi.length; i++){
var colorSq = $('<div>').addClass('colorSq');
var hex = colorApi.hex.value;
console.log(hex);

$('#colorPallette').append(colorApi);
console.log(img);

        }
    });

});

 // Example button that scales the image of the gallery images down
 $("#scale").on("click", function() {
   $(".myCanvas").toggleClass("scale");
 });

 // When a new child (aka drawing) is added to the database,
 // pass the data to a function that builds and puts the drawing
 // into the gallery
 database.ref().on("child_added", function(snapshot) {
   let data = snapshot.val();
   makeCanvas(data);
 });

 // Function that handles the creation of the gallery item
 function makeCanvas(drawing) {
   let canvasItem = $("<div><img src='" + drawing.image + "' class='myCanvas'/><p>" + drawing.artist + "</p></div>");
   let databaseDrawing = canvasItem;
   $("#gallery").append(canvasItem);
 }




});