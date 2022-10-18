// size offset used when visualizing
const sizeOffset = 600;
var centroPoints;


// main function of voronoi
// module import <script src="https://rawgit.com/gorhill/Javascript-Voronoi/master/rhill-voronoi-core.js"></script>
function calcVoronoi(totalPoints = 50,centroids = null) {
  const voronoi = new Voronoi();

    // creating random points in box 
    function randomPoints([width, height], nPoints, margin = 0) {
        const points = [];
        for (let i = 0; i < nPoints; i++) {
          points.push({ 
            x: Math.random(margin, width - margin), 
            y: Math.random(margin, height - margin) 
          });
        }
        return points;
      }
      
      const nPoints = totalPoints;
      const margin = 0;
      const width = 1;
      const height = 1;

      // runs only if centroids == null (on first call)
      console.log(centroids)
      var centr = centroids
      if (centr === null) {
        centr = randomPoints([width, height], nPoints, margin);
      }
    
    // declaring 2D box for points and lines
    const bbox = { xl: margin, xr: width - margin, yt: margin, yb: height - margin };
    
    // compute voronoi and return diagram object (more: https://github.com/gorhill/Javascript-Voronoi)
    const diagram = voronoi.compute(centr, bbox);
    return diagram;
}


// does same as page refresh (creates new random points)
function newDiagramButton() {
  
  var points = document.getElementById("pointsInDiagram").value;

  if (points == "") {
    points = 50;
  } 

  if (points < 2) {
    points = 2;
    document.getElementById("pointsInDiagram").value = 2;
  } else if (points > 1500) {
    points = 1500;
    document.getElementById("pointsInDiagram").value = 1500;
  }

  centroPoints = drawVoronoi(calcVoronoi(points=points))
}

// starts animation of lloyds relaxation
async function relaxAnimation(type) {
  
  // to prevent multiplying animations
  bD = document.getElementById("newDiagram")
  bS = document.getElementById("anim-short")
  bM = document.getElementById("anim-medium")
  bL = document.getElementById("anim-long")

  bD.disabled = true
  bS.disabled = true
  bM.disabled = true
  bL.disabled = true

  t = 500
  o = 20

  // choose speed and operations of animation
  switch (type) {
    case 0:
      t =  200
      o = 10
      break;
  
    case 1:
      t = 100
      o = 20
      break;

    case 2:
      t = 50
      o = 50
  }


  for (let index = 0; index < o; index++) {
    reDraw();
    await sleep(t);
  }

  bD.disabled = false
  bS.disabled = false
  bM.disabled = false
  bL.disabled = false

}

// creates new voronoi with centroid of each point
function reDraw(points = null) {
  if (points === null) {
    centroPoints = drawVoronoi(calcVoronoi(null, centroids = centroPoints))
  } else {
    centroPoints = drawVoronoi(calcVoronoi(points))
  }

  
}


// creates new voronoi with random points
window.onload = function() {
    console.clear()
    centroPoints = drawVoronoi(calcVoronoi())
}

// visualize using paper.js 
// module import <script src="https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.10.2/paper-full.min.js"></script>
function drawVoronoi(diagram) {
  var canvas = document.getElementById('myCanvas');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);

    var newPoints = []

    // for each cell of diagram
    diagram.cells.forEach(cell => {
      
        // sets of corners (sets for removing duplicates)
        const setX = new Set()
        const setY = new Set()

        
        
        cell.halfedges.forEach(element => {
          // adds each point of line to set 
          setX.add(element.edge.va.x*sizeOffset)
          setX.add(element.edge.vb.x*sizeOffset)
          setY.add(element.edge.va.y*sizeOffset)
          setY.add(element.edge.vb.y*sizeOffset)          

          // visualize curent point of cell
          var shape = new paper.Shape.Circle(new paper.Point(element.site.x*sizeOffset, element.site.y*sizeOffset), 2);
          shape.strokeColor = 'black';

          // make lines (walls) around cell
          var path = new paper.Path.Line({
            from: new paper.Point(element.edge.va.x*sizeOffset,element.edge.va.y*sizeOffset),
            to: new paper.Point(element.edge.vb.x*sizeOffset,element.edge.vb.y*sizeOffset),
          });
          path.strokeColor = "black"
        });
        
        // summing both sets of X and Y points of cell
        let sumX = 0;
        setX.forEach(num => {
          sumX += num;
        });
        let sumY = 0;
        setY.forEach(num => {
          sumY += num;
        });

        // using simple formula for centroid https://www.cuemath.com/centroid-formula/
        pointX = sumX / setX.size;
        pointY = sumY / setY.size;

        // adds calculated centroids to newPoints list
        newPoints.push({ 
          x: pointX / sizeOffset, 
          y: pointY / sizeOffset
        });

        // visualizing centroid
        var shape = new paper.Shape.Circle(new paper.Point(pointX, pointY), 5);
        shape.strokeColor = 'blue';

        
    });


  

    // draw in canvas and return newPoint (centroids)
    paper.view.draw();
    return newPoints;
    
}

// sleep declare
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}