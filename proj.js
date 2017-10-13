
    var gl;
    var numLevels = 1;
    var vertices = [];
    var vertexNormals = [];

    var sx = 1;

    var sy = 1;

    var sz = 1;

    var tx = 0.0;

    var ty = 0.0;

    var tz = 0.0;

    var z = -5;

    var type = 0;

    var angleXX = 0.0;

    var angleYY = 0.0;

    var angleZZ = 0.0;

    var rotationXX_ON = 0;

    var rotationXX_DIR = 1;

    var rotationXX_SPEED = 1;
     
    var rotationYY_ON = 0;

    var rotationYY_DIR = 1;

    var rotationYY_SPEED = 1;
     
    var rotationZZ_ON = 0;

    var rotationZZ_DIR = 1;

    var rotationZZ_SPEED = 1;

    function initGL(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
    }


    function getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }


    var shaderProgram;

    function initShaders() {
        var fragmentShader = getShader(gl, "shader-fs");
        var vertexShader = getShader(gl, "shader-vs");

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
        gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

        gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
        shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");

        shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
        shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
        shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
        shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");
    }

    var mvMatrix = mat4();
    var pMatrix = mat4();

    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, flatten(pMatrix));
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, flatten(mvMatrix));

        var normalMatrix;

        normalMatrix = toInverseMat3(mvMatrix, normalMatrix);
        normalMatrix = transpose(normalMatrix);
        gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, flatten(normalMatrix));
    }



    var cubeVertexPositionBuffer;
    var cubeVertexNormalBuffer;
    var cubeVertexIndexBuffer;

    function initBuffers() {
        cubeVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
        vertices = [];
        vertexNormals = [];
        if (type == 0){
            computeSierpinskiGasket();  
        }else if(type == 1){
            computeKochSnowFlake3D();
        }else if(type == 2){
            computeMergerSponger();
        }else if(type == 3){
            computeXadrez3D();
        }

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        cubeVertexPositionBuffer.itemSize = 3;
        cubeVertexPositionBuffer.numItems = vertices.length/3;

        cubeVertexNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
        cubeVertexNormalBuffer.itemSize = 3;
        cubeVertexNormalBuffer.numItems = vertexNormals.length/3;

    }

function setEventListeners(canvas){
    canvas.onmousedown = handleMouseDown;
    
    document.onmouseup = handleMouseUp;
    
    document.onmousemove = handleMouseMove;
    
    function handleKeyDown(event) {
        
        currentlyPressedKeys[event.keyCode] = true;
    }

    function handleKeyUp(event) {
        
        currentlyPressedKeys[event.keyCode] = false;
    }

    document.addEventListener("keypress", function(event){
                
                    // Getting the pressed key 
                    
                    // Updating rec. depth and drawing again
                
                    var key = event.charCode; // ASCII
                
                    switch(key){
                        case 43 :
                            numLevels++;

                            break;
                        case 45 :
                            if( numLevels > 1 ){
                                
                                numLevels--;
                                
                            }
                        //break;
                    }
                    if (type == 0){
                        computeSierpinskiGasket();  
                    }else if(type == 1){
                        computeKochSnowFlake3D();
                    }else if(type == 2){
                        computeMergerSponger();
                    }else if(type==3){
                        computeXadrez3D();
                    }
                    initBuffers();
                });

    document.onkeydown = handleKeyDown;
    
    document.onkeyup = handleKeyUp;
    
     
   

    // Button events
    
    document.getElementById("move-downscale-button").onclick = function(){
                
                // Updating
                
                sx-=0.1
                sy-=0.1
                sz-=0.1
                
                // Render the viewport
                
                drawScene();  
            };
            
            
    document.getElementById("move-scale-button").onclick = function(){
        
        sx+=0.1
        sy+=0.1
        sz+=0.1
        drawScene();  
    };
    
    document.getElementById("XX-on-off-button").onclick = function(){
        
        // Switching on / off
        
        if( rotationXX_ON ) {
            
            rotationXX_ON = 0;
        }
        else {
            
            rotationXX_ON = 1;
        }  
    };

    document.getElementById("XX-direction-button").onclick = function(){
        
        // Switching the direction
        
        if( rotationXX_DIR == 1 ) {
            
            rotationXX_DIR = -1;
        }
        else {
            
            rotationXX_DIR = 1;
        }  
    };      

    document.getElementById("XX-slower-button").onclick = function(){
        
        rotationXX_SPEED *= 0.75;  
    };      

    document.getElementById("XX-faster-button").onclick = function(){
        
        rotationXX_SPEED *= 1.25;  
    };      

    document.getElementById("YY-on-off-button").onclick = function(){
        
        // Switching on / off
        
        if( rotationYY_ON ) {
            
            rotationYY_ON = 0;
        }
        else {
            
            rotationYY_ON = 1;
        }  
    };
    var frac = document.getElementById("fractal");
    frac.addEventListener("change", function(){
        
        // Getting the selection
        
        var p = frac.selectedIndex;
        numLevels = 1;
        switch(p){
            case 0 :
                type = 0;
                computeSierpinskiGasket();
                break;
            case 1 : 
                type = 1;
                computeKochSnowFlake3D();
                break;
            case 2:
                type =2;
                computeMergerSponger();
                break;
            case 3:
                type = 3;
                computeXadrez3D();
                break;
        }
        initBuffers(); 
    });  

    document.getElementById("YY-direction-button").onclick = function(){
        
        // Switching the direction
        
        if( rotationYY_DIR == 1 ) {
            
            rotationYY_DIR = -1;
        }
        else {
            
            rotationYY_DIR = 1;
        }  
    };      

    document.getElementById("YY-slower-button").onclick = function(){
        
        rotationYY_SPEED *= 0.75;  
    };      

    document.getElementById("YY-faster-button").onclick = function(){
        
        rotationYY_SPEED *= 1.25;  
    };      

    document.getElementById("ZZ-on-off-button").onclick = function(){
        
        // Switching on / off
        
        if( rotationZZ_ON ) {
            
            rotationZZ_ON = 0;
        }
        else {
            
            rotationZZ_ON = 1;
        }  
    };

    document.getElementById("ZZ-direction-button").onclick = function(){
        
        // Switching the direction
        
        if( rotationZZ_DIR == 1 ) {
            
            rotationZZ_DIR = -1;
        }
        else {
            
            rotationZZ_DIR = 1;
        }  
    };      

    document.getElementById("ZZ-slower-button").onclick = function(){
        
        rotationZZ_SPEED *= 0.75;  
    };      

    document.getElementById("ZZ-faster-button").onclick = function(){
        
        rotationZZ_SPEED *= 1.25;  
    };            
}



var currentlyPressedKeys = {};

function handleKeys() {
    
    if (currentlyPressedKeys[33]) {
        
        // Page Up
        
        sx *= 0.9;
        
        sz = sy = sx;
    }
    if (currentlyPressedKeys[34]) {
        
        // Page Down
        
        sx *= 1.1;
        
        sz = sy = sx;
    }
    if (currentlyPressedKeys[37]) {
        
        // Left cursor key
        
        if( rotationYY_ON == 0 ) {
            
            rotationYY_ON = 1;
        }  
        
        rotationYY_SPEED -= 0.25;
    }
    if (currentlyPressedKeys[39]) {
        
        // Right cursor key
        
        if( rotationYY_ON == 0 ) {
            
            rotationYY_ON = 1;
        }  
        
        rotationYY_SPEED += 0.25;
    }
    if (currentlyPressedKeys[38]) {
        
        // Up cursor key
        
        if( rotationXX_ON == 0 ) {
            
            rotationXX_ON = 1;
        }  
        
        rotationXX_SPEED -= 0.25;
    }
    if (currentlyPressedKeys[40]) {
        
        // Down cursor key
        
        if( rotationXX_ON == 0 ) {
            
            rotationXX_ON = 1;
        }  
        
        rotationXX_SPEED += 0.25;
    }
}

//----------------------------------------------------------------------------

// Handling mouse events

// Adapted from www.learningwebgl.com


var mouseDown = false;

var lastMouseX = null;

var lastMouseY = null;

function handleMouseDown(event) {
    
    mouseDown = true;
  
    lastMouseX = event.clientX;
  
    lastMouseY = event.clientY;
}

function handleMouseUp(event) {

    mouseDown = false;
}

function handleMouseMove(event) {

    if (!mouseDown) {
      
      return;
    } 
  
    // Rotation angles proportional to cursor displacement
    
    var newX = event.clientX;
  
    var newY = event.clientY;

    var deltaX = newX - lastMouseX;
    
    angleYY += radians( 10 * deltaX  )

    var deltaY = newY - lastMouseY;
    
    angleXX += radians( 10 * deltaY  )
    
    lastMouseX = newX
    
    lastMouseY = newY;
}


//END OF MOUSE EVENTS

    function drawScene() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        pMatrix = perspective( 45, 1, 0.05, 15 );
        
        mvMatrix = mat4();

        mvMatrix = translationMatrix( 0, 0, z );

        mvMatrix = mult( mvMatrix, translationMatrix( tx, ty, tz ) );
                         
        mvMatrix = mult( mvMatrix, rotationZZMatrix( angleZZ ) );
        
        mvMatrix = mult( mvMatrix, rotationYYMatrix( angleYY ) );
        
        mvMatrix = mult( mvMatrix, rotationXXMatrix( angleXX ) );
        
        mvMatrix = mult( mvMatrix, scalingMatrix( sx, sy, sz ) );
        
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        var lighting = true;
        gl.uniform1i(shaderProgram.useLightingUniform, lighting);
        if (lighting) {
            gl.uniform3f(
                shaderProgram.ambientColorUniform,
                parseFloat(document.getElementById("ambientR").value),
                parseFloat(document.getElementById("ambientG").value),
                parseFloat(document.getElementById("ambientB").value)
            );

            var lightingDirection = [
                parseFloat(document.getElementById("lightDirectionX").value),
                parseFloat(document.getElementById("lightDirectionY").value),
                parseFloat(document.getElementById("lightDirectionZ").value)
            ];
            
            normalize(lightingDirection);
            gl.uniform3fv(shaderProgram.lightingDirectionUniform, flatten(lightingDirection));

            gl.uniform3f(
                shaderProgram.directionalColorUniform,
                parseFloat(document.getElementById("directionalR").value),
                parseFloat(document.getElementById("directionalG").value),
                parseFloat(document.getElementById("directionalB").value)
            );
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
        setMatrixUniforms();
        gl.drawArrays(gl.TRIANGLES, 0, cubeVertexPositionBuffer.numItems);
    }


    var lastTime = 0;

    function animate() {
        var timeNow = new Date().getTime();
        if( lastTime != 0 ) {
            var elapsed = timeNow - lastTime;
            if( rotationXX_ON ) {

                angleXX += rotationXX_DIR * rotationXX_SPEED * (90 * elapsed) / 1000.0;
            }
            if( rotationYY_ON ) {

                angleYY += rotationYY_DIR * rotationYY_SPEED * (90 * elapsed) / 1000.0;
            }
            if( rotationZZ_ON ) {

                angleZZ += rotationZZ_DIR * rotationZZ_SPEED * (90 * elapsed) / 1000.0;
            }   }
        lastTime = timeNow;
    }

    function tick() {
        requestAnimFrame(tick);
        handleKeys();
        drawScene();
        animate();
    }


    function webGLStart() {
        var canvas = document.getElementById("AACanvas");
        initGL(canvas);
        initShaders();
        initBuffers();

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        setEventListeners(canvas);
        tick();
    }










    // FRACTAL STUFF



function computeSierpinskiGasket() {
    
    var v1 = [-1, 0, -0.707];
        
    var v2 = [0, 1, 0.707];

    var v3 = [1, 0, -0.707];
    
    var v4 = [0, -1, 0.707];
    vertices = [];
    vertexNormals = [];
    divideTetrahedron(vertices, v1, v2, v3, v4, numLevels );
    computeVertexNormals(vertices, vertexNormals);
}

function divideTetrahedron(gasket, vertex1, vertex2, vertex3, vertex4, levels) {
    if (levels > 1) {
        var v1v2 = computeMidPoint(vertex1, vertex2);
        var v1v3 = computeMidPoint(vertex3, vertex1);
        var v1v4 = computeMidPoint(vertex4, vertex1);
        var v2v3 = computeMidPoint(vertex2, vertex3);
        var v2v4 = computeMidPoint(vertex2, vertex4);
        var v3v4 = computeMidPoint(vertex4, vertex3);

        divideTetrahedron(gasket, vertex1, v1v2, v1v3, v1v4, levels - 1);
        divideTetrahedron(gasket, v1v2, vertex2, v2v3, v2v4, levels - 1);
        divideTetrahedron(gasket, v1v3, v2v3, vertex3, v3v4, levels - 1);
        divideTetrahedron(gasket, v1v4, v2v4, v3v4, vertex4, levels - 1);

    } else {
        var coordinatesToAdd = [].concat(vertex1, vertex2, vertex3,
            vertex3, vertex2, vertex4,
            vertex4, vertex2, vertex1,
            vertex1, vertex3, vertex4);
        for (var i = 0; i < 36; i += 1) {
            gasket.push(coordinatesToAdd[i]);
        }
    }
}

function dividemengersponge(v1, v2, v3, v4, v5,v6,v7,v8, levels) {
    if (levels == 1) {
        var toAdd = [].concat(v1, v2, v3,
                            v1, v3, v4,
                            v5, v8, v7,
                            v5, v7, v6,
                            v8, v4, v3,
                            v8, v3, v7,
                            v5, v6, v2,
                            v5, v2, v1,
                            v6, v7, v3,
                            v6, v3, v2,
                            v5, v1, v4,
                            v5, v4, v8);
        for (var i = 0; i < toAdd.length; i += 1) {
            vertices.push(toAdd[i]);
        }
    } else {
        arris = distance_3D(v1,v2);

        var v1v2_1 = [v1[0]+(arris/3), v1[1], v1[2]];
        var v1v2_2 = [v1[0]+(arris-(arris/3)), v1[1], v1[2]];
        var v2v3_1 = [v2[0], v2[1]+(arris/3), v2[2]];
        var v2v3_2 = [v2[0], v2[1]+(arris-(arris/3)), v2[2]];
        var v1v4_1 = [v1[0], v1[1]+(arris/3), v1[2]];
        var v1v4_2 = [v1[0], v1[1]+(arris-(arris/3)), v1[2]];
        var v3v4_1 = [v3[0]-(arris/3), v3[1], v3[2]];
        var v3v4_2 = [v3[0]-(2*(arris/3)), v3[1], v3[2]];
        var v5v6_1 = [v5[0]+(arris/3), v5[1], v5[2]];
        var v5v6_2 = [v5[0]+(arris-(arris/3)), v5[1], v5[2]];
        var v4v8_1 = [v4[0], v4[1], v4[2]-(arris/3)];
        var v4v8_2 = [v4[0], v4[1], v4[2]-(arris-(arris/3))];
        var v3v7_1 = [v3[0], v3[1], v3[2]-(arris/3)];
        var v3v7_2 = [v3[0], v3[1], v3[2]-(arris-(arris/3))];
        var v5v8_1 = [v5[0], v5[1]+(arris/3), v5[2]];
        var v5v8_2 = [v5[0], v5[1]+(arris-(arris/3)), v5[2]];
        var v6v7_1 = [v6[0], v6[1]+(arris/3), v6[2]];
        var v6v7_2 = [v6[0], v6[1]+(arris-(arris/3)), v6[2]];
        var v8v7_1 = [v8[0]+(arris/3), v8[1], v8[2]];
        var v8v7_2 = [v8[0]+(arris-(arris/3)), v8[1], v8[2]];
        var v1v5_1 = [v1[0], v1[1], v1[2]-(arris/3)];
        var v1v5_2 = [v1[0], v1[1], v1[2]-(arris-(arris/3))];
        var v2v6_1 = [v2[0], v2[1], v2[2]-(arris/3)];
        var v2v6_2 = [v2[0], v2[1], v2[2]-(arris-(arris/3))];

        var v1v3_1 = [v1v2_1[0],v2v3_1[1],v1[2]];
        var v1v3_2 = [v1v2_2[0],v2v3_2[1],v1[2]];

        var v5v7_1 = [v5v6_1[0],v5v8_1[1],v5[2]];
        var v5v7_2 = [v5v6_2[0],v5v8_2[1],v5[2]];

        var v8v3_1 = [v3v4_2[0], v8[1], v4v8_2[2]];
        var v8v3_2 = [v3v4_1[0], v8[1], v4v8_1[2]];

        var v5v2_1 = [v1v2_1[0], v5[1], v1v5_2[2]];
        var v5v2_2 = [v1v2_2[0], v5[1], v1v5_1[2]];

        var v6v3_1 = [v6[0], v2v3_1[1], v2v6_2[2]];
        var v6v3_2 = [v6[0], v2v3_2[1], v2v6_1[2]];

        var v5v4_1 = [v5[0], v1v4_1[1], v1v5_2[2]];
        var v5v4_2 = [v5[0], v1v4_2[1], v1v5_1[2]];

        var v1v1   = [v1v2_1[0], v1v4_1[1], v2v6_1[2]];
        var v2v2   = [v1v2_2[0], v1v4_1[1], v2v6_1[2]];
        var v3v3   = [v1v2_2[0], v1v4_2[1], v2v6_1[2]];
        var v4v4   = [v1v2_1[0], v1v4_2[1], v2v6_1[2]];
        var v5v5   = [v1v2_1[0], v6v7_1[1], v2v6_2[2]];
        var v6v6   = [v1v2_2[0], v6v7_1[1], v2v6_2[2]];
        var v7v7   = [v1v2_2[0], v6v7_2[1], v2v6_2[2]];
        var v8v8   = [v1v2_1[0], v6v7_2[1], v2v6_2[2]];

        var v1v1_b = [v1v1[0], v1[1], v1v1[2]];
        var v2v2_b = [v2v2[0], v2[1], v2v2[2]];
        var v6v6_b = [v6v6[0], v6[1], v6v6[2]];
        var v5v5_b = [v5v5[0], v5[1], v5v5[2]];

        var v3v3_b = [v3v3[0], v3[1], v3v3[2]];
        var v4v4_b = [v4v4[0], v4[1], v4v4[2]];
        var v7v7_b = [v7v7[0], v7[1], v7v7[2]];
        var v8v8_b = [v8v8[0], v8[1], v8v8[2]];

        var v4v2_1 = [v1v2_1[0], v1v4_2[1], v4[2]];
        var v4v2_2 = [v1v2_2[0], v1v4_1[1], v4[2]];
        var v8v6_1 = [v5v6_1[0], v5v8_2[1], v8[2]];
        var v8v6_2 = [v5v6_2[0], v5v8_1[1], v8[2]];
        var v7v4_1 = [v8v7_2[0], v7[1], v3v7_2[2]];
        var v7v4_2 = [v8v7_1[0], v7[1], v3v7_1[2]];
        var v6v1_1 = [v5v6_2[0], v6[1], v2v6_2[2]];
        var v6v1_2 = [v5v6_1[0], v6[1], v2v6_2[2]];
        var v7v2_1 = [v7[0], v2v3_2[1], v2v6_2[2]];
        var v7v2_2 = [v7[0], v2v3_1[1], v2v6_1[2]];
        var v8v1_1 = [v8[0], v1v4_2[1], v1v5_2[2]];
        var v8v1_2 = [v8[0], v1v4_1[1], v1v5_1[2]];
        dividemengersponge(v1, v1v2_1, v1v3_1, v1v4_1, v1v5_1, v1v1_b, v1v1,v8v1_2, levels-1);
        dividemengersponge(v1v2_1, v1v2_2, v4v2_2, v1v3_1, v1v1_b, v2v2_b, v2v2, v1v1, levels-1);
        dividemengersponge(v1v2_2, v2, v2v3_1, v4v2_2, v2v2_b, v2v6_1, v7v2_2, v2v2, levels-1);
        dividemengersponge(v1v4_1, v1v3_1, v4v2_1, v1v4_2, v8v1_2, v1v1, v4v4, v5v4_2 , levels-1);
        dividemengersponge(v1v4_2, v4v2_1, v3v4_2, v4, v5v4_2, v4v4, v4v4_b, v4v8_1, levels-1);
        dividemengersponge(v4v2_1, v1v3_2, v3v4_1, v3v4_2, v4v4, v3v3, v8v3_2, v7v4_2, levels-1);
        dividemengersponge(v1v3_2, v2v3_2, v3, v3v4_1, v3v3, v6v3_2, v3v7_1, v8v3_2, levels-1);
        dividemengersponge(v2v2_b, v2v6_1, v7v2_2, v2v2, v6v1_1, v2v6_2, v6v3_1, v6v6, levels-1);
        dividemengersponge(v6v6_b, v2v6_2, v6v3_1, v6v6, v5v6_2, v6, v6v7_1, v8v6_2, levels-1);
        dividemengersponge(v5v5_b, v6v6_b, v6v6, v5v5, v5v6_1, v5v6_2, v8v6_2, v5v7_1, levels-1);
        dividemengersponge(v1v5_2, v5v5_b, v5v5, v5v4_1, v5, v5v6_1, v5v7_1, v5v8_1, levels-1);
        dividemengersponge(v1v5_1, v1v1_b, v1v1, v8v1_2, v1v5_2, v5v5_b, v5v5, v5v4_1, levels-1);
        dividemengersponge(v5v4_2, v4v4, v7v4_2, v4v8_1, v8v1_1, v8v8, v8v3_1, v4v8_2, levels-1);
        dividemengersponge(v8v1_1, v8v8, v8v3_1, v4v8_2, v5v8_2, v8v6_1, v8v7_1, v8, levels-1);
        dividemengersponge(v3v3, v6v3_2, v3v7_1, v8v3_2, v7v7, v7v2_1, v3v7_2, v7v4_1, levels-1);
        dividemengersponge(v7v7, v7v2_1, v3v7_2, v7v4_1, v5v7_2, v6v7_2, v7, v8v7_2, levels-1);
        dividemengersponge(v8v8, v7v7, v7v4_1, v8v3_1, v8v6_1, v5v7_2, v8v7_2, v8v7_1, levels-1);
        dividemengersponge(v5v4_1, v5v5, v8v8 , v8v1_1, v5v8_1, v5v7_1, v8v6_1, v5v8_2, levels-1);
        dividemengersponge(v4v2_2, v2v3_1, v2v3_2, v1v3_2, v2v2, v7v2_2, v6v3_2, v3v3, levels-1);
        dividemengersponge(v6v6, v6v3_1, v7v2_1, v7v7, v8v6_2, v6v7_1, v6v7_2, v5v7_2, levels-1);

    }
}

function computeMergerSponger() {
    
    var v1 = [-1, -1, 1];       

    var v2 = [1, -1, 1];        
        
    var v3 = [1, 1, 1];     

    var v4 = [-1, 1, 1];        
    
    var v5 = [-1, -1, -1];  

    var v6 = [1, -1, -1];       

    var v7 = [1, 1, -1];        

    var v8 = [-1, 1, -1];

    vertices = [];
    vertexNormals = [];
    dividemengersponge(v1, v2, v3, v4, v5,v6,v7,v8, numLevels );
    computeVertexNormals(vertices, vertexNormals);
}

function addNormaltoVertex(normal, vertex, depth){
    result = [0,0,0];
    result[0] = normal[0]/((-depth)+1) + vertex[0];
    result[1] = normal[1]/((-depth)+1) + vertex[1];
    result[2] = normal[2]/((-depth)+1) + vertex[2];
    return result;
}
function divideKoch(gasket, v1, v2, v3, v4, levels, first){
    if(levels > 1){
        var v1v2 = computeMidPoint(v1, v2);
        var v1v3 = computeMidPoint(v3, v1);
        var v1v4 = computeMidPoint(v4, v1);
        var v2v3 = computeMidPoint(v2, v3);
        var v2v4 = computeMidPoint(v2, v4);
        var v3v4 = computeMidPoint(v4, v3);
        var normal1 = computeNormalVector(v1v4, v2v4, v1v2);
        var normal2 = computeNormalVector(v1v3, v1v2, v2v3);
        var normal3 = computeNormalVector(v3v4, v2v3, v2v4);
        //somar normal ao centro do triangulo 
        var newv1 = computeCentroid(v1v4, v2v4, v1v2);
        var newv2 = computeCentroid(v1v3, v1v2, v2v3);
        var newv3 = computeCentroid(v3v4, v2v3, v2v4);
        normal1 = addNormaltoVertex(normal1, newv1, (levels-numLevels-1));
        normal2 = addNormaltoVertex(normal2, newv2,(levels-numLevels-1));
        normal3 = addNormaltoVertex(normal3, newv3,(levels-numLevels-1));
        
        divideKoch(gasket, v1v2, normal1, v2v4, v1v4, levels - 1, false);
        divideKoch(gasket, v2v3, normal2, v1v2, v1v3, levels - 1, false);
        divideKoch(gasket, v2v4, normal3, v2v3, v3v4, levels - 1, false);
        if(first){
            var normal4 = computeNormalVector(v1v4, v1v3, v3v4);
            var newv4 = computeCentroid(v1v4,v1v3,v3v4);
            normal4 = addNormaltoVertex(normal4, newv4,(levels-numLevels-1));
            divideKoch(gasket, v3v4, normal4, v1v3, v1v4, levels-1,false);
        }
    }
    var coordinatesToAdd = [].concat(v1, v2, v3,
        v3, v2, v4,
        v4, v2, v1,
        v1, v3, v4);
        for (var i = 0; i < 36; i += 1) {
            gasket.push(coordinatesToAdd[i]);
        }
}

function computeKochSnowFlake3D(){
    var v1 = [-1, 0, -0.707];
        
    var v2 = [0, 1, 0.707];

    var v3 = [1, 0, -0.707];
    
    var v4 = [0, -1, 0.707];

    vertices = [];
    vertexNormals = [];
    divideKoch(vertices, v1, v2, v3, v4, numLevels,true );
    computeVertexNormals(vertices, vertexNormals);
}


function distance_3D(a,b){    aux = b[0]-a[0];
    aux2 = b[1]-a[1];
    aux3 = b[2]-a[2];
    aux = Math.pow(aux,2);
    aux2 = Math.pow(aux2,2);
    aux3 = Math.pow(aux3,2);
    return Math.sqrt(aux+aux2+aux3);
}


function computeXadrez3D() {
    // vertices do cubo
    var v1 = [ 1, -1, -1];
    var v2 = [ 1,  1, -1];
    var v3 = [ 1,  1,  1];
    var v4 = [ 1, -1,  1];
    var v5 = [-1,  1, -1];
    var v6 = [-1,  1,  1];
    var v7 = [-1, -1,  1];
    var v8 = [-1, -1, -1];
    // Clearing the vertices array;
    vertices = [];
    vertexNormals = [];
    divideQuadreon(vertices, v1, v2, v3, v4, v5, v6, v7, v8, numLevels );
    computeVertexNormals(vertices, vertexNormals);
    //vertices = flatten( vertices );
}
function divideQuadreon(gasket, vertex1, vertex2, vertex3, vertex4, vertex5, vertex6, vertex7, vertex8, depth) {
    if (depth > 1) {
        var m12 = computeMidPoint(vertex1, vertex2);
        var m23 = computeMidPoint(vertex2, vertex3);
        var m25 = computeMidPoint(vertex2, vertex5);
        var m14 = computeMidPoint(vertex1, vertex4);
        var m43 = computeMidPoint(vertex4, vertex3);
        var m47 = computeMidPoint(vertex4, vertex7);
        var m76 = computeMidPoint(vertex7, vertex6);
        var m36 = computeMidPoint(vertex3, vertex6);
        var m65 = computeMidPoint(vertex6, vertex5);
        var m18 = computeMidPoint(vertex1, vertex8);
        var m85 = computeMidPoint(vertex8, vertex5);
        var m78 = computeMidPoint(vertex7, vertex8);

        // centro do cubo
        var midCenter = computeMidPoint(
            computeMidPoint(computeMidPoint(vertex4,vertex3),computeMidPoint(vertex7, vertex6)),
            computeMidPoint(computeMidPoint(vertex1,vertex2),computeMidPoint(vertex8, vertex5)));

        // centro das faces
        var mfloorface = computeMidPoint(computeMidPoint(vertex1, vertex2),computeMidPoint(vertex8, vertex5));
        var mfrontface = computeMidPoint(computeMidPoint(vertex1, vertex2),computeMidPoint(vertex4, vertex3));
        var mrightface = computeMidPoint(computeMidPoint(vertex2, vertex5),computeMidPoint(vertex3, vertex6));
        var mleftface = computeMidPoint(computeMidPoint(vertex1, vertex8),computeMidPoint(vertex4, vertex7));
        var mbackface = computeMidPoint(computeMidPoint(vertex8, vertex5),computeMidPoint(vertex7, vertex6));
        var mtopface = computeMidPoint(computeMidPoint(vertex4, vertex3),computeMidPoint(vertex7, vertex6));

        // novos 4 cubos, efeito xadrez
        divideQuadreon(gasket, m12, vertex2, m23, mfrontface, m25, mrightface, midCenter, mfloorface,  depth - 1);   // cubo canto inferior direito
        divideQuadreon(gasket, m14, mfrontface, m43, vertex4, midCenter, mtopface, m47, mleftface, depth - 1);   // cubo canto superior esquerdo
        divideQuadreon(gasket, midCenter, mrightface, m36, mtopface, m65, vertex6, m76, mbackface, depth - 1);   // cubo canto superior direito
        divideQuadreon(gasket, m18, mfloorface, midCenter, mleftface, m85, mbackface, m78, vertex8, depth - 1);  // cubo canto inferior esquerdo

    } else {

        var coordinatesToAdd = [].concat(
            // front face
            vertex1,vertex2,vertex3,
            vertex1,vertex3,vertex4,
            // right face
            vertex3,vertex2,vertex5,
            vertex3,vertex5,vertex6,
            // top face
            vertex4,vertex3,vertex6,
            vertex4,vertex6,vertex7,
            // left face
            vertex8,vertex1,vertex4,
            vertex8,vertex4,vertex7,
            //back face
            vertex7,vertex6,vertex8,
            vertex8, vertex6, vertex5,
            //floor face
            vertex8,vertex5,vertex2,
            vertex8, vertex2, vertex1
            );
        for (var i = 0; i < coordinatesToAdd.length*3; i += 1) {
            //console.log(coordinatesToAdd[i]);
            gasket.push(coordinatesToAdd[i]);
        }
        
    }
}