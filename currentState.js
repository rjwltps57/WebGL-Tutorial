var gl;

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
        -0.5, -0.5, -0.5,  1.0, 0.0, 0.0, 1.0,
         0.5,  0.5, -0.5,  1.0, 0.0, 0.0, 1.0,
         0.5, -0.5, -0.5,  1.0, 0.0, 0.0, 1.0,
        -0.5, -0.5, -0.5,  1.0, 0.0, 0.0, 1.0,
        -0.5,  0.5, -0.5,  1.0, 0.0, 0.0, 1.0,
         0.5,  0.5, -0.5,  1.0, 1.0, 1.0, 1.0, 
		// Front (BLUE/WHITE) -> z = 0.5
        -0.5, -0.5,  0.5,  0.0, 0.0, 1.0, 1.0,
         0.5,  0.5,  0.5,  0.0, 0.0, 1.0, 1.0,
         0.5, -0.5,  0.5,  0.0, 0.0, 1.0, 1.0,
        -0.5, -0.5,  0.5,  0.0, 0.0, 1.0, 1.0,
        -0.5,  0.5,  0.5,  0.0, 0.0, 1.0, 1.0,
         0.5,  0.5,  0.5,  1.0, 1.0, 1.0, 1.0, 
		// LEFT (GREEN/WHITE) -> z = 0.5
        -0.5, -0.5, -0.5,  0.0, 1.0, 0.0, 1.0,
        -0.5,  0.5,  0.5,  0.0, 1.0, 0.0, 1.0,
        -0.5,  0.5, -0.5,  0.0, 1.0, 0.0, 1.0,
        -0.5, -0.5, -0.5,  0.0, 1.0, 0.0, 1.0,
        -0.5, -0.5,  0.5,  0.0, 1.0, 0.0, 1.0,
        -0.5,  0.5,  0.5,  0.0, 1.0, 1.0, 1.0, 
		// RIGHT (YELLOE/WHITE) -> z = 0.5
         0.5, -0.5, -0.5,  1.0, 1.0, 0.0, 1.0,
         0.5,  0.5,  0.5,  1.0, 1.0, 0.0, 1.0,
         0.5,  0.5, -0.5,  1.0, 1.0, 0.0, 1.0,
         0.5, -0.5, -0.5,  1.0, 1.0, 0.0, 1.0,
         0.5, -0.5,  0.5,  1.0, 1.0, 0.0, 1.0,
         0.5,  0.5,  0.5,  1.0, 1.0, 1.0, 1.0, 
		// BOTTON (MAGENTA/WHITE) -> z = 0.5
        -0.5, -0.5, -0.5,  1.0, 0.0, 1.0, 1.0,
         0.5, -0.5,  0.5,  1.0, 0.0, 1.0, 1.0,
         0.5, -0.5, -0.5,  1.0, 0.0, 1.0, 1.0,
        -0.5, -0.5, -0.5,  1.0, 0.0, 1.0, 1.0,
        -0.5, -0.5,  0.5,  1.0, 0.0, 1.0, 1.0,
         0.5, -0.5,  0.5,  1.0, 1.0, 1.0, 1.0, 
		// TOP (CYAN/WHITE) -> z = 0.5
        -0.5,  0.5, -0.5,  0.0, 1.0, 1.0, 1.0,
         0.5,  0.5,  0.5,  0.0, 1.0, 1.0, 1.0,
         0.5,  0.5, -0.5,  0.0, 1.0, 1.0, 1.0,
        -0.5,  0.5, -0.5,  0.0, 1.0, 1.0, 1.0,
        -0.5,  0.5,  0.5,  0.0, 1.0, 1.0, 1.0,
         0.5,  0.5,  0.5,  1.0, 1.0, 1.0, 1.0 
];

function initialiseBuffer() {

    gl.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    return testGLError("initialiseBuffers");
}

function initialiseShaders() {

    var fragmentShaderSource = '\
			varying highp vec4 color; \
			void main(void) \
			{ \
				gl_FragColor = color;\
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
			uniform mediump mat4 mMat; \
			uniform mediump mat4 vMat; \
			uniform mediump mat4 pMat; \
			varying  highp vec4 color;\
			void main(void)  \
			{ \
				gl_Position = pMat * vMat * mMat * myVertex; \
				gl_PointSize = 8.0; \
				color = myColor; \
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

flag_animation = 0; 
function toggleAnimation()
{
	flag_animation ^= 1; 
}

rotSpeeds = 0.0;

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
    
    //mat4.rotateX(mMat, mMat, -rotSpeeds) //????????????
    //x방향으로 0.5만큼 이동!
    mat4.identity(mMat);
    mat4.translate(mMat, mMat, [0.0, 0.0, 0.0]); 
    mat4.rotateY(mMat, mMat, rotSpeeds);
    
    //mat4.rotateX(mMat, mMat, rotSpeeds)
	if ( flag_animation ){
		rotSpeeds += 0.03;
    }
    
    //lookAt ==> 내가 어디서 보는지를 결정! (원랜 센터에 있었는데 밖으로 이동하자)
	var vMat = [];  //view 매트릭스!
    mat4.lookAt(vMat, [0.0, 0.0, 4.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    /*
    lookAt 첫번째 벡터 : 카메라 이동
    두번째 벡터 : 센터 벡터(내가 어디를 볼 것인가?)
    세번째 벡터 : 업벡터? -> y방향???
        -> 카메라를 기울인다고 생각하면 된다! (카메라 회전)
    */
    
    var pMat = [];  //project(원근) 매트릭스 !
    /*
    원근 개념
        parallel : vanishing point == 0
            -> affine (orthorganal)
            -> mat4.ortho(~)
            -> 얘는 안찌그러짐 (렌즈영향이 없나봐)
        perspective : vanishing point == 무한
            -> affine X
            -> mat4.perspective(~)
    */
    mat4.identity(pMat); 
    
    //mat4.ortho(pMat, -2*800.0/600.0, 2*800.0/600.0, -2, 2, 1, 7.0)
    mat4.perspective(pMat, 3.14/2.0, 400.0/400.0, 0.1, 10.0);
    /*
    perspective 첫번째 : pMat (output임)
    두번째 : 필드 of view? (스케일링인듯 - 크기 달라짐)
    세번째 : 스크린의 800픽셀/600픽셀
    네번째 near : 0.5 / 다섯째 far : 5????
        -> 아마 near와 far의 차이가 depth인가?? : 차이를 넉넉히 하는게 좋겠다
    */

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
    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 28, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, gl.FALSE, 28, 12);
	//gl.vertexAttrib4f(1, 1.0, 0.0, 1.0, 1.0);

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

function currentStateMain() {
    var canvas = document.getElementById("currentState");

    if (!initialiseGL(canvas)) {
        return;
    }

    if (!initialiseBuffer()) {
        return;
    }

    if (!initialiseShaders()) {
        return;
    }

	// renderScene();
    // Render loop
    requestAnimFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
			function (callback) {
			    window.setTimeout(callback, 1000, 60);
			};
    })();

    (function renderLoop() {
        if (renderScene()) {
            // Everything was successful, request that we redraw our scene again in the future
            requestAnimFrame(renderLoop);
        }
    })();
}
