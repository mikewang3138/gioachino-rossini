
var gl;
var canvas;
var shaderProgram;
var vertexPositionBuffer;
var keyscurrentlypressed = {};
var poslist  = {};
var vellist  = {};
var acclist  = {};
var masslist = {};
var num_particles = 0;
var readydown = true;
var mousex;
var mousey;
var accx;
var accy;
var clicktimer;
var animating = false;

// simulation variables
var massfixed = 10;
var Gconstant = 2.2;
var distance = vec3.create();
var xhat = vec3.create();
    vec3.set(xhat, 1.0, 0.0, 0.0);
var yhat = vec3.create();
    vec3.set(yhat, 0.0, 1.0, 0.0);
var zhat = vec3.create();
    vec3.set(zhat, 0.0, 0.0, 1.0);
var acceleration_vec = vec3.create();

// Create a place to store vertex colors
var vertexGreyColorBuffer;
var vertexBlueColorBuffer;
var vertexYellowColorBuffer;

// Create ModelView matrix
var mvMatrix = mat4.create();

//Create Projection matrix
var pMatrix = mat4.create();

var mvMatrixStack = [];

//----------------------------------------------------------------------------------
function mvPushMatrix() {
    var copy = mat4.clone(mvMatrix);
    mvMatrixStack.push(copy);
}


//----------------------------------------------------------------------------------
function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
      throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}

//----------------------------------------------------------------------------------
function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
}

//----------------------------------------------------------------------------------
function degToRad(degrees) {
        return degrees * Math.PI / 180;
}

//----------------------------------------------------------------------------------
function createGLContext(canvas) {
  var names = ["webgl", "experimental-webgl"];
  var context = null;
  for (var i=0; i < names.length; i++) {
    try {
      context = canvas.getContext(names[i]);
    } catch(e) {}
    if (context) {
      break;
    }
  }
  if (context) {
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
  } else {
    alert("Failed to create WebGL context!");
  }
  return context;
}

//----------------------------------------------------------------------------------
function loadShaderFromDOM(id) {
  var shaderScript = document.getElementById(id);
  
  // If we don't find an element with the specified id
  // we do an early exit 
  if (!shaderScript) {
    return null;
  }
  
  // Loop through the children for the found DOM element and
  // build up the shader source code as a string
  var shaderSource = "";
  var currentChild = shaderScript.firstChild;
  while (currentChild) {
    if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
      shaderSource += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }
 
  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }
 
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
 
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  } 
  return shader;
}

//----------------------------------------------------------------------------------
function setupShaders() {
  vertexShader = loadShaderFromDOM("shader-vs");
  fragmentShader = loadShaderFromDOM("shader-fs");
  
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  gl.useProgram(shaderProgram);
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
}

//----------------------------------------------------------------------------------
function setupBuffers() {
  vertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  var SquareVertices = [
          -1.0,  1.0,   0.0,
          -1.0,  -1.0,  0.0,
           1.0,  -1.0,  0.0,
      
           1.0,  -1.0,  0.0,
           1.0,   1.0,  0.0,
           -1.0,  1.0,  0.0,    
     
      
  ];
    
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(SquareVertices), gl.STATIC_DRAW);
  vertexPositionBuffer.itemSize = 3;
  vertexPositionBuffer.numberOfItems = 6;
    
  vertexGreyColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexGreyColorBuffer);
  var Greycolors = [
      0.8, 0.8, 0.8, 1.0,
      0.8, 0.8, 0.8, 1.0,
      0.8, 0.8, 0.8, 1.0,
      
      0.8, 0.8, 0.8, 1.0,
      0.8, 0.8, 0.8, 1.0,
      0.8, 0.8, 0.8, 1.0,
     
    ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Greycolors), gl.STATIC_DRAW);
  vertexGreyColorBuffer.itemSize = 4;
  vertexGreyColorBuffer.numItems = 6; 
    
  
  vertexBlackColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBlackColorBuffer);
  var blackcolors = [
        0.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 0.0, 1.0,
    ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(blackcolors), gl.STATIC_DRAW);
  vertexBlackColorBuffer.itemSize = 4;
  vertexBlackColorBuffer.numItems = 6; 

      
}

//----------------------------------------------------------------------------------
function draw() { 
  var transformVec = vec3.create();
  
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
  mat4.ortho(pMatrix, 0, 640, 0, 355, 100, -100);
    
  mat4.identity(mvMatrix);
  mvPushMatrix();
  for(var i=0; i < num_particles; i++){
      
      mvPushMatrix();
      vec3.set(transformVec, poslist[i*2], poslist[(i*2)+1], 0);
      mat4.translate(mvMatrix, mvMatrix, transformVec);
      vec3.set(transformVec, 1.0*masslist[i], 1.0*masslist[i], 0.0);
      mat4.scale(mvMatrix, mvMatrix, transformVec);
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
      gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                         vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexGreyColorBuffer);
      gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
                            vertexGreyColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
      setMatrixUniforms();
      gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numberOfItems);
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBlackColorBuffer);
      gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
                            vertexBlackColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.LINE_STRIP, 0, vertexPositionBuffer.numberOfItems);
      mvPopMatrix();
  }
  mvPopMatrix();
  
 
  

  
}

//----------------------------------------------------------------------------------
function animate() {
    
    if(readydown == false)
        clicktimer ++;
    for(var i=0; i < num_particles; i++){
        acclist[i*2]     = 0;
        acclist[(i*2)+1] = 0;
        var posX1 = poslist[i*2];
        var posY1 = poslist[(i*2)+1];
        for(var j=0; j < num_particles; j++){            
            var posX2 = poslist[j*2];
            var posY2 = poslist[(j*2)+1];
            vec3.set(distance, posX2-posX1, posY2-posY1, 0);
            var r = vec3.length(distance);
            if(i != j && r > 5){       
                var r_sq = r*r;
                var acceleration = Gconstant*masslist[j]/r_sq;
                vec3.set(acceleration_vec, ((posX2-posX1)/r)*acceleration, ((posY2-posY1)/r)*acceleration, 0);
                accx = vec3.dot(acceleration_vec, xhat);
                accy = vec3.dot(acceleration_vec, yhat);
                acclist[i*2]     += accx;
                acclist[(i*2)+1] += accy;  
            }
        }
        vellist[i*2]     += acclist[i*2];
        vellist[(i*2)+1] += acclist[(i*2)+1];
        poslist[i*2]     += vellist[i*2];
        poslist[(i*2)+1] += vellist[(i*2)+1];
        
        
    }

    
}

function handledown(event){
    if(readydown){
        mousex = event.pageX - $('#myGLCanvas').offset().left;
        mousey = event.pageY - $('#myGLCanvas').offset().top;
        poslist[num_particles*2] = mousex;
        poslist[(num_particles*2)+1] = gl.viewportHeight-mousey;
        clicktimer = 0;
        readydown = false;
    }

}
function handleup(event){
    if(!readydown){
        mousex = event.pageX - $('#myGLCanvas').offset().left;
        mousey = event.pageY - $('#myGLCanvas').offset().top;
        vellist[num_particles*2] = (mousex - poslist[(num_particles)*2])/100;
        vellist[(num_particles*2)+1] = ((gl.viewportHeight-mousey) - poslist[((num_particles)*2)+1])/100;
        masslist[num_particles] = clicktimer/2;
        num_particles++;
        readydown = true;
        }    
}

function reset() {
     poslist  = {};
     vellist  = {};
     acclist  = {};
     masslist = {};
}
  
    


//----------------------------------------------------------------------------------
function handlekeydown(event){
  keyscurrentlypressed[event.keyCode] = true;
  //console.log(event.keyCode);
    
}

function handlekeyup(event){
  keyscurrentlypressed[event.keyCode] = false;
  //console.log(keypressed);
    
}

//----------------------------------------------------------------------------------
function startup() {
  canvas = document.getElementById("myGLCanvas");
  document.onkeydown = handlekeydown;
  document.onkeyup   = handlekeyup;
  gl = createGLContext(canvas);
  setupShaders(); 
  setupBuffers();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  tick();
}

//----------------------------------------------------------------------------------
function tick() {
    requestAnimFrame(tick);
    draw();
    animate();
}

