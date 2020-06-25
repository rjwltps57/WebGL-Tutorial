var gl;
var mainCall = 1;

function testGLError(functionLastCalled) {
    var lastError = gl.getError();

    if (lastError != gl.NO_ERROR) {
        alert(functionLastCalled + " failed (" + lastError + ")");
        return false;
    }
    return true;
}

function initialiseGL(canvas) {
    try {
        // Try to grab the standard context. If it fails, fallback to experimental
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    catch (e) {
    }

    if (!gl) {
        alert("Unable to initialise WebGL. Your browser may not support it");
        return false;
    }
    return true;
}

var shaderProgram;

var vertexData = [
    // Backface (RED/WHITE) -> z = 0.5
    -0.5, -0.5, -0.5,  1.0, 0.0, 0.0, 1.0,  0.0,  0.0,
     0.5,  0.5, -0.5,  1.0, 0.0, 0.0, 1.0,  1.0,  1.0,
     0.5, -0.5, -0.5,  1.0, 0.0, 0.0, 1.0,  1.0, -0.0,
    -0.5, -0.5, -0.5,  1.0, 0.0, 0.0, 1.0, -0.0, -0.0,
    -0.5,  0.5, -0.5,  1.0, 0.0, 0.0, 1.0, -0.0,  1.0,
     0.5,  0.5, -0.5,  1.0, 1.0, 1.0, 1.0,  1.0,  1.0,
    // Front (BLUE/WHITE) -> z = 0.5
    -0.5, -0.5,  0.5,  0.0, 0.0, 1.0, 1.0, -0.0, -0.0,
     0.5,  0.5,  0.5,  0.0, 0.0, 1.0, 1.0,  1.0,  1.0,
     0.5, -0.5,  0.5,  0.0, 0.0, 1.0, 1.0,  1.0, -0.0,
    -0.5, -0.5,  0.5,  0.0, 0.0, 1.0, 1.0, -0.0, -0.0,
    -0.5,  0.5,  0.5,  0.0, 0.0, 1.0, 1.0, -0.0,  1.0,
     0.5,  0.5,  0.5,  1.0, 1.0, 1.0, 1.0,  1.0,  1.0,
    // LEFT (GREEN/WHITE) -> z = 0.5
    -0.5, -0.5, -0.5,  0.0, 1.0, 0.0, 1.0, -0.0, -0.0,
    -0.5,  0.5,  0.5,  0.0, 1.0, 0.0, 1.0,  1.0,  1.0,
    -0.5,  0.5, -0.5,  0.0, 1.0, 0.0, 1.0,  1.0,  0.0,
    -0.5, -0.5, -0.5,  0.0, 1.0, 0.0, 1.0, -0.0, -0.0,
    -0.5, -0.5,  0.5,  0.0, 1.0, 0.0, 1.0, -0.0,  1.0,
    -0.5,  0.5,  0.5,  0.0, 1.0, 1.0, 1.0,  1.0,  1.0,
    // RIGHT (YELLOE/WHITE) -> z = 0.5
     0.5, -0.5, -0.5,  1.0, 1.0, 0.0, 1.0, -0.0, -0.0,
     0.5,  0.5,  0.5,  1.0, 1.0, 0.0, 1.0,  1.0,  1.0,
     0.5,  0.5, -0.5,  1.0, 1.0, 0.0, 1.0,  1.0,  0.0,
     0.5, -0.5, -0.5,  1.0, 1.0, 0.0, 1.0, -0.0, -0.0,
     0.5, -0.5,  0.5,  1.0, 1.0, 0.0, 1.0, -0.0,  1.0,
     0.5,  0.5,  0.5,  1.0, 1.0, 1.0, 1.0,  1.0,  1.0,
    // BOTTON (MAGENTA/WHITE) -> z = 0.5
    -0.5, -0.5, -0.5,  1.0, 0.0, 1.0, 1.0, -0.0, -0.0,
     0.5, -0.5,  0.5,  1.0, 0.0, 1.0, 1.0,  1.0,  1.0,
     0.5, -0.5, -0.5,  1.0, 0.0, 1.0, 1.0,  1.0,  0.0,
    -0.5, -0.5, -0.5,  1.0, 0.0, 1.0, 1.0, -0.0, -0.0,
    -0.5, -0.5,  0.5,  1.0, 0.0, 1.0, 1.0, -0.0,  1.0,
     0.5, -0.5,  0.5,  1.0, 1.0, 1.0, 1.0,  1.0,  1.0,
    // TOP (CYAN/WHITE) -> z = 0.5
    -0.5,  0.5, -0.5,  0.0, 1.0, 1.0, 1.0, -0.0, -0.0,
     0.5,  0.5,  0.5,  0.0, 1.0, 1.0, 1.0,  1.0,  1.0,
     0.5,  0.5, -0.5,  0.0, 1.0, 1.0, 1.0,  1.0,  0.0,
    -0.5,  0.5, -0.5,  0.0, 1.0, 1.0, 1.0, -0.0, -0.0,
    -0.5,  0.5,  0.5,  0.0, 1.0, 1.0, 1.0, -0.0,  1.0,
     0.5,  0.5,  0.5,  1.0, 1.0, 1.0, 1.0,  1.0,  1.0
];

function initialiseBuffer(textureState) {

    gl.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
  
    if (textureState == false){
        const texData = new Uint8Array([255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 255, 255, 0, 255]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, texData);
        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }else{
        var image = new Image();
        image.src = base64imgSrc
        image.addEventListener('load', function() {
            // Now that the image has loaded make copy it to the texture.
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
        });
    }
    return testGLError("initialiseBuffers");
}

function initialiseShaders() {

    var fragmentShaderSource = '\
            varying highp vec4 color; \
            varying mediump vec2 texCoord;\
            uniform sampler2D sampler2d;\
            void main(void) \
            { \
                gl_FragColor = 0.0 * color + 1.0 * texture2D(sampler2d, texCoord); \
            }';

    gl.fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(gl.fragShader, fragmentShaderSource);
    gl.compileShader(gl.fragShader);
    // Check if compilation succeeded
    if (!gl.getShaderParameter(gl.fragShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the fragment shader.\n" + gl.getShaderInfoLog(gl.fragShader));
        return false;
    }

    // Vertex shader code
    var vertexShaderSource = '\
			attribute highp vec4 myVertex; \
			attribute highp vec4 myColor; \
			attribute highp vec2 myUV; \
			uniform mediump mat4 mMat; \
			uniform mediump mat4 vMat; \
			uniform mediump mat4 pMat; \
			varying  highp vec4 color;\
			varying mediump vec2 texCoord;\
			void main(void)  \
			{ \
				gl_Position = pMat * vMat * mMat * myVertex; \
				gl_PointSize = 8.0; \
				color = myColor; \
				texCoord = myUV; \
			}';

    gl.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(gl.vertexShader, vertexShaderSource);
    gl.compileShader(gl.vertexShader);
    // Check if compilation succeeded
    if (!gl.getShaderParameter(gl.vertexShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the vertex shader.\n" + gl.getShaderInfoLog(gl.vertexShader));
        return false;
    }

    // Create the shader program
    gl.programObject = gl.createProgram();
    // Attach the fragment and vertex shaders to it
    gl.attachShader(gl.programObject, gl.fragShader);
    gl.attachShader(gl.programObject, gl.vertexShader);
    // Bind the custom vertex attribute "myVertex" to location 0
    gl.bindAttribLocation(gl.programObject, 0, "myVertex");
    gl.bindAttribLocation(gl.programObject, 1, "myColor");
    gl.bindAttribLocation(gl.programObject, 2, "myUV");
    // Link the program
    gl.linkProgram(gl.programObject);
    // Check if linking succeeded in a similar way we checked for compilation errors
    if (!gl.getProgramParameter(gl.programObject, gl.LINK_STATUS)) {
        alert("Failed to link the program.\n" + gl.getProgramInfoLog(gl.programObject));
        return false;
    }

    gl.useProgram(gl.programObject);
    // console.log("myVertex Location is: ", gl.getAttribLocation(gl.programObject, "myColor"));

    return testGLError("initialiseShaders");
}

flag_animation = 1; 
function toggleAnimation()
{
	flag_animation ^= 1; 
}

//for rotating tab
rotXSpeeds = 0.0;
rotYSpeeds = 0.0;
rotZSpeeds = 0.0;
rotXSpeeds_ctr = 0.0;
rotYSpeeds_ctr = 0.02;
rotZSpeeds_ctr = 0.0;
function changeRotXspeeds(num){
    rotXSpeeds_ctr = num/100.0
    document.getElementById("doc_rotXspeeds").innerHTML = "The Speeds Of rotX: "+ num/100.0;
}
function changeRotYspeeds(num){
    rotYSpeeds_ctr = num/100.0
    document.getElementById("doc_rotYspeeds").innerHTML = "The Speeds Of rotY: "+ num/100.0;
}
function changeRotZspeeds(num){
    rotZSpeeds_ctr = num/100.0
    document.getElementById("doc_rotZspeeds").innerHTML = "The Speeds Of rotZ: "+ num/100.0;
}

//for translating tab
locX_ctr = 0;
locY_ctr = 0;
locZ_ctr = 0;
function changeLocX(num){
    locX_ctr = num
    document.getElementById("doc_translateX").innerHTML = "The Coordinate Location Of X: "+ num;
}
function changeLocY(num){
    locY_ctr = num
    document.getElementById("doc_translateY").innerHTML = "The Coordinate Location Of Y: "+ num;
}
function changeLocZ(num){
    locZ_ctr = num
    document.getElementById("doc_translateZ").innerHTML = "The Coordinate Location Of Z: "+ num;
}

//for texture mapping
base64imgSrc = '';
textureState = false;
function getBase64imgSrc(imgSrc){
    base64imgSrc = imgSrc
}
function textureMapping(){
    if (base64imgSrc == ""){
        alert("choose your img")
    }else{
        textureState = true;
        mainCall++;
        yourCameraVisionMain()
    }
}

function renderScene() {

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clearDepth(1.0);										// Added for depth Test 

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);	// Added for depth Test 
	gl.enable(gl.DEPTH_TEST);								// Added for depth Test 

    var mMatLocation = gl.getUniformLocation(gl.programObject, "mMat");
    var vMatLocation = gl.getUniformLocation(gl.programObject, "vMat");
    var pMatLocation = gl.getUniformLocation(gl.programObject, "pMat");
    //y축 회전!!
    var mMat = []; //모델 매트릭스!
    
    mat4.identity(mMat);
    mat4.translate(mMat, mMat, [locX_ctr, locY_ctr, locZ_ctr]); 
    mat4.rotateX(mMat, mMat, rotXSpeeds);
    mat4.rotateY(mMat, mMat, rotYSpeeds);
    mat4.rotateZ(mMat, mMat, rotZSpeeds);
    
    //mat4.rotateX(mMat, mMat, rotSpeeds)
    if ( flag_animation ){
        rotXSpeeds += rotXSpeeds_ctr/mainCall;
        rotYSpeeds += rotYSpeeds_ctr/mainCall;
        rotZSpeeds += rotZSpeeds_ctr/mainCall;
    }
    
    //lookAt ==> 내가 어디서 보는지를 결정! (원랜 센터에 있었는데 밖으로 이동하자)
	var vMat = [];  //view 매트릭스!
    mat4.lookAt(vMat, [0.0, 0.0, 4.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    /*
    lookAt 첫번째 벡터 : 카메라 이동
    두번째 벡터 : 센터 벡터(내가 어디를 볼 것인가?)
    */
    
    var pMat = [];  //project(원근) 매트릭스 !
    mat4.identity(pMat); 
    //mat4.ortho(pMat, -2*800.0/600.0, 2*800.0/600.0, -2, 2, 1, 7.0)
    mat4.perspective(pMat, 3.14/2.0, 400.0/400.0, 0.1, 5);

    gl.uniformMatrix4fv(mMatLocation, gl.FALSE, mMat );
    gl.uniformMatrix4fv(vMatLocation, gl.FALSE, vMat );
    gl.uniformMatrix4fv(pMatLocation, gl.FALSE, pMat );


    if (!testGLError("gl.uniformMatrix4fv")) {
        return false;
    }
	//vertexData[0] += 0.01; 

    //bindBuffer : Draw하기 전에 Bind
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 36 , 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, gl.FALSE, 28, 12);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, gl.FALSE, 36, 28);

    if (!testGLError("gl.vertexAttribPointer")) {
        return false;
    }

	gl.drawArrays(gl.TRIANGLES, 0, 36); 
	//gl.drawArrays(gl.LINE_STRIP, 0, 36); 
    if (!testGLError("gl.drawArrays")) {
        return false;
    }

    return true;
}

function yourCameraVisionMain() {
    var canvas = document.getElementById("yourCameraVision");

    if (!initialiseGL(canvas)) {
        return;
    }

    if (!initialiseBuffer(textureState)) {
        return;
    }

    if (!initialiseShaders()) {
        return;
    }

    requestAnimFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
			function (callback) {
			    window.setTimeout(callback, 1000, 60);
			};
    })();

    (function renderLoop() {
        if (renderScene()) {
            requestAnimFrame(renderLoop);
        }
    })();
}