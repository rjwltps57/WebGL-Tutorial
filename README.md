# WebGL-Tutorial Project
This project is collection of very short projects to learn WebGL and Computer Graphics.

## 1. Author
AjouUniv. 201520916 Software Kim Minseok.

## 2. Topic
Transformation and Texture Mapping
<div>
  <img width="409" alt="스크린샷 2020-06-25 오후 2 40 30" src="https://user-images.githubusercontent.com/52411740/85662047-5c979400-b6f2-11ea-904e-910607e111d7.png">
</div>
There is the cube rotating at 0.02 speed in the y-axis symmetric direction.<br>
In this demo, I implement transformation for the cube and image texture mapping.<br>
So user can adjust x,y,z axis rotation speed and location of the cube,<br>
and also design the cube with texture mapping.

## 3. Main Functions
### 3-1.Transformation
#### (1) Rotation
<div>
  <img width="361" alt="스크린샷 2020-06-25 오후 3 21 25" src="https://user-images.githubusercontent.com/52411740/85666575-93bc7400-b6f7-11ea-8e48-ccf61a4cb423.png">
</div>
User can adjust x,y,z axis rotation speed.<br>
The default state is that y axis rotation speed is 0.02 and others are 0.<br>
User can control the values from -0.04 to 0.04.<br>
<div>
  <img width="284" alt="스크린샷 2020-06-25 오후 3 29 58" src="https://user-images.githubusercontent.com/52411740/85667784-ec404100-b6f8-11ea-82de-76d5a1a9573c.png">
</div>
Note that about above code, I divide the rotSpeeds_ctr into "mainCall", <br>
In this code, the main function is called several times when texture mapping is invoked.<br>
So I divide the speeds with the number of main functions called, in order to evaluate the rotating speed.

#### (2) Translation
<div>
  <img width="333" alt="스크린샷 2020-06-25 오후 3 38 52" src="https://user-images.githubusercontent.com/52411740/85668692-fe6eaf00-b6f9-11ea-954c-8049db96741b.png">
</div>
User can adjust location of the cube.<br>
The default state is that x,y,z coordinates are 0.<br>
User can control the values from -2 to 2.<br>
There are two ways for translating the cube,<br>
one way is using model matrix, and another way is using view matrix.<br>
In this program, model matrix was used.

### 3-2.Image Texture Mapping
<div>
  <img width="340" alt="스크린샷 2020-06-25 오후 3 46 07" src="https://user-images.githubusercontent.com/52411740/85669808-2dd1eb80-b6fb-11ea-8ec5-01538d9ece3f.png">
</div>
User can select local image file to push the "파일선택" button.<br>
If user push that button without selecting an image, it alert some message.<br>
<div>
  <img width="751" alt="스크린샷 2020-06-25 오후 3 58 05" src="https://user-images.githubusercontent.com/52411740/85671487-e0ef1480-b6fc-11ea-8bd1-ce796a2ee938.png">
</div>
If user select the local image, the local image appears.<br>
The image is scaled to 256x256 resolution.<br>
And then, push the "apply" button so that user gets texture mapped cube.<br>

## 4. Reference
#### for html and css
https://git.ajou.ac.kr/hwan/webgl-tutorial/-/tree/master/student2019/201620955<br>

#### for transformation
https://git.ajou.ac.kr/MTG/cg_course/-/blob/master/07transformation-coding/hello.js<br>

#### for texture mapping
https://git.ajou.ac.kr/MTG/cg_course/-/tree/master/HW4<br>

#### for image loading and scaling
http://magic.wickedmiso.com/235<br>
https://stackoverflow.com/questions/36112458/scaling-image-from-inputtype-file<br>
